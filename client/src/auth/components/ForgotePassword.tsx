import { useState, type ChangeEvent, type FormEvent } from "react"
import { useAuthStore } from "../../store/useAuthModalStore";
import { X, Mail } from "lucide-react";

const ForgotePassword = () => {
    const { showAuthModal, closeModal } = useAuthStore((state) => state);


    const [formData, setFormData] = useState({
        email: '',
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <div className="w-full sm:w-87.5 py-10 md:w-md relative text-center bg-white/6 border border-white/10 rounded-2xl px-8">
            <button onClick={closeModal} title="Close Modal" className="hover:text-[#bdbdbd] absolute right-4 top-4 transition-all duration-300">
                <X />
            </button>
            <form
                onSubmit={handleSubmit}>
                <h1 className="text-white text-3xl font-medium">
                    Forgote Password
                </h1>

                <p className="text-gray-400 text-sm mt-2">Enter your email address and we'll send you an OTP to reset your password.</p>


                <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-border h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
                    <Mail size={20} className="text-white/50" />
                    <input type="email" name="email" placeholder="Email id" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none text-base" value={formData.email} onChange={handleChange} required />
                </div>

                <button type="submit" className="px-6 py-2.5 w-full mt-5 bg-primary hover:bg-primary-hover active:scale-95 transition-all rounded-full" >
                    Send OTP
                </button>

                <div className="text-gray-400 text-sm mt-3" >
                    <button onClick={() => showAuthModal("login")} className="text-indigo-400 hover:underline ml-1">Go Back</button>
                </div>
            </form>
        </div>
    )
}


export default ForgotePassword;