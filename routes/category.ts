import { Router } from "express";
import * as CategoryController from "../controller/categoryController";

export const categoryRoute = Router()

categoryRoute.post("/", CategoryController.getCategories)
