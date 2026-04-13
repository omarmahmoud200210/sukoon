import jwt from "jsonwebtoken";

export const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_TOKEN!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_TOKEN!,
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
};

export const generateAccessToken = (userId: number) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_TOKEN!, {
    expiresIn: "1h",
  });

  return accessToken;
};

export const generateForgotPasswordToken = (userId: number) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_FORGOT_PASSWORD_TOKEN!,
    {
      expiresIn: "1h",
    },
  );

  return accessToken;
};

export const generateVerificationToken = (userId: number) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_VERIFICATION_TOKEN!,
    {
      expiresIn: "24h",
    },
  );

  return accessToken;
};
