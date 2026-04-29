import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { Icon } from './_icons';

export default function BlogPreview({ data }: { data: HomepageContent['blogPreview'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const title = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const TitleTag = title.Tag;
  const intro = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p' });
  const IntroTag = intro.Tag;
  const ctaLabel = getConvertedNodeBinding(data, { field: 'ctaLabel', defaultTag: 'span' });
  const CtaLabelTag = ctaLabel.Tag;
  return (
    <section className="hp2-blog">
      <div className="hp2-wrap">
        <div className="hp2-section-head">
          <EyebrowTag {...eyebrow.props} className="hp2-eyebrow">{data.eyebrow}</EyebrowTag>
          <TitleTag {...title.props} className="hp2-h2">{data.title}</TitleTag>
          <IntroTag {...intro.props} className="hp2-intro">{data.intro}</IntroTag>
        </div>
        <div className="hp2-blog__grid">
          {data.posts.map((p, i) => {
            const tagB = getConvertedNodeBinding(data, { field: `posts.${i}.tag`, defaultTag: 'span' });
            const TagTag = tagB.Tag;
            const titleB = getConvertedNodeBinding(data, { field: `posts.${i}.title`, defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const TTitleTag = titleB.Tag;
            const readB = getConvertedNodeBinding(data, { field: `posts.${i}.readTime`, defaultTag: 'span' });
            const ReadTag = readB.Tag;
            const postImg = getConvertedImageBinding(data, {
              field: `posts.${i}.image`,
              altField: `posts.${i}.imageAlt`,
              defaultAlt: p.imageAlt ?? p.title,
            });
            return (
              <article key={i} className="hp2-post">
                {postImg.hidden ? (
                  <div {...postImg.props} data-image-hidden="true" className="hp2-post__img iph" aria-hidden="true">
                    <span>{p.tag.toLowerCase()} visual</span>
                  </div>
                ) : postImg.hasImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    {...postImg.props}
                    src={postImg.src}
                    alt={postImg.alt || p.imageAlt || p.title}
                    className="hp2-post__img"
                  />
                ) : (
                  <div {...postImg.props} className="hp2-post__img iph" aria-hidden="true">
                    <span>{p.tag.toLowerCase()} visual</span>
                  </div>
                )}
                <div className="hp2-post__body">
                  <TagTag {...tagB.props} className="hp2-post__badge">{p.tag}</TagTag>
                  <TTitleTag {...titleB.props} className="hp2-post__title">
                    {p.href ? <Link href={p.href}>{p.title}</Link> : p.title}
                  </TTitleTag>
                  <ReadTag {...readB.props} className="hp2-post__meta">{p.readTime}</ReadTag>
                </div>
              </article>
            );
          })}
        </div>
        <div className="hp2-blog__cta">
          <Link href={data.ctaHref} className="hp2-btn hp2-btn--secondary hp2-btn--md">
            <CtaLabelTag {...ctaLabel.props}>{data.ctaLabel}</CtaLabelTag>
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
