import type { RequestHandler } from "express";
import TagService from "./tags.service.js";
import { AppError } from "../../../shared/middleware/error.js";

class TagsController {
  constructor(private tagService: TagService) {}

  getAll: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tags = await this.tagService.getAllTags(userId);
    return res.status(200).json(tags);
  };

  getById: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const tag = await this.tagService.getTagById(id, userId);

    if (!tag) {
      throw AppError.NotFound("Tag not found");
    }

    return res.status(200).json(tag);
  };

  create: RequestHandler = async (req, res) => {
    const { name } = req.body;
    const userId = req.user!.id;

    const tag = await this.tagService.createTag(userId, name);
    return res.status(201).json(tag);
  };

  update: RequestHandler = async (req, res) => {
    const { name } = req.body;
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const tag = await this.tagService.updateTag(id, userId, name);
    return res.status(200).json(tag);
  };

  delete: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const tag = await this.tagService.deleteTag(id, userId);
    return res.status(200).json(tag);
  };

  addToTask: RequestHandler = async (req, res) => {
    const userId = Number((req.user as any).id);
    const tagId = Number(req.params.id);
    const taskId = Number(req.params.taskId);

    await this.tagService.addTagToTask(tagId, taskId, userId);
    return res.status(200).json({ message: "Tag added to task successfully" });
  };

  removeFromTask: RequestHandler = async (req, res) => {
    const userId = Number((req.user as any).id);
    const tagId = Number(req.params.id);
    const taskId = Number(req.params.taskId);

    await this.tagService.removeTagFromTask(tagId, taskId, userId);
    return res
      .status(200)
      .json({ message: "Tag removed from task successfully" });
  };

  getTasksByTag: RequestHandler = async (req, res) => {
    const userId = Number((req.user as any).id);
    const tagId = Number(req.params.id);

    const tasks = await this.tagService.getTasksByTag(tagId, userId);
    return res.status(200).json(tasks);
  };
}

export default TagsController;
