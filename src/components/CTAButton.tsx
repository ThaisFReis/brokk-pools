interface CTAButtonProps {
  text: string;
  href: string;
  ariaLabel: string;
  className?: string;
}

function CTAButton({ text, href, ariaLabel, className = '' }: CTAButtonProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={`
        ${className}
        group
        relative
        inline-block
        min-h-[44px]
        overflow-hidden
        rounded-lg
        bg-gradient-to-br
        from-forge-metaldark/70
        to-forge-deepblack/40
        px-8
        py-3
        font-display
        text-lg
        font-bold
        text-gray-200
        shadow-lg
        backdrop-blur-xl
        transition-all
        duration-500
        hover:scale-105
        hover:text-gray-100
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-offset-forge-deepblack
      `}
    >
      {/* Metallic top edge */}
      <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-forge-steel/40 to-transparent" />

      {/* Heated metal accent line (appears on hover) */}
      <div className="absolute left-0 top-[2px] h-[1px] w-full bg-gradient-to-r from-transparent via-solana-purple/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Bottom forge glow */}
      <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-solana-purple/20 to-solana-purple/40 transition-all duration-700 group-hover:w-full" />

      <span className="relative font-display text-lg font-medium tracking-wide text-gray-300/70 group-hover:text-gray-100">{text}</span>
    </a>
  );
}

export default CTAButton;
