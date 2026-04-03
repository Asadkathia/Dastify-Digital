import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findByRelation, findOneBySlug } from '@/lib/cms/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return [];
}

export default async function BlogTagPage({ params }: Props) {
  const { slug } = await params;
  const tag = await findOneBySlug('tags', slug, false);

  if (!tag || !tag.id) {
    notFound();
  }

  const posts = await findByRelation({
    collection: 'blog-posts',
    relationField: 'tags',
    value: String(tag.id),
  });

  return (
    <section className="sp">
      <div className="wrap">
        <h1>Tag: {String(tag.title || slug)}</h1>
        <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
          {posts.map((doc) => (
            <article key={String(doc.id)}>
              <h2 style={{ fontSize: '24px' }}>
                <Link href={`/blog/${String(doc.slug || '')}`}>{String(doc.title || 'Untitled')}</Link>
              </h2>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
