import { Router } from "express";
import AuthController from "../controllers/authController";

class AuthRoutes extends AuthController {
  public router: Router = Router();

  constructor() {
    super();
    this.router.use("/auth/", this.confirmationRoutes());
  }

  public confirmationRoutes() {
    const routes = Router();
    routes.get("/confirmation/:id", this.confirmationEmail);
    return routes;
  }

  public getRouter() {
    return this.router;
  }
}
export default AuthRoutes;

export const authRoutes = new AuthRoutes().getRouter();
