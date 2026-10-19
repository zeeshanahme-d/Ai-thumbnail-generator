//icons
import { Lock, Mail } from "lucide-react";
//componenrs
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import AuthTabs from "./components/AuthTabs";
import FieldError from "./components/FieldError";
import Input from "../../components/Input";
//hooks & utils
import toast from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../../core/auth/hooks";
import { loginSchema } from "./core/_schemas";
import { getApiErrorMessage } from "../../lib/axios";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: login, isPending } = useLogin();

  const from =
    (location.state as { from?: string } | null)?.from ?? "/dashboard/generate";

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: loginSchema, onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      try {
        await login(value);
        navigate(from, { replace: true });
      } catch (err) {
        toast.error(getApiErrorMessage(err));
      }
    },
  });

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
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
                autoComplete="current-password"
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
            className="text-sm font-medium text-text-secondary underline-offset-4 transition-colors hover:text-text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

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
                {isSubmitting || isPending ? "Signing in..." : "Sign in"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </AuthLayout>
  );
}
