import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

/** @typedef {Object} NewsArticle
 * @property {string} id
 * @property {string} title
 * @property {string} summary
 * @property {string|null} imageUrl
 * @property {string} source
 * @property {string} url
 * @property {Date|null} publishedAt
 * @property {boolean} curated
 * @property {boolean} pinned
 */

/** @returns {Promise<NewsArticle[]>} */
export async function fetchCuratedNews() {
  try {
    const snap = await getDocs(
      query(collection(db, 'news'), orderBy('publishedAt', 'desc'), limit(20))
    );
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title ?? '',
        summary: data.summary ?? '',
        imageUrl: data.imageUrl || null,
        source: data.source || 'Sport Surge',
        url: data.url ?? '',
        publishedAt: data.publishedAt?.toDate?.() ?? null,
        curated: true,
        pinned: !!data.pinned,
      };
    });
  } catch {
    return [];
  }
}

/** @returns {Promise<NewsArticle[]>} */
export async function fetchLiveNews() {
  try {
    const res = await fetch('/api/sports-news');
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'ok' || !Array.isArray(data.articles)) return [];

    return data.articles
      .filter((a) => a.title && a.url)
      .map((a) => ({
        id: a.url,
        title: a.title,
        summary: a.description ?? '',
        imageUrl: a.urlToImage || null,
        source: a.source?.name ?? 'News',
        url: a.url,
        publishedAt: a.publishedAt ? new Date(a.publishedAt) : null,
        curated: false,
        pinned: false,
      }));
  } catch {
    return [];
  }
}

/** @param {NewsArticle[]} curated @param {NewsArticle[]} live @returns {NewsArticle[]} */
export function mergeNews(curated, live) {
  const curatedUrls = new Set(curated.map((n) => n.url).filter(Boolean));
  const dedupedLive = live.filter((n) => !curatedUrls.has(n.url));

  const pinned = curated.filter((n) => n.pinned);
  const unpinned = curated.filter((n) => !n.pinned);

  return [...pinned, ...unpinned, ...dedupedLive].slice(0, 9);
}

/** @param {Date|null} date */
export function formatNewsDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
