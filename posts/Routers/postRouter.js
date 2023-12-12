const express = require('express');
const { createPost, getPost, getComments, comment, search, usersWhoLiked } = require('../controllers/postController.js');
const postRouter = express.Router();

// whenever I say, I need the userId in my route, it simply means I want to verify whether the user is logged in or not.
// Routes like createPost, comment or likePost

postRouter
.route('/createPost/:userId')
.post(createPost);

postRouter
.route('/getPost/:postId')
.get(getPost); 

postRouter
.route('/getComments/:postId')
.get(getComments);

postRouter
.route('/comment/:userId/:postId')
.post(comment);

postRouter
.route('/search')
.get(search);

postRouter
.route('/usersWhoLiked/:postId')
.get(usersWhoLiked);

module.exports = postRouter;