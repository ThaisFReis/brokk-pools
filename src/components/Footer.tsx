import { socialLinks } from '../content/social';
import { SocialPlatform } from '../types/SocialLink';

// Simple inline SVG icons to avoid external dependencies
function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const iconClass = 'w-5 h-5 sm:w-6 sm:h-6 fill-current';

  if (platform === 'x') {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (platform === 'telegram') {
    return (
      <svg
      className={iconClass} 
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    );
  }

  return null;
}

export const Footer = () => {
  return (
    <footer
      id="footer"
      className="relative w-full border-t border-forge-steel/10 bg-gradient-to-b from-forge-deepblack/40 to-forge-deepblack/80 backdrop-blur-xl"
    >
      {/* Metallic top edge */}
      <div className="absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-solana-purple/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-display">© {new Date().getFullYear()} Brokk Pools</span>
            <span className="hidden text-forge-steel/40 sm:inline">•</span>
            <span className="hidden text-xs sm:inline">Forged in DeFi</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="group relative"
              >
                <div className="relative rounded-full bg-forge-metaldark/40 p-2 transition-all duration-300 hover:scale-110 hover:bg-forge-metaldark/60">
                  <div className="relative">
                    <SocialIcon platform={link.platform} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
