import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import fs from "fs/promises";

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export const removeLocalFile = async (localPath: string) => {
  try {
    await fs.unlink(localPath);
  } catch (error) {
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

export const deleteFileFromCloudinary = async (publicId: string) => {
  if (!publicId) return null;
  configureCloudinary();
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
    return null;
  }
};

export default uploadFileOnCloudniary;
