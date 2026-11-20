/**
 * Returns 403 to search engines, AI crawlers and scrapers on every deploy. `robots.txt` stays readable so polite
 * crawlers see the disallow-all. Link unfurlers (Slack, Twitter, Facebook, LinkedIn) and Netlify's own agents are
 * allowed so shared links still preview.
 */
const ALLOWED = /slackbot|slack-imgproxy|twitterbot|facebookexternalhit|linkedinbot|netlify|vercel-screenshot/i;

const BLOCKED = new RegExp(
  [
    // Search engines
    'googlebot|google-inspectiontool|googleother|adsbot-google|bingbot|bingpreview|msnbot|slurp|duckduckbot',
    'baiduspider|yandex|sogou|exabot|seznambot|petalbot|applebot|qwantify|ahrefsbot|semrushbot|mj12bot|dotbot',
    // AI crawlers and agents
    'gptbot|chatgpt-user|oai-searchbot|claudebot|claude-web|claude-user|claude-searchbot|anthropic-ai',
    'perplexitybot|perplexity-user|google-extended|ccbot|bytespider|amazonbot|meta-externalagent',
    'meta-externalfetcher|cohere-ai|diffbot|omgili|youbot|timpibot|ai2bot|imagesiftbot|ia_archiver',
    // Generic
    'crawler|spider|scrapy|scraper|headlesschrome|python-requests|curl/|wget/|go-http-client|httpclient',
  ].join('|'),
  'i'
);

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const { pathname } = new URL(request.url);
  if (pathname === '/robots.txt') return context.next();

  const agent = request.headers.get('user-agent') ?? '';
  if (!agent || (BLOCKED.test(agent) && !ALLOWED.test(agent))) {
    return new Response('Forbidden', {
      status: 403,
      headers: { 'content-type': 'text/plain', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' },
    });
  }
  return context.next();
};

export const config = { path: '/*' };
