"use client";

import Link from "next/link";
import { useState } from "react";
import { getConvertedNodeBinding } from "@/components/converted-editor";

type ServiceItem = {
  id: string;
  number: string;
  name: string;
  tagline: string;
  outcomesTitle: string;
  outcomes: string[];
  description: string;
  cta: { label: string; href: string };
};

type ServicesData = {
  chip: string;
  title: string;
  intro: string;
  items: ServiceItem[];
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"
      viewBox="0 0 24 24" aria-hidden="true"
      style={{ transition: 'transform 0.3s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function Services({ data }: { data: ServicesData }) {
  const [active, setActive] = useState<string | null>(null);
  const items = Array.isArray(data.items)
    ? data.items.filter((item): item is ServiceItem => Boolean(item && typeof item === "object"))
    : [];
  const chipNode = getConvertedNodeBinding(data, { field: 'chip', defaultTag: 'div', nodeKey: 'chip' });
  const titleNode = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h2', nodeKey: 'title', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const introNode = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p', nodeKey: 'intro' });
  const TitleTag = titleNode.Tag;

  return (
    <section className="svc-convert-services" id="services">
      <div className="wrap">
        <div className="svc-convert-services-header">
          <div className="chip svc-convert-services-chip" data-r {...chipNode.props}>
            <span className="chip-dot svc-convert-purple-dot"></span>
            {data.chip}
          </div>
          <TitleTag className="svc-convert-services-title" data-r data-delay="1" {...titleNode.props}>
            {data.title}
          </TitleTag>
          <p className="svc-convert-services-intro" data-r data-delay="2" {...introNode.props}>
            {data.intro}
          </p>
        </div>
        <div className="svc-convert-service-list">
          {items.map((item, index) => {
            const itemId = typeof item.id === "string" && item.id.length > 0 ? item.id : `item-${index}`;
            const ctaHref = typeof item.cta?.href === "string" && item.cta.href.length > 0 ? item.cta.href : "#";
            const ctaLabel = typeof item.cta?.label === "string" ? item.cta.label : "";
            const isActive = active === itemId;
            const outcomes = Array.isArray(item.outcomes) ? item.outcomes : [];
            return (
              <div key={itemId}>
                <div
                  className={`svc-convert-service-row${isActive ? " active" : ""}`}
                  onClick={() => setActive(isActive ? null : itemId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(isActive ? null : itemId);
                    }
                  }}
                >
                  <div className="svc-convert-service-num" {...getConvertedNodeBinding(data, { field: `items.${index}.number`, defaultTag: 'div', nodeKey: `items_${index}_number` }).props}>{item.number}</div>
                  <div className="svc-convert-service-info">
                    <h3 className="svc-convert-service-name" {...getConvertedNodeBinding(data, { field: `items.${index}.name`, defaultTag: 'h3', nodeKey: `items_${index}_name`, allowedTags: ['h2', 'h3', 'h4', 'p'] }).props}>{item.name}</h3>
                    <p className="svc-convert-service-tagline" {...getConvertedNodeBinding(data, { field: `items.${index}.tagline`, defaultTag: 'p', nodeKey: `items_${index}_tagline` }).props}>{item.tagline}</p>
                  </div>
                  <div className="svc-convert-service-arrow">
                    <ChevronIcon open={isActive} />
                  </div>
                </div>
                <div className={`svc-convert-service-expanded${isActive ? " show" : ""}`}>
                  <div className="svc-convert-service-expanded-inner">
                    <div className="svc-convert-service-outcomes">
                      <h4 {...getConvertedNodeBinding(data, { field: `items.${index}.outcomesTitle`, defaultTag: 'h4', nodeKey: `items_${index}_outcomesTitle`, allowedTags: ['h3', 'h4', 'p'] }).props}>{item.outcomesTitle}</h4>
                      <ul>
                        {outcomes.map((outcome, outcomeIndex) => (
                          <li
                            key={outcome}
                            {...getConvertedNodeBinding(data, { field: `items.${index}.outcomes.${outcomeIndex}`, defaultTag: 'li', nodeKey: `items_${index}_outcomes_${outcomeIndex}` }).props}
                          >
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="svc-convert-service-cta">
                      <p {...getConvertedNodeBinding(data, { field: `items.${index}.description`, defaultTag: 'p', nodeKey: `items_${index}_description` }).props}>{item.description}</p>
                      <Link href={ctaHref} className="btn-dk" {...getConvertedNodeBinding(data, { field: `items.${index}.cta.label`, defaultTag: 'a', nodeKey: `items_${index}_cta_label` }).props}>
                        {ctaLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
