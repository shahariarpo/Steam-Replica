import { FaSteam, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';

const FOOTER_LINKS = [
  {
    title: 'About',
    links: ['About Valve', 'Jobs', 'Steamworks', 'Steam Distribution', 'Gift Cards'],
  },
  {
    title: 'Help',
    links: ['Support', 'Steam Status', 'Privacy Policy', 'Legal', 'Subscriber Agreement'],
  },
  {
    title: 'Community',
    links: ['Discussions', 'Workshop', 'Market', 'Broadcasts', 'Community Hub'],
  },
];

const LANGUAGES = [
  'English', 'Español', 'Français', 'Deutsch', 'Italiano',
  'Português', 'Русский', '日本語', '한국어', '简体中文',
];

export default function Footer() {
  return (
    <footer className="bg-steam-darkest mt-12 border-t border-steam-border" id="footer">
      {/* Top accent gradient */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-steam-accent/30 to-transparent" />
      
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {/* Links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-steam-text-bright group">
              <FaSteam className="text-4xl text-steam-accent/80 group-hover:text-steam-accent transition-colors duration-300" />
              <div>
                <div className="text-xl font-bold tracking-widest">STEAM</div>
                <div className="text-[11px] text-steam-text-dim">© 2026 Valve Corporation</div>
              </div>
            </div>
            <p className="text-xs text-steam-text-dim leading-relaxed">
              Steam is the ultimate destination for playing, discussing, and creating games.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: FaFacebook, label: 'Facebook' },
                { icon: FaTwitter, label: 'Twitter' },
                { icon: FaYoutube, label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-steam-medium/40 text-steam-text-dim hover:text-steam-accent hover:bg-steam-medium/80 transition-all duration-200 hover:scale-110"
                  aria-label={label}
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-xs font-semibold text-steam-text-bright uppercase tracking-widest">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-steam-text-dim hover:text-steam-accent transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="section-divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Language selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="language-select" className="text-xs text-steam-text-dim">🌐</label>
            <select
              id="language-select"
              className="bg-steam-medium/50 text-steam-text text-xs rounded-md px-3 py-1.5 border border-steam-border/50 outline-none cursor-pointer hover:border-steam-accent/50 transition-colors duration-200 appearance-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-steam-text-dim/60 text-center">
            All trademarks are property of their respective owners. Educational replica — not affiliated with Valve.
          </p>
        </div>
      </div>
    </footer>
  );
}
