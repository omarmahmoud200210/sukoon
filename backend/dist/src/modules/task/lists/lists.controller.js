import ListService from "./lists.service.js";
import { AppError } from "../../../shared/middleware/error.js";
class ListsController {
    listService;
    constructor(listService) {
        this.listService = listService;
    }
    getAll = async (req, res) => {
        const userId = req.user.id;
        const lists = await this.listService.getAllLists(userId);
        return res.status(200).json(lists);
    };
    getById = async (req, res) => {
        const userId = req.user.id;
        const id = Number(req.params.id);
        const list = await this.listService.getListById(id, userId);
        if (!list) {
            throw AppError.NotFound("List not found");
        }
        return res.status(200).json(list);
    };
    create = async (req, res) => {
        const { title, color } = req.body;
        const userId = req.user.id;
        const list = await this.listService.createList(userId, title, color || "#000000");
        return res.status(201).json(list);
    };
    update = async (req, res) => {
        const { title, color } = req.body;
        const userId = req.user.id;
        const id = Number(req.params.id);
        const list = await this.listService.updateList(id, userId, title, color);
        return res.status(200).json(list);
    };
    delete = async (req, res) => {
        const userId = req.user.id;
        const id = Number(req.params.id);
        const list = await this.listService.deleteList(id, userId);
        return res.status(200).json(list);
    };
}
export default ListsController;
