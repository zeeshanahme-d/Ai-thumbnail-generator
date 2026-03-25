import { motion } from "motion/react";
import { useState } from "react";
//icons
import { ChevronDown, Cpu, Image, PenTool, RectangleHorizontal, RectangleVertical, Sparkle, Square } from "lucide-react";

const ASPECT_RATIOS = [
    {
        ratio: "16 : 9",
        icon: <RectangleHorizontal />
    },
    {
        ratio: "1 : 1",
        icon: <Square />
    },
    {
        ratio: "9 : 16",
        icon: <RectangleVertical />
    }
];

const THUMBNAIL_STYLES = [
    {
        style: "Bold & Graphic",
        description: "High contrast, bold typography, striking visuals, vibrant colors.",
        icon: <Sparkle size={18} />
    },
    {
        style: "Tech/Futuristic",
        description: "Modern, sleek, high-tech elements, bold colors, futuristic elements.",
        icon: <Cpu size={18} />
    },
    {
        style: "Minimalist",
        description: "Clean, simple, minimalistic design, bold colors, lots of white space.",
        icon: <Square size={18} />
    },
    {
        style: "Photorealistic",
        description: "Photo-based, realistic, lifelike, natural looking, DSLR-style photography.",
        icon: <Image size={18} />
    },
    {
        style: "Illustrated",
        description: "Hand-drawn, artistic, creative, cartoon-like, vector art style.",
        icon: <PenTool size={18} />
    },
];

const COLOR_SCHEMES = [
    {
        scheme: "Vibrant",
        description: "Vibrant, bold, colorful, striking, vibrant colors.",
        schemeColors: ["#FF6B6B", "#4ECDC4", "#45B7D1"]
    },
    {
        scheme: "Sunset",
        description: "Warm, orange, pink, purple, soft, cinematic, glow.",
        schemeColors: ["#FF8C42", "#FF3C38", "#A23B72"]
    },
    {
        scheme: "Ocean",
        description: "Cool, blue, teal, fresh, clean, aquatic, calm.",
        schemeColors: ["#0077B6", "#00B4D8", "#90E0EF"]
    },
    {
        scheme: "Forest",
        description: "Green, earthy, organic, fresh, calm, forest, natural.",
        schemeColors: ["#2D6A4F", "#40916C", "#95D5B2"]
    },
    {
        scheme: "Purple",
        description: "Purple, magenta, violet, modern, stylish, moody, elegant.",
        schemeColors: ["#7B2CBF", "#9D4EDD", "#C77DFF"]
    },
    {
        scheme: "Monochrome",
        description: "Black, white, gray, high contrast, dramatic, timeless, elegant.",
        schemeColors: ["#212529", "#495057", "#ADB5BD"]
    },
    {
        scheme: "Neon",
        description: "Neon, electric, blue, pink, cyberpunk, high contrast, glow.",
        schemeColors: ["#FF00FF", "#00FFFF", "#FFFF00"]
    },
    {
        scheme: "Pastel",
        description: "Soft, pastel, low saturation, gentle, friendly, calm, sweet.",
        schemeColors: ["#FFB5A7", "#FCD5CE", "#F8EDEB"]
    }
];


