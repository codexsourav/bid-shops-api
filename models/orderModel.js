import './db.js';
import { Schema, model } from 'mongoose';

const orders = new Schema({
    productId: {
        type: String,
        require: true,
    },
    qut: {
        type: Number,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    status: {
        type: String,
        require: true,
        default: "Placed"
    },
    shippingId: String,
    shippingName: String,
    address: {
        fullName: {
            type: String,
        },
        phone: {
            type: String,
        },
        addressLine1: {
            type: String,
        },
        addressLine2: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

export default model("orders", orders);