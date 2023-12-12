const pool = require('../db.js');

module.exports.userProfile = async function userProfile(req, res){
    try {
        let userId = req.user.id;
        let user = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [userId]
        );
    
        return res.status(200).json({
            message: "User profile",
            userInfo: user.rows[0]
        });
    } catch (error) {
        return res.status(403).send(error);
    }
}

module.exports.updateProfile = async function updateProfile(req, res){
    try {
        let userId = req.user.id;
        let dataToBeUpdated = req.body;
        if(dataToBeUpdated)
        {
            let updateClauses = [];
            let values = [];
            for(let key in dataToBeUpdated)
            {
                if(["email", "password", "profilephoto", "role"].includes(key))
                {
                    updateClauses.push(`${key} = $${updateClauses.length + 1}`);
                    values.push(dataToBeUpdated[key]);
                }
            }
            values.push(userId);
    
            if(updateClauses.length > 0)
            {
                // console.log(updateClauses);
                // console.log(values);
                
                let updateQuery = `UPDATE users SET ${updateClauses.join(", ")} WHERE id = $${updateClauses.length+1}`;
                // console.log(updateQuery);
                await pool.query(updateQuery, values);
                let userInfo = await pool.query(
                    "SELECT * FROM users WHERE id = $1",
                    [userId]
                );
        
                return res.status(200).json({
                    message: "User data has been updated",
                    userInfo : userInfo
                });
            }
            else {
                return res.status(403).json({
                    message: "Please give valid fields to update"
                })
            }
        }
        else{
            return res.status(403).json({
                message: "Please enter the data to be updated."
            })
        }
    } catch (error) {
        return res.status(404).send(error);
    }
}

module.exports.getUserHistory = async function getUserHistory(req, res) {
    try {
        // console.log(req.user);
        let id = req.user.id;
    
        let user = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
    
        // console.log(user.rows[0]);
        return res.status(200).json({
            message: `Here are the 10 last viewed posts of the user with userId = ${id}`,
            userHistory : user.rows[0].userhistory
        })
    } catch (error) {
        return res.status(404).send(error);
    }
}

module.exports.postUserHistory = async function postUserHistory(req, res){
    try {
        let postId = req.params.postId;
        let userId = req.user.id;
    
        let user = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [userId]
        );
            // console.log(user);
        console.log(user.rows[0].userhistory);
    
        let history = user.rows[0].userhistory;
        let removedHistory;
        if(history.length >= 10)
            removedHistory = history.shift();
        // console.log(history);
        history.push(parseInt(postId));
    
        user = await pool.query(
            "UPDATE users SET userhistory = $1 WHERE id = $2 RETURNING *",
            [history, userId]
        )
    
        return res.status(200).json({
            message: "User history updated",
            userhistory: user.rows[0].userhistory
        })
    } catch (error) {
        return res.status(403).send(error);
    }
}

module.exports.likedPosts = async function likedPosts(req, res){
    try {
        let userId = req.user.id;
        let user = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [userId]
        );
    
        return res.status(200).json({
            message: "Liked posts are :",
            likedPosts : user.rows[0].likedposts
        })
    } catch (error) {
        return res.status(403).send(error);
    }
}

module.exports.addOrRemoveLikedPosts = async function addOrRemoveLikedPosts(req, res){
    try {
        let userId = req.user.id;
        let postId = req.params.postId;
    
        let user = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [userId]
        );

        let post = await pool.query(
            "SELECT * FROM posts WHERE id = $1",
            [postId]
        );

        // console.log(post);
    
        let userLikedList = user.rows[0].likedposts;
        let userWhoLikedList = post.rows[0].userswholiked;
        let flag = true;
        if(userLikedList.includes(parseInt(postId)))
            flag = false;
        console.log(userLikedList);
        console.log("Break");
        console.log(userWhoLikedList, flag);
        if(flag){
            userLikedList.push(parseInt(postId));
            userWhoLikedList.push(parseInt(userId));
        }
        else{
            userLikedList = userLikedList.filter(item => item !== parseInt(postId));
            userWhoLikedList = userWhoLikedList.filter(item => item !== parseInt(userId));
        }
        console.log(userWhoLikedList);
        user = await pool.query(
            "UPDATE users SET likedposts = $1 WHERE id = $2",
            [userLikedList, userId]
        );
        post = await pool.query(
            "UPDATE posts SET usersWhoLiked = $1 WHERE id = $2",
            [userWhoLikedList, postId]
        );
        return res.status(200).json({
            message: "Liked Posts section of this user updated successfully",
            userLikedPosts : userLikedList
        })
    } catch (error) {
        return res.status(403).send(error);
    }
}