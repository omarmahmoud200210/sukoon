import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/token.utils.js";
const refreshToken = (req, res, next) => {
    const token = req.cookies.refresh_token;
    if (!token) {
        res.sendStatus(401);
        return;
    }
    jwt.verify(token, process.env.JWT_REFRESH_TOKEN, (err, user) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        const payload = user;
        const userId = Number(payload.id);
        const accessToken = generateAccessToken(userId);
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });
        req.user = { id: userId };
        next();
    });
};
export default refreshToken;
