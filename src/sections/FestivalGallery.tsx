import { useEffect, useRef, useState } from 'react';

const FESTIVALS = [
  {
    name: 'Diwali',
    month: 'November',
    tagline: 'Festival of Lights',
    image: '/images/img-fest-diwali.jpg',
  },
  {
    name: 'Holi',
    month: 'March',
    tagline: 'Festival of Colors',
    image: '/images/img-fest-holi.jpg',
  },
  {
    name: 'Durga Puja',
    month: 'October',
    tagline: 'Victory of the Goddess',
    image: '/images/img-fest-durga.jpg',
  },
  {
    name: 'Onam',
    month: 'September',
    tagline: 'Harvest Festival of Kerala',
    image: '/images/img-fest-onam.jpg',
  },
];

export default function FestivalGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>(
    new Array(FESTIVALS.length).fill(false)
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            FESTIVALS.forEach((_, i) => {
              setTimeout(() => {
                setCardsVisible((prev) => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="festivals"
      ref={sectionRef}
      style={{
        background: '#1C1917',
        padding: '120px 5vw',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#D4A03C',
            display: 'block',
          }}
        >
          FESTIVALS
        </span>
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 400,
            color: '#F5F0EB',
            lineHeight: 1.2,
            margin: '12px 0 0',
          }}
        >
          A Celebration for
          <br />
          Every Season
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '18px',
            color: 'rgba(245,240,235,0.7)',
            maxWidth: '520px',
            marginTop: '16px',
            lineHeight: 1.65,
          }}
        >
          India's festivals are not just events — they are expressions of
          faith, harvests of joy, and celebrations of life itself.
        </p>

        {/* Gallery */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginTop: '60px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '16px',
            scrollbarWidth: 'none',
          }}
        >
          {FESTIVALS.map((fest, i) => (
            <div
              key={fest.name}
              style={{
                flex: '0 0 calc(25% - 18px)',
                minWidth: '280px',
                scrollSnapAlign: 'start',
                opacity: cardsVisible[i] ? 1 : 0,
                transform: cardsVisible[i]
                  ? 'translateX(0)'
                  : 'translateX(30px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
              }}
            >
              <div
                style={{
                  aspectRatio: '4/5',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={fest.image}
                  alt={fest.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                />
              </div>
              <h3
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '22px',
                  color: '#F5F0EB',
                  margin: '16px 0 0',
                }}
              >
                {fest.name}
              </h3>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '4px 16px',
                  background: 'rgba(212,160,60,0.15)',
                  border: '1px solid rgba(212,160,60,0.3)',
                  borderRadius: '50px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  color: '#D4A03C',
                }}
              >
                {fest.month}
              </span>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <a
            href="/festivals"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 40px',
              border: '1px solid rgba(212,160,60,0.5)',
              borderRadius: '50px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
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
            View All Festivals
          </a>
        </div>
      </div>
    </section>
  );
}
