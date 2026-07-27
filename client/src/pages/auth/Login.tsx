//icons
import { Lock, Mail } from "lucide-react";
//componenrs
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import AuthTabs from "./components/AuthTabs";
import SocialAuth from "./components/SocialAuth";
import FieldError from "./components/FieldError";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
//hooks & utils
import { useForm } from "@tanstack/react-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "./core/hooks";
import { loginSchema } from "./core/_schemas";
import { getApiErrorMessage } from "../../lib/axios";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: login, isPending, error } = useLogin();

  const from =
    (location.state as { from?: string } | null)?.from ?? "/dashboard/generate";

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: loginSchema, onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      try {
        await login(value);
        navigate(from, { replace: true });
      } catch {
        // Server error is rendered from the mutation's `error` state below.
      }
    },
  });

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to keep generating high-conversion AI thumbnails."
      topSlot={<AuthTabs />}
    >
      {!!error && (
        <Alert variant="error" className="mb-6">
          {getApiErrorMessage(error)}
        </Alert>
      )}
      <SocialAuth />
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

        <form.Field name="password">
          {(field) => (
            <div>
              <Input
                icon={Lock}
                type="password"
                name={field.name}
                placeholder="Password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldError meta={field.state.meta} />
            </div>
          )}
        </form.Field>

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isPending}
            >
              {isSubmitting || isPending ? "Signing in..." : "Sign in"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AuthLayout>
  );
}
