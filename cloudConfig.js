const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//cloudinary or backend ko jodna
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, //cloud_name, api_key etc remains same and required for cloudinary configuration
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowed_formats: ["png", "jpg", "jpeg"],
    },
  });

  module.exports = {
    cloudinary,
    storage,
  };