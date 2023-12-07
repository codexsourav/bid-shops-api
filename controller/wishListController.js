import usersModel from "../models/usersModel.js";
import productModel from "../models/productModel.js";


export const manageWishList = async (req, res) => {
    const id = req.params.id;
    const wishlist = req.authUser.watchList;
    const addOrRemoveElement = (arr, element) => {
        const index = arr.indexOf(element);
        if (index !== -1) {
            arr.splice(index, 1);
            return { action: 'remove', updatedArray: arr };
        } else {
            arr.push(element);
            return { action: 'add', updatedArray: arr };
        }
    };

    const newList = addOrRemoveElement(wishlist, id);

    try {
        await usersModel.updateOne({ _id: req.authUser._id }, { $set: { "watchList": newList.updatedArray } })
        res.send({ "action": newList.action == "add" ? true : false })
    } catch (error) {
        res.send({ "action": false })
    }
}


export const getWishList = async (req, res) => {
    const wishlist = req.authUser.watchList;
    try {
        const data = await productModel.find({ _id: { $in: wishlist } })
        res.send(data)
    } catch (error) {
        res.send([])
    }
}