const express = require('express');
const userRouter = express.Router();
const {registerUser, loginUser} = require('../controllers/authController.js');
const { protectRoute } = require('../controllers/verifyToken.js');
const { getUserHistory, postUserHistory, likedPosts, addOrRemoveLikedPosts, userProfile, updateProfile } = require('../controllers/userController.js');

userRouter
.route('/register')
.post(registerUser);

userRouter
.route('/login')
.post(loginUser);

userRouter.use(protectRoute);
userRouter
.route('/userProfile')
.get(userProfile)

userRouter
.route('/updateProfile')
.patch(updateProfile)

userRouter
.route('/userHistory')
.get(getUserHistory)

userRouter
.route('/userHistory/:postId')
.post(postUserHistory)

userRouter
.route('/likedPosts')
.get(likedPosts)

userRouter
.route('/likedPosts/:postId')
.post(addOrRemoveLikedPosts)

module.exports = userRouter;
