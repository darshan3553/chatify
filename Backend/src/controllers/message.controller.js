import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/user.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password')
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user.id;
        const { id:userToChatId} = req.params;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userToChatId },
                { sender: userToChatId, receiver: myId }
            ]
        });
        res.status(200).json(messages);


    } catch (error) {
       console.log("Error fetching messages:", error);
       res.status(500).json({ message: "Server Error" });   

    }
};

export const sendMessage = async (req, res) => {
    try {
        const{ text, image} = req.body;
        const { id: receiverId} = req.params;
        const senderId = req.user.id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error sending message:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getChatpartners = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId },
        { receiverId: loggedInUserId }
      ]
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds }
    }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("Error fetching chat partners:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

