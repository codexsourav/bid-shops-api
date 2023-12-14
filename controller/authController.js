import sendOtp, { sendForgetPassMessage } from "../helper/Fast2Sms.js";
import { sendResetPassMail, sendVerifyMailMail } from "../helper/SendMail.js";
import sendMail from "../mail/mailer.js";
import { SuccessfullyChangePasswordMail } from "../mail/templates/MailTemplates.js";
import usersModel from "../models/usersModel.js";
import hash, { validateHashPass } from "../utils/HashPass.js";
import { isDateUpToCurrent } from "../utils/MakeTimes.js";
import makeTwtToken from "../utils/makeTwtToken.js";
import { isValidMobile, validateEmail } from "../utils/validate.js";


export const adminLogin = async (req, res) => {
    const { userinfo, pass } = req.body;

    try {

        if (!userinfo, !pass) {
            return res.json({ "error": "Please Enter Your Credentials", "success": false });
        }

        const user = await usersModel.findOne({
            "$or": [{ "email": userinfo }, { "mobile": userinfo }]
        }, { "verify": 0 });

        if (!user) {
            return res.json({ "error": "Invalid Credentials Details", "success": false });
        }

        const isVerified = validateHashPass(user.pass, pass);
        if (!isVerified) {
            return res.status(406).json({ "error": "Invalid Auth Credentials Details", "success": false });
        } else if (!user.isAllow) {
            return res.status(406).json({ "error": "Your Account is Suspended", "success": false });
        } else if (!user.isAdmin) {
            return res.status(203).json({ "success": false, "error": "Your Are Not Admin" });
        }

        delete user._doc.pass;
        delete user._doc.verify;

        const token = makeTwtToken(res, { _id: user._id, email: user.email, mobile: user.mobile });
        return res.status(202).json({ ...user._doc, token, "success": true });
    } catch (error) {
        console.log(error);
        return res.json({ "error": error.toString(), "success": false });
    }

};

export const login = async (req, res) => {
    const { userinfo, pass } = req.body;

    try {

        if (!userinfo, !pass) {
            return res.json({ "error": "Please Enter Your Credentials", "success": false });
        }

        const user = await usersModel.findOne({
            "$or": [{ "email": userinfo }, { "mobile": userinfo }]
        }, { "verify": 0 });

        if (!user) {
            return res.json({ "error": "Invalid Credentials Details", "success": false });
        }

        const isVerified = validateHashPass(user.pass, pass);
        if (!isVerified) {
            return res.status(406).json({ "error": "Invalid Auth Credentials Details", "success": false });
        } else if (!user.isAllow) {
            return res.status(406).json({ "error": "Your Account is Suspended", "success": false });
        } else if (!user.isMobileVerify) {
            delete user._doc.pass;
            await sendOtp(user.mobile);
            return res.status(203).json({ ...user._doc, "success": true });
        }

        delete user._doc.pass;
        delete user._doc.verify;

        const token = makeTwtToken(res, { _id: user._id, email: user.email, mobile: user.mobile });
        return res.status(202).json({ ...user._doc, token, "success": true });
    } catch (error) {
        console.log(error);
        return res.json({ "error": error.toString(), "success": false });
    }

};

export const signUp = async (req, res) => {

    const { name, email, mobile, pass } = req.body;

    if (!name || !email || !mobile || !pass) {
        return res.json({ "error": "Please Fill All Fields", "success": false });
    } else if (name.length <= 2) {
        return res.json({ "error": "Name is Too Short Min 3.", "success": false });
    } else if (!validateEmail(email)) {
        return res.json({ "error": "Invalid Email ID", "success": false });
    } else if (!isValidMobile(mobile)) {
        return res.json({ "error": "Invalid Mobile Number", "success": false });
    } else if (pass.length <= 5) {
        return res.json({ "error": "Password Too Short Min 5", "success": false });
    }

    try {
        const searchDbIsExist = await usersModel.findOne({
            "$or": [{ "email": email }, { "mobile": mobile }]
        }, { "email": 1, "mobile": 1 });

        if (searchDbIsExist && searchDbIsExist.mobile == mobile) {
            return res.json({ "error": "Mobile Number Already Exist", "success": false });
        } else if (searchDbIsExist && searchDbIsExist.email == email) {
            return res.json({ "error": "Email ID Already Exist", "success": false });
        }

        // send Otp Here 
        const createUser = new usersModel({ name, email, mobile, pass });
        const user = await createUser.save();
        await sendVerifyMailMail(name, email, "Verify Your Account");
        await sendOtp(mobile);
        delete user._doc.pass;
        delete user._doc.verify;

        return res.status(201).json({ ...user._doc, "success": true });
    } catch (error) {
        console.log(error);
        return res.json({ "error": error.response?.data.message || error.toString(), "success": false });
    }
};

