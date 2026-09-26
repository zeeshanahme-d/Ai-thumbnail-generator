import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

// Streams an in-memory image to Cloudinary. Resolves to null when the upload fails.
const uploadFileOnCloudniary = (
  buffer: Buffer,
  folder = "thumbnails",
  fileName?: string,
): Promise<UploadApiResponse | null> => {
  configureCloudinary();

  const options: UploadApiOptions = {
    folder,
    filename_override: fileName,
    use_filename: Boolean(fileName),
    unique_filename: true,
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
    console.error("Cloudinary upload failed:", error);
    return null;
  });
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
