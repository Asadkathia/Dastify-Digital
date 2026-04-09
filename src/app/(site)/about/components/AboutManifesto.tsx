export type AboutManifestoData = {
  watermark: string;
  headline: string;
  highlight: string;
  statements: string[];
  paragraphs: string[];
};

export default function AboutManifesto({ data }: { data: AboutManifestoData }) {
  return (
    <section className="about-manifesto">
      <span className="sec-wm g1">{data.watermark}</span>
      <div className="wrap">
        <div className="about-manifesto-inner">
          <div className="about-manifesto-left">
            <h2 className="h1 about-manifesto-headline" data-r>
              {data.headline} <span className="about-manifesto-highlight">{data.highlight}</span>
            </h2>
            <div className="about-manifesto-statements">
              {data.statements.map((item, index) => (
                <div className="about-manifesto-statement" data-r data-delay={`${index + 1}`} key={`about-manifesto-statement-${item}-${index}`}>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="about-manifesto-right">
            <div className="about-manifesto-copy">
              {data.paragraphs.map((item, index) => (
                <p data-r data-delay={index === 0 ? undefined : `${index}`} key={`about-manifesto-copy-${item.slice(0, 20)}-${index}`} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </div>
          </div>
        </div>
        <div className="about-manifesto-divider" />
      </div>
    </section>
  );
}
