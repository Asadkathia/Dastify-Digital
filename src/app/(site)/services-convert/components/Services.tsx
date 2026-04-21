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

/** Shape returned by the Payload services collection (depth: 1) */
export type CollectionServiceDoc = {
  id: number | string;
  slug: string;
  title: string;
  tagline?: string | null;
  excerpt?: string | null;
  outcomesTitle?: string | null;
  outcomes?: Array<{ text: string }> | null;
  cta?: { label?: string | null; href?: string | null } | null;
};

function docToItem(doc: CollectionServiceDoc, index: number): ServiceItem {
  return {
    id: String(doc.slug || doc.id),
    number: String(index + 1).padStart(2, '0'),
    name: doc.title,
    tagline: doc.tagline ?? '',
    outcomesTitle: doc.outcomesTitle ?? 'What you get',
    outcomes: (doc.outcomes ?? []).map((o) => o.text).filter(Boolean),
    description: doc.excerpt ?? '',
    cta: {
      label: doc.cta?.label ?? 'Learn more →',
      href: doc.cta?.href ?? '/contact',
    },
  };
}

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

export default function Services({ data, collectionItems }: { data: ServicesData; collectionItems?: CollectionServiceDoc[] }) {
  const [active, setActive] = useState<string | null>(null);
  // When collectionItems is provided (collection-backed mode), map them to ServiceItem.
  // Otherwise use the hand-entered items from content.ts (static / editable mode).
  const fromCollection = Array.isArray(collectionItems) && collectionItems.length > 0;
  const items: ServiceItem[] = fromCollection
    ? collectionItems.map(docToItem)
    : Array.isArray(data.items)
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
            // In collection-backed mode, suppress data-field editing attributes.
            const numProps = fromCollection ? {} : getConvertedNodeBinding(data, { field: `items.${index}.number`, defaultTag: 'div', nodeKey: `items_${index}_number` }).props;
            const nameProps = fromCollection ? {} : getConvertedNodeBinding(data, { field: `items.${index}.name`, defaultTag: 'h3', nodeKey: `items_${index}_name`, allowedTags: ['h2', 'h3', 'h4', 'p'] }).props;
            const taglineProps = fromCollection ? {} : getConvertedNodeBinding(data, { field: `items.${index}.tagline`, defaultTag: 'p', nodeKey: `items_${index}_tagline` }).props;
            const outcomesTitleProps = fromCollection ? {} : getConvertedNodeBinding(data, { field: `items.${index}.outcomesTitle`, defaultTag: 'h4', nodeKey: `items_${index}_outcomesTitle`, allowedTags: ['h3', 'h4', 'p'] }).props;
            const descriptionProps = fromCollection ? {} : getConvertedNodeBinding(data, { field: `items.${index}.description`, defaultTag: 'p', nodeKey: `items_${index}_description` }).props;
            const ctaLabelProps = fromCollection ? {} : getConvertedNodeBinding(data, { field: `items.${index}.cta.label`, defaultTag: 'a', nodeKey: `items_${index}_cta_label` }).props;
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
                  <div className="svc-convert-service-num" {...numProps}>{item.number}</div>
                  <div className="svc-convert-service-info">
                    <h3 className="svc-convert-service-name" {...nameProps}>{item.name}</h3>
                    <p className="svc-convert-service-tagline" {...taglineProps}>{item.tagline}</p>
                  </div>
                  <div className="svc-convert-service-arrow">
                    <ChevronIcon open={isActive} />
                  </div>
                </div>
                <div className={`svc-convert-service-expanded${isActive ? " show" : ""}`}>
                  <div className="svc-convert-service-expanded-inner">
                    <div className="svc-convert-service-outcomes">
                      <h4 {...outcomesTitleProps}>{item.outcomesTitle}</h4>
                      <ul>
                        {outcomes.map((outcome, outcomeIndex) => (
                          <li
                            key={outcome}
                            {...(fromCollection ? {} : getConvertedNodeBinding(data, { field: `items.${index}.outcomes.${outcomeIndex}`, defaultTag: 'li', nodeKey: `items_${index}_outcomes_${outcomeIndex}` }).props)}
                          >
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="svc-convert-service-cta">
                      <p {...descriptionProps}>{item.description}</p>
                      <Link href={ctaHref} className="btn-dk" {...ctaLabelProps}>
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
