'use client';

import { useEffect } from 'react';
import { loadStoryblokBridge } from '@storyblok/react';

export function StoryblokBridgeLoader() {
  useEffect(() => {
    loadStoryblokBridge().catch(() => {
      // Keep silent in non-visual contexts where bridge script is not available.
    });
  }, []);

  return null;
}
