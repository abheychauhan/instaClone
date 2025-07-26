const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: 'dh4x7x7nf',
  api_key: "175756726327464",
  api_secret: "BSlHQJ1bbUPsfvBAPNPs2HDzJi8",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "insta_posts",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const storage1 = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "instaClone-avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const storage2 = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video");
    return {
      folder: "instaClone-stories",
      resource_type: isVideo ? "video" : "image",
      format: isVideo ? "mp4" : "jpg",
    };
  }
});


const storage3 = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");
    const isPdf = file.mimetype === "application/pdf";

    const resourceType = isImage ? "image" : isVideo ? "video" : isPdf ? "raw" : "auto";
    const fileType = isImage ? "image" : isVideo ? "video" : isPdf ? "pdf" : null;

    // Set correct format extension (e.g., jpg, mp4, pdf)
    let format;
    if (isImage) {
      format = file.mimetype.split("/")[1]; // e.g., 'png', 'jpg'
    } else if (isVideo) {
      format = 'mp4'; // common for video
    } else if (isPdf) {
      format = 'pdf';
    }

    // Save fileType to req to use later in message creation
    req.fileType = fileType;

    return {
      folder: "instaClone-messages",
      resource_type: resourceType,
      format: format,
    };
  },
});





module.exports = { cloudinary, storage ,storage1 ,storage2 ,storage3 };
