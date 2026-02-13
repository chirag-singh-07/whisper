import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const prefix = (req as any).userId || "anon";
    const name = `${prefix}-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  // accept only image mimetypes
  if (file.mimetype && String(file.mimetype).startsWith("image/"))
    cb(null, true);
  else cb(new Error("Only image uploads are allowed."));
};

const chatFileFilter = (req: any, file: any, cb: any) => {
  // accept images, videos, audio, and common documents
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/") ||
    file.mimetype.startsWith("audio/") ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "text/plain"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type."), false);
  }
};

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
export const upload = multer({
  storage,
  fileFilter: chatFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
