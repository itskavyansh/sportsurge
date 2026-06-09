import { Mail, ArrowRight, ExternalLink, Loader2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import useReveal from '../hooks/useReveal';
import { fetchCuratedNews, fetchLiveNews, mergeNews, formatNewsDate } from '../lib/news';

const TICKER = ['CRICKET', 'FOOTBALL', 'BASKETBALL', 'BADMINTON', 'KABADDI', 'VOLLEYBALL', 'HOCKEY', 'ATHLETICS', 'SWIMMING', 'BOXING', 'TENNIS', 'WRESTLING'];

export default function EventsSection() {
  const headerRef = useReveal();
  const gridRef   = useReveal();
  const notifyRef = useReveal();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [curated, live] = await Promise.all([fetchCuratedNews(), fetchLiveNews()]);
      if (!cancelled) {
        setArticles(mergeNews(curated, live));
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="events" className="relative overflow-hidden" style={{ background: '#13131a', padding: 0 }}>
      <div className="section-wordmark events-wordmark" aria-hidden="true">News</div>
      <div className="stats-scanline" />

      <div className="events-ticker">
        <div className="events-ticker-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="events-ticker-item">
              <span className="events-ticker-dot" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: '6rem 5%' }}>
        <div className="max-w-[700px] mx-auto mb-12 reveal text-center" ref={headerRef}>
          <div className="section-label justify-center before:hidden">India Sports</div>
          <h2 className="section-title">Latest <span>News</span></h2>
          <p className="text-[0.85rem] text-[--text-secondary] mt-3 leading-relaxed">
            Curated updates from Sport Surge plus live headlines from across Indian sports.
          </p>
        </div>

        {loading ? (
          <div className="news-loading">
            <Loader2 size={22} className="animate-spin" />
            <span>Loading sports news…</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="news-empty reveal" ref={gridRef}>
            <p>No news available right now. Check back soon or add articles from the admin panel.</p>
          </div>
        ) : (
          <div className="news-grid reveal" ref={gridRef}>
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}

        <div className="events-notify-wrap reveal" ref={notifyRef}>
          <div className="events-card">
            <div className="events-card-inner">
              <div className="events-icon-wrap">
                <Mail size={32} strokeWidth={1.5} color="#000" />
              </div>
              <div className="events-text">
                <h3 className="events-heading">Stay in the Loop</h3>
                <p className="events-sub">Get alerts on new events, summits, and meetups. Drop your email and be first to know.</p>
              </div>
              <NotifyForm />
            </div>
            <div className="events-card-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsCard({ article }) {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-card">
      <div className="news-card-img-wrap">
        {article.imageUrl ? (
          <img src={article.imageUrl} alt="" className="news-card-img" loading="lazy" />
        ) : (
          <div className="news-card-img-fallback" />
        )}
        {article.curated && (
          <span className={`news-card-badge${article.pinned ? ' news-card-badge-pinned' : ''}`}>
            {article.pinned ? 'Featured' : 'Curated'}
          </span>
        )}
      </div>
      <div className="news-card-body">
        <div className="news-card-meta">
          <span className="news-card-source">{article.source}</span>
          {article.publishedAt && (
            <span className="news-card-date">{formatNewsDate(article.publishedAt)}</span>
          )}
        </div>
        <h3 className="news-card-title">{article.title}</h3>
        {article.summary && <p className="news-card-summary">{article.summary}</p>}
        <span className="news-card-link">
          Read more <ExternalLink size={12} />
        </span>
      </div>
    </a>
  );
}

function NotifyForm() {
  const inputRef  = useRef(null);
  const [done, setDone] = useState(false);
  const [err,  setErr]  = useState(false);

  const submit = () => {
    const v = inputRef.current?.value.trim();
    if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setErr(true); setTimeout(() => setErr(false), 2000); return; }
    setDone(true);
  };

  if (done) return (
    <div className="events-success">
      <span className="events-success-dot" />
      You're on the list!
    </div>
  );

  return (
    <div className="events-form">
      <input
        ref={inputRef}
        type="email"
        placeholder="your@email.com"
        className={`events-input${err ? ' events-input-err' : ''}`}
      />
      <button className="events-btn" onClick={submit}>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