function Generate() {
    const [title, setTitle] = useState("");
    const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0].ratio);
    const [thumbnailStyle, setThumbnailStyle] = useState(THUMBNAIL_STYLES[0]);
    const [colorScheme, setColorScheme] = useState(COLOR_SCHEMES[0]);


    const handleThumbnailStyle = (style: any) => {
        setThumbnailStyle(style);

        const popover = document.getElementById("popover-thumbnail-style") as HTMLElement | null;

        if (popover) {
            popover.hidePopover();
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center px-4 md:px-10 lg:px-16 xl:px-32 mt-44">
            <div className="absolute top-30 -z-10 left-1/4 size-72 bg-primary blur-[300px]"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                {/* Left Side */}
                <div>
                    <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl">
                        <div className="w-full">
                            <TitleOverlay title="Create Your Thumbnail" />
                            <motion.p className="text-sm text-start text-zinc-400 max-w-lg mt-0.5"
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                            >
                                Describe your vision and let AI bring it to life
                            </motion.p>

                            <div className="w-full text-base mt-4">
                                <label className='block mb-2  font-medium'>Title or Topic</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder='e.g., 10x faster learning'
                                    maxLength={100}
                                    className='focus:border-pink-500 outline-none w-full rounded-lg h-12 bg-background/20 border border-white/20 py-2 px-4'
                                />
                                <p className="text-sm text-end text-zinc-400 mt-1">{title.length}/100</p>
                            </div>

                            <div>
                                <TitleOverlay title="Aspect Ratio" className="text-base! font-medium!" />
                                <div className="flex items-center gap-2 mt-2">
                                    {ASPECT_RATIOS.map((ratio) => (
                                        <button key={ratio.ratio} onClick={() => setAspectRatio(ratio.ratio)} className={`flex items-center gap-3 rounded-lg border border-white/20 px-5 py-2 ${aspectRatio === ratio.ratio ? "bg-white/8 text-zinc-200 " : "bg-background/10 text-white/60"} hover:bg-white/12`}>
                                            {ratio.icon} {ratio.ratio}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <TitleOverlay title="Thumbnail Style" className="text-base! font-medium!" />
                                <div className="mt-2 relative w-full">
                                    <button className='popover-thumbnail-style-button flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition gap-1 bg-white/8 border-white/10 text-zinc-200 hover:bg-white/12' popoverTarget="popover-thumbnail-style">
                                        <div className="flex flex-col items-start gap-1">
                                            <div className="flex items-center gap-2">
                                                {thumbnailStyle.icon}
                                                <p className="text-sm font-medium">{thumbnailStyle.style}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-400">{thumbnailStyle.description}</p>
                                            </div>
                                        </div>
                                        <ChevronDown size={20} className="text-zinc-400" />
                                    </button>

                                    <div popover="auto" id="popover-thumbnail-style" className="popover-thumbnail-style rounded-lg border border-white/12 bg-black/20 backdrop-blur-3xl shadow-lg">
                                        {THUMBNAIL_STYLES.map((style) => (
                                            <button key={style.style} onClick={() => handleThumbnailStyle(style)} className='flex text-white w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-black/30'>
                                                <div className="flex flex-col items-start gap-1">
                                                    <div className="flex items-center gap-2">
                                                        {style.icon}
                                                        <p className="text-sm font-medium">{style.style}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-zinc-400">{style.description}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                </div>
                            </div>

                            <div className="mt-4">
                                <TitleOverlay title="Color Scheme" className="text-base! font-medium!" />
                                <div className="mt-2">
                                    <div className="grid grid-cols-6 gap-3 w-full">
                                        {COLOR_SCHEMES.map((scheme) => (
                                            <button key={scheme.scheme} onClick={() => setColorScheme(scheme)} className={`rounded-lg transition-all ${colorScheme.scheme === scheme.scheme ? "ring-2 ring-primary" : ""}`} title={scheme.scheme}>
                                                <div className="flex h-10 rounded-lg overflow-hidden">
                                                    {scheme.schemeColors.map((color) => (
                                                        <div key={color} className="flex-1 " style={{ backgroundColor: color }}></div>
                                                    ))}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-sm text-start mt-2 text-zinc-400">Selected: {colorScheme.scheme}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {/* Right Side */}
                <div>
                    <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl">
                        <TitleOverlay title="Preview" />
                        <div className="mt-4">
                            <div className="relative mx-auto w-full max-w-2xl">
                                <div className={`relative overflow-hidden ${aspectRatio === "16 : 9" ? "aspect-[16/9]" : aspectRatio === "1 : 1" ? "aspect-square" : "aspect-[9/16]"}`}>
                                    <div className="absolute inset-0 m-2 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-white/20 bg-black/25">
                                        <div className="max-sm:hidden flex size-20 items-center justify-center rounded-full bg-white/10">
                                            <Image size={40} className="opacity-50" />
                                        </div>
                                        <div className="px-4 text-center">
                                            <p className="font text-zinc-200">Generate your first thumbnail</p>
                                            <p className="mt-1 text-xs text-zinc-400">Fill out the form and click Generate</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Generate;

const TitleOverlay = ({ title, className }: { title: string, className?: string }) => {
    return (
        <div>
            <motion.h3 className={`text-xl font-semibold text-start ${className}`}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
            >
                {title}
            </motion.h3>
        </div>
    )
}