import { socialLinks } from '../content/social';
import { SocialPlatform } from '../types/SocialLink';

// Simple inline SVG icons to avoid external dependencies
function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const iconClass = 'w-6 h-6 fill-current';

  if (platform === 'x') {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (platform === 'discord') {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    );
  }

  if (platform === 'docs') {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h5v2H8V7z" />
      </svg>
    );
  }

  return null;
}

function Footer() {
  return (
    <footer
      id="footer"
      className="relative w-full bg-white/3 shadow-md backdrop-blur-xl px-6 py-12"
    >
      {/* Metallic top edge */}
      <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-forge-steel/40 to-transparent" />

      {/* Holographic accent line */}
      <div className="absolute left-0 top-[2px] h-[1px] w-full bg-gradient-to-r from-transparent via-solana-purple/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        {/* Social Links */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-8">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              className="group flex items-center gap-3 text-gray-400 transition-all duration-500 hover:text-gray-100"
            >
              <div className="relative overflow-hidden rounded-full bg-gradient-to-br from-forge-metaldark/90 to-forge-deepblack/80 p-3 shadow-md backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-solana-purple/60">
                {/* Forge glow effect */}
                <div className="absolute inset-0 rounded-full bg-solana-purple/20 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 animate-ember-flicker rounded-full bg-forge-ember/10 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-60" />

                <div className="relative transition-all duration-500">
                  <SocialIcon platform={link.platform} />
                </div>
              </div>
              <span className="font-medium transition-all duration-300">
                {link.label}
              </span>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-forge-steel/20 pt-8 text-center">
          <p className="font-display text-sm text-gray-500">
            © {new Date().getFullYear()} Brokk Pools. Forged in DeFi, Powered by the Gods.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
