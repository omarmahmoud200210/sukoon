import TagRepository from "./tags.repository.js";
class TagService {
    tagRepository;
    constructor(tagRepository) {
        this.tagRepository = tagRepository;
    }
    async getAllTags(userId) {
        return await this.tagRepository.getAllTags(userId);
    }
    async getTagById(id, userId) {
        return await this.tagRepository.getTagById(id, userId);
    }
    async createTag(userId, name) {
        const exists = await this.tagRepository.tagExistsForUser(userId, name);
        if (exists) {
            throw new Error("A tag with this name already exists");
        }
        return await this.tagRepository.createTag(userId, name);
    }
    async updateTag(id, userId, name) {
        const exists = await this.tagRepository.tagExistsForUser(userId, name, id);
        if (exists) {
            throw new Error("A tag with this name already exists");
        }
        return await this.tagRepository.updateTag(id, userId, name);
    }
    async deleteTag(id, userId) {
        return await this.tagRepository.deleteTag(id, userId);
    }
    async addTagToTask(tagId, taskId, userId) {
        return await this.tagRepository.addTagToTask(tagId, taskId, userId);
    }
    async removeTagFromTask(tagId, taskId, userId) {
        return await this.tagRepository.removeTagFromTask(tagId, taskId, userId);
    }
    async getTasksByTag(tagId, userId) {
        return await this.tagRepository.getTasksByTag(tagId, userId);
    }
}
export default TagService;
