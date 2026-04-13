import CommentService from "./comments.service.js";
class CommentsController {
    commentService;
    constructor(commentService) {
        this.commentService = commentService;
    }
    getAll = async (req, res) => {
        const taskId = Number(req.params.taskId);
        const comments = await this.commentService.getAllComments(taskId);
        return res.status(200).json(comments);
    };
    getById = async (req, res) => {
        const taskId = Number(req.params.taskId);
        const id = Number(req.params.id);
        const comment = await this.commentService.getCommentById(id, taskId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json(comment);
    };
    create = async (req, res) => {
        const { content } = req.body;
        const taskId = Number(req.params.taskId);
        const userId = Number(req.user.id);
        const comment = await this.commentService.createComment(taskId, userId, content);
        return res.status(201).json(comment);
    };
    update = async (req, res) => {
        const { content } = req.body;
        const taskId = Number(req.params.taskId);
        const id = Number(req.params.id);
        const userId = Number(req.user.id);
        const comment = await this.commentService.updateComment(id, taskId, userId, content);
        return res.status(200).json(comment);
    };
    delete = async (req, res) => {
        const taskId = Number(req.params.taskId);
        const id = Number(req.params.id);
        const userId = Number(req.user.id);
        const comment = await this.commentService.deleteComment(id, taskId, userId);
        return res.status(200).json(comment);
    };
}
export default CommentsController;
