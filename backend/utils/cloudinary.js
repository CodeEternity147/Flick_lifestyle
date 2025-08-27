import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables if not already loaded
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  dotenv.config({ path: './config.env' });
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
export const uploadImage = async (file, folder = 'flick-lifestyle') => {
  try {
    let uploadOptions = {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    };

    // If file is a buffer, convert to base64 data URL
    if (Buffer.isBuffer(file)) {
      const base64Data = `data:image/jpeg;base64,${file.toString('base64')}`;
      uploadOptions = { ...uploadOptions, resource_type: 'image' };
      const result = await cloudinary.uploader.upload(base64Data, uploadOptions);
      return {
        public_id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height
      };
    }

    // If file is a stream or other format
    const result = await cloudinary.uploader.upload(file, uploadOptions);
    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    const errorMessage = error.message || error.toString();
    
    // Handle specific Cloudinary errors
    if (errorMessage.includes('File too large')) {
      throw new Error('File too large');
    }
    
    if (errorMessage.includes('Invalid file type')) {
      throw new Error('Invalid file type. Only images are allowed.');
    }
    
    if (errorMessage.includes('Upload preset')) {
      throw new Error('Upload configuration error. Please contact support.');
    }
    
    throw new Error(`Image upload failed: ${errorMessage}`);
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files, folder = 'flick-lifestyle') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error.message}`);
  }
};

// Generate optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: 'auto:good',
    fetch_format: 'auto',
    ...options
  };

  return cloudinary.url(publicId, defaultOptions);
};

// Generate thumbnail URL
export const getThumbnailUrl = (publicId, width = 300, height = 300) => {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto:good',
    fetch_format: 'auto'
  });
};

export default cloudinary;
