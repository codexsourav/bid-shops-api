import sendMail from "../mail/mailer.js"
import { newAcountMail, resetPassMail, successfullyEmailVerified } from "../mail/templates/MailTemplates.js"
import usersModel from "../models/usersModel.js";
import generateOTP from "../utils/GenerateOTP.js";
import futureTime from "../utils/MakeTimes.js";
import generateRandomString from "../utils/RendomString.js";

export const sendVerifyMail = async (name, email, subject) => {
    const otp = generateOTP();
    const mailTemplate = newAcountMail(name, otp);
    try {
        await sendMail(email, subject, mailTemplate)
        const otpHash = hash(otp);
        await usersModel.updateOne({ email }, { "verify": { "otpToken": otpHash, otpDate: futureTime(10), } });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const sendResetPassMail = async (name, email, subject) => {
    const otpHash = generateRandomString(50);
    const mailTemplate = resetPassMail(name, process.env.HOST_URI + "/reset-password/" + otpHash);
    try {
        const response = await sendMail(email, subject, mailTemplate);
        await usersModel.updateOne({ email }, { "verify": { "passwordToken": otpHash, "passDate": futureTime(10), } });
        return response;
    } catch (error) {
        throw error;
    }
}

export const sendVerifyMailMail = async (name, email, subject) => {
    const otpHash = generateRandomString(50);
    const mailTemplate = newAcountMail(name, process.env.HOST_URI + "/verify-email/" + otpHash);
    try {
        const response = await sendMail(email, subject, mailTemplate);
        const otpHash = hash(otp);
        await usersModel.updateOne({ email }, { "verify": { "token": otpHash } });
        return response;
    } catch (error) {
        throw error;
    }
}

export const sendVerifySuccessMail = async (name, email, subject) => {
    const mailTemplate = successfullyEmailVerified(name);
    try {
        const response = await sendMail(email, subject, mailTemplate);
        await usersModel.updateOne({ email }, { "verify": { "token": "" } });
        return response;
    } catch (error) {
        throw error;
    }
}