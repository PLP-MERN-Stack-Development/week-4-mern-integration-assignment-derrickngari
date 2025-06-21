const Post = require('../models/postModel')
const sanitizeHtml = require('sanitize-html')

exports.createPost = async (req, res) => {
    try {
        const { title, content, excerpt, category, featuredImage } = req.body;
        console.log("BODY:", req.body);

        if (!title || !content || !category) return res.status(400).json({ message: "All fields are required" })

        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
            allowedAttributes: {
                a: ["href", "name", "target"],
                img: ["src", "alt"],
                "*": ["style"], 
            },
            });

        const newPost = new Post({
          title,
          content: sanitizedContent,
          excerpt,
          author: req.user.id,
          category,
          featuredImage: req.file?.filename,
          isPublished: true,
        });
        await newPost.save()

        res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('author', 'name')
            .populate('category', 'name')    
            .populate('comments.user', 'name');

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ message: error.message }); 
    }
};

exports.getPostsById = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
            .populate('author', 'name')
            .populate('category', 'name')
            .populate('comments.user', 'name');

        if (!post) return res.status(401).json({ message: "Post not found" })
        
        // If the user is logged in, track their id
    if (req.user && !post.viewCount.includes(req.user.id)) {
        post.viewCount.push(req.user.id);
    }
    await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) return res.status(404).json({ message: "Post not found" })
        if (post.author.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized" })
        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updatedPost);
    } 
        catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) return res.status(404).json({ message: "Post not found" })
        if (post.author.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized" })
        await post.deleteOne()
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// addComment, 
exports.addComment = async (req, res) => {
    try {
      const { id } = req.params;
      let { content } = req.body;
  
      if (!content) return res.status(400).json({ message: "Comment cannot be empty" });
  
      // sanitize
      content = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });
  
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      post.comments.push({ user: req.user.id, content });
      await post.save();
  
      await post.populate('comments.user', 'name');
  
      res.status(201).json(post.comments); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
//     updateComment,
exports.updateComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const { content } = req.body;

        const sanitizedComment = sanitizeHtml(content, {
            allowedTags: [],
            allowedAttributes: {},
          });
          
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        const comment = post.comments.find((comment) => comment._id.toString() === commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        comment.content = sanitizedComment;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
 
//     deleteComment,
exports.deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" })
            const comment = post.comments.find((comment) => comment._id.toString() === commentId);
            if (!comment) return res.status(404).json({ message: "Comment not found" })
            post.comments.remove(comment)
            await post.save()
            res.status(200).json(post)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
//     addLike,
exports.toggleLike = async (req, res) => {
    try {
      const { id } = req.params;
  
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      const userId = req.user.id;
  
      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(u => u.toString() !== userId.toString());
      } else {
        post.likes.push(userId);
      }
  
      await post.save();
  
      // Optional: Populate post author and comments
      const updatedPost = await Post.findById(id)
        .populate('author', 'name')
        .populate('comments.user', 'name');
  
      res.json({
        likesCount: updatedPost.likes.length,
        post: updatedPost,
      }); 
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
//     getComments,
exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(post.comments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
//     getCommentById
exports.getCommentById = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        const comment = post.comments.find((comment) => comment._id.toString() === commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        res.status(200).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}