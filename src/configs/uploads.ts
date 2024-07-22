import path from "path";
import multer from "multer";
import crypto from "crypto";

const TMP_FOLDER = path.resolve(__dirname, "..", "database", "uploads", "tmp");
const UPLOADS_FOLDER = path.resolve(__dirname, "..", "database", "uploads");

const MULTER: multer.Options = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

export default { TMP_FOLDER, UPLOADS_FOLDER, MULTER };
