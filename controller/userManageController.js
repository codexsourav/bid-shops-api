import usersModel from "../models/usersModel.js";

export const getUsers = async (req, res) => {
    return res.send(await usersModel.find({}, { pass: 0 }));
}

export const getVerifiedUsers = async (req, res) => {
    return res.send(await usersModel.find({ "isEmailVerify": true, "isMobileVerify": true }, { pass: 0 }));
}

export const blockUsers = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await usersModel.findOne({ _id: id }, { pass: 0 });

        const update = await usersModel.updateOne({ _id: id }, { $set: { "isAllow": !user.isAllow } });
        return res.send({ "success": true, user: update, "message": (!user.isAllow ? "User Unblocked" : "User Blocked") });
    } catch (error) {
        return res.send({ "success": false, error: error.toString() });
    }
}



export const deleteUsers = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await usersModel.deleteOne({ _id: id });
        return res.send({ "success": true, user });
    } catch (error) {
        return res.send({ "success": false, error: error.toString() });
    }
}
