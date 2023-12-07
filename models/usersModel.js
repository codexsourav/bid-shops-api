import './db.js';
import HashPass from '../utils/HashPass.js';
import { Schema, model } from 'mongoose';

const users = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 2,
        trim: true,
    },
    profile: {
        type: String,
        required: true,
        default: "profile.webp"
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minLength: 2,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minLength: 10,
        unique: true,
    },
    pass: {
        type: String,
        required: true,
    },
    isEmailVerify: {
        type: Boolean,
        required: true,
        default: false,
    },
    isMobileVerify: {
        type: Boolean,
        required: true,
        default: false,
    },
    isAllow: {
        type: Boolean,
        required: true,
        default: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    jwtToken: {
        type: String,
    },
    watchList: {
        type: Array,
        default: [],
    },
    bids: {
        type: Array,
        default: [],
    },
    cart: [
        {
            productId: {
                type: String,
            },
            qyt: {
                type: Number,
            }
        }
    ],
    verify: {
        token: {
            type: String,
        },
        otpToken: {
            type: String,
        },
        passwordToken: {
            type: String,
        },
        tokenDate: {
            type: Date,
            default: Date.now,
        },
        passDate: {
            type: Date,
            default: Date.now,
        },
        otpDate: {
            type: Date,
            default: Date.now,
        },
    },

    date: {
        type: Date,
        default: Date.now,
    },

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
    }
});

users.pre("save", function (next) {
    if (!this.isModified("pass")) {
        var hash = HashPass(pass);
        this.pass = hash;
        next();
    }

    this.pass = HashPass(this.pass);
    next();
});

export default model("users", users);