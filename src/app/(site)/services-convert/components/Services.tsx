"use client";

import Link from "next/link";
import { useState } from "react";

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

  return (
    <section className="svc-convert-services" id="services">
      <div className="wrap">
        <div className="svc-convert-services-header">
          <div className="chip svc-convert-services-chip" data-r>
            <span className="chip-dot svc-convert-purple-dot"></span>
            {data.chip}
          </div>
          <h2 className="svc-convert-services-title" data-r data-delay="1">
            {data.title}
          </h2>
          <p className="svc-convert-services-intro" data-r data-delay="2">
            {data.intro}
          </p>
        </div>
        <div className="svc-convert-service-list">
          {data.items.map((item, index) => {
            const isActive = active === item.id;
            return (
              <div key={item.id}>
                <div
                  className={`svc-convert-service-row${isActive ? " active" : ""}`}
                  onClick={() => setActive(isActive ? null : item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(isActive ? null : item.id);
                    }
                  }}
                >
                  <div className="svc-convert-service-num">{item.number}</div>
                  <div className="svc-convert-service-info">
                    <h3 className="svc-convert-service-name">{item.name}</h3>
                    <p className="svc-convert-service-tagline">{item.tagline}</p>
                  </div>
                  <div className="svc-convert-service-arrow">
                    <ChevronIcon open={isActive} />
                  </div>
                </div>
                <div className={`svc-convert-service-expanded${isActive ? " show" : ""}`}>
                  <div className="svc-convert-service-expanded-inner">
                    <div className="svc-convert-service-outcomes">
                      <h4>{item.outcomesTitle}</h4>
                      <ul>
                        {item.outcomes.map((outcome) => (
                          <li key={outcome}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="svc-convert-service-cta">
                      <p>{item.description}</p>
                      <Link href={item.cta.href} className="btn-dk">
                        {item.cta.label}
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
