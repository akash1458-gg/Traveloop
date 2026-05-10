import { useEffect, useRef, useState } from 'react';

const EXPERIENCES = [
  {
    title: 'Palace Stays',
    category: 'HERITAGE',
    description:
      "Spend a night in a converted maharaja's palace, where marble corridors, courtyards, and royal hospitality transport you to a bygone era.",
    image: '/images/img-exp-palace.jpg',
  },
  {
    title: 'Wildlife Safaris',
    category: 'ADVENTURE',
    description:
      'Track Bengal tigers in Ranthambore, spot one-horned rhinos in Kaziranga, or witness elephants in the Western Ghats.',
    image: '/images/img-exp-safari.jpg',
  },
  {
    title: 'Ayurvedic Wellness',
    category: 'WELLNESS',
    description:
      "Rejuvenate with ancient healing practices in Kerala's backwaters — yoga, meditation, and therapies that have endured 5,000 years.",
    image: '/images/img-exp-ayurveda.jpg',
  },
  {
    title: 'Culinary Journeys',
    category: 'GASTRONOMY',
    description:
      "From street food in Old Delhi to royal Rajasthani thalis, every region offers a feast as diverse as its landscape.",
    image: '/images/img-exp-culinary.jpg',
  },
];

export default function ExperienceShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>(
    new Array(EXPERIENCES.length).fill(false)
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            EXPERIENCES.forEach((_, i) => {
              setTimeout(() => {
                setCardsVisible((prev) => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, i * 200);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experiences"
      ref={sectionRef}
      style={{
        background: '#F5F0EB',
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
          EXPERIENCES
        </span>
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 400,
            color: '#1C1917',
            lineHeight: 1.2,
            margin: '12px 0 0',
          }}
        >
          Live the Extraordinary
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '18px',
            color: '#44403C',
            maxWidth: '640px',
            marginTop: '16px',
            lineHeight: 1.65,
          }}
        >
          From palace stays to jungle safaris, from yoga retreats to culinary
          journeys — immerse yourself in experiences that transform.
        </p>

        {/* 2x2 Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
            gap: '24px',
            marginTop: '60px',
          }}
          className="experience-grid"
        >
          {EXPERIENCES.map((exp, i) => (
            <div
              key={exp.title}
              style={{
                display: 'flex',
                background: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                opacity: cardsVisible[i] ? 1 : 0,
                transform: cardsVisible[i]
                  ? 'translateY(0)'
                  : 'translateY(40px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                flexWrap: 'wrap',
              }}
            >
              {/* Image */}
              <div
                style={{
                  flex: '1 1 45%',
                  minWidth: '200px',
                  aspectRatio: '16/10',
                }}
              >
                <img
                  src={exp.image}
                  alt={exp.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <div
                style={{
                  flex: '1 1 55%',
                  minWidth: '200px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#E85D3F',
                  }}
                >
                  {exp.category}
                </span>
                <h3
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '28px',
                    fontWeight: 400,
                    color: '#1C1917',
                    margin: '8px 0 0',
                  }}
                >
                  {exp.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '15px',
                    color: '#44403C',
                    lineHeight: 1.6,
                    marginTop: '12px',
                    maxWidth: '360px',
                  }}
                >
                  {exp.description}
                </p>
                <a
                  href="/experiences"
                  style={{
                    display: 'inline-block',
                    marginTop: '16px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    color: '#E85D3F',
                    textDecoration: 'none',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    const underline = e.currentTarget.querySelector(
                      '.exp-underline'
                    ) as HTMLElement;
                    if (underline) underline.style.width = '100%';
                  }}
                  onMouseLeave={(e) => {
                    const underline = e.currentTarget.querySelector(
                      '.exp-underline'
                    ) as HTMLElement;
                    if (underline) underline.style.width = '0%';
                  }}
                >
                  Learn more →
                  <span
                    className="exp-underline"
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      width: '0%',
                      height: '1px',
                      background: '#E85D3F',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
