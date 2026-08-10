// Cloudinary-backed uploads. This is the fix for the old project's "photos not
// loading" bug: files never touch the server's local disk (which is wiped on
// every Render redeploy) — a custom Multer storage engine streams each file
// straight to Cloudinary, which returns a permanent https URL + publicId that
// we store in Postgres.
//
// We implement the storage engine ourselves (instead of the
// multer-storage-cloudinary package) because that package still pins a
// cloudinary v1 peer dependency and hasn't been updated for v2 — writing the
// ~20 lines directly avoids a dependency conflict and is worth understanding
// anyway: Multer storage engines just need `_handleFile` and `_removeFile`.

import multer from "multer";

import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";

class CloudinaryStorageEngine {
  constructor({ folder, resourceType }) {
    this.folder = folder;
    this.resourceType = resourceType;
  }

  _handleFile(req, file, cb) {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `j27-portfolio/${this.folder}`, resource_type: this.resourceType },
      (error, result) => {
        if (error) return cb(error);
        cb(null, {
          path: result.secure_url,
          filename: result.public_id,
          size: result.bytes,
        });
      }
    );

    // Multer hands us the raw multipart part as a readable stream here
    // (no need to buffer it in memory first) — pipe it straight through.
    file.stream.pipe(uploadStream);
  }

  _removeFile(req, file, cb) {
    cloudinary.uploader.destroy(file.filename, { resource_type: this.resourceType }).then(
      () => cb(null),
      (error) => cb(error)
    );
  }
}

const buildFileFilter = (allowedMimeTypes) => (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  const error = new Error(`Unsupported file type: ${file.mimetype}`);
  error.statusCode = 400;
  cb(error);
};

const createCloudinaryUploader = ({ folder, allowedMimeTypes, maxSizeMb, resourceType = "image" }) =>
  multer({
    storage: new CloudinaryStorageEngine({ folder, resourceType }),
    fileFilter: buildFileFilter(allowedMimeTypes),
    limits: { fileSize: maxSizeMb * 1024 * 1024, files: 1 },
  });

export const imageUpload = createCloudinaryUploader({
  folder: "images",
  maxSizeMb: 5,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
});

export const certificateUpload = createCloudinaryUploader({
  folder: "certificates",
  maxSizeMb: 8,
  allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
  resourceType: "auto",
});

export const resumeUpload = createCloudinaryUploader({
  folder: "resumes",
  maxSizeMb: 8,
  allowedMimeTypes: ["application/pdf"],
  resourceType: "auto",
});

// Guard: if Cloudinary env vars aren't set yet, fail fast with a clear message
// instead of a confusing Multer/Cloudinary stack trace.
export const requireCloudinaryConfigured = (req, res, next) => {
  if (!isCloudinaryConfigured) {
    return res.status(500).json({
      message:
        "Cloudinary is not configured on the server. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env.",
    });
  }
  next();
};

export const fileDetailsFromUpload = (file) => ({
  url: file.path, // secure_url, set in _handleFile above
  publicId: file.filename, // public_id, set in _handleFile above
  originalName: file.originalname,
  mimeType: file.mimetype,
  size: file.size,
});

export const removeUploadedAsset = async (publicId, resourceType = "image") => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Failed to remove Cloudinary asset:", publicId, error.message);
  }
};
