export type CreateTafreeghType = {
  content: string;
  userId: string;
};

export type UpdateTafreeghType = {
  id: string;
  content: string;
};

export type DeleteTafreeghType = {
  id: string;
};

export type TafreeghItem = {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
};