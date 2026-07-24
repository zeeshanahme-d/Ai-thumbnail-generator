import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { Link2, Upload, X } from "lucide-react";
import Alert from "../Alert";
import Button from "../Button";
import Input from "../Input";
import {
  ACCEPTED_IMAGE_LABEL,
  IMAGE_ACCEPT_ATTRIBUTE,
  MAX_IMAGE_SIZE_MB,
  formatFileSize,
  validateImageFile,
  validateImageUrl,
} from "../../lib/imageValidation";

interface ReferenceImageUploadProps {
  file: File | null;
  imageUrl: string;
  onFileChange: (file: File | null) => void;
  onImageUrlChange: (imageUrl: string) => void;
}

export default function ReferenceImageUpload({
  file,
  imageUrl,
  onFileChange,
  onImageUrlChange,
}: ReferenceImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUrlFieldVisible, setIsUrlFieldVisible] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
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

  const hasImageUrl = imageUrl.trim().length > 0;
  const previewSource = filePreviewUrl ?? (hasImageUrl ? imageUrl : null);

  const selectFile = (candidate: File | undefined) => {
    if (!candidate) return;

    const validationError = validateImageFile(candidate);
    setError(validationError);

    if (validationError) return;

    onFileChange(candidate);
    onImageUrlChange("");
    setIsUrlFieldVisible(false);
    setUrlDraft("");
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

  const addImageUrl = () => {
    const validationError = validateImageUrl(urlDraft);
    setError(validationError);

    if (validationError) return;

    onImageUrlChange(urlDraft.trim());
    onFileChange(null);
    setIsUrlFieldVisible(false);
    setUrlDraft("");
  };

  const handleUrlKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addImageUrl();
  };

  const closeUrlField = () => {
    setIsUrlFieldVisible(false);
    setUrlDraft("");
    setError(null);
  };

  const removeReference = () => {
    onFileChange(null);
    onImageUrlChange("");
    setError(null);
  };

  const handlePreviewError = () => {
    if (!hasImageUrl) return;
    onImageUrlChange("");
    setError("We couldn't load that image. Check the URL and try again.");
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

      {previewSource ? (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background-surface p-3">
          <img
            src={previewSource}
            alt={file ? file.name : "Reference image"}
            onError={handlePreviewError}
            className="size-14 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">
              {file ? file.name : imageUrl}
            </p>
            <p className="text-xs text-text-muted">
              {file ? formatFileSize(file.size) : "Image URL"}
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

      {isUrlFieldVisible ? (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1">
            <Input
              icon={Link2}
              type="url"
              autoFocus
              value={urlDraft}
              placeholder="https://example.com/image.jpg"
              onChange={(event) => setUrlDraft(event.target.value)}
              onKeyDown={handleUrlKeyDown}
            />
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            fullWidth={false}
            onClick={addImageUrl}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={closeUrlField}
            aria-label="Cancel image URL"
          >
            <X size={15} />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsUrlFieldVisible(true)}
          className="mt-3 flex items-center gap-2 text-xs text-text-secondary transition hover:text-primary"
        >
          <Link2 size={13} />
          Or paste an image URL
        </button>
      )}
    </div>
  );
}
