import multer, { FileFilterCallback, MulterError } from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    cb(null, false);
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;