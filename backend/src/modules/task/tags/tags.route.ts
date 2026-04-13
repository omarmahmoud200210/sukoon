import express from "express";
import TagsController from "./tags.controller.js";
import TagRepository from "./tags.repository.js";
import TagService from "./tags.service.js";
import tryCatch from "../../../shared/utils/tryCatch.utils.js";
import validation from "../../../shared/middleware/validation.js";
import { createTagSchema, updateTagSchema } from "./tags.schema.js";

const tagsRouter = express.Router();

const tagRepository = new TagRepository();
const tagService = new TagService(tagRepository);
const tagsController = new TagsController(tagService);

tagsRouter.get("/", tryCatch(tagsController.getAll));
tagsRouter.get("/:id", tryCatch(tagsController.getById));
tagsRouter.post(
  "/",
  validation(createTagSchema),
  tryCatch(tagsController.create),
);
tagsRouter.patch(
  "/:id",
  validation(updateTagSchema),
  tryCatch(tagsController.update),
);
tagsRouter.delete("/:id", tryCatch(tagsController.delete));

tagsRouter.post("/:id/tasks/:taskId", tryCatch(tagsController.addToTask));
tagsRouter.delete(
  "/:id/tasks/:taskId",
  tryCatch(tagsController.removeFromTask),
);
tagsRouter.get("/:id/tasks", tryCatch(tagsController.getTasksByTag));

export default tagsRouter;
