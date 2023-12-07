const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    amount: {
        type: Number,
        required: true,
        maxLength: 20,
        trim: true
    },
    type: {
        type: String,
        default:"expense"
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 200,
        trim: true
    },
    createdBy:{
        type:ObjectId,
        ref:"Userdata"
     }
}, {timestamps: true})

module.exports = mongoose.model('Expense', ExpenseSchema)