import fs from "fs";
import path, { relative } from "path";

const convertToUrlPath = (modelType, filename) => {
  return `public/${modelType}/${filename}`;
};

const deleteImage = (relativeFilePath) => {
  try {
    const fullPath = path.join(__dirname, "../", relativeFilePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Image deleted: ${fullPath}`);
    } else {
      console.log(`Image not found: ${fullPath}`);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};



module.exports = {
  convertToUrlPath,
  deleteImage,
};
