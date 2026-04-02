'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type LivePreviewSyncProps = {
  enabled: boolean;
};

type PreviewMessage = {
  type?: string;
};

function isPayloadPreviewMessage(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const message = data as PreviewMessage;
  return message.type === 'payload-live-preview' || message.type === 'payload-document-event';
}

export function LivePreviewSync({ enabled }: LivePreviewSyncProps) {
  const router = useRouter();
  const isEmbeddedPreview =
    typeof window !== 'undefined' && window.self !== window.top && document.referrer.includes('/admin');

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (!isPayloadPreviewMessage(event.data)) {
        return;
      }

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        router.refresh();
      }, 120);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [enabled, router]);

  useEffect(() => {
    if (!enabled || !isEmbeddedPreview) {
      return;
    }

    const interval = setInterval(() => {
      router.refresh();
    }, 1200);

    return () => {
      clearInterval(interval);
    };
  }, [enabled, isEmbeddedPreview, router]);

  return null;
}
