'use client';

function SkeletonRect({ width = '100%', height = 16, radius = 4, opacity = 1 }: {
  width?: string | number;
  height?: number;
  radius?: number;
  opacity?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.4s infinite',
        opacity,
        flexShrink: 0,
      }}
    />
  );
}

function SkeletonBlockCard() {
  return (
    <div
      style={{
        borderRadius: '8px',
        border: '1px solid #1e1e1e',
        background: '#141414',
        padding: '10px 12px',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <SkeletonRect width={14} height={20} radius={3} />
      <SkeletonRect width={20} height={20} radius={10} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <SkeletonRect width="60%" height={12} />
        <SkeletonRect width="40%" height={10} opacity={0.6} />
      </div>
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <>
      <style>{`
        @keyframes skeletonShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* Palette skeleton */}
        <aside style={{ width: 220, flexShrink: 0, background: '#111', borderRight: '1px solid #222', padding: '16px 10px' }}>
          <SkeletonRect width="50%" height={10} radius={3} />
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, border: '1px solid #1e1e1e', background: '#141414' }}>
                <SkeletonRect width={18} height={18} radius={4} />
                <SkeletonRect width="55%" height={11} />
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas skeleton */}
        <div style={{ width: 280, flexShrink: 0, background: '#0f0f0f', borderRight: '1px solid #222', padding: '16px 8px' }}>
          <SkeletonRect width="50%" height={10} radius={3} />
          <div style={{ marginTop: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlockCard key={i} />
            ))}
          </div>
        </div>

        {/* Preview skeleton */}
        <div style={{ flex: 1, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', width: '100%', height: '100%', opacity: 0.04, borderRadius: 0 }} />
        </div>

        {/* Config skeleton */}
        <aside style={{ width: 280, flexShrink: 0, background: '#111', borderLeft: '1px solid #222', padding: '16px 14px' }}>
          <SkeletonRect width="45%" height={10} radius={3} />
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <SkeletonRect width="35%" height={10} radius={3} />
                <div style={{ marginTop: 6 }}>
                  <SkeletonRect height={34} radius={6} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
