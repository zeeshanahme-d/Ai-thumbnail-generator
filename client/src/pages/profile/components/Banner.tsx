interface BannerProps {
    className?: string;
}

const Banner = ({ className }: BannerProps) => {
    return <div className={`h-[140px] sm:h-[200px] relative overflow-hidden bg-linear-to-b from-primary via-[#c1121f] to-[#9c0b01] ${className}`}>
        <div aria-hidden="true" className="absolute top-[-40px] right-[10%] w-[200px] h-[200px] rounded-full bg-white/10"></div>
        <div aria-hidden="true" className="absolute bottom-[-30px] left-[20%] w-[150px] h-[150px] rounded-full bg-white/5"></div>
    </div>
}

export default Banner