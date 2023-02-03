import express from "express";
import { getAllUsers, signUp, login, updateUser,deleteUser, getBookingsOfUser, getUserById } from '../controllers/user-controller';

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id",getUserById);
userRouter.post("/signUp", signUp );
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", login);
userRouter.get("/bookings/:id", getBookingsOfUser);

export default userRouter;
