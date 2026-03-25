import { motion } from "motion/react";
import type { Thumbnail } from "../types";

interface ThumbnailCardProps {
    thumbnail: Thumbnail;
}

const ThumbnailCard = ({ thumbnail }: ThumbnailCardProps) => {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            key={thumbnail?._id} className="group relative rounded-2xl bg-white/6 border border-white/10 transition shadow-xl overflow-hidden ">
            <div className="relative overflow-hidden rounded-t-2xl bg-black">
                <img alt="Best way to learn Digital Marketing in 2826" loading="lazy" width="1280" height="720" decoding="async" className="aspect-video object-cover object-top group-hover:scale-[1.05] transition-transform duration-500" src={thumbnail.image_url} />
                {thumbnail?.userId?.name && <div className="group-hover:opacity-100 transition-all opacity-0 absolute bottom-2 right-2 bg-pink-950/50 backdrop-blur px-6 py-1.5 text-xs rounded-full">{thumbnail?.userId?.name}</div>}
            </div>
            <div className="p-4 space-y-2">
                <h3 className="text-sm font-semibold text-zinc-100 truncate">{thumbnail?.title}</h3>
                <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-white/8">{thumbnail?.style}</span>
                    <span className="px-2 py-0.5 rounded bg-white/8">{thumbnail?.color_scheme}</span>
                    <span className="px-2 py-0.5 rounded bg-white/8">{thumbnail?.aspect_ratio}</span>
                </div>
                <p className="text-xs text-zinc-500">
                    {thumbnail.createdAt ? new Date(thumbnail.createdAt).toDateString() : ""}
                </p>
            </div>
        </motion.div>
    )
}

export default ThumbnailCard