'use client';

import { useState } from 'react';
import type { PageBuilderBlock } from './types';

type AccordionBlockProps = Extract<PageBuilderBlock, { type: 'accordion' }>;

function AccordionItem({ heading, body }: { heading: string; body: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255,255,255,.1)',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'inherit',
          gap: '16px',
        }}
        aria-expanded={open}
      >
        <span style={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.4 }}>{heading}</span>
        <span
          style={{
            flexShrink: 0,
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            opacity: 0.6,
            fontSize: '20px',
            lineHeight: 1,
          }}
        >
          +
        </span>
      </button>
      {open ? (
        <div
          style={{
            paddingBottom: '18px',
            lineHeight: 1.7,
            opacity: 0.8,
            whiteSpace: 'pre-wrap',
          }}
        >
          {body}
        </div>
      ) : null}
    </div>
  );
}

export function AccordionBlock(props: AccordionBlockProps) {
  if (props.items.length === 0) return null;

  return (
    <section className="sp">
      <div className="wrap" style={{ maxWidth: '760px' }}>
        {props.title ? (
          <h2 data-field="title" style={{ marginBottom: '24px' }}>{props.title}</h2>
        ) : null}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}>
          {props.items.map((item, i) => (
            <AccordionItem key={i} heading={item.heading} body={item.body} />
          ))}
        </div>
      </div>
    </section>
  );
}
