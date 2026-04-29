import Link from 'next/link';
import type { BlogPostSeed } from '../../blog-1/content';
import type { PageContent } from '../content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';

function PostMedia({
  post,
  data,
  index,
}: {
  post: BlogPostSeed;
  data: PageContent['related'];
  index: number;
}) {
  const imgBinding = getConvertedImageBinding(data, {
    field: `posts.${index}.image`,
    altField: `posts.${index}.imageAlt`,
    defaultAlt: post.imageAlt ?? post.title,
  });
  if (imgBinding.hidden) {
    return (
      <div {...imgBinding.props} data-image-hidden="true" className="iph bp2-card__iph" role="img" aria-label={`${post.cat} post placeholder`}>
        <span>{post.cat}</span>
      </div>
    );
  }
  if (imgBinding.hasImage) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img {...imgBinding.props} src={imgBinding.src} alt={imgBinding.alt || post.title} className="bp2-card__img-real" />;
  }
  return (
    <div {...imgBinding.props} className="iph bp2-card__iph" role="img" aria-label={`${post.cat} post placeholder`}>
      <span>{post.cat}</span>
    </div>
  );
}

export default function Related({ data }: { data: PageContent['related'] }) {
  if (!data.posts || data.posts.length === 0) return null;
  const title = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
  const TitleTag = title.Tag;
  return (
    <section className="bp2-related">
      <div className="bp2-wrap">
        <TitleTag {...title.props} className="bp2-related__title">{data.title}</TitleTag>
        <div className="bp2-related__grid">
          {data.posts.map((p, i) => {
            const tB = getConvertedNodeBinding(data, { field: `posts.${i}.title`, defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const TTag = tB.Tag;
            const cB = getConvertedNodeBinding(data, { field: `posts.${i}.cat`, defaultTag: 'span' });
            const CTag = cB.Tag;
            return (
              <Link href={p.href} key={p.id} className="bp2-card">
                <div className="bp2-card__media">
                  <PostMedia post={p} data={data} index={i} />
                </div>
                <div className="bp2-card__body">
                  <CTag {...cB.props} className="bp2-badge bp2-badge--primary">{p.cat}</CTag>
                  <TTag {...tB.props} className="bp2-card__title">{p.title}</TTag>
                  <div className="bp2-card__meta">{p.date} · {p.read}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
