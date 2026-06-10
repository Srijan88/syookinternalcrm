export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ minHeight: '100dvh', width: '100%' }}
      className="md:flex md:items-start md:justify-center md:py-10"
    >
      {/* Device shell — visible only at md+ */}
      <div className="w-full md:w-[390px] relative">

        {/* iOS device frame (desktop only) */}
        <div className="hidden md:block">
          <div
            style={{
              position: 'absolute',
              inset: -12,
              borderRadius: 56,
              background: '#1C1C1E',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06) inset',
              zIndex: -1,
            }}
          />
          {/* Dynamic Island */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 120,
              height: 34,
              background: '#000000',
              borderRadius: 999,
              zIndex: 60,
            }}
          />
          {/* Side buttons */}
          <div style={{ position: 'absolute', left: -14, top: 100,  width: 4, height: 32,  background: '#2A2A2A', borderRadius: '2px 0 0 2px' }} />
          <div style={{ position: 'absolute', left: -14, top: 148,  width: 4, height: 56,  background: '#2A2A2A', borderRadius: '2px 0 0 2px' }} />
          <div style={{ position: 'absolute', left: -14, top: 214,  width: 4, height: 56,  background: '#2A2A2A', borderRadius: '2px 0 0 2px' }} />
          <div style={{ position: 'absolute', right: -14, top: 160, width: 4, height: 80,  background: '#2A2A2A', borderRadius: '0 2px 2px 0' }} />
        </div>

        {/*
          Screen content.
          height: 100dvh + display: flex + flex-direction: column means:
          – The screen is always exactly viewport-tall (never body-scroll)
          – Children (status bar spacer, App flex column, home indicator) are
            stacked vertically and own their respective heights
          No transform needed — BottomNav is in normal flow, not position:fixed
        */}
        <div
          className="w-full bg-bg overflow-hidden"
          style={{
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Status bar spacer (desktop only, accounts for Dynamic Island) */}
          <div className="hidden md:block" style={{ height: 50, flexShrink: 0 }} />

          {/* Main content — flex: 1 fills the space between spacer and indicator */}
          {children}

          {/* Home indicator (desktop only) */}
          <div
            className="hidden md:flex"
            style={{ justifyContent: 'center', paddingBottom: 8, paddingTop: 6, flexShrink: 0 }}
          >
            <div
              style={{
                width: 134,
                height: 5,
                background: '#1C1C1E',
                borderRadius: 999,
                opacity: 0.18,
              }}
            />
          </div>
        </div>

        {/* Screen border overlay (desktop) */}
        <div
          className="hidden md:block pointer-events-none"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 44,
            border: '1px solid rgba(255,255,255,0.1)',
            zIndex: 50,
          }}
        />
      </div>
    </div>
  );
}
