export const getUserInitial = (fullName?: string | null): string => {
  return fullName ? fullName.charAt(0).toUpperCase() : "A";
};

// Saves an image under `name` plus its real extension. Browsers ignore the download attribute
// for other domains such as Cloudinary, so the image is fetched as a blob first. If that
// fails, the image opens in a new tab instead.
export const handleDownloadFile = async (url: string, name: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Download failed with status ${response.status}`);

    const blob = await response.blob();
    const extension = blob.type.split("/")[1] || "png";
    const baseName = name.replace(/[\\/:*?"<>|]+/g, "").trim().slice(0, 100) || "thumbnail";
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `${baseName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Some browsers read the blob after click() returns, so it is released a moment later.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch (error) {
    console.error(error);
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

export const debounce = <Args extends unknown[]>(func: (...args: Args) => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
