import OrdersModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';


export const createOrder = async (req, res) => {
    try {
        const {
            productId,
            qut,
            price,
        } = req.body;

        // Check for required fields
        if (!productId || !qut || !price) {
            return res.status(400).json({ error: 'Product ID, quantity, price are required fields' });
        }

        const newOrder = new OrdersModel({
            productId,
            qut,
            price,
            address: req.authUser.address,
        });

        const savedOrder = await newOrder.save();

        res.status(201).json(savedOrder);
    } catch (error) {
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


