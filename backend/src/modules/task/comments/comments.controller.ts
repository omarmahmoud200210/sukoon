import type { RequestHandler } from "express";
import CommentService from "./comments.service.js";
import { AppError } from "../../../shared/middleware/error.js";

class CommentsController {
  constructor(private commentService: CommentService) {}

  getAllCommentsByTask: RequestHandler = async (req, res) => {
    const taskId = Number(req.params.taskId);
    const comments = await this.commentService.getAllComments(taskId);
    return res.status(200).json(comments);
  };

  getById: RequestHandler = async (req, res) => {
    const taskId = Number(req.params.taskId);
    const id = Number(req.params.id);
    const comment = await this.commentService.getCommentById(id, taskId);

    if (!comment) {
      throw AppError.NotFound("Comment not found");
    }

    return res.status(200).json(comment);
  };

  create: RequestHandler = async (req, res) => {
    const { content } = req.body;
    const taskId = Number(req.params.taskId);
    const userId = req.user!.id;

    const comment = await this.commentService.createComment(
      taskId,
      userId,
      content,
    );
    return res.status(201).json(comment);
  };

  update: RequestHandler = async (req, res) => {
    const { content } = req.body;
    const taskId = Number(req.params.taskId);
    const id = Number(req.params.id);
    const userId = req.user!.id;

    const comment = await this.commentService.updateComment(
      id,
      taskId,
      userId,
      content,
    );
    return res.status(200).json(comment);
  };

  delete: RequestHandler = async (req, res) => {
    const taskId = Number(req.params.taskId);
    const id = Number(req.params.id);
    const userId = req.user!.id;

    const comment = await this.commentService.deleteComment(id, taskId, userId);
    return res.status(200).json(comment);
  };
}

export default CommentsController;
