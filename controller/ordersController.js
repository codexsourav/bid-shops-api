import orderModel from '../models/orderModel.js';
import OrdersModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';
import usersModel from '../models/usersModel.js';

export const myOrders = async (req, res) => {
    try {
        const user = req.authUser._id;
        const allOrders = [];
        const orders = await orderModel.find({ user });

        for (let n = 0; n < orders.length; n++) {
            const order = orders[n];
            const products = [];

            for (let i = 0; i < order.products.length; i++) {
                const element = order.products[i];
                const data = await productModel.findOne({ _id: element.productId });
                if (data) {
                    products.push({ ...data._doc, qut: element.qut });
                }
            }

            allOrders.push({ ...order._doc, products }); // Push the order with its products
        }

        return res.send(allOrders);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error', success: false });
    }
};



export const orderProducts = async (req, res) => {

    try {
        const user = await usersModel.findById(req.authUser._id);
        var total = 0;
        const productIdsInCart = user.cart.map(item => item.productId);

        const cartProducts = await productModel.find({ _id: { $in: productIdsInCart }, inStock: true });

        const cartWithDetails = user.cart.map(item => {
            const product = cartProducts.find(p => p._id.toString() === item.productId.toString());
            return {
                productId: item.productId,
                quantity: item.qyt,
                productDetails: product || null,
            };
        });

        for (let i = 0; i < cartWithDetails.length; i++) {
            const element = cartWithDetails[i];
            total = total + (element.productDetails.price * element.quantity);
        }

        // Respond with the cart data including product details
        return res.send({ success: true, products: cartWithDetails, total });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error', success: false });
    }


}



export const createOrder = async (req, res) => {
    try {
        const {
            products,
            price,
        } = req.body;

        // Check for required fields
        if (!products || !price) {
            return res.status(400).json({ error: 'Product ID, quantity, price are required fields' });
        }

        const newOrder = new OrdersModel({
            user: req.authUser._id,
            products,
            price,
            address: req.authUser.address,
        });

        const savedOrder = await newOrder.save();
        await usersModel.updateOne({ _id: req.authUser._id }, { cart: [] })
        res.status(201).json(savedOrder);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { address } = req.body;

        // Check if address is provided
        if (!address) {
            return res.status(400).json({ success: false, error: 'Address is required to update' });
        }

        const updatedOrder = await OrdersModel.findByIdAndUpdate(
            id,
            { address },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const cancelledOrder = await OrdersModel.findByIdAndUpdate(
            id,
            { status: 'Cancelled' },
            { new: true }
        );

        if (!cancelledOrder) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        res.status(200).json({ success: true, cancelledOrder });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const getOrdersWithProductData = async (req, res) => {
    try {
        const ordersWithProducts = await OrdersModel.aggregate([
            {
                $lookup: {
                    from: 'products', // Name of the products collection
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            {
                $project: {
                    productId: 1,
                    qut: 1,
                    price: 1,
                    status: 1,
                    shippingId: 1,
                    shippingName: 1,
                    address: 1,
                    productData: { $arrayElemAt: ['$productData', 0] }
                }
            }
        ]).exec();

        res.status(200).json(ordersWithProducts);
    } catch (error) {
        res.status(500).json([]);
    }
};


