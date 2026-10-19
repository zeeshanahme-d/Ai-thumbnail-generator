interface BannerProps {
    className?: string;
}

// The band across the top of a profile, with the public pages' fading grid and grain.
const Banner = ({ className = "" }: BannerProps) => (
    <div className={`relative h-36 overflow-hidden border-b border-border bg-background-surface sm:h-48 ${className}`}>
        <div aria-hidden="true" className="backdrop-grid absolute inset-0" />
        <div aria-hidden="true" className="backdrop-grain absolute inset-0" />
    </div>
);

export default Banner;
