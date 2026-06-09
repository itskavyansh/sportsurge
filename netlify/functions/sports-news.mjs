export default async () => {
  const apiKey =
    Netlify.env.get('NEWS_API_KEY') || Netlify.env.get('VITE_NEWS_API_KEY');

  if (!apiKey) {
    return Response.json(
      { status: 'error', message: 'News API key not configured' },
      { status: 500 },
    );
  }

  try {
    const headers = { 'User-Agent': 'SportSurge/1.0' };

    const headlinesUrl = new URL('https://newsapi.org/v2/top-headlines');
    headlinesUrl.searchParams.set('country', 'in');
    headlinesUrl.searchParams.set('category', 'sports');
    headlinesUrl.searchParams.set('pageSize', '12');
    headlinesUrl.searchParams.set('apiKey', apiKey);

    let response = await fetch(headlinesUrl, { headers });
    let data = await response.json();

    const articles = data.articles ?? [];
    if (articles.length < 3) {
      const everythingUrl = new URL('https://newsapi.org/v2/everything');
      everythingUrl.searchParams.set('q', 'sports India cricket football');
      everythingUrl.searchParams.set('language', 'en');
      everythingUrl.searchParams.set('sortBy', 'publishedAt');
      everythingUrl.searchParams.set('pageSize', '12');
      everythingUrl.searchParams.set('apiKey', apiKey);

      const fallbackRes = await fetch(everythingUrl, { headers });
      const fallbackData = await fallbackRes.json();

      if (fallbackData.status === 'ok' && fallbackData.articles?.length) {
        const seen = new Set(articles.map((a) => a.url));
        const merged = [
          ...articles,
          ...fallbackData.articles.filter((a) => a.url && !seen.has(a.url)),
        ].slice(0, 12);

        data = { ...fallbackData, articles: merged, totalResults: merged.length };
        response = fallbackRes;
      }
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch {
    return Response.json(
      { status: 'error', message: 'Failed to fetch sports news' },
      { status: 502 },
    );
  }
};

export const config = {
  path: '/api/sports-news',
};
