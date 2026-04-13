import { api } from "@/lib/api";
import type {
  CreateTafreeghType,
  UpdateTafreeghType,
  DeleteTafreeghType,
} from "@/types/tafreegh";

const getAllTafreeghs = async () => {
  const { data } = await api.get("/tafreegh");
  return data;
};

const createTafreegh = async (tafreegh: CreateTafreeghType) => {
  const { data } = await api.post("/tafreegh", tafreegh);
  return data;
};

const updateTafreegh = async (tafreegh: UpdateTafreeghType) => {
  const { data } = await api.patch(`/tafreegh/${tafreegh.id}`, tafreegh);
  return data;
};

const deleteTafreegh = async (tafreegh: DeleteTafreeghType) => {
  const { data } = await api.delete(`/tafreegh/${tafreegh.id}`);
  return data;
};

const deleteAllTafreegh = async () => {
  const { data } = await api.delete("/tafreegh");
  return data;
};

export {
  getAllTafreeghs,
  createTafreegh,
  updateTafreegh,
  deleteTafreegh,
  deleteAllTafreegh,
};
