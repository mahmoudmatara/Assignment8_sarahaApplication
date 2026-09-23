import { tokenTypeEnum } from "../common/enum/index.js";
import {
  ForbiddenException,
  UnauthorizedException,
} from "../common/exceptions/error.exceptions.js";
import { decodeToken } from "../common/security/token.security.js";

export const authentication = (tokenType = tokenTypeEnum.ACCESSTOKEN) => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) throw UnauthorizedException("Token is required");
      const { profileData, payload } = await decodeToken({
        authorization,
        tokenType,
      });
      req.user = profileData;
      req.payload = payload;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authorization = (accessRole) => {
  return async (req, res, next) => {
    try {
      if (!accessRole.includes(req.user.role)) throw ForbiddenException();
      next();
    } catch (error) {
      next(error);
    }
  };
};
