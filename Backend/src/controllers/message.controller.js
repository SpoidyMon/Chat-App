import Messages from "../models/message.model.js";
import User from "../models/User.model.js";
import cloudinary from "../lib/cloudinary.js";


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUser = await User.find({ _id: { $ne: loggedInUser } }).select("-password")

        res.status(200).json(filteredUser)

    } catch (error) {
        console.log(`Error in getUsersForSidebar contoller : ${error.message}`);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id:chatUserId}=req.params;
        const myid=req.user._id;

        const messages=await Messages.find({
            $or:[
                {senderId:myid,recieverId:chatUserId},
                {senderId:chatUserId,recieverId:myid}
            ]
        })

        res.status(200).json(messages)


    } catch (error) {
        console.log(`Error in getMessages contoller : ${error.message}`);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body;
        const {id:recieverId}=req.params;
        const senderId=req.user._id;

        let imageURL;

        if(image){
            const cloudinaryResponse=await cloudinary.uploader.upload(image);
            imageURL=cloudinaryResponse.secure_url;
        }

        const newMessage=new Messages({
            senderId,
            recieverId,
            text,
            image:imageURL
        })

        await newMessage.save();


        res.status(201).json(newMessage);

    }catch(error){
        console.log(`Error in sendMessage contoller : ${error.message}`);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}