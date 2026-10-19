import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import BackButton from "../../components/BackButton";
import Input from "../../components/Input";
import FieldError from "./components/FieldError";
import { useResetPassword } from "../../core/auth/hooks";
import { resetPasswordSchema } from "./core/_schemas";
import { getApiErrorMessage } from "../../lib/axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email] = useState(() => sessionStorage.getItem("tg_reset_email") || "");
  const [otp] = useState(() => sessionStorage.getItem("tg_reset_otp") || "");

  const { mutateAsync: resetPasswordMutate, isPending } = useResetPassword();

  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, otp, navigate]);

  const form = useForm({
    defaultValues: { newPassword: "", confirmPassword: "" },
    validators: { onChange: resetPasswordSchema, onSubmit: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        const response = await resetPasswordMutate({
          email,
          otp,
          newPassword: value.newPassword,
        });
        sessionStorage.removeItem("tg_reset_email");
        sessionStorage.removeItem("tg_reset_otp");
        toast.success(response.message || "Password reset successful! Please log in.");
        navigate("/login", { replace: true });
      } catch (err) {
        toast.error(getApiErrorMessage(err));
      }
    },
  });

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Choose a new password for your account."
      topSlot={<BackButton />}
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
        <form.Field name="newPassword">
          {(field) => (
            <div>
              <Input
                icon={Lock}
                type="password"
                name={field.name}
                label="New password"
                autoComplete="new-password"
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
                name={field.name}
                label="Confirm password"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldError meta={field.state.meta} />
            </div>
          )}
        </form.Field>

        <div className="pt-2">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                rounded="lg"
                disabled={isSubmitting || isPending}
              >
                {isSubmitting || isPending ? "Resetting password..." : "Reset password"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </AuthLayout>
  );
}
