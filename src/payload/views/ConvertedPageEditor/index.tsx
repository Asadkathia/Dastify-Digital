'use client';

import { useEffect } from 'react';
import { useEditorStore } from '../PageEditor/store';
import PageEditorView from '../PageEditor';

export default function ConvertedPageEditorView() {
  const setEditorMode = useEditorStore((s) => s.setEditorMode);
  const setConvertedPageName = useEditorStore((s) => s.setConvertedPageName);

  useEffect(() => {
    setEditorMode('converted');
    const match = window.location.pathname.match(/\/edit-converted-page\/([^/?#]+)/);
    if (match?.[1]) {
      setConvertedPageName(decodeURIComponent(match[1]));
    }

    return () => {
      setEditorMode('pages');
      setConvertedPageName(null);
    };
  }, [setEditorMode, setConvertedPageName]);

  return <PageEditorView mode="converted" />;
}
