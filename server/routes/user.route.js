import { Router } from "express";
import {
  loginController,
  signUpController,
  verifyEmailController,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/sign-up", signUpController);

userRouter.post("/verify-email", verifyEmailController);

userRouter.post("/login", loginController);

export default userRouter;
