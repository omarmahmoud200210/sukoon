import CommentRepository from "./comments.repository.js";
class CommentService {
    commentRepository;
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async getAllComments(taskId) {
        return await this.commentRepository.getCommentsByTask(taskId);
    }
    async getCommentById(id, taskId) {
        return await this.commentRepository.getCommentById(id, taskId);
    }
    async createComment(taskId, userId, content) {
        return await this.commentRepository.createComment(taskId, userId, content);
    }
    async updateComment(id, taskId, userId, content) {
        return await this.commentRepository.updateComment(id, taskId, userId, content);
    }
    async deleteComment(id, taskId, userId) {
        return await this.commentRepository.deleteComment(id, taskId, userId);
    }
}
export default CommentService;
