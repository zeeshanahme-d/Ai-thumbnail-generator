import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import ConfirmDialog from "../../../../components/modals/confirmation-dialog/ConfirmDialog";
import FieldError from "../../../auth/components/FieldError";
import { useSession } from "../../../../store/useSessionStore";
import { useChangePassword } from "../core/hooks/use-change-password";
import { changePasswordSchema } from "../core/_schemas";
import type { ChangePasswordPayload } from "../core/_models";

export default function ChangePasswordSection() {
    const { changePasswordMutate, isPending } = useChangePassword();
    const clearSession = useSession((state) => state.clearSession);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    // Validated form values, held while the sign-out warning is open.
    const [pendingValues, setPendingValues] = useState<ChangePasswordPayload | null>(null);

    const form = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validators: {
            onChange: changePasswordSchema,
            onSubmit: changePasswordSchema,
        },
        // Nothing is sent yet: the user first confirms they will be signed out everywhere.
        onSubmit: ({ value }) => {
            setPendingValues(value);
        },
    });

    const handleConfirmChange = () => {
        if (!pendingValues) return;

        changePasswordMutate(pendingValues, {
            onSuccess: (res: any) => {
                // The server ended every session, this one included.
                clearSession();
                queryClient.clear();
                toast.success(res?.message || "Password changed. Log in with your new password.");
                navigate("/login", { replace: true });
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || error?.response?.data?.error?.message || "Failed to update password.";
                toast.error(message);
                setPendingValues(null);
            },
        });
    };

    return (
        <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                SECURITY & PASSWORD
            </h2>
            <div className="rounded-2xl border border-border bg-background-card p-6">
                <div className="mb-6">
                    <h3 className="text-base font-semibold text-text-primary">Change Password</h3>
                    <p className="mt-1 text-sm text-text-secondary">
                        Ensure your account uses a strong password with letters, numbers, and special characters.
                    </p>
                </div>


                <form
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field name="currentPassword">
                        {(field) => (
                            <div>
                                <label htmlFor="currentPassword" className="mb-1.5 block pl-1 text-xs font-medium text-text-secondary">
                                    Current Password
                                </label>
                                <Input
                                    icon={Lock}
                                    type="password"
                                    id="currentPassword"
                                    name={field.name}
                                    placeholder="Enter current password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                <FieldError meta={field.state.meta} />
                            </div>
                        )}
                    </form.Field>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <form.Field name="newPassword">
                            {(field) => (
                                <div>
                                    <label htmlFor="newPassword" className="mb-1.5 block pl-1 text-xs font-medium text-text-secondary">
                                        New Password
                                    </label>
                                    <Input
                                        icon={Lock}
                                        type="password"
                                        id="newPassword"
                                        name={field.name}
                                        placeholder="Enter new password"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError meta={field.state.meta} />
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="confirmPassword">
                            {(field) => (
                                <div>
                                    <label htmlFor="confirmPassword" className="mb-1.5 block pl-1 text-xs font-medium text-text-secondary">
                                        Confirm New Password
                                    </label>
                                    <Input
                                        icon={Lock}
                                        type="password"
                                        id="confirmPassword"
                                        name={field.name}
                                        placeholder="Confirm new password"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError meta={field.state.meta} />
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div className="flex justify-end pt-2">
                        <form.Subscribe selector={(state) => state.isSubmitting}>
                            {(isSubmitting) => (
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    fullWidth={false}
                                    disabled={isSubmitting || isPending}
                                >
                                    {isSubmitting || isPending ? "Updating..." : "Update Password"}
                                </Button>
                            )}
                        </form.Subscribe>
                    </div>
                </form>
            </div>

            <ConfirmDialog
                open={pendingValues !== null}
                onClose={() => setPendingValues(null)}
                onConfirm={handleConfirmChange}
                title="Sign out of all sessions?"
                description="Changing your password signs you out everywhere, including this browser and any other device. You'll need to log in again with your new password."
                confirmLabel="Change password"
                variant="danger"
                loading={isPending}
            />
        </section>
    );
}
