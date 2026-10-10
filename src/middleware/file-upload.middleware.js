import multer from "multer";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { BadRequestException } from "../common/exceptions/error.exceptions.js";

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
  file: ["application/pdf", "application/json"],
  video: ["video/mp4", "video/mkv"],
};

export const localFileUpload = ({ maxFileSize = 5, validation = [] } = {}) => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (validation.length === 0 || validation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid formats"), false);
    }
  };

  return multer({
    fileFilter,
    storage,
    limits: { fileSize: maxFileSize * 1024 * 1024 },
  });
};

export const processFile = async ({
  customPath = "general",
  file,
  validation = [],
}) => {
  const result = await fileTypeFromBuffer(file.buffer);

  if (!result || !validation.includes(result.mime)) {
    throw new BadRequestException("Invalid file formats");
  } else {
    await mkdir(path.resolve(`./uploads/${customPath}`), { recursive: true });
    const uniqueFilePath = `uploads/${customPath}/${randomUUID()}.${
      result.ext
    }`;

    await writeFile(path.resolve(`./${uniqueFilePath}`), file.buffer);
    file.finalPath = uniqueFilePath;
    return file;
  }
};

export const processFiles = async ({
  customPath,
  files = [],
  validation = [],
}) => {
  const assets = [];
  for (const file of files) {
    const uploadFile = await processFile({ customPath, file, validation });
    assets.push(uploadFile);
  }
  return assets;
};

export const processFields = async ({
  customPath,
  fields = {},
  validation = [],
}) => {
  const assets = [];
  for (const field of Object.keys(fields)) {
    const files = await processFiles({
      customPath,
      files: fields[field],
      validation,
    });
    assets.push({ field, files });
  }
  return assets;
};

export const processMulterUpload = ({
  customPath = "general",
  validation = [],
} = {}) => {
  return async (req, res, next) => {
    try {
      console.log(req.files);

      if (req.file) {
        req.file = await processFile({
          customPath,
          file: req.file,
          validation,
        });
      } else if (Array.isArray(req.files)) {
        req.files = await processFiles({
          customPath,
          files: req.files,
          validation,
        });
      } else if (
        typeof req.files === "object" &&
        Object.keys(req.files)?.length
      ) {
        req.files = await processFields({
          customPath,
          fields: req.files,
          validation,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
