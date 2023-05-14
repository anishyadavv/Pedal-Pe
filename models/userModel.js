const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    is_verified: {
        type:Number,
        default:0
    },
    token: {
        type:String,
        default:''
    },
    balance: {
        type:Number,
        default:0
    },
    cycleid: {
        type: String,
    },
    starthour: {
        type: Number,
        default:0
    },
    startminutes: {
        type: Number,
        default:0
    },
    startseconds: {
        type: Number,
        default:0
    },
    endhour: {
        type: Number,
        default:0
    },
    endminutes: {
        type: Number,
        default:0
    },
    endseconds: {
        type: Number,
        default:0
    },
    status: {
        type: Number,
        default:0
    },
    lastride:{
        type:Number,
        default:0
    },
    paymentId:{
        type:String,
        default:''
    }
});




module.exports =  mongoose.model('User', userSchema);
