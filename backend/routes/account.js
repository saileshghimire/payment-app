const express = require("express");
const { authMiddleware } = require("../middleware/middleware");
const { Account } = require("../database/database");
const { mongoose } = require("mongoose");
const router  = express.Router();

router.get("/balance", authMiddleware, async (req,res) => {
    const account = await Account.findOne({
        userId: req.userId
    });
    res.status(200).json({
        balance: account.balance
    });
});

router.post("/transfer", authMiddleware, async (req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
    const { amount, to } = req.body;
    const account = await Account.findOne({
        userId: req.userId
    }).session(session);

    if(!account || account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Insuficient balance"
        });
    }

    const toaccount = await Account.findOne({
        userId: to
    }).session(session);

    if(!toaccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Invalid account"
        });
    }

    await Account.updateOne({userId:req.userId},{
        $inc:{
            balance: -amount
        }
    }).session(session);

    await Account.updateOne({userId: to},{
        $inc:{
            balance: amount
        }
    }).session(session);
    
    await session.commitTransaction();
    session.endSession();

    res.json({
        message: "Transfer successful"
    });
    } catch(error){
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            message:"Transfer failed",
            error: error.message
        })
    }
});


module.exports = router;
