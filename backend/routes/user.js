const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { Account, User } = require("../database/database");
const { JWT_SECRET } = require("../config");
const { JsonWebTokenError } = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/middleware");


const signupBody = zod.object({
    username:zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});


router.post("/signup", async (req,res) => {
    const parseResult = signupBody.safeParse(req.body);
    if (!parseResult.success){
        return res.status(411).json({
            message: "Incorrect inputs",
            errors: parseResult.error.errors // Providing detailed error information
        });
    }

    const existingUser = await User.findOne({
        username:req.body.username
    });

    if (existingUser){
        return res.status(411).json({
            message: "Email already taken" 
        });
    }
    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    });

    const userId = user._id;

    await Account.create({
        userId: userId,
        balance: 1+ Math.random() *10000
    })

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
    const { success } = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect username/password"
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if(user){
        const token = jwt.sign({
            userID : user._id
        },JWT_SECRET);
        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        messages:"Error while logging in"
    });

})

// updating user infromation

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message:"Error while updating information"
        });
    }
    
    await User.updateOne({_id: req.userId},req.body);

    res.json({
        message: "Updated successfully"
    });
});

// search information

router.get("/bulk", async (req,res) =>{
    const filter = req.query.filter || "";
    
    const users = await User.find({
        $or:[{
            firstName:{
                "$regex": filter
            }
        },{
                lastname:{
                    "$regex": filter
                }
            }
        ]
        });

        res.json({
            user:users.map(user =>({
                username: user.username,
                firstName: user.firstName,
                lastName:user.lastName,
                _id: user._id
            }))
        });
});

module.exports= router ;