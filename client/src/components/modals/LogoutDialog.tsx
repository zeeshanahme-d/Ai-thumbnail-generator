import ConfirmDialog from "./confirmation-dialog/ConfirmDialog";
import { useLogout } from "../../core/auth/hooks";
import type { LogoutDialogProps } from "../../types";

// Asks before signing out. Used by the navbar menu, the mobile menu and the dashboard sidebar.
// Render it outside any popover: a closed popover hides everything inside it, the dialog too.
export default function LogoutDialog({ open, onClose }: LogoutDialogProps) {
    const { mutate: logout, isPending } = useLogout();

    return (
        <ConfirmDialog
            open={open}
            onClose={onClose}
            onConfirm={() => logout(undefined, { onSettled: onClose })}
            title="Log out?"
            description="You'll need to log in again to make thumbnails."
            confirmLabel="Log out"
            loading={isPending}
        />
    );
}
