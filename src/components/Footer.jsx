import { Globe, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const scrollTo = (e, id) => {
    e.preventDefault();
    if (!id || id === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.querySelector(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-[#050505] border-t border-[rgba(255,107,0,0.3)] pt-16 pb-8 px-[5%]">
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-12 max-w-[1100px] mx-auto mb-12">
        <div>
          <a href="#" className="nav-logo inline-block mb-4 text-[1.4rem]" onClick={(e) => scrollTo(e, '#')}>
            SPORT <span>SURGE</span>
          </a>
          <p className="text-[0.85rem] text-[--text-muted] leading-[1.75] max-w-[260px]">
            India's first comprehensive sportsperson registration portal — bridging athletes with opportunities from grassroots to elite level.
          </p>
          <div className="flex gap-3 mt-6">
            <a href="#" className="social-btn" aria-label="Globe"><Globe size={16} /></a>
            <a href="#" className="social-btn" aria-label="Globe"><Globe size={16} /></a>
            <a href="#" className="social-btn" aria-label="YouTube"><Globe size={16} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-[0.8rem] font-bold tracking-widest uppercase text-[--accent] mb-5">Quick Links</h4>
          <ul className="list-none flex flex-col gap-3">
            {[
              { href: '#', label: 'Home' },
              { href: '#about', label: 'About Us' },
              { href: '#features', label: 'Members' },
              { href: '#', label: 'Event Registration' },
              { href: '#', label: 'Member Registration' },
              { href: '#', label: 'News' },
            ].map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={(e) => scrollTo(e, l.href)} className="text-[--text-muted] no-underline text-[0.875rem] hover:text-white transition-colors duration-300">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[0.8rem] font-bold tracking-widest uppercase text-[--accent] mb-5">Contact Us</h4>
          <div className="contact-item">
            <span className="icon"><Phone size={15} color="var(--accent)" /></span>
            <a href="tel:8800166158" className="text-[--text-muted] no-underline text-[0.875rem] hover:text-[--accent] transition-colors duration-300">8800166158</a>
          </div>
          <div className="contact-item">
            <span className="icon"><Mail size={15} color="var(--accent)" /></span>
            <a href="mailto:sportsurge@gmail.com" className="text-[--text-muted] no-underline text-[0.875rem] hover:text-[--accent] transition-colors duration-300">sportsurge@gmail.com</a>
          </div>
          <div className="contact-item">
            <span className="icon"><MapPin size={15} color="var(--accent)" /></span>
            <p className="text-[--text-muted] text-[0.875rem] m-0">India</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[--border] pt-6 flex flex-col md:flex-row justify-between items-center max-w-[1100px] mx-auto gap-2">
        <p className="text-[0.8rem] text-[--text-muted]">© 2025 <a href="#" className="text-[--accent] no-underline">Sport Surge Pro</a>. All rights reserved.</p>
        <p className="text-[0.8rem] text-[--text-muted]">Designed for athletes. Built for champions.</p>
      </div>
    </footer>
  );
}
