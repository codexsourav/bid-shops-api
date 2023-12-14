import productModel from "../models/productModel.js";

export const addProduct = async (req, res) => {

    try {

        const { title, description, price, hintPrice, specs, image, gallery, rating, inStock } = req.body;

        if (!title || !description || !price || !hintPrice || !specs || !image || !gallery || !rating) {
            return res.json({ error: "Please Enter All Fields", success: false });
        }

        const addProduct = new productModel({
            title,
            description,
            price,
            hintPrice,
            specs: specs,
            image: image,
            gallery: gallery,
            rating,
            inStock
        });

        await addProduct.save();
        return res.json({ "message": "Product Add Successfully", "success": true });
    } catch (error) {
        console.log(error);
        return res.json({ "error": error.toString(), "success": false });
    }
}

export const updateProduct = async (req, res) => {

    try {
        const id = req.params.id;
        const { title, description, price, hintPrice, specs, image, gallery, inStock, rating } = req.body;

        if (!title || !description || !price || !hintPrice || !specs || !image || !gallery || !rating) {
            return res.json({ error: "Please Enter All Fields", success: false });
        }

        var product = {
            title,
            description,
            price,
            hintPrice,
            specs: specs,
            image: image,
            gallery: gallery,
            inStock,
            rating
        }

        await productModel.updateOne({ _id: id }, { $set: product });
        return res.json({ "message": "Product Update Successfully", "success": true });
    } catch (error) {
        console.log(error);
        return res.json({ "error": error.toString(), "success": false });
    }
}

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        await productModel.deleteOne({ _id: id });
        return res.json({ "message": "Product Delete Successfully", "success": true });
    } catch (error) {
        console.log(error);
        return res.json({ "error": error.toString(), "success": false });
    }
}