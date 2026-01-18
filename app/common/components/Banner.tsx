import Image from "next/image";

interface BannerProps {
  src: string;
  alt?: string;
  className?: string;
}

const Banner = ({ src, alt = "Banner", className = "" }: BannerProps) => {
  return (
    <div className={`w-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={400}
        className="w-full h-auto object-cover rounded-lg md:rounded-none"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
      />
    </div>
  );
};

export default Banner;
