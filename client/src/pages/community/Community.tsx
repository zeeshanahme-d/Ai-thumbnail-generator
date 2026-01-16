import { motion } from "motion/react";
import { ThumbnailData } from "../../data/thumbnail";
import Button from "../../components/Button";
import { useState } from "react";



const Community = () => {
    const [limit, setLimit] = useState(12);
    const handleLoadMore = () => {
        setLimit(prev => prev + 12);
    };
    return (
        <div className="relative flex flex-col items-center px-4 md:px-10 lg:px-16 xl:px-32 mt-44">
            <div className="absolute top-30 -z-10 left-1/4 size-72 bg-primary blur-[300px]"></div>
            <div className="w-full">
                <motion.h1 className="text-2xl md:text-3xl font-medium max-w-3xl text-start"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                >
                    Community
                </motion.h1>
                <motion.p className="text-base text-start text-zinc-400 max-w-lg mt-1"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    Browse AI-generated thumbnails created by the community and share your own
                </motion.p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6 items-start mt-10">
                {ThumbnailData.slice(0, limit)?.map((thumbnail, index) => {
                    return (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                            key={index} className="group relative rounded-2xl bg-white/6 border border-white/10 transition shadow-xl overflow-hidden ">
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
                })}
            </div>
            {limit < ThumbnailData.length &&
                <Button className="w-44! mt-10 " variant="outline" onClick={handleLoadMore}>
                    Load More
                </Button>}
        </div>
    )
}

export default Community