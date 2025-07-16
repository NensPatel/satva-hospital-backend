import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convert uploaded filename into relative public path
export const convertToUrlPath = (modelType, filename) => {
  return `public/${modelType}/${filename}`;
};

// Delete image using relative path
export const deleteImage = (relativeFilePath) => {
  try {
    const fullPath = path.join(__dirname, "../", relativeFilePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    } 
  } catch (error) {
    console.error("Error deleting image:", error.message);
  }
};


