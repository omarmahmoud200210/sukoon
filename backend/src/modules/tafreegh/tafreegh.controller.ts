import type { RequestHandler } from "express";
import TafreeghService from "./tafreegh.service.js";
import { AppError } from "../../shared/middleware/error.js";

class TafreeghController {
  constructor(private tafreeghService: TafreeghService) {}

  getAll: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tafreeghs = await this.tafreeghService.getAllTafreeghs(userId);
    return res.status(200).json(tafreeghs);
  };

  getById: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const tafreegh = await this.tafreeghService.getTafreeghById(id, userId);

    if (!tafreegh) {
      throw AppError.NotFound("Tafreegh not found");
    }

    return res.status(200).json(tafreegh);
  };

  create: RequestHandler = async (req, res) => {
    const { content } = req.body;
    const userId = req.user!.id;

    const tafreegh = await this.tafreeghService.createTafreegh(
      userId,
      content,
    );
    return res.status(201).json(tafreegh);
  };

  update: RequestHandler = async (req, res) => {
    const { content } = req.body;
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const tafreegh = await this.tafreeghService.updateTafreegh(id, userId, content);
    return res.status(200).json(tafreegh);
  };

  delete: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const tafreegh = await this.tafreeghService.deleteTafreegh(id, userId);
    return res.status(200).json(tafreegh);
  };

  deleteAll: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tafreeghs = await this.tafreeghService.deleteAllTafreegh(userId);
    return res.status(200).json(tafreeghs);
  };
}

export default TafreeghController;
