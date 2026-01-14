import { useAuthStore } from "../store/useAuthModalStore";
import ForgotePassword from "./components/ForgotePassword";
import LoginForm from "./components/LoginForm";
import ResetPassword from "./components/ResetPassword";
import SignUpForm from "./components/SignUpForm";
import VerifyOTP from "./components/VerifyOTP";
import { motion } from "motion/react";



function AuthModal() {
    const { mode } = useAuthStore((state) => state);

    const getContent = () => {
        switch (mode) {
            case 'login':
                return <LoginForm />;
            case 'signup':
                return <SignUpForm />;
            case 'forgotPassword':
                return <ForgotePassword />;
            case 'verifyOtp':
                return <VerifyOTP />;
            case 'resetPassword':
                return <ResetPassword />;
            default:
                return null;
        }
    };

    return (
        <div className={`overflow-hidden! h-screen w-full z-[999] bg-primary-light fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-[100px]`}>
            <motion.div
                className="w-full flex-centered h-full"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 70, mass: 2 }}
            >
                {getContent()}
            </motion.div>
        </div>
    );
}

export default AuthModal;
