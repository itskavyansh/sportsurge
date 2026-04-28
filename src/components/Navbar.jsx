import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef = useRef(null);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 60);

    const hero = document.getElementById('hero');
    if (hero) {
      const maxScroll = hero.offsetHeight - window.innerHeight;
      setHidden(y > 50 && y < maxScroll - 50);
    }

    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach((sec) => {
      if (y >= sec.offsetTop - 100) current = sec.id;
    });
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) closeMenu();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    closeMenu();
    if (!id || id === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.querySelector(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  };

  const links = [
    { href: '#', label: 'Home' },
    { href: '#about', label: 'About Us' },
    { href: '#features', label: 'Members' },
    { href: '#events', label: 'Events' },
    { href: '#coaches', label: 'Coaches' },
    { href: '#footer', label: 'Contact Us' },
  ];

  const cn = `${scrolled ? 'scrolled' : ''} ${hidden ? 'navbar-hidden' : ''}`.trim();

  return (
    <div ref={navRef}>
      <nav id="navbar" className={cn || undefined}>
        <a href="#" className="nav-logo" onClick={(e) => scrollTo(e, '#')}>
          <span className="nav-logo-sport">SPORT</span> <span>SURGE</span>
        </a>

        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className={activeSection === l.href.replace('#', '') || (l.href === '#' && !activeSection) ? 'active' : ''}
                onClick={(e) => scrollTo(e, l.href)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions" id="navActions">
          <Link to="/register" className="btn-login">Log In</Link>
          <Link to="/register" className="btn-register">Register Now</Link>
        </div>

        <div
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          aria-label="Menu"
          onClick={toggleMenu}
        >
          <span></span><span></span><span></span>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {links.map((l) => (
          <a key={l.label} href={l.href} onClick={(e) => scrollTo(e, l.href)}>
            {l.label}
          </a>
        ))}
        <Link to="/register" className="btn-register" style={{ textAlign: 'center' }}>Register Now</Link>
      </div>
    </div>
  );
}
