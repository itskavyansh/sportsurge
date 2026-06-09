import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function newsApiProxy(apiKey) {
  const handler = async (_req, res) => {
    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'error', message: 'Missing VITE_NEWS_API_KEY' }));
      return;
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

      res.statusCode = response.status;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=300');
      res.end(JSON.stringify(data));
    } catch {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'error', message: 'Failed to fetch sports news' }));
    }
  };

  return {
    name: 'news-api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/sports-news', handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/sports-news', handler);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      newsApiProxy(env.VITE_NEWS_API_KEY),
    ],
  };
});
