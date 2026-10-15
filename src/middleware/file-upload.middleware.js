import multer from "multer";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { BadRequestException } from "../common/exceptions/error.exceptions.js";

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/gif"],
  file: ["application/pdf", "application/json"],
  video: ["video/mp4", "video/x-matroska"],
};

export const localFileUpload = ({
  maxFileSize = 5,
  maxFiles = 3,
  validation = [],
} = {}) => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (validation.length === 0 || validation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format", { cause: { status: 400 } }), false);
    }
  };

  return multer({
    fileFilter,
    storage,
    limits: { fileSize: maxFileSize * 1024 * 1024, files: maxFiles },
  });
};

const collectFiles = (req) => {
  if (req.file) return [req.file];
  if (Array.isArray(req.files)) return req.files;
  if (req.files && typeof req.files === "object") {
    return Object.values(req.files).flat();
  }
  return [];
};

const detectFile = async (file, validation) => {
  const result = await fileTypeFromBuffer(file.buffer);
  if (!result || (validation.length && !validation.includes(result.mime))) {
    BadRequestException("Invalid file formats");
  }
  return result;
};

const writeFileOndisk = async (file, result, customPath) => {
  await mkdir(path.resolve(`./uploads/${customPath}`), { recursive: true });
  const finalPath = `uploads/${customPath}/${randomUUID()}.${result.ext}`;
  await writeFile(path.resolve(`./${finalPath}`), file.buffer);
  file.path = finalPath;
  return file;
};

export const processMulterUpload = ({
  customPath = "general",
  validation = [],
} = {}) => {
  return async (req, res, next) => {
    try {
      const files = collectFiles(req);
      if (!files.length) return next();

      const folder =
        typeof customPath === "function" ? customPath(req) : customPath;
      const detected = [];
      for (const file of files)
        detected.push(await detectFile(file, validation));
      for (let i = 0; i < files.length; i++)
        await writeFileOndisk(files[i], detected[i], folder);
      next();
    } catch (error) {
      next(error);
    }
  };
};

// export const processFile = async ({
//   customPath = "general",
//   file,
//   validation = [],
// }) => {
//   const result = await fileTypeFromBuffer(file.buffer);

//   if (!result || !validation.includes(result.mime)) {
//     throw new BadRequestException("Invalid file formats");
//   } else {
//     await mkdir(path.resolve(`./uploads/${customPath}`), { recursive: true });
//     const uniqueFilePath = `uploads/${customPath}/${randomUUID()}.${
//       result.ext
//     }`;

//     await writeFile(path.resolve(`./${uniqueFilePath}`), file.buffer);
//     file.finalPath = uniqueFilePath;
//     return file;
//   }
// };

// export const processFiles = async ({
//   customPath,
//   files = [],
//   validation = [],
// }) => {
//   const assets = [];
//   for (const file of files) {
//     const uploadFile = await processFile({ customPath, file, validation });
//     assets.push(uploadFile);
//   }
//   return assets;
// };

// export const processFields = async ({
//   customPath,
//   fields = {},
//   validation = [],
// }) => {
//   const assets = [];
//   for (const field of Object.keys(fields)) {
//     const files = await processFiles({
//       customPath,
//       files: fields[field],
//       validation,
//     });
//     assets.push({ field, files });
//   }
//   return assets;
// };

// export const processMulterUpload = ({
//   customPath = "general",
//   validation = [],
// } = {}) => {
//   return async (req, res, next) => {
//     try {
//       console.log(req.files);

//       if (req.file) {
//         req.file = await processFile({
//           customPath,
//           file: req.file,
//           validation,
//         });
//       } else if (Array.isArray(req.files)) {
//         req.files = await processFiles({
//           customPath,
//           files: req.files,
//           validation,
//         });
//       } else if (
//         typeof req.files === "object" &&
//         Object.keys(req.files)?.length
//       ) {
//         req.files = await processFields({
//           customPath,
//           fields: req.files,
//           validation,
//         });
//       }

//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };
