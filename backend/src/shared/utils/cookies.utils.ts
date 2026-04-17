import type { Response } from "express";

export default function setCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  rememberMe?: boolean,
): void {
  const accessMaxAge = rememberMe
    ? 7 * 24 * 60 * 60 * 1000 // 7 days
    : 15 * 60 * 1000; // 15 minutes

  const refreshMaxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 7 * 24 * 60 * 60 * 1000; // 7 days

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: accessMaxAge,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: refreshMaxAge,
  });
}
