import { Request, Response } from "express";
import { User } from "../entity/User";
import { redis } from "../services";

class AuthController {
  public async confirmationEmail(req: Request, res: Response) {
    const key_id = req.params.id;
    const userId = await redis.get(key_id);
    if (userId) {
      await User.update({ id: userId! }, { confirmed: true });
      await redis.del(key_id);
      res.send("ok");
    } else {
      res.send("invalid");
    }
  }
}

export default AuthController;
