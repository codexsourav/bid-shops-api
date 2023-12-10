import { getBidWinner } from "../helper/getBidWinner.js";
import bidModel from "../models/bidModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import usersModel from "../models/usersModel.js";

export const dashbordData = async (req, res) => {

    try {
        const currentDate = new Date();

        const allUser = await usersModel.find().count();
        const verifiedUsers = await usersModel.find({ "isEmailVerify": true, "isMobileVerify": true }).count();

        const allProducts = await productModel.find().count();
        const privateProducts = await productModel.find({ inStock: false }).count();

        var liveBidsOrders = 0;

        const totalOrders = await orderModel.find().count();
        const cancelOrder = await orderModel.find({ status: "Cancelled" }).count();

        const latestUsers = await usersModel.find({}, { pass: 0, verify: 0 }).sort({ date: -1 }).limit(5);
        const activeBids = await bidModel.find({ startDate: { $lte: currentDate }, endDate: { $gte: currentDate } });

        var activeBisWithWinner = [];

        const newOrders = await orderModel.find().sort({ date: -1 }).limit(10);

        for (let i = 0; i < activeBids.length; i++) {
            const element = activeBids[i];
            liveBidsOrders = liveBidsOrders + element.users.length;
            const winner = await getBidWinner(element.users);
            activeBisWithWinner.push({ ...element._doc, "winData": winner });
        }

        res.send({
            "count": {
                "user": {
                    total: allUser,
                    verified: verifiedUsers,
                },
                "product": {
                    total: allProducts,
                    outOfStock: privateProducts,
                },
                "bid": {
                    total: activeBids.length || 0,
                    apply: liveBidsOrders,
                },
                "order": {
                    total: totalOrders,
                    cancel: cancelOrder,
                }
            },
            "activeBids": activeBisWithWinner,
            "orders": newOrders,
            "users": latestUsers,
        });

    } catch (error) {
        console.log(error);
        res.send({
            "count": {
                "user": {
                    total: 0,
                    verified: 0,
                },
                "product": {
                    total: 0,
                    outOfStock: 0,
                },
                "bid": {
                    total: 0,
                    apply: 0,
                },
                "order": {
                    total: 0,
                    cancel: 0,
                }
            },
            "activeBids": [],
            "orders": [],
            "users": [],
        })
    }

}