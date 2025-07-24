import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Needed if you use ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteImage = (relativeFilePath) => {
  try {
    // Always join with 'public' root
    const fullPath = path.join(__dirname, "../public", relativeFilePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log("Deleted:", fullPath);
    } else {
      console.warn("File not found to delete:", fullPath);
    }
  } catch (error) {
    console.error("Error deleting image:", error.message);
  }
};
