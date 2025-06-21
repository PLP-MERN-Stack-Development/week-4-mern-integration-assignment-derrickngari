const express = require("express");
const router = express.Router();
const { 
    createPost, 
    getAllPosts, 
    getPostsById, 
    updatePost, 
    deletePost,
    addComment, 
    updateComment, 
    deleteComment,
    toggleLike,
    getComments,
    getCommentById
 } = require('../controllers/postsControllers')
const { authMiddleware } = require('../middlewares/authMiddlewares')
const upload = require('../middlewares/uploadMiddleware')

router.post("/posts", authMiddleware, upload.single("featuredImage"), createPost);
router.get('/posts', getAllPosts)
router.get("/posts/:id", authMiddleware, getPostsById);
router.put('/posts/:id', authMiddleware, updatePost);
router.delete("/posts/:id", authMiddleware, deletePost);
router.post('/posts/:id/comments', authMiddleware, addComment);
router.put('/posts/:id/comments/:commentId', authMiddleware, updateComment);
router.delete('/posts/:id/comments/:commentId', authMiddleware, deleteComment);
router.post("/posts/:id/likes", authMiddleware, toggleLike);
router.get('/posts/:id/comments', getComments);
router.get('/posts/:id/comments/:commentId', getCommentById);

module.exports = router;