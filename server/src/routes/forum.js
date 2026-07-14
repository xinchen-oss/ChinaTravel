import { Router } from "express";
import { createPost, getPosts, getPost, deletePost, createReply, getModerationPosts, moderatePost } from "../controllers/forumController.js";
import { authorize, protect, protectOptional } from "../middleware/auth.js";
import { ROLES } from "../utils/constants.js";


const router = Router();

router.get("/", getPosts);
router.get("/admin/moderacion", protect, authorize(ROLES.ADMIN), getModerationPosts);
router.put("/:id/moderate", protect, authorize(ROLES.ADMIN), moderatePost);
router.get("/:id", protectOptional, getPost);
router.post("/", protect, authorize(ROLES.ADMIN, ROLES.USER), createPost);

router.post("/:postId/reply", protect, authorize(ROLES.ADMIN, ROLES.USER), createReply);
router.delete("/:id", protect, authorize(ROLES.ADMIN, ROLES.USER), deletePost);

// routes/forum.js
router.patch('/moderation/:id', protect, authorize(ROLES.ADMIN), moderatePost);

export default router;
