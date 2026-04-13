import prisma from "../../shared/database/prisma.js";
class AuthRepository {
    constructor() { }
    async getUser(userId, email) {
        const conditions = [];
        if (userId !== undefined)
            conditions.push({ id: userId });
        if (email !== undefined)
            conditions.push({ email });
        if (conditions.length === 0)
            return null;
        return await prisma.user.findFirst({
            where: { OR: conditions },
        });
    }
    async login(email) {
        return await prisma.user.findUnique({ where: { email } });
    }
    async register(data, hashedPassword) {
        return await prisma.user.create({
            data: {
                ...data,
                passwordHashed: hashedPassword,
                avatarUrl: "",
                isVerified: false,
            },
        });
    }
    async forgotPassword(email) {
        return await prisma.user.findUnique({ where: { email } });
    }
    async resetPassword(userId, password) {
        return await prisma.user.update({
            where: { id: userId },
            data: { passwordHashed: password },
        });
    }
    async verifyEmail(userId) {
        return await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true },
        });
    }
    async googleLogin(profile) {
        return await prisma.user.findUnique({
            where: {
                email: profile.emails?.[0]?.value,
            },
        });
    }
    async googleRegister(profile) {
        return await prisma.user.create({
            data: {
                email: profile.emails?.[0]?.value,
                passwordHashed: "",
                firstName: profile.name?.givenName || "",
                lastName: profile.name?.familyName || "",
                avatarUrl: profile.photos?.[0]?.value || "",
                isVerified: true,
                oauth: true,
            },
        });
    }
    async changeFirstNameAndLastName(userId, firstName, lastName) {
        return await prisma.user.update({
            where: { id: userId },
            data: { firstName, lastName },
        });
    }
    async changePassword(userId, password) {
        return await prisma.user.update({
            where: { id: userId },
            data: { passwordHashed: password },
        });
    }
    async deleteAccount(userId) {
        return await prisma.user.delete({ where: { id: userId } });
    }
    async uploadAvatar(userId, avatarUrl) {
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
