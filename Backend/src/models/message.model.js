import mongoose, { mongo } from "mongoose";
import User from "./User.model.js";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
},
    { timestamps: true },
)

const Messages=mongoose.model("Message",messageSchema);
export default Messages; 