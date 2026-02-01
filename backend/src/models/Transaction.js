const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrow_date: {
        type: Date,
        default: Date.now
    },
    due_date: {
        type: Date, // โจทย์ไม่ได้ระบุกี่วัน แต่ควรมี field นี้ไว้
        required: true
    },
    return_date: {
        type: Date,
        default: null // ถ้าเป็น null แปลว่ายังไม่คืน
    },
    status: {
        type: String,
        enum: ['borrowed', 'returned'],
        default: 'borrowed'
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);