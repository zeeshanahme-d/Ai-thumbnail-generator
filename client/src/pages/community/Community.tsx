import { useState } from "react";
import { motion } from "motion/react";
import { ThumbnailData } from "../../data/thumbnail";
import Button from "../../components/Button";
import ThumbnailCard from "../../components/ThumbnailCard";



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
                {ThumbnailData.slice(0, limit)?.map((thumbnail) => {
                    return (
                        <ThumbnailCard thumbnail={thumbnail} key={thumbnail._id} />
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