import { getBidWithWinner } from "../helper/getBidWithWinner.js";
import bidModel from "../models/bidModel.js";
import usersModel from "../models/usersModel.js";



export const getBids = async (req, res) => {
    try {
        const currentDate = new Date();
        const userbids = req.authUser.bids;
        let data = await bidModel.find({ startDate: { $lte: currentDate }, endDate: { $gte: currentDate } });
        var userBiddata;

        data = data.map(item => {
            if (userbids.includes(item._id)) {

                for (let i = 0; i < item.users.length; i++) {
                    const element = item.users[i];
                    if (element.user == req.authUser._id) {
                        userBiddata = element;
                        break;
                    }
                }

                return { ...item.toObject(), isAttemd: true, userData: userBiddata };
            } else {
                return { ...item.toObject(), isAttemd: false };
            }
        });

        res.send(data);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching bids.' });
    }
}



export const addNewBidAmount = async (req, res) => {
    const { amount } = req.body;
    const { id } = req.params;
    console.log(req.body);
    console.log(req.authUser._id);
    try {
        if (!amount) {
            return res.send({ success: false, error: "Please Enter Your Amount" })
        }
        if (req.authUser.bids.includes(id)) {
            return res.send({ success: true, message: 'Bid Place Successful' });
        }
        const data = await bidModel.updateOne(
            { _id: id },
            { $push: { users: { "user": req.authUser._id, amount } } }
        );
        await usersModel.updateOne({ _id: req.authUser._id }, { $push: { bids: id } })
        res.send({ success: true, message: 'Bid Place Successful' });
    } catch (error) {
        res.status(500).send({ success: false, error: error.toString() });
    }
}


export const getBidResults = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await bidModel.findOne({ _id: id });
        var bidData = null;

        if (data) {
            bidData = await getBidWithWinner(data);
        } else {
            return res.status(500).send({ success: false, error: "No Bid Found" });
        }

        res.send(bidData);
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error.toString() });
    }
}




const getWinners = async (req, res) => {
    const data = await bidModel.find();
    const allBids = data.users;

    for (let i = 0; i < allBids.length; i++) {
        const element = allBids[i];

    }

}