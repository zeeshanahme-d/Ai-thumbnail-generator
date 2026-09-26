import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import AuthTabs from "./components/AuthTabs";
import FieldError from "./components/FieldError";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import { useSignup } from "../../core/auth/hooks";
import { signupSchema } from "./core/_schemas";
import { getApiErrorMessage } from "../../lib/axios";

export default function Signup() {
  const navigate = useNavigate();
  const { mutateAsync: signup, isPending, error } = useSignup();

  const form = useForm({
    defaultValues: { fullName: "", email: "", password: "" },
    validators: { onChange: signupSchema, onSubmit: signupSchema },
    onSubmit: async ({ value }) => {
      try {
        const response = await signup(value);
        // Free credits unlock once the emailed code is entered.
        sessionStorage.setItem("tg_verify_email", value.email.trim().toLowerCase());
        toast.success(response.message || "Account created. Check your email for a 6-digit code.");
        navigate("/verify-email", { replace: true });
      } catch {
        // Server error is rendered from the mutation's `error` state below.
      }
    },
  });

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start creating visually stunning, premium thumbnails for free."
      topSlot={<AuthTabs />}
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
        <form.Field name="fullName">
          {(field) => (
            <div>
              <Input
                icon={User}
                type="text"
                name={field.name}
                label="Full name"
                autoComplete="name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldError meta={field.state.meta} />
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div>
              <Input
                icon={Mail}
                type="email"
                name={field.name}
                label="Email address"
                autoComplete="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldError meta={field.state.meta} />
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div>
              <Input
                icon={Lock}
                type="password"
                name={field.name}
                label="Password"
                autoComplete="new-password"
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
              // className="cursor-not-allowed"
              disabled={isSubmitting || isPending}
            >
              {isSubmitting || isPending
                ? "Creating account..."
                : "Create Account"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthLayout>
  );
}
