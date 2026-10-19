//icons
import { User, AtSign, Mail, Globe, Loader2, CheckCircle2, XCircle, Camera } from "lucide-react";
//components
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import FieldError from "../../../auth/components/FieldError";
import SettingsSection from "./SettingsSection";
//hooks & utils
import { useMemo, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useSession } from "../../../../store/useSessionStore";
import { getUserInitial, debounce } from "../../../../lib/herlper-fuctions";
import { useUploadAvatar } from "../core/hooks/use-upload-avatar";
import { useUpdateProfile } from "../core/hooks/use-update-profile";
import { useCheckUsername } from "../../../profile/core/hooks/useCheckUsername";
import { updateProfileSchema } from "../core/_schemas";
import { getApiErrorMessage } from "../../../../lib/axios";
import toast from "react-hot-toast";

export default function EditProfileSection() {
    const { user } = useSession((state) => state);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadAvatarMutate, isPending: isUploading } = useUploadAvatar();
    const { updateProfileMutate, isPending: isUpdating } = useUpdateProfile();

    const [debouncedUsername, setDebouncedUsername] = useState(user?.username ?? "");

    const handleDebouncedUsernameChange = useMemo(
        () => debounce((value: string) => setDebouncedUsername(value), 400),
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

        uploadAvatarMutate(formData, {
            onSuccess: (res) => {
                toast.success(res.message || "Avatar uploaded successfully.");
            },
            onError: (error) => {
                toast.error(getApiErrorMessage(error, "Failed to upload avatar."));
            },
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
        onSubmit: ({ value }) => {
            if (isUsernameTaken || isCheckingUsername) return;
            updateProfileMutate(value, {
                onSuccess: (res) => {
                    toast.success(res.message || "Profile updated successfully.");
                },
                onError: (error) => {
                    toast.error(getApiErrorMessage(error, "Failed to update profile."));
                },
            });
        },
    });


    return (
        <SettingsSection
            title="Profile"
            description="Shown on your public profile and with the thumbnails you publish."
        >
            {/* Avatar */}
            <div className="mb-8 flex items-center gap-4">
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background-surface-2 text-2xl font-medium text-text-primary">
                    {user?.avatar?.url ? (
                        <img src={user.avatar.url} alt="Your profile photo" className="size-full object-cover" />
                    ) : (
                        getUserInitial(user?.fullName)
                    )}
                </span>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    rounded="lg"
                    fullWidth={false}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                    {isUploading ? "Uploading..." : "Change photo"}
                </Button>
            </div>

            <form
                noValidate
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
                className="space-y-6.5"
            >
                <div className="grid grid-cols-1 gap-x-6 gap-y-6.5 md:grid-cols-2">
                    {/* Full Name */}
                    <form.Field name="fullName">
                        {(field) => (
                            <div>
                                <Input
                                    icon={User}
                                    type="text"
                                    id="fullName"
                                    label="Full name"
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
                                <Input
                                    icon={AtSign}
                                    type="text"
                                    id="username"
                                    label="Username"
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
                                <FieldError meta={field.state.meta}>
                                    {!isUsernameUnchanged && debouncedUsername.trim().length >= 3 && (
                                        isCheckingUsername ? (
                                            <span className="flex items-center gap-1 text-xs text-text-muted">
                                                <Loader2 size={12} className="animate-spin" /> Checking availability...
                                            </span>
                                        ) : checkData?.available === true ? (
                                            <span className="flex items-center gap-1 text-xs font-medium text-success">
                                                <CheckCircle2 size={13} /> Username is available
                                            </span>
                                        ) : checkData?.available === false ? (
                                            <span className="flex items-center gap-1 text-xs font-medium text-primary">
                                                <XCircle size={13} /> Username is already taken
                                            </span>
                                        ) : null
                                    )}
                                </FieldError>
                            </div>
                        )}
                    </form.Field>

                    {/* Email Address (read-only) */}
                    <div>
                        <Input
                            icon={Mail}
                            type="email"
                            id="email"
                            label="Email address"
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
                                <Input
                                    icon={Globe}
                                    type="url"
                                    id="website"
                                    label="Website"
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
                            <div className="mb-1.5 flex items-center justify-between">
                                <label htmlFor="bio" className="text-sm font-medium text-text-secondary">Bio</label>
                                <span className="font-mono text-xs tabular-nums text-text-muted">{field.state.value.length}/200</span>
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
                                rounded="lg"
                                fullWidth={false}
                                disabled={isSubmitting || isUpdating || isUsernameTaken || isCheckingUsername}
                            >
                                {isSubmitting || isUpdating ? "Saving..." : "Save profile"}
                            </Button>
                        )}
                    </form.Subscribe>
                </div>
            </form>
        </SettingsSection>
    );
}
