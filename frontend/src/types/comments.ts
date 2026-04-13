export type Comment = {
  id: number;
  taskId: number;
  userId: number;
  content: string;
  user?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
};

export type CreateComment = {
  taskId: number;
  content: string;
};

export type UpdateComment = {
  content: string;
  taskId: number;
};
