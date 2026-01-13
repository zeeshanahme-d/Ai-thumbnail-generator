import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import AuthModal from "../auth/AuthModal";
import { useAuthStore } from "../store/useAuthModalStore";

export default function Navbar() {
    const { showAuthModal, isModalOpen } = useAuthStore((state) => state);
    const [isOpen, setIsOpen] = useState(false);
    const handleCloseMenu = () => {
        setIsOpen(false)
    };
    const handleOpenAuthModal = () => {
        showAuthModal("login");
    };

    return (
        <>
            <motion.nav className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-10 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link to="/">
                    <img className="h-8.5 w-auto" src="/logo.svg" alt="logo" width={130} height={34} />
                </Link>

                <div className="hidden md:flex items-center gap-8 transition duration-500">
                    <Link to="/" className="hover:text-pink-300 transition">Home</Link>
                    <Link to="/generate" className="hover:text-pink-300 transition">Generate</Link>
                    <Link to="/community" className="hover:text-pink-300 transition">Community</Link>
                    <Link to="/my-generation" className="hover:text-pink-300 transition">My Generations</Link>
                </div>

                <button onClick={handleOpenAuthModal} className="hidden md:block px-6 py-2.5 bg-primary hover:bg-primary-hover active:scale-95 transition-all rounded-full">
                    Get Started
                </button>
                <button onClick={() => setIsOpen(true)} className="md:hidden">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </motion.nav>

            <div className={`fixed inset-0 z-100 bg-black/40 backdrop-blur-3xl flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Link onClick={handleCloseMenu} to="/">Home</Link>
                <Link onClick={handleCloseMenu} to="/generate">Generate</Link>
                <Link onClick={handleCloseMenu} to="/community">Community</Link>
                <Link onClick={handleCloseMenu} to="/my-generation">My Generations</Link>
                <button onClick={handleCloseMenu} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-primary hover:bg-primary-hover transition text-white rounded-md flex">
                    <XIcon />
                </button>
            </div>
            {isModalOpen && <AuthModal />}
        </>
    );
}