const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['Contract', 'Checklist', 'CueSheet', 'Other'], required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: String },
    version: { type: String, default: '1.0' },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
