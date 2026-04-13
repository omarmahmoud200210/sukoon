import CommentRepository from "./comments.repository.js";
class CommentService {
    commentRepository;
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    getAllComments(taskId) {
        return this.commentRepository.getAllComments(taskId);
    }
    getCommentById(id, taskId) {
        return this.commentRepository.getCommentById(id, taskId);
    }
    createComment(taskId, userId, content) {
        return this.commentRepository.createComment(taskId, userId, content);
    }
    updateComment(id, taskId, userId, content) {
        return this.commentRepository.updateComment(id, taskId, userId, content);
    }
    deleteComment(id, taskId, userId) {
        return this.commentRepository.deleteComment(id, taskId, userId);
    }
}
export default CommentService;
