import type { RequestHandler } from "express";
import type { UserRole } from "@prisma/client";
import AdminService from "./admin.service.js";
import { AppError } from "../../shared/middleware/error.js";

class AdminController {
  constructor(private readonly adminService: AdminService) {}

  getStats: RequestHandler = async (_req, res) => {
    const stats = await this.adminService.getStats();
    res.status(200).json(stats);
  };

  getSystemHealth: RequestHandler = async (_req, res) => {
    const health = await this.adminService.getSystemHealth();
    res.status(200).json(health);
  };

  getAllUsers: RequestHandler = async (req, res) => {
    const role = (req.query.role as UserRole) || "USER";
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const users = await this.adminService.getAllUsers(role, cursor, limit);
    res.status(200).json(users);
  };

  getUserById: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw AppError.BadRequest("Invalid user ID");
    }

    const user = await this.adminService.getUserById(id);

    if (!user) {
      throw AppError.NotFound("User not found");
    }

    res.status(200).json(user);
  };

  updateUserRole: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const { role } = req.body;

    if (isNaN(id)) {
      throw AppError.BadRequest("Invalid user ID");
    }

    const user = await this.adminService.updateUserRole(id, role);
    res.status(200).json(user);
  };

  updateUserStatus: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const { isActive } = req.body;

    if (isNaN(id)) {
      throw AppError.BadRequest("Invalid user ID");
    }

    const user = await this.adminService.updateUserStatus(id, isActive);
    res.status(200).json(user);
  };
}

export default AdminController;
