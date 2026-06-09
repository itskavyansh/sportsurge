export default async () => {
  const apiKey =
    Netlify.env.get('NEWS_API_KEY') || Netlify.env.get('VITE_NEWS_API_KEY');

  if (!apiKey) {
    return Response.json(
      { status: 'error', message: 'News API key not configured' },
      { status: 500 },
    );
  }

  const url =
    'https://newsapi.org/v2/top-headlines?category=sports&language=en&pageSize=10&apiKey=' +
    apiKey;

  const upstream = await fetch(url);
  const data = await upstream.json();

  return Response.json(data, { status: upstream.status });
};

export const config = {
  path: '/api/sports-news',
};
