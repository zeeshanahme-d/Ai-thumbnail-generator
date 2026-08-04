import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import BackButton from "./components/BackButton";
import Alert from "../../components/Alert";
import { useForgotPassword, useVerifyOtp } from "./core/hooks";
import { getApiErrorMessage } from "../../lib/axios";

const LENGTH = 6;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [email] = useState(() => sessionStorage.getItem("tg_reset_email") || "");
  const [otp, setOtp] = useState<string[]>(new Array(LENGTH).fill(""));
  const [timer, setTimer] = useState(60);
  const [validationError, setValidationError] = useState<string | null>(null);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { mutateAsync: forgotPasswordMutate, isPending: isResending } = useForgotPassword();
  const { mutateAsync: verifyOtpMutate, isPending: isVerifying, error: verifyApiError } = useVerifyOtp();

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value && Number.isNaN(Number(value))) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setValidationError(null);
    if (value && index < LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const chars = e.clipboardData.getData("text").trim().slice(0, LENGTH).split("");
    if (!chars.every((char) => !Number.isNaN(Number(char)))) return;
    const next = [...otp];
    chars.forEach((char, i) => (next[i] = char));
    setOtp(next);
    setValidationError(null);
    inputRefs.current[Math.min(chars.length - 1, LENGTH - 1)]?.focus();
  };

  const handleResendOtp = async () => {
    if (!email || timer > 0 || isResending) return;
    try {
      await forgotPasswordMutate({ email });
      toast.success("A new 6-digit code has been sent to your email.");
      setTimer(60);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to resend code."));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < LENGTH || !/^\d{6}$/.test(otpCode)) {
      setValidationError("Please enter a valid 6-digit verification code.");
      return;
    }

    try {
      await verifyOtpMutate({ email, otp: otpCode });
      sessionStorage.setItem("tg_reset_otp", otpCode);
      toast.success("OTP verified successfully.");
      navigate("/reset-password");
    } catch {
      // Error rendered below via Alert
    }
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle={email ? `Enter the 6-digit code sent to ${email}` : "Enter the 6-digit code we sent to your email"}
      topSlot={<BackButton />}
    >
      {(validationError || !!verifyApiError) && (
        <Alert variant="error" className="mb-6">
          {validationError || getApiErrorMessage(verifyApiError)}
        </Alert>
      )}

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

        <Button type="submit" variant="primary" disabled={isVerifying}>
          {isVerifying ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center pt-2">
          <p className="text-sm text-text-secondary">
            Didn't receive the code?{" "}
            {timer > 0 ? (
              <span className="font-medium text-text-muted">
                Resend in <span className="text-primary font-semibold">{timer}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="font-medium text-primary hover:underline disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            )}
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
