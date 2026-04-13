import CommentRepository from "./comments.repository.js";

class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async getAllComments(taskId: number) {
    return await this.commentRepository.getCommentsByTask(taskId);
  }

  async getCommentById(id: number, taskId: number) {
    return await this.commentRepository.getCommentById(id, taskId);
  }

  async createComment(taskId: number, userId: number, content: string) {
    return await this.commentRepository.createComment(taskId, userId, content);
  }

  async updateComment(id: number, taskId: number, userId: number, content: string) {
    return await this.commentRepository.updateComment(id, taskId, userId, content);
  }

  async deleteComment(id: number, taskId: number, userId: number) {
    return await this.commentRepository.deleteComment(id, taskId, userId);
  }
}

export default CommentService;
