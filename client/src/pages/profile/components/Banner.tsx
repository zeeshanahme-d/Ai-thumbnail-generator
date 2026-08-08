interface BannerProps {
    className?: string;
}

const Banner = ({ className }: BannerProps) => {
    return <div className={`h-35 sm:h-50 relative overflow-hidden bg-linear-to-b from-primary via-[#c1121f] to-[#9c0b01] ${className}`}>
        <div aria-hidden="true" className="absolute -top-10 right-[10%] w-50 h-50 rounded-full bg-white/10"></div>
        <div aria-hidden="true" className="absolute -bottom-7.5 left-[20%] w-37.5 h-37.5 rounded-full bg-white/5"></div>
    </div>
}

export default Banner