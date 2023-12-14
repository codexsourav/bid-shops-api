import { sendVerifyMailMail } from "../helper/SendMail.js";
import usersModel from "../models/usersModel.js";
import HashPass, { validateHashPass } from "../utils/HashPass.js";
import sendOtp from "../helper/Fast2Sms.js";
import { isDateUpToCurrent } from "../utils/MakeTimes.js";
import makeTwtToken from "../utils/makeTwtToken.js";
import { isValidMobile } from "../utils/validate.js";

export const updateProfile = async (req, res) => {

    try {

        const { profile, name } = req.body;
        const { _id } = req.authUser;

        const updatedUser = await usersModel.findOneAndUpdate({ _id }, { $set: { profile, name } }, { new: true });
        delete updatedUser._doc.pass;
        delete updatedUser._doc.verify;
        return res.send({ success: true, profile: updatedUser._doc, message: "Your Profile Update Successfully" })

    } catch (error) {
        return res.status(400).json({ error: "Update Profile Field!", success: false })
    }

}


export const updateEmail = async (req, res) => {

    try {

        const { email } = req.body;
        const { _id } = req.authUser;

        const findUser = await usersModel.find({ email }).count();

        if (findUser != 0) {
            return res.send({ success: false, error: "Email ID Already Exist" });
        }

        const updatedUser = await usersModel.findOneAndUpdate({ _id }, { $set: { email, isEmailVerify: false } }, { new: true });
        delete updatedUser._doc.pass;
        delete updatedUser._doc.verify;
        await sendVerifyMailMail(updatedUser.name, email, "Verify Your Account");

        const token = makeTwtToken(res, { _id: updatedUser._id, email: updatedUser.email, mobile: updatedUser.mobile });
        return res.send({ success: true, profile: updatedUser._doc, token, message: "Your Email Update Successfully" })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Update Profile Field!", success: false })
    }

}

export const updateMobile = async (req, res) => {

    try {
        const { mobile } = req.params;
        if (!isValidMobile(mobile)) {
            return res.json({ "error": "Invalid Mobile Number", "success": false });
        }
        const findUser = await usersModel.find({ mobile }).count();

        if (findUser != 0) {
            return res.send({ success: false, error: "Mobile Number Already Exist" });
        }

        await sendOtp(req.authUser.mobile, mobile);
        return res.send({ success: true, message: "OTP Send Successfully" })

    } catch (error) {
        console.log(e);
        return res.status(400).json({ error: "Otp Send Field", success: false })
    }

}

export const setUpdatedMobile = async (req, res) => {

    try {

        const { mobile, otp } = req.body;
        const userData = req.authUser;
        const otpToken = userData.verify.otpToken;
        const otpTime = userData.verify.otpDate;

        if (!otpToken || otpToken.length == 0) {
            return res.json({ "error": "Invalid OTP", "success": false });
        }

        if (isDateUpToCurrent(otpTime)) {
            return res.json({ "error": "Invalid OTP! Expired", "success": false });
        }

        if (!validateHashPass(otpToken, otp)) {
            return res.json({ "error": "Invalid OTP", "success": false });
        }

        const updatedUser = await usersModel.findOneAndUpdate({ _id: userData._id }, { $set: { mobile, isMobileVerify: true } }, { new: true });
        delete updatedUser._doc.pass;
        delete updatedUser._doc.verify;
        const token = makeTwtToken(res, { _id: updatedUser._id, email: updatedUser.email, mobile: updatedUser.mobile });

        return res.send({ success: true, profile: updatedUser._doc, token, message: "Your Mobile Update Successfully" })

    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: "Unknown Error", success: false })
    }
}

export const updatePass = async (req, res) => {

    try {

        const { currentPass, newPass } = req.body;
        const { _id, pass } = req.authUser;

        const isVerified = validateHashPass(pass, currentPass);
        if (!isVerified) {
            return res.send({ success: false, "error": "Incorrect Current Password" })
        }
        if (pass.length <= 5) {
            return res.json({ "error": "Password Too Short Min 5", "success": false });
        }
        const hashPass = HashPass(newPass);
        const updatedUser = await usersModel.updateOne({ _id }, { $set: { pass: hashPass } }, { new: true });

        return res.send({ success: true, message: "Your Password Update Successfully" })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Update Password Field!", success: false })
    }

}
