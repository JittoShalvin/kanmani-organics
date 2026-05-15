const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    fullDescription: { type: String },
    features: [String],
    benefits: [String],
    usage: { type: String },
    sizes: [String],
    image: { type: String },
    category: { type: String },
    link: { type: String },
    sortOrder: { type: Number, default: 0 },
    visible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
