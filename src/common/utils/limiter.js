import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import geoip from "geoip-lite";
import { successResponse } from "./success.response.js";

function fromWhere(ip) {
  try {
    return geoip.lookup(ip);
  } catch (error) {
    console.log({ error });
    return null;
  }
}

export const generateLimiter = ({
  ttl = 15,
  limit = 1000,
  message = "Too Many Requests",
  status = 429,
  standardHeaders = "draft-8",
  skipSuccessfulRequests,
  skipFailedRequests,
}) => {
  return rateLimit({
    windowMs: ttl * 60 * 1000,
    standardHeaders,
    skipSuccessfulRequests,
    skipFailedRequests,

    limit: (req) => {
      const data = fromWhere(req.ip);
      return data?.country === "EG" ? limit : 0;
    },

    handler: (req, res) => {
      return successResponse({ res, message, status });
    },

    keyGenerator: (req) => {
      const ip = ipKeyGenerator(req.ip, 52);
      return `${ip}::${req.path}`;
    },
  });
};
