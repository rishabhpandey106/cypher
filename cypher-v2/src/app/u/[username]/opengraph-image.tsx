import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#FFF8E7',
          padding: '40px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#FFFFFF',
            border: '8px solid #000',
            boxShadow: '20px 20px 0px #000',
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: '#000',
                letterSpacing: '-1px',
              }}
            >
              CYPHER
            </div>

            <div
              style={{
                background: '#000',
                color: '#fff',
                padding: '10px 18px',
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              ANONYMOUS
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          >
            <div
              style={{
                fontSize: 42,
                color: '#555',
                fontWeight: 700,
                marginBottom: 24,
              }}
            >
              Send a secret message to
            </div>

            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                background: '#FFD93D',
                border: '8px solid #000',
                padding: '20px 32px',
              }}
            >
              <span
                style={{
                  fontSize: 96,
                  fontWeight: 900,
                  color: '#000',
                  lineHeight: 1,
                  letterSpacing: '-3px',
                }}
              >
                @{username}
              </span>
            </div>
          </div>

          {/* Bottom */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'auto',
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#666',
              }}
            >
              Ask anything. Stay anonymous.
            </div>

            <div
              style={{
                width: 70,
                height: 70,
                background: '#FF6B6B',
                border: '6px solid #000',
              }}
            />
          </div>
        </div>
      </div>
    ),
    size
  )
}