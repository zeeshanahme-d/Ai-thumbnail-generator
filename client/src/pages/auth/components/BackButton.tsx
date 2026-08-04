import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <Button
            type="button"
            variant="secondary"
            fullWidth={false}
            onClick={() => navigate(-1)}
            className="border-none p-0! hover:bg-transparent!"
        >
            <ArrowLeft size={16} />
            Back
        </Button>
    );
}
