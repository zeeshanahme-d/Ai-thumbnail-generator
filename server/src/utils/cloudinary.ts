import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";
import logger from "./logger.js";

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

// Streams an in-memory image to Cloudinary. Resolves to null when the upload fails.
// Cloudinary picks a random public id; uploaders' filenames never end up in the public URL.
const uploadFileOnCloudinary = (
  buffer: Buffer,
  folder = "thumbnails",
): Promise<UploadApiResponse | null> => {
  configureCloudinary();

  const options: UploadApiOptions = {
    folder,
    overwrite: false,
    resource_type: "image",
  };

  // upload_stream throws synchronously for setup errors such as missing keys, which the
  // executor turns into a rejection, so every failure reaches the same catch.
  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => (result ? resolve(result) : reject(error)))
      .end(buffer);
  }).catch((error) => {
    logger.error("Cloudinary upload failed", { error });
    return null;
  });
};

export const deleteFileFromCloudinary = async (publicId: string) => {
  if (!publicId) return null;
  configureCloudinary();
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error("Cloudinary delete failed", { publicId, error });
    return null;
  }
};

export default uploadFileOnCloudinary;
