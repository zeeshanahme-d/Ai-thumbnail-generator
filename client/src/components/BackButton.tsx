import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

// Goes back one page, or to `fallbackTo` when the page was opened directly and has no history.
export default function BackButton({ fallbackTo = "/" }: { fallbackTo?: string }) {
    const navigate = useNavigate();

    const handleBack = () => {
        // React Router keeps the history position in `idx`; 0 means this is the first entry.
        if (window.history.state?.idx > 0) navigate(-1);
        else navigate(fallbackTo);
    };

    return (
        <Button
            type="button"
            variant="secondary"
            fullWidth={false}
            onClick={handleBack}
            className="border-none p-0! hover:bg-transparent!"
        >
            <ArrowLeft size={16} />
            Back
        </Button>
    );
}
