import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Lock, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import ConfirmDialog from "../../../../components/modals/confirmation-dialog/ConfirmDialog";
import { useSession } from "../../../../store/useSessionStore";
import { useDeleteAccount } from "../core/hooks/use-delete-account";
import { getApiErrorMessage } from "../../../../lib/axios";

export default function DangerZoneSection() {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [password, setPassword] = useState("");
    const { deleteAccountMutate, isPending } = useDeleteAccount();
    const clearSession = useSession((state) => state.clearSession);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const closeConfirm = () => {
        setIsConfirmOpen(false);
        setPassword("");
    };

    const handleDelete = () => {
        if (!password || isPending) return;

        deleteAccountMutate({ password }, {
            onSuccess: (res) => {
                clearSession();
                queryClient.clear();
                toast.success(res.message || "Your account has been deleted successfully.");
                navigate("/login", { replace: true });
            },
            onError: (error) => {
                toast.error(getApiErrorMessage(error, "Failed to delete account."));
                setPassword("");
            },
        });
    };

    const handlePasswordKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") handleDelete();
    };

    return (
        <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-500">
                DANGER ZONE
            </h2>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-xs">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={18} className="text-red-500" />
                            <h3 className="text-base font-semibold text-text-primary">Delete Account</h3>
                        </div>
                        <p className="mt-1 text-sm text-text-secondary">
                            Permanently delete your account and all associated thumbnails, credits, and profile data. This cannot be undone.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        fullWidth={false}
                        onClick={() => setIsConfirmOpen(true)}
                        className="bg-red-600! hover:bg-red-700! text-white! shrink-0 self-start sm:self-auto"
                    >
                        <Trash2 size={16} className="mr-1.5 inline-block" />
                        Delete Account
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={closeConfirm}
                onConfirm={handleDelete}
                title="Delete Account"
                description="Are you absolutely sure you want to delete your account? All your generated thumbnails, credits, and profile settings will be permanently removed. This action cannot be reversed."
                confirmLabel="Delete My Account"
                variant="danger"
                loading={isPending}
                confirmDisabled={!password}
            >
                <label htmlFor="delete-account-password" className="mb-1.5 block pl-1 text-left text-xs font-medium text-text-secondary">
                    Enter your password to confirm
                </label>
                <Input
                    icon={Lock}
                    id="delete-account-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Current password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyDown={handlePasswordKeyDown}
                />
            </ConfirmDialog>
        </section>
    );
}
