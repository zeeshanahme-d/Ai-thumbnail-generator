import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import BackButton from "./components/BackButton";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import FieldError from "./components/FieldError";
import { useResetPassword } from "./core/hooks";
import { resetPasswordSchema } from "./core/_schemas";
import { getApiErrorMessage } from "../../lib/axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email] = useState(() => sessionStorage.getItem("tg_reset_email") || "");
  const [otp] = useState(() => sessionStorage.getItem("tg_reset_otp") || "");

  const { mutateAsync: resetPasswordMutate, isPending, error } = useResetPassword();

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
      } catch {
        // Server error is displayed via the Alert component below
      }
    },
  });

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Choose a new password for your account"
      topSlot={<BackButton />}
    >
      {!!error && (
        <Alert variant="error" className="mb-6">
          {getApiErrorMessage(error)}
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
        <form.Field name="newPassword">
          {(field) => (
            <div>
              <Input
                icon={Lock}
                type="password"
                name={field.name}
                placeholder="New password"
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
                placeholder="Confirm password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldError meta={field.state.meta} />
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isPending}
            >
              {isSubmitting || isPending ? "Resetting password..." : "Reset password"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthLayout>
  );
}
