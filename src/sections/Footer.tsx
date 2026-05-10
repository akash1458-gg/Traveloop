import { useEffect, useRef, useState } from 'react';

const EXPLORE_LINKS = [
  'Destinations',
  'Experiences',
  'Heritage Sites',
  'Wildlife',
  'Adventure',
];

const PLAN_LINKS = [
  'Travel Guide',
  'Visa Information',
  'Best Time to Visit',
  'How to Reach',
  'Accommodations',
];

const CONNECT_LINKS = [
  'About Us',
  'Contact',
  'Media Gallery',
  'Travel Blog',
  'FAQs',
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [columnsVisible, setColumnsVisible] = useState<boolean[]>(
    new Array(4).fill(false)
  );

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            [0, 1, 2, 3].forEach((i) => {
              setTimeout(() => {
                setColumnsVisible((prev) => {
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
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        background: '#1C1917',
        padding: '80px 5vw 40px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
        }}
      >
        {/* Brand */}
        <div
          style={{
            opacity: columnsVisible[0] ? 1 : 0,
            transform: columnsVisible[0] ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '24px',
              fontWeight: 400,
              color: '#F5F0EB',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontWeight: 400 }}>Incredible</span>{' '}
            <span style={{ fontWeight: 600 }}>India</span>
          </a>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              color: '#78716C',
              lineHeight: 1.6,
              marginTop: '16px',
              maxWidth: '280px',
            }}
          >
            The official tourism portal of India — inspiring travelers to
            discover the soul of the subcontinent.
          </p>
        </div>

        {/* Explore */}
        <div
          style={{
            opacity: columnsVisible[1] ? 1 : 0,
            transform: columnsVisible[1] ? 'translateY(0)' : 'translateY(30px)',
            transition:
              'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s',
          }}
        >
          <h4
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#D4A03C',
              margin: '0 0 20px',
            }}
          >
            EXPLORE
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {EXPLORE_LINKS.map((link) => (
              <li key={link} style={{ marginBottom: '8px' }}>
                <a
                  href="#"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    color: '#78716C',
                    textDecoration: 'none',
                    lineHeight: 2.4,
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#F5F0EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#78716C';
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Plan */}
        <div
          style={{
            opacity: columnsVisible[2] ? 1 : 0,
            transform: columnsVisible[2] ? 'translateY(0)' : 'translateY(30px)',
            transition:
              'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
          }}
        >
          <h4
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#D4A03C',
              margin: '0 0 20px',
            }}
          >
            PLAN YOUR TRIP
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {PLAN_LINKS.map((link) => (
              <li key={link} style={{ marginBottom: '8px' }}>
                <a
                  href="#"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    color: '#78716C',
                    textDecoration: 'none',
                    lineHeight: 2.4,
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#F5F0EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#78716C';
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div
          style={{
            opacity: columnsVisible[3] ? 1 : 0,
            transform: columnsVisible[3] ? 'translateY(0)' : 'translateY(30px)',
            transition:
              'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s',
          }}
        >
          <h4
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#D4A03C',
              margin: '0 0 20px',
            }}
          >
            CONNECT
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {CONNECT_LINKS.map((link) => (
              <li key={link} style={{ marginBottom: '8px' }}>
                <a
                  href="#"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    color: '#78716C',
                    textDecoration: 'none',
                    lineHeight: 2.4,
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#F5F0EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#78716C';
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '60px auto 0',
          borderTop: '1px solid rgba(245, 240, 235, 0.08)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            color: '#57534E',
          }}
        >
          © 1999 Incredible India. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {['Privacy Policy', 'Terms of Use', 'Sitemap'].map((item, i) => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {i > 0 && (
                <span style={{ color: '#57534E', fontSize: '13px' }}>·</span>
              )}
              <a
                href="#"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  color: '#57534E',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#F5F0EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#57534E';
                }}
              >
                {item}
              </a>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
