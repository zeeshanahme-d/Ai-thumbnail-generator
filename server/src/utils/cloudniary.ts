import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import fs from "fs/promises";

// Configured lazily: dotenv.config() runs *after* the module graph is imported,
// so reading process.env at module scope would yield undefined credentials.
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const removeLocalFile = async (localPath: string) => {
  try {
    await fs.unlink(localPath);
  } catch (error) {
    // Never throw from cleanup — it would crash the process from a finally block.
    console.error("Failed to remove temp upload:", error);
  }
};

const uploadFileOnCloudniary = async (
  localPath: string,
  folder = "thumbnails",
) => {
  if (!localPath) return null;

  configureCloudinary();

  const options: UploadApiOptions = {
    folder,
    use_filename: true,
    // Keep names unique so two users uploading "logo.png" cannot clobber
    // each other's asset.
    unique_filename: true,
    overwrite: false,
    resource_type: "image",
  };

  try {
    return await cloudinary.uploader.upload(localPath, options);
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  } finally {
    await removeLocalFile(localPath);
  }
};

export default uploadFileOnCloudniary;
