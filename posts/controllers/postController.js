const pool = require('../db.js')

module.exports.createPost = async function createPost(req, res){
    try {
        let userId = req.params.userId;
        let {
            picture_url, 
            title, 
            tag
        } = req.body;

        console.log(userId, req.body);
    
        let user = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [userId]
        );

        let isLoggedIn = user.rows[0].is_logged_in;
    
        if(!isLoggedIn){
            return res.status(403).json({
                message: "First login"
            });
        }
    
        let postDetails = await pool.query(
            "INSERT INTO posts (picture_url, title, tag, userId) VALUES ($1, $2, $3, $4) RETURNING *",
            [picture_url, title, tag, userId]
        );
    
        return res.status(200).json({
            message: "Post created successfully",
            postInfo : postDetails.rows[0]
        });
    } catch (error) {
        res.status(403).send(error);
    }
}

module.exports.getPost = async function getPost(req, res){
    try {
        let postId = req.params.postId;
        let postDetails = await pool.query(
            "SELECT * FROM posts WHERE id = $1",
            [postId]
        );
    
        return res.status(200).json({
            message: "Post details are here !!",
            postDetails: postDetails.rows[0]
        });
    } catch (error) {
        return res.status(403).send(error);
    }
}

module.exports.getComments = async function getComments(req, res){
    try {
        let postId = req.params.postId;
    
        let postDetails = await pool.query(
            "SELECT * FROM posts WHERE id = $1",
            [postId]
        );
    
        let comments = postDetails.rows[0].comments;
        // console.log(comments);
        return res.status(200).json({
            message: "Comments for this specific post are here",
            comments : comments
        })
    } catch (error) {
        return res.status(403).send(error);
    }
}

module.exports.comment = async function comment(req, res){
    try {
        let userId = req.params.userId;
        let postId = req.params.postId;
    
        let user = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [userId]
        );
    
        let isLoggedIn = user.rows[0].is_logged_in;
    
        if(!isLoggedIn){
            return res.status(403).json({
                message: "First login"
            });
        }
    
        let {comments} = req.body;
        if(comments)
        {
            let post = await pool.query(
                "SELECT * FROM posts WHERE id = $1",
                [postId]
            );
    
            let commentList = post.rows[0].comments;
    
            console.log(commentList);
            console.log(comment);
            commentList.push(comments);
            
            post = await pool.query(
                "UPDATE posts SET comments = $1 WHERE id = $2 RETURNING *",
                [commentList, postId]
            );
    
            return res.status(200).json({
                message: "Comment added successfully",
                comments: post.rows[0].comments
            });
        }
        else{
            return res.status(403).json({
                message: "Please add a comment"
            })
        }
    } catch (error) {
        res.status(403).send(error);
    }
}

module.exports.search = async function search(req, res){
    try {
        console.log("hello");
        let {searchString} = req.body;
    
        let query = "SELECT * FROM posts WHERE title ILIKE $1 OR tag ILIKE $1 LIMIT 10";
    
        let searchResults = await pool.query(query, [`%${searchString}%`]);
        console.log(searchResults);
        return res.status(200).json({
            message: "Search Results are :",
            searchResults: searchResults.rows
        });
    } catch (error) {
        return res.status(403).send(error);
    }
}

module.exports.usersWhoLiked = async function usersWhoLiked(req, res){
    try {
        let postId = req.params.postId;
    
        let post = await pool.query(
            "SELECT * FROM posts WHERE id = $1",
            [postId]
        );
    
        return res.status(200).json({
            message: "Users who liked this post",
            usersWhoLiked: post.rows[0].userswholiked
        })
    } catch (error) {
        return res.status(403).send(error);
    }
}