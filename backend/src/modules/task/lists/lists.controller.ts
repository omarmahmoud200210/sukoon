import type { RequestHandler } from "express";
import ListService from "./lists.service.js";
import { AppError } from "../../../shared/middleware/error.js";

class ListsController {
  constructor(private listService: ListService) {}

  getAll: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const lists = await this.listService.getAllLists(userId);
    return res.status(200).json(lists);
  };

  getById: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const list = await this.listService.getListById(id, userId);

    if (!list) {
      throw AppError.NotFound("List not found");
    }

    return res.status(200).json(list);
  };

  create: RequestHandler = async (req, res) => {
    const { title, color } = req.body;
    const userId = req.user!.id;

    const list = await this.listService.createList(
      userId,
      title,
      color || "#000000",
    );
    return res.status(201).json(list);
  };

  update: RequestHandler = async (req, res) => {
    const { title, color } = req.body;
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const list = await this.listService.updateList(id, userId, title, color);
    return res.status(200).json(list);
  };

  delete: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const list = await this.listService.deleteList(id, userId);
    return res.status(200).json(list);
  };
}

export default ListsController;
