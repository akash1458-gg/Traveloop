import { useEffect, useRef, useState } from 'react';

export default function PlanningCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="plan"
      ref={sectionRef}
      style={{
        background: 'linear-gradient(135deg, #E85D3F 0%, #D4A03C 50%, #2E7D5C 100%)',
        padding: '100px 5vw',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 400,
            color: '#F5F0EB',
            letterSpacing: '0.04em',
            lineHeight: 1.2,
            margin: 0,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          Begin Your Indian Odyssey
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '18px',
            color: 'rgba(245,240,235,0.9)',
            lineHeight: 1.65,
            marginTop: '20px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition:
              'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s',
          }}
        >
          Whether you seek spiritual solace in Varanasi, adventure in Ladakh,
          or tranquility in Kerala — your journey starts here.
        </p>
        <a
          href="/create-trip"
          style={{
            display: 'inline-block',
            marginTop: '36px',
            padding: '16px 48px',
            background: '#F5F0EB',
            color: '#1C1917',
            borderRadius: '50px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'all 0.4s ease',
            cursor: 'pointer',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.4s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1C1917';
            e.currentTarget.style.color = '#F5F0EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F5F0EB';
            e.currentTarget.style.color = '#1C1917';
          }}
        >
          Plan Your Trip
        </a>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            color: 'rgba(245,240,235,0.7)',
            marginTop: '16px',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.8s ease-out 0.6s',
          }}
        >
          Or call us: +91-11-2336-3607
        </p>
      </div>
    </section>
  );
}
