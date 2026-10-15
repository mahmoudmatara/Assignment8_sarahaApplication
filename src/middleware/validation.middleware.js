import { BadRequestException } from "../common/exceptions/index.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const validationResult = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
      files: req.files,
      file: req.file,
    });
    if (!validationResult.success) {
      throw BadRequestException(
        "Validation Error",
        validationResult.error.issues
      );
    }
    req.validate = validationResult.data;
    next();
  };
};
