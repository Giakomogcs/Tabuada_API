import fs from "fs/promises";
import path from "path";
import uploadConfig from "../configs/uploads";

class DiskStorage {
  async saveFile(file: string): Promise<string> {
    await fs.rename(
      path.resolve(uploadConfig.TMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    );

    return file;
  }

  async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try {
      await fs.stat(filePath);
    } catch {
      return;
    }

    await fs.unlink(filePath);
  }
}

export default DiskStorage;
