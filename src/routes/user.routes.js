
import express from "express";

const userRouter = express.Router();

authRouter.get("/", (req, res) => {
  res.send("Get all users");
});

authRouter.post("/", (req, res) => {
  res.send("Create a new user");
});

export default userRouter;
