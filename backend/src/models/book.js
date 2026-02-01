const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    coverImage: {
        type: String, // Base64 or URL
        default: null
    }
    // หมายเหตุ: สถานะ "ว่าง/ถูกยืม" (2.2.7) เราจะใช้ Logic เช็คจาก quantity ตอนดึงข้อมูล
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
