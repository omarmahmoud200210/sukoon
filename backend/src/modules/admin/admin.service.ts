import AdminRepository from "./admin.repository.js";
import type { UserRole } from "@prisma/client";

class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getAllUsers(
    userRole: UserRole = "USER",
    cursor?: number,
    limit: number = 10,
  ) {
    return await this.adminRepository.getAllUsers(userRole, cursor, limit);
  }

  async getUserById(id: number) {
    return await this.adminRepository.getUserById(id);
  }

  async updateUserRole(id: number, role: UserRole) {
    return await this.adminRepository.updateUserRole(id, role);
  }

  async updateUserStatus(id: number, isActive: boolean) {
    return await this.adminRepository.updateUserStatus(id, isActive);
  }

  async getStats() {
    return await this.adminRepository.getStats();
  }

  async getSystemHealth() {
    const dbHealth = await this.adminRepository.getSystemHealth();
    const memoryUsage = process.memoryUsage();

    return {
      ...dbHealth,
      server: {
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsage: {
          heapUsedMB: +(memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
          heapTotalMB: +(memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
          rssMB: +(memoryUsage.rss / 1024 / 1024).toFixed(2),
        },
      },
    };
  }
}

export default AdminService;
