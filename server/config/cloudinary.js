import cloudinary from "cloudinary";

const {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} =
    process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

export const cloudinaryUploadImage = async (fileUpload) => {
    try {
        return await cloudinary.v2.uploader.upload(fileUpload, {
            resource_type: "auto",
        });
    } catch (error) {
        return error;
    }
};

export const cloudinaryRemoveImage = async (imagePublicId) => {
    try {
        return await cloudinary.v2.uploader.destroy(imagePublicId);
    } catch (error) {
        return error;
    }
};
