import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/user.controller.js";
import { authenticationMiddleware } from "../middleware/authentication.middleware.js";
import { authorize } from "../middleware/authorization.middleware.js";
import { ROLES } from "../constants/roles.js";

const userRouter = express.Router();

// GET /api/users - Get all users (Admin only)
userRouter.get(
  "/",
  authenticationMiddleware,
  authorize(ROLES.ADMIN),
  getAllUsers
);

// GET /api/users/:id - Get user by ID (Admin only)
userRouter.get(
  "/:id",
  authenticationMiddleware,
  authorize(ROLES.ADMIN),
  getUserById
);

// POST /api/users - Create a new user (Admin only)
userRouter.post(
  "/",
  authenticationMiddleware,
  authorize(ROLES.ADMIN),
  createUser
);

export default userRouter;
