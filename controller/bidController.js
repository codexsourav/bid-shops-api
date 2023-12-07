import bidModel from "../models/bidModel.js";
import usersModel from "../models/usersModel.js";


export const getBids = async (req, res) => {
    try {
        const data = await bidModel.find();
        res.send(data);
    } catch (error) {
        res.send(data);
    }
}


export const addNewBidAmount = async (req, res) => {
    const { amount } = req.body;
    const { id } = req.params;

    try {
        if (req.authUser.bids.includes(id)) {
            return res.send({ success: true, data });
        }
        const data = await bidModel.updateOne(
            { _id: id },
            { $push: { users: { userID: req.authUser._id, amount } } }
        );
        await usersModel.updateOne({ _id: req.authUser._id }, { $push: { bids: id } })
        res.send({ success: true, data });
    } catch (error) {
        res.send({ success: false, error: error.toString() });
    }
}


const getWinners = async (req, res) => {
    const data = await bidModel.find();
    const allBids = data.users;

    for (let i = 0; i < allBids.length; i++) {
        const element = allBids[i];

    }

}