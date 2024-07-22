"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TagsController_1 = __importDefault(require("../controllers/TagsController"));
const tagsRoutes = (0, express_1.Router)();
const tagsController = new TagsController_1.default();
tagsRoutes.post("/", tagsController.create);
tagsRoutes.patch("/:id", tagsController.update);
tagsRoutes.delete("/:id", tagsController.delete);
tagsRoutes.get("/", tagsController.index);
exports.default = tagsRoutes;
