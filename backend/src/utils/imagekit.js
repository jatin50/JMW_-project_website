import ImageKit from "imagekit";
import fs from "fs";
import path from "path";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadToImageKit = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return { success: false, message: "No local file path provided" };
    }
    console.log( "localfilepath:",localFilePath)

    if (!fs.existsSync(localFilePath)) {
      return { success: false, message: "File does not exist" };
    }

    const fileBuffer = fs.readFileSync(localFilePath);

    const response = await imagekit.upload({
      file: fileBuffer.toString("base64"),
      fileName: path.basename(localFilePath),
      folder: "products",
    });

    console.log("ImageKit URL:", response.url);

    fs.unlinkSync(localFilePath);
    

    return {
      success: true,
      url: response.url,
      fileId: response.fileId,
    };

  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("ImageKit Upload Error:", error);

    return {
      success: false,
      message: error.message || "Image upload failed",
    };
  }
};

export default uploadToImageKit;
