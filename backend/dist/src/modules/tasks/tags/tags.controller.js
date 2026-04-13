import TagService from "./tags.service.js";
class TagsController {
    tagService;
    constructor(tagService) {
        this.tagService = tagService;
    }
    getAll = async (req, res) => {
        const userId = Number(req.user.id);
        const tags = await this.tagService.getAllTags(userId);
        return res.status(200).json(tags);
    };
    getById = async (req, res) => {
        const userId = Number(req.user.id);
        const id = Number(req.params.id);
        const tag = await this.tagService.getTagById(id, userId);
        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }
        return res.status(200).json(tag);
    };
    create = async (req, res) => {
        const { name } = req.body;
        const userId = Number(req.user.id);
        const tag = await this.tagService.createTag(userId, name);
        return res.status(201).json(tag);
    };
    update = async (req, res) => {
        const { name } = req.body;
        const userId = Number(req.user.id);
        const id = Number(req.params.id);
        const tag = await this.tagService.updateTag(id, userId, name);
        return res.status(200).json(tag);
    };
    delete = async (req, res) => {
        const userId = Number(req.user.id);
        const id = Number(req.params.id);
        const tag = await this.tagService.deleteTag(id, userId);
        return res.status(200).json(tag);
    };
    addToTask = async (req, res) => {
        const userId = Number(req.user.id);
        const tagId = Number(req.params.id);
        const taskId = Number(req.params.taskId);
        await this.tagService.addTagToTask(tagId, taskId, userId);
        return res.status(200).json({ message: "Tag added to task successfully" });
    };
    removeFromTask = async (req, res) => {
        const userId = Number(req.user.id);
        const tagId = Number(req.params.id);
        const taskId = Number(req.params.taskId);
        await this.tagService.removeTagFromTask(tagId, taskId, userId);
        return res
            .status(200)
            .json({ message: "Tag removed from task successfully" });
    };
    getTasksByTag = async (req, res) => {
        const userId = Number(req.user.id);
        const tagId = Number(req.params.id);
        const tasks = await this.tagService.getTasksByTag(tagId, userId);
        return res.status(200).json(tasks);
    };
}
export default TagsController;
