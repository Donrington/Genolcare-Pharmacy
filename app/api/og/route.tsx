import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0A1628 0%, #0F2660 45%, #1A3B8B 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background pattern dots */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(109,190,69,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            display: 'flex',
          }}
        />

        {/* Green accent glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(109,190,69,0.25) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Blue glow bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-60px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,59,139,0.5) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Horizontal rule accent */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '3px',
            background: 'linear-gradient(90deg, #6DBE45 0%, #1A3B8B 50%, transparent 100%)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 80px',
            height: '100%',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Top: Logo + tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Logo mark */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6DBE45, #1A3B8B)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'white', fontSize: '22px', fontWeight: '900', letterSpacing: '-0.02em', lineHeight: 1 }}>
                Genolcare
              </span>
              <span style={{ color: 'rgba(109,190,69,0.9)', fontSize: '11px', fontWeight: '600', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: '4px' }}>
                Pharmacy & Clinical Consulting
              </span>
            </div>

            {/* Verified badge */}
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(109,190,69,0.12)',
                border: '1px solid rgba(109,190,69,0.3)',
                borderRadius: '999px',
                padding: '6px 16px',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6DBE45', display: 'flex' }} />
              <span style={{ color: '#6DBE45', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Verified Specialist Practice
              </span>
            </div>
          </div>

          {/* Center: Main headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                background: 'rgba(109,190,69,0.15)',
                border: '1px solid rgba(109,190,69,0.25)',
                borderRadius: '8px',
                padding: '6px 14px',
                width: 'fit-content',
              }}
            >
              <span style={{ color: '#6DBE45', fontSize: '12px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Wuse District, Abuja FCT · Nigeria
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span
                style={{
                  fontSize: '64px',
                  fontWeight: '900',
                  color: 'white',
                  lineHeight: '1.05',
                  letterSpacing: '-0.03em',
                }}
              >
                Clinical Excellence.
              </span>
              <span
                style={{
                  fontSize: '64px',
                  fontWeight: '900',
                  lineHeight: '1.05',
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(90deg, #6DBE45, #9FD96A)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Precision Care.
              </span>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '20px', lineHeight: '1.5', maxWidth: '640px', margin: 0 }}>
              15+ years of specialist expertise in infectious disease pharmacology. Genuine medications, WAPCP-certified consultations, and seamless pharmaceutical service.
            </p>
          </div>

          {/* Bottom: Trust signals */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            {[
              { value: '15+', label: 'Years Experience' },
              { value: 'FPCPharm', label: 'Certified' },
              { value: 'WAPCP', label: 'Fellow' },
              { value: '100%', label: 'Genuine Medications' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: '#6DBE45', fontSize: '22px', fontWeight: '900', letterSpacing: '-0.02em' }}>
                  {item.value}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {item.label}
                </span>
              </div>
            ))}

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>genolcare-pharmacy.vercel.app</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
