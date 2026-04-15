import Link from "next/link";
import type { PageContent } from "./types";

type Props = {
  data: PageContent["methods"];
};

export default function ContactMethods({ data }: Props) {
  return (
    <section className="contact-methods">
      <div className="wrap">
        <div className="contact-methods-grid">
          {data.items.map((item, index) => {
            const detailLink = item.link;
            return (
              <div
                className="contact-method"
                data-r
                data-delay={String(index + 1)}
                key={`${"methods"}-${item.link?.href ?? item.title}-${index}`}
              >
                <div className={`contact-method-icon ${item.color}`} data-field={`methods.items.${index}.icon`}>
                  {item.icon}
                </div>
                <div className="contact-method-title" data-field={`methods.items.${index}.title`}>
                  {item.title}
                </div>
                <div className="contact-method-detail">
                  {detailLink ? (
                    detailLink.href.startsWith("/") ? (
                      <>
                        <Link href={detailLink.href} data-field={`methods.items.${index}.link.label`}>
                          {detailLink.label}
                        </Link>
                        <br />
                      </>
                    ) : (
                      <>
                        <a href={detailLink.href} data-field={`methods.items.${index}.link.label`}>
                          {detailLink.label}
                        </a>
                        <br />
                      </>
                    )
                  ) : null}
                  <span data-field={`methods.items.${index}.detail`}>{item.detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
