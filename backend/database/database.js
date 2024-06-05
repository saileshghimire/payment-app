const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://sailesh:1234@cluster0.vm8tuzu.mongodb.net/payment_app');

// Define Schema 

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    firstName:{
        type :String,
        required: true,
        trim: true
    },
    lastName :{
        type: String,
        required: true,
        trim:true
    },
    password:{
        type: String,
        required: true,
        minLength:6
    },
    createdDate :{
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedDate :{
        type:Date,
        default: Date.now,
    }
});

// creting a model from userschema
const User = mongoose.model('User', UserSchema);

// account for balancing
const accountSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    balance:{
        type: Number,
        required:true,
        default:0
    }
})

const Account = mongoose.model('Account',accountSchema);

module.exports = {
    User,
    Account,
};


