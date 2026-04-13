import { api } from "@/lib/api";

const API_URL = "/lists";

const getAllLists = async () => {
  const { data } = await api.get(`${API_URL}/`);
  return data;
};

const getListById = async (listId: string) => {
  const { data } = await api.get(`${API_URL}/${listId}`);
  return data;
};

const createList = async (listName: string) => {
  const { data } = await api.post(API_URL, { title: listName });
  return data;
};

const updateList = async (listId: string, listName: string) => {
  const { data } = await api.patch(`${API_URL}/${listId}`, { title: listName });
  return data;
};

const deleteList = async (listId: string) => {
  const { data } = await api.delete(`${API_URL}/${listId}`);
  return data;
};

export { getAllLists, getListById, createList, updateList, deleteList };
