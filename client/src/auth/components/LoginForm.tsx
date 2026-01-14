import { useState, type ChangeEvent, type FormEvent } from "react"
import { useAuthStore } from "../../store/useAuthModalStore";
import { Lock, Mail, X } from "lucide-react";
import Button from "../../components/Button";

const LoginForm = () => {
    const { showAuthModal, closeModal } = useAuthStore((state) => state);


    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    return (
        <div className="w-[90%] xs:w-sm md:w-md relative text-center bg-white/6 border border-white/10 rounded-2xl md:px-8 md:py-10 px-4 py-5">
            <button onClick={closeModal} title="Close Modal" className="hover:text-[#bdbdbd] absolute right-4 top-4 transition-all duration-300">
                <X />
            </button>
            <form
                onSubmit={handleSubmit}>
                <h1 className="text-white text-3xl font-medium">
                    Login
                </h1>

                <p className="text-gray-400 text-sm mt-2">Please login to continue</p>

                <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-border h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
                    <Mail size={20} className="text-white/50" />
                    <input type="email" name="email" placeholder="Email id" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none text-base" value={formData.email} onChange={handleChange} required />
                </div>

                <div className=" flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-border h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
                    <Lock size={20} className="text-white/50" />
                    <input type="password" name="password" placeholder="Password" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none text-base" value={formData.password} onChange={handleChange} required />
                </div>

                <div className="my-4 text-left">
                    <button type="button" onClick={() => showAuthModal("forgotPassword")} className="text-sm text-indigo-400 hover:underline">
                        Forget password?
                    </button>
                </div>

                <Button type="submit" variant="primary" >
                    Login
                </Button>

                <div className="text-gray-400 text-sm mt-3 cursor-pointer" >
                    Don't have an account
                    <button onClick={() => showAuthModal("signup")} className="text-indigo-400 hover:underline ml-1">click here</button>
                </div>
            </form>
        </div>
    )
}


export default LoginForm;