
const mongoose = require('mongoose');


const cycleUserSchema = new mongoose.Schema({
    id: {
        type: String,
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
});

module.exports =  mongoose.model('CycleUser', cycleUserSchema);