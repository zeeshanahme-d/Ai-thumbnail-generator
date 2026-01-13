import { useRef, useState } from "react"
import { useAuthStore } from "../../store/useAuthModalStore";
import { X } from "lucide-react";

const length = 6;

const VerifyOTP = () => {
    const { showAuthModal, closeModal } = useAuthStore((state) => state);
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));

    const inputRefs = useRef<HTMLInputElement[] | undefined>([]);


    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // // Move to next input if value entered
        if (value && index < length - 1 && inputRefs?.current?.[index + 1]) {
            inputRefs?.current?.[index + 1].focus();
        }

        // // Check if OTP is complete
        const otpValue = newOtp.join('');
        if (otpValue.length === length) {
            inputRefs?.current?.[length - 1]?.blur();
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Since the OTP is managed by React state, use the otp array directly
        const otpValue = otp.join('');
        console.log("OTP entered:", otpValue);
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs?.current?.[index - 1].focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.slice(0, length).split('');

        if (pasteArray.every(char => !isNaN(Number(char)))) {
            const newOtp = [...otp];
            pasteArray.forEach((char, index) => {
                if (index < length) {
                    newOtp[index] = char;
                }
            });
            setOtp(newOtp);

            const lastIndex = Math.min(pasteArray.length - 1, length - 1);
            if (inputRefs?.current?.[lastIndex]) {
                inputRefs.current[lastIndex].focus();
            }
        }
    };

    return (
        <div className="w-full sm:w-87.5 md:w-md p-10 relative text-center bg-white/6 border border-white/10 rounded-2xl px-8">
            <button onClick={closeModal} title="Close Modal" className="hover:text-[#bdbdbd] absolute right-4 top-4 transition-all duration-300">
                <X />
            </button>
            <form
                onSubmit={handleSubmit}>
                <h1 className="text-white text-3xl font-medium">
                    Verify OTP
                </h1>

                <p className="text-gray-400 text-sm mt-2">Enter the OTP we sent to your email.</p>

                <div className="flex justify-center gap-2 my-6 ">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el: HTMLInputElement | null) => { if (inputRefs.current) inputRefs.current[index] = el!; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            required
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={(e) => handlePaste(e)}
                            className={`bg-white/5 ring-2 ring-white/10 focus-within:ring-border w-10 h-12 sm:w-14 sm:h-14 rounded-lg text-center text-base border-none outline-none`}
                        />
                    ))}
                </div>


                <button type="submit" className="px-6 py-2.5 w-full mt-4 bg-primary hover:bg-primary-hover active:scale-95 transition-all rounded-full" >
                    Submit
                </button>

                <div className="text-gray-400 text-sm mt-3" >
                    <button onClick={() => showAuthModal("login")} className="text-indigo-400 hover:underline ml-1">Go Back</button>
                </div>
            </form>
        </div>
    )
}


export default VerifyOTP;