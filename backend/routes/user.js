const express = require("express");
const router = express.Router();
const zod = require("zod");
import { User } from "../database/database";
import { JWT_SECRET } from "../config";
import { JsonWebTokenError } from "jsonwebtoken";
const jwt = require("jsonwebtoken");

const signupBody = Zod.object({
    username:zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});


router.post("/signup", async (req,res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }

    const existingUser = await User.findOne({
        username:req.body.username
    });

    if (!existingUser){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs" 
        });
    }
    const user = User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    });

    const userId = user._id;
    const token = jwt.sign({
        userId
    },JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
        token: token
    });

});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/signin", async (req,res) => {
    const { success } = signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message:"Incorrect username/password"
        });
    }

    const user = await User.findOne({
        username: req.body.username
    });

    if(user){
        const token = jwt.sign({
            userID : user._id
        },JWT_SECRET);
        return;
    }

    res.status(411).json({
        messages:"Error while logging in"
    });

})



module.exports= router ;