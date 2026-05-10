import { useEffect, useRef, useState } from 'react';
import { Plane } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Destinations', href: '#destinations' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'Heritage', href: '#heritage' },
  { label: 'Festivals', href: '#festivals' },
  { label: 'Plan Your Trip', href: '#plan' },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const wh = window.innerHeight;

      // Show/hide based on scroll direction
      if (y > lastScrollY.current && y > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      // Transparent in hero, frosted after
      setIsScrolled(y >= wh * 0.3);
      lastScrollY.current = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 5vw',
          transition: 'all 0.4s ease',
          transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
          background: isScrolled
            ? 'rgba(28, 25, 23, 0.85)'
            : 'rgba(28, 25, 23, 0.4)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'blur(8px)',
          borderBottom: '1px solid rgba(245, 240, 235, 0.08)',
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, '#hero')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: "'Cinzel', serif",
            fontSize: '22px',
            fontWeight: 400,
            color: 'black',
            letterSpacing: '0.06em',
            textDecoration: 'none',
          }}
        >
          <Plane size={24} fill="black" color="black" />
          <span style={{ fontWeight: 600 }}>Traveloop</span>
        </a>

        {/* Center nav - desktop */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                color: 'rgba(245, 240, 235, 0.7)',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                position: 'relative',
                paddingBottom: '2px',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#F5F0EB';
                const underline = e.currentTarget.querySelector(
                  '.nav-underline'
                ) as HTMLElement;
                if (underline) underline.style.width = '100%';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(245, 240, 235, 0.7)';
                const underline = e.currentTarget.querySelector(
                  '.nav-underline'
                ) as HTMLElement;
                if (underline) underline.style.width = '0%';
              }}
            >
              {link.label}
              <span
                className="nav-underline"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0%',
                  height: '1px',
                  background: '#D4A03C',
                  transition: 'width 0.3s ease',
                }}
              />
            </a>
          ))}
        </div>

        {/* CTA - desktop */}
        <a
          href="#plan"
          onClick={(e) => handleLinkClick(e, '#plan')}
          className="hidden md:inline-block"
          style={{
            padding: '8px 24px',
            border: '1px solid rgba(245, 240, 235, 0.3)',
            borderRadius: '50px',
            color: '#F5F0EB',
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            background: 'rgba(245, 240, 235, 0.1)',
            transition: 'all 0.4s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#D4A03C';
            e.currentTarget.style.color = '#1C1917';
            e.currentTarget.style.borderColor = '#D4A03C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(245, 240, 235, 0.1)';
            e.currentTarget.style.color = '#F5F0EB';
            e.currentTarget.style.borderColor = 'rgba(245, 240, 235, 0.3)';
          }}
        >
          Explore Now
        </a>

        {/* Hamburger - mobile */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          <span
            style={{
              width: '24px',
              height: '2px',
              background: '#F5F0EB',
              transition: 'all 0.3s ease',
              transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none',
            }}
          />
          <span
            style={{
              width: '24px',
              height: '2px',
              background: '#F5F0EB',
              transition: 'all 0.3s ease',
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              width: '24px',
              height: '2px',
              background: '#F5F0EB',
              transition: 'all 0.3s ease',
              transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: '#1C1917',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '28px',
                fontWeight: 400,
                color: '#F5F0EB',
                textDecoration: 'none',
                opacity: 0,
                animation: `fadeIn 0.4s ease forwards ${i * 0.1}s`,
              }}
            >
              {link.label}
            </a>
          ))}
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
