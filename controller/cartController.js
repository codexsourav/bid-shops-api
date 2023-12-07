import usersModel from "../models/usersModel.js";
import productModel from "../models/productModel.js";

export const cartData = async (req, res) => {
    try {
        const user = await usersModel.findById(req.authUser._id);

        const productIdsInCart = user.cart.map(item => item.productId);

        const cartProducts = await productModel.find({ _id: { $in: productIdsInCart } });

        const cartWithDetails = user.cart.map(item => {
            const product = cartProducts.find(p => p._id.toString() === item.productId.toString());
            return {
                productId: item.productId,
                quantity: item.qyt,
                productDetails: product || null,
            };
        });

        // Respond with the cart data including product details
        return res.send({ success: true, cart: cartWithDetails });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error', success: false });
    }
}

export const addToCart = async (req, res) => {
    const { id, qut } = req.body;

    if (!id || !qut) {
        return res.send({ "error": "Invalid Request", "success": false });
    }

    function existInCart(productId) {
        // Check if the product is already in the cart
        return req.authUser.cart.some(item => item.productId === productId);
    }

    if (existInCart(id)) {
        const updatedCart = req.authUser.cart.map(item => {
            if (item.productId === id) {
                item.qyt += qut;
            }
            return item;
        });

        try {
            // Update the user's cart in the database
            const updatedUser = await usersModel.findOneAndUpdate(
                { _id: req.authUser._id },
                { cart: updatedCart },
                { new: true }
            );

            // Respond with the updated user data
            return res.send({ "success": true, "user": updatedUser });
        } catch (err) {
            return res.status(500).send({ "error": "Internal Server Error", "success": false });
        }
    } else {
        // If the product is not in the cart, add it
        const newItem = { productId: id, qyt: qut };
        try {
            // Add the item to the user's cart in the database
            const updatedUser = await usersModel.findOneAndUpdate(
                { _id: req.authUser._id },
                { $push: { cart: newItem } },
                { new: true }
            );

            // Respond with the updated user data
            return res.send({ "success": true, "user": updatedUser });
        } catch (err) {
            return res.status(500).send({ "error": "Internal Server Error", "success": false });
        }
    }
}


export const removeFromCart = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.send({ "error": "Invalid Request", "success": false });
    }

    try {
        // Remove the item from the cart using filter to exclude the specified product ID
        const updatedCart = req.authUser.cart.filter(item => item.productId !== id);

        // Update the user's cart in the database
        const updatedUser = await usersModel.findOneAndUpdate(
            { _id: req.authUser._id },
            { cart: updatedCart },
            { new: true }
        );

        // Respond with the updated user data
        return res.send({ "success": true, "user": updatedUser });
    } catch (err) {
        return res.status(500).send({ "error": "Internal Server Error", "success": false });
    }
}
