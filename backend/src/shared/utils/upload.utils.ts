import { v2 as cloudinary } from "cloudinary";

cloudinary.config();

export default async function uploadImage(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "avatars" }, (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve(result.secure_url);
      })
      .end(buffer);
  });
}