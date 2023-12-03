import './db.js';
import HashPass from '../utils/HashPass.js';
import { Schema, model } from 'mongoose';

const products = new Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 2,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    hintPrice: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 4.5
    },
    gallery: Array,
    specs: [
        {
            title: String,
            value: String,
        }
    ],
    inStock: {
        type: Boolean,
        default: true,
    }
});



export default model("products", products);