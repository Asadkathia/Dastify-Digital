"use client";

import { useState } from "react";
import type { PageContent } from "../content";

type Props = { data: PageContent["filters"] };

export default function BlogFilters({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState(
    Math.max(
      0,
      data.items.findIndex((item) => item.active),
    ),
  );

  return (
    <div className="blog1-blog-filters">
      <div className="wrap blog1-blog-filters-wrap">
        {data.items.map((item, index) => (
          <button
            key={`${"filters"}-${item.label}-${index}`}
            className={`blog1-filter-btn${index === activeIndex ? " active" : ""}`}
            onClick={() => setActiveIndex(index)}
            type="button"
            data-field={`filters.items.${index}.label`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
