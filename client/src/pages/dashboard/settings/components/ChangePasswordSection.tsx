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
import SettingsSection from "./SettingsSection";
import { PASSWORD_MIN_LENGTH } from "../../../../lib/passwordValidation";
import { useSession } from "../../../../store/useSessionStore";
import { useChangePassword } from "../core/hooks/use-change-password";
import { changePasswordSchema } from "../core/_schemas";
import type { ChangePasswordPayload } from "../core/_models";
import { getApiErrorMessage } from "../../../../lib/axios";

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
            onSuccess: (res) => {
                // The server ended every session, this one included.
                clearSession();
                queryClient.clear();
                toast.success(res.message || "Password changed. Log in with your new password.");
                navigate("/login", { replace: true });
            },
            onError: (error) => {
                toast.error(getApiErrorMessage(error, "Failed to update password."));
                setPendingValues(null);
            },
        });
    };

    return (
        <SettingsSection
            title="Password"
            description={`At least ${PASSWORD_MIN_LENGTH} characters with an uppercase and a lowercase letter, a number and a symbol. Changing it signs you out on every device.`}
        >
            <form
                noValidate
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
                className="space-y-6.5"
            >
                <form.Field name="currentPassword">
                    {(field) => (
                        <div>
                            <Input
                                icon={Lock}
                                type="password"
                                id="currentPassword"
                                label="Current password"
                                autoComplete="current-password"
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

                <div className="grid grid-cols-1 gap-x-6 gap-y-6.5 md:grid-cols-2">
                    <form.Field name="newPassword">
                        {(field) => (
                            <div>
                                <Input
                                    icon={Lock}
                                    type="password"
                                    id="newPassword"
                                    label="New password"
                                    autoComplete="new-password"
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
                                <Input
                                    icon={Lock}
                                    type="password"
                                    id="confirmPassword"
                                    label="Confirm new password"
                                    autoComplete="new-password"
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
                                rounded="lg"
                                fullWidth={false}
                                disabled={isSubmitting || isPending}
                            >
                                {isSubmitting || isPending ? "Updating..." : "Update password"}
                            </Button>
                        )}
                    </form.Subscribe>
                </div>
            </form>

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
        </SettingsSection>
    );
}
