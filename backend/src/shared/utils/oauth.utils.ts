import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Profile, VerifyCallback } from "passport-google-oauth20";
import AuthenticationServices from "../../modules/auth/auth.service.js";
import AuthRepository from "../../modules/auth/auth.repositorty.js";

const googleCredentials = {
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!,
};

const authRepository = new AuthRepository();
const authService = new AuthenticationServices(authRepository);

const googleStrategy = async (
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
) => {
  try {
    const user = await authService.googleLogin(profile);
    done(null, user as any);
  } catch (err) {
    done(err as Error, undefined);
  }
};

if (process.env.GOOGLE_CLIENT_ID) {
  const googleCredential = new GoogleStrategy(
    googleCredentials,
    googleStrategy,
  );
  passport.use(googleCredential);
}