'use client';

import { useState } from 'react';
import type { CaseTab } from '@/lib/homepage-content';

type CaseTabsProps = {
  tabs: CaseTab[];
};

export function CaseTabs({ tabs }: CaseTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '');

  return (
    <div className="cases-tabs" data-r>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`c-tab ${activeTab === tab.id ? 'on' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
