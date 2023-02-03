import express from "express";
import { addAdmin, adminLogin, getAdmins, getAdminById} from "../controllers/admin-controller";

const  adminRouter = express.Router();

adminRouter.post("/signup", addAdmin);
adminRouter.post("/Login", adminLogin);
adminRouter.get("/", getAdmins);
adminRouter.get("/:id", getAdminById);

export default adminRouter;