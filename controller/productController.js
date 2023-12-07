import productModel from "../models/productModel.js";

export const getPopulerProduct = async (req, res) => {
    try {
        const products = await productModel.find().sort({ rating: -1 }).limit(20);
        res.send(products);
    } catch (error) {
        res.send([]);
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.send(products);
    } catch (error) {
        res.send([]);
    }
}

export const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const products = await productModel.findOne({ _id: id });
        res.send(products);
    } catch (error) {
        res.send([]);
    }
}

export const searchProducts = async (req, res) => {
    const query = req.params.query;
    try {
        const products = await productModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        res.send(products);
    } catch (error) {
        res.send([]);
    }
}
