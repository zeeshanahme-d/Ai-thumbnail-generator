import { useRef } from "react";
import { Link } from "react-router-dom";
import { Settings, User } from "lucide-react";
import Button from "./Button";
import { useSession } from "../store/useSessionStore";
import { getUserInitial } from "../lib/herlper-fuctions";

const MENU_ID = "profile-menu";

const ITEM_CLASSES =
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-background-surface-2 hover:text-text-primary";

// The navbar avatar, opening a Profile / Settings menu. Desktop only; MobileNav covers small screens.
export default function ProfileMenu() {
    const user = useSession((state) => state.user);
    const menuRef = useRef<HTMLDivElement>(null);

    // The navbar stays mounted across routes, so the menu is closed by hand when a link is followed.
    const closeMenu = () => menuRef.current?.hidePopover();

    return (
        <>
            <Button
                type="button"
                variant="secondary"
                size="icon"
                popoverTarget={MENU_ID}
                aria-label="Open account menu"
                className="profile-menu-anchor hidden md:flex items-center overflow-hidden p-0"
            >
                {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                    <span className="text-sm font-semibold text-text-primary">{getUserInitial(user?.fullName)}</span>
                )}
            </Button>

            {/* Native Popover API — light-dismiss and Esc come for free */}
            <div ref={menuRef} id={MENU_ID} popover="auto" className="profile-menu-popover">
                <nav
                    aria-label="Account"
                    className="w-48 rounded-2xl border border-border bg-background-card p-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)]"
                >
                    <Link to={user?.username ? `/profile/${user.username}` : "/profile"} onClick={closeMenu} className={ITEM_CLASSES}>
                        <User size={16} />
                        Profile
                    </Link>
                    <Link to="/dashboard/settings" onClick={closeMenu} className={ITEM_CLASSES}>
                        <Settings size={16} />
                        Settings
                    </Link>
                </nav>
            </div>
        </>
    );
}
