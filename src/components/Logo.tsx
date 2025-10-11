interface LogoProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

function Logo({ src, alt, width = 120, height = 120, className = '' }: LogoProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} object-contain`}
      loading="eager"
    />
  );
}

export default Logo;
