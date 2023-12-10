import usersModel from "../models/usersModel.js";
import { getBidWinner } from "./getBidWinner.js";

export const getBidWithWinner = async (data) => {
    // pass bid data 
    var bidData = [];

    const winner = await getBidWinner(data.users);
    for (let i = 0; i < data.users.length; i++) {
        const userData = data.users[i];
        const usersData = await usersModel.findOne({ _id: userData.user }, { pass: 0, verify: 0, cart: 0, });
        bidData.push({ "bid": { "amountData": userData, "profile": usersData } });
    }
    return ({ ...data._doc, "users": bidData, winner });
}