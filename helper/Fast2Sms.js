import axios from "axios";
import hash from "../utils/HashPass.js";
import usersModel from "../models/usersModel.js";
import generateOTP from "../utils/GenerateOTP.js";
import futureTime from "../utils/MakeTimes.js";
import generateRandomString from "../utils/RendomString.js";

export default async (mobile) => {
    const otp = generateOTP();
    var options = {
        method: 'POST',
        url: 'https://www.fast2sms.com/dev/bulkV2',
        headers: {
            Accept: '*/*',
            Authorization: process.env.FAST2SMS,
            'Content-Type': 'application/json'
        },
        data: { variables_values: otp, route: 'otp', numbers: mobile }
    };

    try {
        const response = await axios.request(options);
        const otpHash = hash(otp);
        await usersModel.updateOne({ mobile }, { "verify": { "otpToken": otpHash, otpDate: futureTime(10), } });
        return response.data;
    } catch (error) {
        throw error.response?.data.message ? new Error(error.response.data.message) : error;
    }
}

export const sendForgetPassMessage = async (mobile) => {

    const otpHash = generateRandomString(50);
    var options = {
        method: 'POST',
        url: 'https://www.fast2sms.com/dev/bulkV2',
        headers: {
            Accept: '*/*',
            Authorization: process.env.FAST2SMS,
            'Content-Type': 'application/json'
        },
        data: {
            message: otpHash, route: 'q', numbers: mobile, "language": "english",
        }
    };

    try {
        const response = await axios.request(options);
        await usersModel.updateOne({ mobile }, { "verify": { "passwordToken": otpHash, "passDate": futureTime(10), } });
        return response.data;
    } catch (error) {
        throw error.response?.data.message ? new Error(error.response.data.message) : error;
    }

}

export const sendVerifyEmailMessage = async (mobile) => {

    const otpHash = generateRandomString(50);
    var options = {
        method: 'POST',
        url: 'https://www.fast2sms.com/dev/bulkV2',
        headers: {
            Accept: '*/*',
            Authorization: process.env.FAST2SMS,
            'Content-Type': 'application/json'
        },
        data: {
            message: otpHash, route: 'q', numbers: mobile, "language": "english",
        }
    };

    try {
        const response = await axios.request(options);
        await usersModel.updateOne({ mobile }, { "verify": { "passwordToken": otpHash, "passDate": futureTime(10), } });
        return response.data;
    } catch (error) {
        throw error.response?.data.message ? new Error(error.response.data.message) : error;
    }

}