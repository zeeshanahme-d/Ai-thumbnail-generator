import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import AuthTabs from "./components/AuthTabs";
import SocialAuth from "./components/SocialAuth";
import FieldError from "./components/FieldError";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import { useSignup } from "./core/hooks";
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
        await signup(value);
        // The API only creates the account, so send them to sign in.
        navigate("/login", { replace: true });
      } catch {
        // Server error is rendered from the mutation's `error` state below.
      }
    },
  });
  console.log(error);

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
        <form.Field name="fullName">
          {(field) => (
            <div>
              <Input
                icon={User}
                type="text"
                name={field.name}
                placeholder="Full name"
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
