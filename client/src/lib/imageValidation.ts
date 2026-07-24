export const ACCEPTED_IMAGE_EXTENSIONS: readonly string[] = [
    "jpg",
    "jpeg",
    "png",
    "webp",
];

export const ACCEPTED_IMAGE_MIME_TYPES: readonly string[] = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export const MAX_IMAGE_SIZE_MB = 5;

const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

/** Value for an <input type="file"> accept attribute. */
export const IMAGE_ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_EXTENSIONS.map(
    (extension) => `.${extension}`,
).join(",");

export const ACCEPTED_IMAGE_LABEL = ACCEPTED_IMAGE_EXTENSIONS.map((extension) =>
    extension.toUpperCase(),
).join(", ");

export function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;

    const kilobytes = bytes / 1024;
    if (kilobytes < 1024) return `${Math.round(kilobytes)} KB`;

    return `${(kilobytes / 1024).toFixed(1)} MB`;
}

function getFileExtension(fileName: string) {
    const lastDotIndex = fileName.lastIndexOf(".");
    return lastDotIndex === -1 ? "" : fileName.slice(lastDotIndex + 1).toLowerCase();
}

/** Returns a user-facing error message, or null when the URL is usable. */
export function validateImageUrl(url: string): string | null {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) return "Enter an image URL first.";

    let parsedUrl: URL;
    try {
        parsedUrl = new URL(trimmedUrl);
    } catch {
        return "That doesn't look like a valid URL.";
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return "Image URL must start with http:// or https://";
    }

    return null;
}

/** Returns a user-facing error message, or null when the file is acceptable. */
export function validateImageFile(file: File): string | null {
    const hasAllowedExtension = ACCEPTED_IMAGE_EXTENSIONS.includes(
        getFileExtension(file.name),
    );
    // Some browsers report an empty type for less common formats.
    const hasAllowedMimeType =
        !file.type || ACCEPTED_IMAGE_MIME_TYPES.includes(file.type);

    if (!hasAllowedExtension || !hasAllowedMimeType) {
        return `"${file.name}" is not a supported image. Use ${ACCEPTED_IMAGE_LABEL}.`;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return `"${file.name}" is ${formatFileSize(file.size)}. Maximum size is ${MAX_IMAGE_SIZE_MB} MB.`;
    }

    return null;
}