export const forgetPass = async (req, res) => {
    const id = req.params.id;

    try {
        const userData = await usersModel.findOne({
            "$or": [{ "email": id }, { "mobile": id }]
        }, { "pass": 0 });

        if (!userData) {
            return res.json({ "error": "User Not Found!", "success": false });
        }

        if (validateEmail(id)) {
            await sendResetPassMail(userData.name, userData.email, "Reset Your Password");
            return res.status(202).json({ "message": "Your Reset Password Link Send Successfully", "success": true, });
        } else if (isValidMobile(id)) {
            await sendForgetPassMessage(userData.mobile);
            return res.status(202).json({ "message": "Your Reset Password Link Send Successfully", "success": true, });
        } else {
            return res.json({ "error": "Enter Valid Email or Mobile Number", "success": false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ "error": error.toString(), "success": false });
    }
};

export const changePass = async (req, res) => {
    const token = req.params.token;
    const { pass } = req.body;
    try {

        if (pass.length <= 5) {
            return res.json({ "error": "Password Too Short Min 5", "success": false });
        }

        const userData = await usersModel.findOne({ "verify.passwordToken": token, }, { "pass": 0 });

        if (!userData) {
            return res.json({ "error": "Invalid Link! Link is Expired", "success": false });
        }

        const passToken = userData.verify.passwordToken;
        const passTime = userData.verify.passDate;

        if (!passToken || passToken.length == 0) {
            return res.json({ "error": "Invalid Link! Link is Expired", "success": false });
        }

        if (isDateUpToCurrent(passTime)) {
            return res.json({ "error": "Invalid Link! Link is Expired", "success": false });
        }

        if (token != passToken) {
            return res.json({ "error": "Invalid Link! Link is Expired", "success": false });
        }

        const passHash = hash(pass);
        await usersModel.updateOne({ _id: userData._id }, { $set: { pass: passHash, "verify": { passwordToken: "", passDate: Date.now() } } });
        await sendMail(userData.email, "Password Changed Successfully", SuccessfullyChangePasswordMail(userData.name));
        return res.json({ "message": "Password Changed Successfully", "success": true });

    } catch (error) {
        console.log(error);
        return res.json({ "error": error.toString(), "success": false });
    }

};

export const verifyOtp = async (req, res) => {

    const { userinfo, otp } = req.body;

    try {

        if (!userinfo, !otp) {
            return res.json({ "error": "Invalid OTP", "success": false });
        }

        const userData = await usersModel.findOne({
            "$or": [{ "email": userinfo }, { "mobile": userinfo }]
        }, { "pass": 0 });

        if (!userData) {
            return res.json({ "error": "User Not Found!", "success": false });
        }

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
        await usersModel.updateOne({ _id: userData._id }, { $set: { isMobileVerify: true, verify: { otpToken: "", otpDate: Date.now() } } });
        const token = makeTwtToken(res, { _id: userData._id, email: userData.email, mobile: userData.mobile });

        delete userData._doc.verify;

        return res.status(202).json({ ...userData._doc, "success": true, token });

    } catch (error) {
        console.log(error);
        return res.json({ "error": error.toString(), "success": false });
    }
};

export const resendOtp = async (req, res) => {

    const { userinfo } = req.body;

    try {

        if (!userinfo) {
            return res.json({ "error": "Invalid OTP", "success": false });
        }

        const userData = await usersModel.findOne({
            "$or": [{ "email": userinfo }, { "mobile": userinfo }]
        }, { "pass": 0 });

        if (!userData) {
            return res.json({ "error": "User Not Found!", "success": false });
        }

        await sendOtp(userData.mobile);
        delete userData._doc.verify;
        return res.status(202).json({ ...userData._doc, "success": true, "message": "Successfully Send OTP" });

    } catch (error) {
        console.log(error);
        return res.json({ "error": error.toString(), "success": false });
    }
};

export const resendVerifyMail = async (req, res) => {
    try {
        const email = req.params.email;
        const userData = await usersModel.findOne({ email }, { "pass": 0 });
        if (!userData) {
            return res.json({ "error": "User Not Exist on This Email", "success": false });
        }
        await sendVerifyMailMail(userData.name, email, "Verify Your Account");
        return res.json({ "message": "Email Send Successfully", "success": true });
    } catch (error) {
        return res.json({ "error": error.toString(), "success": false });
    }
}

export const VerifyMail = async (req, res) => {
    try {
        const token = req.params.token;

        const userData = await usersModel.findOne({ "verify.token": token }, { "pass": 0 });

        if (!userData) {
            return res.json({ "error": "Invalid Verification Link", "success": false });
        }
        await sendVerifySuccessMail(userData.name, email, "Successfully Verified");
        return res.json({ "message": "Email Successfully Verified", "success": true });
    } catch (error) {
        return res.json({ "error": error.toString(), "success": false });
    }
}



export const userProfile = async (req, res) => {
    try {
        const userData = await usersModel.findOne({ "_id": req.authUser._id }, { "pass": 0, "verify": 0 });
        return res.json(userData);
    } catch (error) {
        return res.json({ "error": error.toString(), "success": false });
    }
}