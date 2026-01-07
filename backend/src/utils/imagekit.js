import ImageKit from "imagekit";
import fs from "fs";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadToImageKit = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return {
        success: false,
        message: "No local file path provided",
      };
    }
    if (!fs.existsSync(localFilePath)) {
      return {
        success: false,
        message: "File does not exist at given path",
      };
    }

    const fileBuffer = fs.readFileSync(localFilePath);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: localFilePath.split("/").pop(),
      folder: "products", // optional folder
    });
    console.log(response.url)

    fs.unlinkSync(localFilePath);

    return {
      success: true,
      url: response.url,
      fileId: response.fileId,
    };

  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("ImageKit Upload Error:", error.message);

    return {
      success: false,
      message: "Image upload failed",
    };
  }
};

export default uploadToImageKit;
