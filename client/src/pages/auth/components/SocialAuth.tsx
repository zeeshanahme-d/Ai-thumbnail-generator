import GoogleButton from "./GoogleButton";

interface SocialAuthProps {
    label?: string;
    onGoogle?: () => void;
}

export default function SocialAuth({ label, onGoogle }: SocialAuthProps) {
    return (
        <div className="mb-6">
            <GoogleButton label={label} onClick={onGoogle} />
            <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    or continue with email
                </span>
                <span className="h-px flex-1 bg-border" />
            </div>
        </div>
    );
}
