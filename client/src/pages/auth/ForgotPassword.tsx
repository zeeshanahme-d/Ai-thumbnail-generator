import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import BackButton from "./components/BackButton";
import Input from "../../components/Input";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/verify-otp");
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we'll send you a reset code"
      topSlot={<BackButton />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          icon={Mail}
          type="email"
          name="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" variant="primary">Send code</Button>
      </form>
    </AuthLayout>
  );
}
