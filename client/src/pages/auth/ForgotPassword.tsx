import { Mail } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import BackButton from "./components/BackButton";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import FieldError from "./components/FieldError";
import { useForgotPassword } from "./core/hooks";
import { forgotPasswordSchema } from "./core/_schemas";
import { getApiErrorMessage } from "../../lib/axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { mutateAsync: forgotPasswordMutate, isPending, error } = useForgotPassword();

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onChange: forgotPasswordSchema, onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        const response = await forgotPasswordMutate(value);
        sessionStorage.setItem("tg_reset_email", value.email);
        toast.success(response.message || "Reset code sent to your email!");
        navigate("/verify-otp");
      } catch {
        // Server error is displayed via the error alert below
      }
    },
  });

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we'll send you a reset code"
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
        <form.Field name="email">
          {(field) => (
            <div>
              <Input
                icon={Mail}
                type="email"
                name={field.name}
                placeholder="Email address"
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
              {isSubmitting || isPending ? "Sending code..." : "Send code"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthLayout>
  );
}
