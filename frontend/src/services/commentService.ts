import { api } from "@/lib/api";
import type { Comment, CreateComment, UpdateComment } from "@/types/comments";

const getCommentsByTaskId = async (taskId: string): Promise<Comment[]> => {
  const { data } = await api.get(`/tasks/${taskId}/comments`);
  return data;
};

const createComment = async (commentData: CreateComment): Promise<Comment> => {
  const { data } = await api.post(`/tasks/${commentData.taskId}/comments`, commentData);
  return data;
};

const updateComment = async (id: string, commentData: UpdateComment): Promise<Comment> => {
  const { data } = await api.patch(`/tasks/${commentData.taskId}/comments/${id}`, commentData);
  return data;
};

const deleteComment = async (taskId: string, id: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}/comments/${id}`);
};

export {
  getCommentsByTaskId,
  createComment,
  updateComment,
  deleteComment,
};