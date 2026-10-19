import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Lock, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import FieldError from "../../../auth/components/FieldError";
import ConfirmDialog from "../../../../components/modals/confirmation-dialog/ConfirmDialog";
import SettingsSection from "./SettingsSection";
import { useSession } from "../../../../store/useSessionStore";
import { useDeleteAccount } from "../core/hooks/use-delete-account";
import { getApiErrorMessage } from "../../../../lib/axios";

export default function DangerZoneSection() {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const { deleteAccountMutate, isPending } = useDeleteAccount();
    const clearSession = useSession((state) => state.clearSession);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const closeConfirm = () => {
        setIsConfirmOpen(false);
        setPassword("");
        setPasswordError(null);
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
                setPasswordError(getApiErrorMessage(error, "Failed to delete account."));
                setPassword("");
            },
        });
    };

    const handlePasswordKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") handleDelete();
    };

    return (
        <SettingsSection title="Delete account" danger>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
                    Permanently delete your account with all your thumbnails, credits and profile data. An active
                    subscription is cancelled right away. This can't be undone.
                </p>

                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    rounded="lg"
                    fullWidth={false}
                    onClick={() => setIsConfirmOpen(true)}
                    className="shrink-0 self-start sm:self-auto"
                >
                    <Trash2 size={16} />
                    Delete account
                </Button>
            </div>

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={closeConfirm}
                onConfirm={handleDelete}
                title="Delete your account?"
                description="All your thumbnails, credits and profile settings will be permanently removed. This can't be undone."
                confirmLabel="Delete my account"
                variant="danger"
                loading={isPending}
                confirmDisabled={!password}
            >
                {/* pb-2 keeps room under the error line above the dialog buttons */}
                <div className="pb-2">
                    <Input
                        icon={Lock}
                        id="delete-account-password"
                        label="Enter your password to confirm"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Current password"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                            setPasswordError(null);
                        }}
                        onKeyDown={handlePasswordKeyDown}
                    />
                    <FieldError message={passwordError} />
                </div>
            </ConfirmDialog>
        </SettingsSection>
    );
}
