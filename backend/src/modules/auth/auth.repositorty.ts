import prisma from "../../shared/database/prisma.js";
import type { User } from "@prisma/client";
import type { Profile } from "passport-google-oauth20";

class AuthRepository {
  constructor() {}

  async getUser(userId?: number, email?: string) {
    const conditions = [];
    if (userId !== undefined) conditions.push({ id: userId });
    if (email !== undefined) conditions.push({ email });
    if (conditions.length === 0) return null;
    return await prisma.user.findFirst({
      where: { OR: conditions },
    });
  }

  async login(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async register(
    data: Pick<User, "firstName" | "lastName" | "email">,
    hashedPassword: string,
  ) {
    return await prisma.user.create({
      data: {
        ...data,
        passwordHashed: hashedPassword,
        avatarUrl: "",
        isVerified: false,
      },
    });
  }

  async forgotPassword(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async resetPassword(userId: number, password: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { passwordHashed: password },
    });
  }

  async verifyEmail(userId: number) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  }

  async googleLogin(profile: Profile) {
    return await prisma.user.findUnique({
      where: {
        email: profile.emails?.[0]?.value!,
      },
    });
  }

  async googleRegister(profile: Profile) {
    return await prisma.user.create({
      data: {
        email: profile.emails?.[0]?.value!,
        passwordHashed: "",
        firstName: profile.name?.givenName || "",
        lastName: profile.name?.familyName || "",
        avatarUrl: profile.photos?.[0]?.value || "",
        isVerified: true,
        oauth: true,
      },
    });
  }

  async changeFirstNameAndLastName(
    userId: number,
    firstName: string,
    lastName: string,
  ) {
    return await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName },
    });
  }

  async changePassword(userId: number, password: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { passwordHashed: password },
    });
  }

  async deleteAccount(userId: number) {
    return await prisma.user.delete({ where: { id: userId } });
  }

  async uploadAvatar(userId: number, avatarUrl: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });
  }

  async getAllUsers() {
    return await prisma.user.findMany({
      select: { id: true },
    });
  }
}

export default AuthRepository;
