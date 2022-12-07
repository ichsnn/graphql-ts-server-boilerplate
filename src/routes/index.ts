import { Router } from "express";
import { authRoutes } from "./AuthRoutes";

const routes = Router();

routes.use(authRoutes);

export default routes;
