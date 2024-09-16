import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from './ApiError';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dgsvoeqsl',
  api_key: process.env.CLOUDINARY_API_KEY || '635435151655556',
  api_secret: process.env.CLOUDINARY_API_SECRET || '-U_oEauANmOtbiLj_EONTYt7vCM',
});

interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: any;
}

const uploadOnCloudinary = async (localFile: File, folderName: string): Promise<CloudinaryUploadResult> => {
  const buffer = await localFile.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: folderName,
      },
      (error, result) => {
        // Log result for debugging
        console.log("Cloudinary Result:", result);

        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(new ApiError(500, "Failed to upload image to Cloudinary"));
        }

        if (!result || !result.secure_url) {
          return reject(new ApiError(500, "No result returned from Cloudinary"));
        }

        resolve(result); // This should return the entire result, including `secure_url`
      }
    );

    uploadStream.end(bytes);
  });
};

export { uploadOnCloudinary };
