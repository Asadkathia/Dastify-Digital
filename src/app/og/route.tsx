import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Dastify Digital';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px',
          background: 'linear-gradient(135deg, #0E0E0C 0%, #0367a5 100%)',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.8 }}>Dastify Digital</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, marginTop: 24 }}>{title}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
