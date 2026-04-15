"use client";

import { useState } from "react";
import Link from "next/link";
import type { PageContent } from "./types";

type Props = {
  data: PageContent["faq"];
};

export default function ContactFaq({ data }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const TitleTag = (data.titleTag || "h2") as keyof JSX.IntrinsicElements;

  return (
    <section className="faq-section">
      <div className="wrap">
        <div className="faq-grid">
          <div className="faq-header" data-r="L">
            <div className="chip contact2-faq-chip">
              <span className="chip-dot contact2-faq-chip-dot" />
              <span data-field="faq.chipText">{data.chipText}</span>
            </div>
            <TitleTag
              className="faq-title"
              data-field="faq.title"
              data-style-field="faq.editor.nodes.title.styles"
              data-tag-field="faq.titleTag"
              data-allowed-tags="h2,h3,h4"
            >
              {data.title}
            </TitleTag>
            <p className="faq-desc" data-field="faq.description">
              {data.description}
            </p>
            <a href={data.callCta.href} className="btn-dk contact2-faq-btn" data-field="faq.callCta.label">
              {data.callCta.label}
            </a>
          </div>

          <div className="faq-list" data-r="R">
            {data.items.map((item, index) => {
              const open = openIndex === index;
              return (
                <div
                  className={`faq-item${open ? " open" : ""}`}
                  key={`${"faq-items"}-${item.question}-${index}`}
                >
                  <button
                    type="button"
                    className="faq-question contact2-faq-question-btn"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                  >
                    <span className="faq-q-text" data-field={`faq.items.${index}.question`}>
                      {item.question}
                    </span>
                    <span className="faq-toggle">+</span>
                  </button>
                  <div className="faq-answer">
                    <div className="faq-answer-inner" data-field={`faq.items.${index}.answer`}>
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
