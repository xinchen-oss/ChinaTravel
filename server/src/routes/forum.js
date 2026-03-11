import { Router } from "express";
import { createPost, getPosts, getPost, deletePost, createReply } from "../controllers/forumController.js";
import { authorize, protect } from "../middleware/auth.js";
import { ROLES } from "../utils/constants.js";


const router = Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", protect, authorize(ROLES.ADMIN, ROLES.USER), createPost);

router.post("/:postId/reply", protect, authorize(ROLES.ADMIN, ROLES.USER), createReply);
router.delete("/:id", protect, authorize(ROLES.ADMIN, ROLES.USER), deletePost);

export default router;
