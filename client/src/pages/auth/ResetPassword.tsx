import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import BackButton from "./components/BackButton";
import Input from "../../components/Input";
import Alert from "../../components/Alert";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    navigate("/login");
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Choose a new password for your account"
      topSlot={<BackButton />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          icon={Lock}
          type="password"
          name="newPassword"
          placeholder="New password"
          required
          value={form.newPassword}
          onChange={handleChange}
        />
        <Input
          icon={Lock}
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          required
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {error && <Alert variant="error">{error}</Alert>}
        <Button type="submit" variant="primary">Reset password</Button>
      </form>
    </AuthLayout>
  );
}
