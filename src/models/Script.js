const mongoose = require('mongoose');

const scriptSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, // Wedding, Corporate, Gala, Sports
    tone: { type: String, required: true }, // Funny, Formal, High Energy
    language: { type: String, default: 'English' },
    content: { type: String, required: true },
    wordCount: { type: Number },
    duration: { type: String }, // Estimated duration like "15 mins"
    stageDirections: { type: String },
    micCues: { type: String },
    dressCodeSuggestions: { type: String },
    isPremium: { type: Boolean, default: false },
    favoritesCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Script', scriptSchema);
