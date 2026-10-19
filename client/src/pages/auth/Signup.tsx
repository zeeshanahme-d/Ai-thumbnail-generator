import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import AuthTabs from "./components/AuthTabs";
import FieldError from "./components/FieldError";
import Input from "../../components/Input";
import { useSignup } from "../../core/auth/hooks";
import { signupSchema } from "./core/_schemas";
import { getApiErrorMessage } from "../../lib/axios";
import { FREE_MONTHLY_CREDITS } from "../../lib/credits";
import { PASSWORD_MIN_LENGTH } from "../../lib/passwordValidation";

export default function Signup() {
  const navigate = useNavigate();
  const { mutateAsync: signup, isPending } = useSignup();

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
      } catch (err) {
        toast.error(getApiErrorMessage(err));
      }
    },
  });

  return (
    <AuthLayout
      title="Create your account"
      subtitle={`Get ${FREE_MONTHLY_CREDITS} free credits a month once you verify your email.`}
      topSlot={<AuthTabs />}
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
        <form.Field name="fullName">
          {(field) => (
            <div>
              <Input
                icon={User}
                type="text"
                name={field.name}
                label="Full name"
                placeholder="Your name"
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
                placeholder="you@example.com"
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
                placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
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
                {isSubmitting || isPending
                  ? "Creating account..."
                  : "Create account"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </AuthLayout>
  );
}
