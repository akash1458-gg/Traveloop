import { useEffect, useRef, useState } from 'react';

const DESTINATIONS = [
  'Rajasthan',
  'Kerala',
  'Himachal Pradesh',
  'Tamil Nadu',
  'Uttarakhand',
  'Goa',
  'Kashmir',
  'Madhya Pradesh',
  'Gujarat',
  'West Bengal',
  'Karnataka',
  'Sikkim',
];

export default function DestinationMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const content = DESTINATIONS.map((d, i) => (
    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      {d}
      <span style={{ color: '#D4A03C', margin: '0 20px', fontSize: '10px' }}>◆</span>
    </span>
  ));

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '56px',
        background: '#1C1917',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      }}
    >
      <div
        className="animate-marquee"
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          fontFamily: "'Inter', sans-serif",
          fontSize: '13px',
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'rgba(245, 240, 235, 0.5)',
        }}
      >
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
}
