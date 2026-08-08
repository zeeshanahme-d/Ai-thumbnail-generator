//icons
import { User, AtSign, Mail, Globe, Loader2, CheckCircle2, XCircle } from "lucide-react";
//components
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import Alert from "../../../../components/Alert";
import FieldError from "../../../auth/components/FieldError";
//hooks & utils
import { useRef, useState, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { useSession } from "../../../../store/useSessionStore";
import { getUserInitial, debounce } from "../../../../lib/herlper-fuctions";
import { useUploadAvatar } from "../core/hooks/use-upload-avatar";
import { useUpdateProfile } from "../core/hooks/use-update-profile";
import { useCheckUsername } from "../../../profile/core/hooks/useCheckUsername";
import { updateProfileSchema } from "../core/_schemas";
import { getApiErrorMessage } from "../../../../lib/axios";

export default function EditProfileSection() {
    const { user } = useSession((state) => state);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
    const { mutateAsync: updateProfile, isPending: isUpdating, error, isSuccess } = useUpdateProfile();

    const [debouncedUsername, setDebouncedUsername] = useState(user?.username ?? "");

    const handleDebouncedUsernameChange = useCallback(
        debounce((value: string) => {
            setDebouncedUsername(value);
        }, 400),
        [],
    );

    const isUsernameUnchanged = debouncedUsername.trim().toLowerCase() === (user?.username ?? "").toLowerCase();

    const { data: checkData, isFetching: isCheckingUsername } = useCheckUsername(
        !isUsernameUnchanged ? debouncedUsername : undefined,
        user?._id,
    );

    const isUsernameTaken = !isUsernameUnchanged && checkData?.available === false;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        uploadAvatar(formData, {
            onSettled: () => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            },
        });
    };

    const form = useForm({
        defaultValues: {
            fullName: user?.fullName ?? "",
            username: user?.username ?? "",
            bio: user?.bio ?? "",
            website: user?.website ?? "",
        },
        validators: { onChange: updateProfileSchema, onSubmit: updateProfileSchema },
        onSubmit: async ({ value }) => {
            if (isUsernameTaken || isCheckingUsername) return;
            try {
                await updateProfile(value);
            } catch {
                // Server error is rendered from the mutation's `error` state below.
            }
        },
    });

    return (
        <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                EDIT PROFILE
            </h2>
            <div className="rounded-2xl border border-border bg-background-card p-6">

                {/* Avatar */}
                <div className="mb-8 flex flex-col items-center justify-center">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <div className="flex size-20 overflow-hidden items-center justify-center rounded-full bg-teal-600 text-3xl font-medium text-white">
                        {user?.avatar?.url ? (
                            <img src={user.avatar.url} alt="Avatar" className="size-full object-cover" />
                        ) : (
                            getUserInitial(user?.fullName)
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-50 disabled:hover:no-underline"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={12} className="animate-spin" /> Uploading...
                            </>
                        ) : (
                            "Change Photo"
                        )}
                    </button>
                </div>

                {/* Alerts */}
                {!!error && (
                    <Alert variant="error" className="mb-6">
                        {getApiErrorMessage(error)}
                    </Alert>
                )}
                {isSuccess && (
                    <Alert variant="success" className="mb-6">
                        Profile updated successfully!
                    </Alert>
                )}

                <form
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void form.handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Full Name */}
                        <form.Field name="fullName">
                            {(field) => (
                                <div className="space-y-1.5">
                                    <label htmlFor="fullName" className="pl-1 text-xs text-text-secondary">Full Name</label>
                                    <Input
                                        icon={User}
                                        type="text"
                                        id="fullName"
                                        name={field.name}
                                        placeholder="John Doe"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError meta={field.state.meta} />
                                </div>
                            )}
                        </form.Field>

                        {/* Username */}
                        <form.Field name="username">
                            {(field) => (
                                <div>
                                    <label htmlFor="username" className="pl-1 text-xs text-text-secondary">Username</label>
                                    <Input
                                        icon={AtSign}
                                        type="text"
                                        id="username"
                                        name={field.name}
                                        placeholder="username"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            field.handleChange(val);
                                            handleDebouncedUsernameChange(val);
                                        }}
                                    />
                                    {!isUsernameUnchanged && debouncedUsername.trim().length >= 3 && (
                                        <div className="mt-1">
                                            {isCheckingUsername ? (
                                                <span className="flex items-center gap-1 text-xs text-text-muted">
                                                    <Loader2 size={12} className="animate-spin" /> Checking availability...
                                                </span>
                                            ) : checkData?.available === true ? (
                                                <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                                                    <CheckCircle2 size={13} /> Username is available
                                                </span>
                                            ) : checkData?.available === false ? (
                                                <span className="flex items-center gap-1 text-xs font-medium text-primary">
                                                    <XCircle size={13} /> Username is already taken
                                                </span>
                                            ) : null}
                                        </div>
                                    )}
                                    <FieldError meta={field.state.meta} />
                                </div>
                            )}
                        </form.Field>

                        {/* Email Address (read-only) */}
                        <div>
                            <label htmlFor="email" className="pl-1 text-xs text-text-secondary">Email Address</label>
                            <Input
                                icon={Mail}
                                type="email"
                                id="email"
                                value={user?.email ?? ""}
                                readOnly
                                disabled
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Website */}
                        <form.Field name="website">
                            {(field) => (
                                <div>
                                    <label htmlFor="website" className="pl-1 text-xs text-text-secondary">Website</label>
                                    <Input
                                        icon={Globe}
                                        type="url"
                                        id="website"
                                        name={field.name}
                                        placeholder="https://yoursite.com"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldError meta={field.state.meta} />
                                </div>
                            )}
                        </form.Field>
                    </div>

                    {/* Bio */}
                    <form.Field name="bio">
                        {(field) => (
                            <div>
                                <div className="flex items-center justify-between px-1">
                                    <label htmlFor="bio" className="text-xs text-text-secondary">Bio</label>
                                    <span className="text-xs text-text-muted">{field.state.value.length}/200</span>
                                </div>
                                <div className="rounded-lg border border-border bg-background-surface transition-colors focus-within:border-primary">
                                    <textarea
                                        className="w-full resize-none border-none bg-transparent px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted"
                                        rows={3}
                                        id="bio"
                                        name={field.name}
                                        placeholder="Tell the community a bit about yourself..."
                                        maxLength={200}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </div>
                                <FieldError meta={field.state.meta} />
                            </div>
                        )}
                    </form.Field>

                    <div className="flex justify-end pt-2">
                        <form.Subscribe selector={(state) => state.isSubmitting}>
                            {(isSubmitting) => (
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    fullWidth={false}
                                    disabled={isSubmitting || isUpdating || isUsernameTaken || isCheckingUsername}
                                >
                                    {isSubmitting || isUpdating ? "Saving..." : "Save Profile"}
                                </Button>
                            )}
                        </form.Subscribe>
                    </div>
                </form>

            </div>
        </section>
    );
}
