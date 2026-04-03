import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findByRelation, findOneBySlug } from '@/lib/cms/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return [];
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await findOneBySlug('blog-categories', slug, false);

  if (!category || !category.id) {
    notFound();
  }

  const posts = await findByRelation({
    collection: 'blog-posts',
    relationField: 'categories',
    value: String(category.id),
  });

  return (
    <section className="sp">
      <div className="wrap">
        <h1>Category: {String(category.title || slug)}</h1>
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
