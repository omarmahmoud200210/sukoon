import { api } from "@/lib/api";

const API_URL = "/tags";

const getAllTags = async () => {
  const { data } = await api.get(`${API_URL}/`);
  return data;
};

const getTagById = async (tagId: string) => {
  const { data } = await api.get(`${API_URL}/${tagId}`);
  return data;
};

const createTag = async (tagName: string) => {
  const { data } = await api.post(`${API_URL}/`, { name: tagName });
  return data;
};

const updateTag = async (tagId: string, name: string) => {
  const { data } = await api.patch(`${API_URL}/${tagId}`, { name });
  return data;
};

const deleteTag = async (tagId: string) => {
  const { data } = await api.delete(`${API_URL}/${tagId}`);
  return data;
};

export { getAllTags, createTag, updateTag, deleteTag, getTagById };
