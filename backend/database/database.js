const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://sailesh:1234@cluster0.vm8tuzu.mongodb.net/payment_database');

// Define Schema 

const UserSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
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
        default: Date
    }
});

// creting a model from userschema
const User = mongoose.model('User', UserSchema);

module.exports = {
    User
}


