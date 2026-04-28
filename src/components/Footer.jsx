import { Globe, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const scrollTo = (e, id) => {
    e.preventDefault();
    if (!id || id === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.querySelector(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="footer-wrap">
      {/* Big wordmark */}
      <div className="footer-wordmark" aria-hidden="true">SURGE</div>

      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="nav-logo text-[1.6rem]" onClick={(e) => scrollTo(e, '#')}>
              SPORT <span>SURGE</span>
            </a>
            <p className="footer-tagline">
              India's first comprehensive sportsperson registration portal — bridging athletes with opportunities from grassroots to elite level.
            </p>
            <div className="footer-socials">
              {['X', 'IG', 'YT'].map(s => (
                <a key={s} href="#" className="social-btn" aria-label={s}>
                  <span className="text-[0.65rem] font-bold tracking-wider">{s}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-head">Quick Links</h4>
            <ul className="footer-links-list">
              {[['#', 'Home'], ['#about', 'About Us'], ['#features', 'Members'], ['#coaches', 'Coaches'], ['#events', 'Events']].map(([href, label]) => (
                <li key={label}>
                  <a href={href} onClick={(e) => scrollTo(e, href)} className="footer-link">
                    {label} <ArrowUpRight size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-head">Contact</h4>
            <div className="footer-contact-list">
              {[
                { icon: Phone, val: '8800166158',          href: 'tel:8800166158' },
                { icon: Mail,  val: 'sportsurge@gmail.com', href: 'mailto:sportsurge@gmail.com' },
                { icon: MapPin,val: 'India',                href: null },
              ].map(({ icon: Icon, val, href }) => (
                <div key={val} className="footer-contact-item">
                  <Icon size={14} color="var(--accent)" />
                  {href
                    ? <a href={href} className="footer-contact-val">{val}</a>
                    : <span className="footer-contact-val">{val}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 <a href="#" style={{ color: 'var(--accent)' }}>Sport Surge Pro</a>. All rights reserved.</p>
          <p>Designed for athletes. Built for champions.</p>
        </div>
      </div>
    </footer>
  );
}
