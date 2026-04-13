import TagRepository from "./tags.repository.js";

class TagService {
  constructor(private tagRepository: TagRepository) {}

  async getAllTags(userId: number) {
    return await this.tagRepository.getAllTags(userId);
  }

  async getTagById(id: number, userId: number) {
    return await this.tagRepository.getTagById(id, userId);
  }

  async createTag(userId: number, name: string) {
    const exists = await this.tagRepository.tagExistsForUser(userId, name);

    if (exists) {
      throw new Error("A tag with this name already exists");
    }

    return await this.tagRepository.createTag(userId, name);
  }

  async updateTag(id: number, userId: number, name: string) {
    const exists = await this.tagRepository.tagExistsForUser(userId, name, id);
    
    if (exists) {
      throw new Error("A tag with this name already exists");
    }

    return await this.tagRepository.updateTag(id, userId, name);
  }

  async deleteTag(id: number, userId: number) {
    return await this.tagRepository.deleteTag(id, userId);
  }

  async addTagToTask(tagId: number, taskId: number, userId: number) {
    return await this.tagRepository.addTagToTask(tagId, taskId, userId);
  }

  async removeTagFromTask(tagId: number, taskId: number, userId: number) {
    return await this.tagRepository.removeTagFromTask(tagId, taskId, userId);
  }

  async getTasksByTag(tagId: number, userId: number) {
    return await this.tagRepository.getTasksByTag(tagId, userId);
  }
}

export default TagService;
