import './db.js';
import { Schema, model } from 'mongoose';

const bids = new Schema({
    image: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    desc: {
        type: String,
        require: true,
    },
    hintPrice: {
        type: Number,
        required: true,
    },
    minPrice: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 4.5
    },
    users: [
        {
            user: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now(),
            }
        }
    ],
    selectWinner: {
        type: Boolean,
        default: false,
    },
    winner: {
        user: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now(),
        }
    },
    startDate: {
        type: Date,
        require: true,
    },
    endDate: {
        type: Date,
        require: true,
    },
    isSlide: {
        type: Boolean,
        default: false,
    },
    slideImage: String,
    date: {
        type: Date,
        default: Date.now(),
        require: true,
    }
});


export default model("bids", bids);