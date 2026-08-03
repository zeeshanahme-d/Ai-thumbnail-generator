import toast from "react-hot-toast";

export const getUserInitial = (fullName?: string | null): string => {
  return fullName ? fullName.charAt(0).toUpperCase() : "A";
};

export const handleDownloadFile = async (url: string, fileName: string) => {
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: unknown) {
    console.error(error);
    toast.error((error as any)?.message || "Error downloading the file.");
  }
};

export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): T => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  } as T;
};
