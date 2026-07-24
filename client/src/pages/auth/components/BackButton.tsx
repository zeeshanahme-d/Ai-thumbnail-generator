import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary transition hover:text-text-primary"
        >
            <ArrowLeft size={16} />
            Back
        </button>
    );
}
