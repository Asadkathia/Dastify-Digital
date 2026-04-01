'use client';

import { useState } from 'react';
import type { FaqItem } from '@/lib/homepage-content';

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list" data-r data-delay="2">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button
              className="faq-q"
              type="button"
              onClick={() => setOpenIndex((current) => (current === index ? null : index))}
            >
              <div className="faq-qt">{item.question}</div>
              <div className="faq-ic">+</div>
            </button>
            <div className="faq-a">
              <div className="faq-ai">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
