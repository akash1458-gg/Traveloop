import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '../utils/database';

export default function DestinationShowcase() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [states, setStates] = useState([]);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const allStates = db.getAll('states');
    setStates(allStates);
    setCardsVisible(new Array(allStates.length).fill(false));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || states.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            states.forEach((_, i) => {
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
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [states]);

  return (
    <section
      id="destinations"
      ref={sectionRef}
      style={{
        background: '#EDE8E1',
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
          EXPLORE THE STATES
        </span>
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 400,
            color: '#1C1917',
            lineHeight: 1.2,
            margin: '8px 0 0',
          }}
        >
          Unveil the Magic of India
        </h2>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '32px',
            marginTop: '60px',
          }}
        >
          {states.map((state, i) => (
            <div
              key={state.id}
              onClick={() => navigate(`/state/${state.id}`)}
              style={{
                position: 'relative',
                height: '480px',
                borderRadius: '32px',
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: cardsVisible[i] ? 1 : 0,
                transform: cardsVisible[i]
                  ? 'translateY(0)'
                  : 'translateY(40px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="group shadow-xl hover:shadow-2xl"
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img') as HTMLElement;
                if (img) img.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img') as HTMLElement;
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              {/* Background Image */}
              <img
                src={state.image}
                alt={state.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />

              {/* Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(28,25,23,0.95) 0%, rgba(28,25,23,0.4) 40%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '40px',
                }}
              >
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#D4A03C',
                  marginBottom: '8px'
                }}>
                  {state.region} India
                </span>
                <h3
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '28px',
                    color: '#F5F0EB',
                    margin: 0,
                  }}
                >
                  {state.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    color: 'rgba(245,240,235,0.7)',
                    lineHeight: 1.5,
                    marginTop: '12px',
                    opacity: 0.9
                  }}
                >
                  {state.tagline}
                </p>

                {/* View Details Prompt */}
                <div style={{
                  marginTop: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: 0,
                  transform: 'translateY(10px)',
                  transition: 'all 0.4s ease'
                }} className="group-hover:opacity-100 group-hover:translateY(0)">
                   <div style={{
                     height: '1px',
                     width: '40px',
                     background: '#D4A03C'
                   }} />
                   <span style={{
                     color: '#D4A03C',
                     fontSize: '12px',
                     fontWeight: 600,
                     textTransform: 'uppercase',
                     letterSpacing: '0.1em'
                   }}>Discover More</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/activities')}
            style={{
              padding: '18px 48px',
              background: '#1C1917',
              color: '#F5F0EB',
              borderRadius: '50px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 10px 30px rgba(28,25,23,0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(28,25,23,0.25)';
              e.currentTarget.style.background = '#D4A03C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(28,25,23,0.15)';
              e.currentTarget.style.background = '#1C1917';
            }}
          >
            Explore All Activities
          </button>
        </div>
      </div>
    </section>
  );
}
