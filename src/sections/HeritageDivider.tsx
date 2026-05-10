import { useEffect, useRef, useState } from 'react';

export default function HeritageDivider() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);

    function onScroll() {
      const rect = section?.getBoundingClientRect();
      if (rect) {
        const scrollProgress = -rect.top * 0.3;
        setParallaxY(scrollProgress);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section
      id="heritage"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '50vh',
        minHeight: '400px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background image with parallax */}
      <div
        style={{
          position: 'absolute',
          inset: '-20% 0',
          backgroundImage: 'url(https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&h=600&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${parallaxY}px)`,
          transition: 'transform 0.1s linear',
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(12,10,9,0.4), rgba(12,10,9,0.6))',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '600px',
          padding: '0 24px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#D4A03C',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          HERITAGE
        </span>
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 400,
            color: '#F5F0EB',
            letterSpacing: '0.04em',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Where History Breathes
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '18px',
            color: 'rgba(245,240,235,0.85)',
            lineHeight: 1.65,
            marginTop: '20px',
          }}
        >
          Walk through corridors carved by empires, stand before monuments that
          have witnessed millennia, and feel the pulse of a civilization that
          has never stopped creating.
        </p>
        <div style={{ marginTop: '32px' }}>
          <a
            href="/experiences"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              border: '1px solid rgba(212,160,60,0.5)',
              borderRadius: '50px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              color: '#F5F0EB',
              textDecoration: 'none',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#D4A03C';
              e.currentTarget.style.color = '#1C1917';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#F5F0EB';
            }}
          >
            Discover Heritage
          </a>
        </div>
      </div>
    </section>
  );
}
