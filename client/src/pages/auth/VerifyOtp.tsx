import {
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import BackButton from "./components/BackButton";

const LENGTH = 6;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(new Array(LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (Number.isNaN(Number(value))) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const chars = e.clipboardData.getData("text").slice(0, LENGTH).split("");
    if (!chars.every((char) => !Number.isNaN(Number(char)))) return;
    const next = [...otp];
    chars.forEach((char, i) => (next[i] = char));
    setOtp(next);
    inputRefs.current[Math.min(chars.length - 1, LENGTH - 1)]?.focus();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/reset-password");
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the 6-digit code we sent to your email"
      topSlot={<BackButton />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              required
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-14 w-11 rounded-lg border border-border bg-background-surface text-center text-lg text-text-primary outline-none transition-colors focus:border-primary sm:w-14"
            />
          ))}
        </div>
        <Button type="submit" variant="primary">Verify</Button>
      </form>
    </AuthLayout>
  );
}
