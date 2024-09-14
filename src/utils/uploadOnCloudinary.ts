import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ||'dgsvoeqsl',
  api_key: process.env.CLOUDINARY_API_KEY || '635435151655556',
  api_secret: process.env.CLOUDINARY_API_SECRET || '-U_oEauANmOtbiLj_EONTYt7vCM',
});

const uploadOnCloudinary = async (localFilePath: string, folderName: string) => {
  try {
    if (!localFilePath) return null;

    // File upload on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: `${folderName}`, 
    });

    // File has been uploaded successfully
    console.log('File is uploaded on Cloudinary', response.url);
    fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
    return response;

  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    fs.unlinkSync(localFilePath); // Remove the locally saved temporary file as the upload operation failed
    return null;
  }
};

export { uploadOnCloudinary };
