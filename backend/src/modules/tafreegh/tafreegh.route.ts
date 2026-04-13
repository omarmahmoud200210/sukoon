import express from "express";
import TafreeghController from "./tafreegh.controller.js";
import TafreeghRepository from "./tafreegh.repository.js";
import TafreeghService from "./tafreegh.service.js";
import tryCatch from "../../shared/utils/tryCatch.utils.js";
import validation from "../../shared/middleware/validation.js";
import { createTafreeghSchema, updateTafreeghSchema } from "./tafreegh.schema.js";

const tafreeghRouter = express.Router();

const tafreeghRepository = new TafreeghRepository();
const tafreeghService = new TafreeghService(tafreeghRepository);
const tafreeghController = new TafreeghController(tafreeghService);

tafreeghRouter.get("/", tryCatch(tafreeghController.getAll));
tafreeghRouter.get("/:id", tryCatch(tafreeghController.getById));
tafreeghRouter.post(
  "/",
  validation(createTafreeghSchema),
  tryCatch(tafreeghController.create),
);
tafreeghRouter.patch(
  "/:id",
  validation(updateTafreeghSchema),
  tryCatch(tafreeghController.update),
);
tafreeghRouter.delete("/:id", tryCatch(tafreeghController.delete));
tafreeghRouter.delete("/", tryCatch(tafreeghController.deleteAll));

export default tafreeghRouter;
