import { absoluteURL } from '@/lib/cms/urls';

export type RSSItem = {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
};

export function generateRSS(args: { title: string; description: string; items: RSSItem[] }): string {
  const { title, description, items } = args;

  const entries = items
    .map((item) => {
      const link = absoluteURL(`/blog/${item.slug}`);
      return `\n      <item>\n        <title><![CDATA[${item.title}]]></title>\n        <description><![CDATA[${item.description}]]></description>\n        <link>${link}</link>\n        <guid>${link}</guid>\n        ${item.publishedAt ? `<pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>` : ''}\n      </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title><![CDATA[${title}]]></title>\n    <description><![CDATA[${description}]]></description>\n    <link>${absoluteURL('/')}</link>${entries}\n  </channel>\n</rss>`;
}
