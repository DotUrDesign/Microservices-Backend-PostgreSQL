const pool = require("../db.js");
const bcrypt = require('bcrypt'); 
const dotenv = require('dotenv');
dotenv.config();
const JWT_KEY = process.env.JWT_KEY;
const jwt = require('jsonwebtoken');

module.exports.registerUser = async function registerUser(req, res) {
    try {
        let {
            email,
            password,
            profilePhoto,
            role,
            userhistory,
            likedposts
        } = req.body;

        if(password.length < 5 || password > 50){   
            return res.json({
                message: "Password length should be between 5 and 50 characters. Now enter a new password."
            });
        }
        
        let salt = await bcrypt.genSalt();
        let hashedString = await bcrypt.hash(password, salt);
        password = hashedString;
    
        let user = await pool.query(
            "INSERT INTO users (email, password, profilePhoto, role, userhistory, likedposts) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [email, password, profilePhoto, role, userhistory, likedposts]
        );
    
        if(user)
        {
            // console.log(user);
            return res.json({
                message: "Registration successful",
                userInfo : user.rows[0]
            })
        }
        else{
            return res.json({
                message : "fill all the required credentials"
            })
        }
    } catch (error) {
        return res.status(403).send(error);
    }
}

function generateAccessToken(user) {
    return jwt.sign(user, JWT_KEY, {expiresIn : '55m'});
}

function generateRefreshToken(user){
    return jwt.sign(user, JWT_KEY);
}

module.exports.loginUser = async function loginUser(req, res){
    let {
        email,
        password
    } = req.body;

    let user = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    // console.log(user.rows[0]);
    let userInfo = user.rows[0];
    // console.log(userInfo.password);
    if(userInfo)
    {
        let check = bcrypt.compare(password, userInfo.password);
        if(check)
        {
            // token creation
            let accessToken = generateAccessToken({id : userInfo.id, email : userInfo.email});
            let refreshToken = generateRefreshToken({id : userInfo.id, email: userInfo.email});

            res.cookie('refreshToken', refreshToken, {httpOnly : true}); 

            // is_logged_in = true;
            await pool.query(
                "UPDATE users SET is_logged_in = $1 WHERE id = $2",
                [true, userInfo.id]
            );

            return res.json({
                message: "User logged in successfully",
                userInfo : userInfo,
                accessToken: accessToken
            })
        }   
        else{
            return res.json({
                message: "Wrong password"
            })
        }
    }
    else{
        return res.json({
            message: "First register"
        })
    }
}
