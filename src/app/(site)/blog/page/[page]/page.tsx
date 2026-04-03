import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findBlogPage } from '@/lib/cms/queries';

type Props = {
  params: Promise<{ page: string }>;
};

export async function generateStaticParams() {
  return [];
}

export default async function BlogPaginatedPage({ params }: Props) {
  const { page } = await params;
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const { docs, totalPages } = await findBlogPage(pageNumber, false);

  if (pageNumber > totalPages) {
    notFound();
  }

  return (
    <section className="sp">
      <div className="wrap">
        <h1>Blog - Page {pageNumber}</h1>
        <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
          {docs.map((doc) => (
            <article key={String(doc.id)}>
              <h2 style={{ fontSize: '24px' }}>
                <Link href={`/blog/${String(doc.slug || '')}`}>{String(doc.title || 'Untitled')}</Link>
              </h2>
              {doc.excerpt ? <p>{String(doc.excerpt)}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
