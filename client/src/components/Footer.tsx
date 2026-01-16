import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="flex bg-white/6 border-t border-white/10 flex-wrap justify-center md:justify-between overflow-hidden gap-10 md:gap-20 mt-20 py-20 px-6 md:px-10 lg:px-16 xl:px-32 text-[13px] text-gray-500">
            <motion.div className="flex flex-wrap items-start gap-10 md:gap-35"
                initial={{ x: -150, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
            >
                <Link to="/">
                    <img className="h-8.5 w-auto" src="/logo.svg" alt="logo" width={130} height={34} />
                </Link>
            </motion.div>
            <motion.div className="flex flex-col max-md:items-center max-md:text-center gap-2 items-end"
                initial={{ x: 150, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
            >
                <p className="mt-3 text-center">&copy; {new Date().getFullYear()} <a href="https://prebuiltui.com?utm_source=pixels">PrebuiltUI</a></p>
            </motion.div>
        </footer>
    );
}