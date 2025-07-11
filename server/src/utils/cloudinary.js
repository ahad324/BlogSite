import { v2 as cloudinary } from 'cloudinary';
import { configDotenv } from 'dotenv';
configDotenv()
// Validate environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Cloudinary configuration error: Missing required environment variables', {
    CLOUDINARY_CLOUD_NAME: cloudName,
    CLOUDINARY_API_KEY: apiKey,
    CLOUDINARY_API_SECRET: apiSecret ? '[REDACTED]' : undefined,
  });
} else {
  // Configure Cloudinary only if variables are present
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

// Upload function
export const uploadToCloudinary = async (buffer, folder = 'blogsite/profiles') => {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary not configured: Missing environment variables');
  }
  try {
    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 256, height: 256, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            console.log('Cloudinary upload error:', error);
            return reject(new Error(`Cloudinary upload failed: ${error.message}`));
          }
          console.log('Cloudinary upload success:', { secure_url: result.secure_url, public_id: result.public_id });
          resolve(result);
        }
      );
      stream.end(buffer);
    });
  } catch (error) {
    console.log('UploadToCloudinary error:', error.message);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Delete function
export const deleteFromCloudinary = async (publicId) => {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary not configured: Missing environment variables');
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', result);
    return result;
  } catch (error) {
    console.log('Cloudinary delete error:', error.message);
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};