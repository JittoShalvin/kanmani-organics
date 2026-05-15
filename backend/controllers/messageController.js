const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createMessage = async (req, res) => {
    const { name, email, phone, message } = req.body;
    const newMessage = new Message({ name, email, phone, message });
    try {
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.json(message);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
