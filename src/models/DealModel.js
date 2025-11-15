const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const DEAL_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected"
}

const dealSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        trim:true,
        minlength: 3,
        maxlength: 150,
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:350,
    },
    price:{
        type:Number,
        required:true,
    },
    originalPrice:{
        type:Number,
        required:true,
    },
    url:{
        type:String,
        trim:true,
    },
    category:{
        type:String,
        trim:true,
        required:true,
    },
    status:{
        type: String,
        enum:Object.values(DEAL_STATUS),
        required:true,
        default: DEAL_STATUS.PENDING,
    },
    temperature:{
        type: Number,
        requireed : true,
        default: 0,
    },
    authorId:{
        type: ObjectId,
        required:true,
        ref:"User",
    }
},{timestamps:true});

const Deal = mongoose.model('Deal', dealSchema);
module.exports = {
    DEAL_STATUS,
    Deal
}