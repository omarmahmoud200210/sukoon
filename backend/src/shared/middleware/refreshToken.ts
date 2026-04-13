import type { RequestHandler, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/token.utils.js";

const refreshToken: RequestHandler = (req, res, next: NextFunction) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_REFRESH_TOKEN!,
    (
      err: jwt.VerifyErrors | null,
      user: jwt.JwtPayload | string | undefined,
    ) => {
      if (err) {
        res.sendStatus(403);
        return;
      }

      const payload = user as jwt.JwtPayload;
      const userId = Number(payload.id);
      const accessToken = generateAccessToken(userId);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      req.user = { id: userId } as Express.User;
      next();
    },
  );
};

export default refreshToken;
