import express from "express";

// Tambahkan .js extension
import { membershipController } from "../controller/membership.controller.js";
import { authUser } from "../middlewares/auth.js";
import uploadFile from "../middlewares/upload.js";

const membershipRouter = express.Router();

membershipRouter.post("/register", membershipController.register);
membershipRouter.post("/login", membershipController.login);
membershipRouter.get("/profile", authUser, membershipController.getProfile);
membershipRouter.put("/profile/update", authUser, membershipController.updateProfile);
membershipRouter.put("/profile/image", authUser, uploadFile, membershipController.uploadProfileImage);

export { membershipRouter };
