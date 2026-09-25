import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Upload, X } from "lucide-react";
import Alert from "../Alert";
import Button from "../Button";
import {
  ACCEPTED_IMAGE_LABEL,
  IMAGE_ACCEPT_ATTRIBUTE,
  MAX_IMAGE_SIZE_MB,
  formatFileSize,
  validateImageFile,
} from "../../lib/imageValidation";

interface ReferenceImageUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function ReferenceImageUpload({
  file,
  onFileChange,
}: ReferenceImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setFilePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setFilePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const selectFile = (candidate: File | undefined) => {
    if (!candidate) return;

    const validationError = validateImageFile(candidate);
    setError(validationError);

    if (validationError) return;

    onFileChange(candidate);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
    // Reset so picking the same file again still fires a change event.
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const removeReference = () => {
    onFileChange(null);
    setError(null);
  };

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
        Reference image
      </p>
      <p className="mt-1 text-xs text-text-muted">
        Blend a face, logo, or asset directly into your thumbnail output.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_ACCEPT_ATTRIBUTE}
        onChange={handleInputChange}
        className="hidden"
      />

      {file && filePreviewUrl ? (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background-surface p-3">
          <img
            src={filePreviewUrl}
            alt={file.name}
            className="size-14 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">
              {file.name}
            </p>
            <p className="text-xs text-text-muted">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            rounded="lg"
            onClick={removeReference}
            aria-label="Remove reference image"
            className="hover:text-primary"
          >
            <X size={15} />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 transition ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-background-surface hover:border-primary/50"
          }`}
        >
          <Upload size={20} className="text-primary" />
          <span className="text-sm text-text-primary">
            Drag and drop or click to upload
          </span>
          <span className="text-[11px] uppercase tracking-wide text-text-muted">
            {ACCEPTED_IMAGE_LABEL} up to {MAX_IMAGE_SIZE_MB}MB
          </span>
        </button>
      )}

      {error && (
        <Alert variant="error" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  );
}
