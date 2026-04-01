import type { HomepageContent } from '@/lib/homepage-content';

type FooterProps = {
  data: HomepageContent['footer'];
};

export function Footer({ data }: FooterProps) {
  const [brandLeft, brandRight] = data.logo.split('.');

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-logo-wrap">
            <div className="nav-logo" style={{ fontSize: '20px', marginBottom: '12px' }}>
              {brandLeft}
              <span className="nav-logo-dot">.</span>
              {brandRight}
            </div>
            <p className="footer-tagline">{data.tagline}</p>
            <div className="footer-socials">
              {data.socials.map((social) => (
                <a key={social.label} className="social-btn" href={social.href}>
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {data.columns.map((column) => (
            <div key={column.title}>
              <div className="footer-col-t">{column.title}</div>
              {column.links.map((link) => (
                <a key={link.label} className="footer-link" href={link.href}>
                  {link.label}
                </a>
              ))}
              {column.button ? (
                <div style={{ marginTop: '20px' }}>
                  <button className="btn-pu" style={{ width: '100%', justifyContent: 'center' }} type="button">
                    {column.button}
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">{data.copyright}</span>
          <div className="footer-badges">
            {data.badges.map((badge) => (
              <span key={badge.label} className={`f-badge${badge.tone ? ` ${badge.tone}` : ''}`}>
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
