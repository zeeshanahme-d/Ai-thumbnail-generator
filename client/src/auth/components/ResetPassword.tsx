import { useState, type ChangeEvent, type FormEvent } from "react"
import { useAuthStore } from "../../store/useAuthModalStore";
import { X, Lock } from "lucide-react";
import Button from "../../components/Button";

const ResetPassword = () => {
    const { showAuthModal, closeModal } = useAuthStore((state) => state);


    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <div className="w-[90%] xs:w-sm md:w-md md:py-10 relative text-center bg-white/6 border border-white/10 rounded-2xl px-4 py-5 md:px-8">
            <button onClick={closeModal} title="Close Modal" className="hover:text-[#bdbdbd] absolute right-4 top-4 transition-all duration-300">
                <X />
            </button>
            <form
                onSubmit={handleSubmit}>
                <h1 className="text-white text-3xl font-medium">
                    Reset Password
                </h1>

                <p className="text-gray-400 text-sm mt-2">Enter your new password below to reset your account password.</p>

                <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-border h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
                    <Lock size={20} className="text-white/50" />
                    <input type="password" name="newPassword" placeholder="New Passwoed" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none text-base" value={formData.newPassword} onChange={handleChange} required />
                </div>
                <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-border h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
                    <Lock size={20} className="text-white/50" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none text-base" value={formData.confirmPassword} onChange={handleChange} required />
                </div>

                <Button type="submit" variant="primary" className="mt-5">
                    Reset Password
                </Button>

                <div className="text-gray-400 text-sm mt-3" >
                    <button onClick={() => showAuthModal("login")} className="text-indigo-400 hover:underline ml-1">Go Back</button>
                </div>
            </form>
        </div>
    )
}


export default ResetPassword;