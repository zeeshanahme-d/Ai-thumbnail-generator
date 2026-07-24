import { useRef, useState, type ToggleEvent } from "react";
import { ArrowRight, LogIn, LogOut, MenuIcon, User, XIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../store/useSessionStore";
import { useLogout } from "../pages/auth/core/hooks";
import { navlinks } from "../data/navlinks";

const MENU_ID = "mobile-nav-menu";

const ITEM_CLASSES =
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition hover:bg-background-surface-2 hover:text-text-primary";

export default function MobileNav() {
    const isAuthenticated = useSession((state) => state.isAuthenticated);
    const { mutate: logout } = useLogout();
    const { pathname } = useLocation();
    const menuRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => menuRef.current?.hidePopover();

    const handleLogout = () => {
        closeMenu();
        logout();
    };

    return (
        <>
            <button
                popoverTarget={MENU_ID}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                className="flex size-9 items-center justify-center rounded-full border border-border text-text-secondary transition hover:bg-background-surface-2 active:scale-90 md:hidden"
            >
                {isOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
            </button>

            {/* Native Popover API — light-dismiss and Esc come for free */}
            <div
                ref={menuRef}
                id={MENU_ID}
                popover="auto"
                onToggle={(event: ToggleEvent<HTMLDivElement>) =>
                    setIsOpen(event.newState === "open")
                }
                className="mobile-menu-popover md:hidden"
            >
                <div className="rounded-2xl border border-border bg-background-card p-4 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)]">
                    <div className="flex flex-col gap-1">
                        {navlinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={closeMenu}
                                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${pathname === link.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-text-secondary hover:bg-background-surface-2 hover:text-text-primary"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <hr className="my-3 border-border" />

                    <Link to="/dashboard/profile" onClick={closeMenu} className={ITEM_CLASSES}>
                        <User size={16} />
                        Profile
                    </Link>

                    {isAuthenticated ? (
                        <button onClick={handleLogout} className={`w-full ${ITEM_CLASSES}`}>
                            <LogOut size={16} />
                            Log out
                        </button>
                    ) : (
                        <Link to="/login" onClick={closeMenu} className={ITEM_CLASSES}>
                            <LogIn size={16} />
                            Sign In
                        </Link>
                    )}

                    <Link
                        to="/dashboard/generate"
                        onClick={closeMenu}
                        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-text-on-primary transition-all hover:bg-primary-hover active:scale-95"
                    >
                        Generate
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </>
    );
}
