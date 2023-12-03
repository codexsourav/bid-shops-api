import usersModel from "../models/usersModel.js";
import productModel from "../models/productModel.js";



export const addProduct = async (req, res) => {

    const { title, description, price, hintPrice, specs } = req.body;

    const { image, gallery } = req.files;

    if (!title, !description, !price, !hintPrice, !specs) {
        return res.json({ error: "Please Enter All Filds", success: false });
    }

    if (!image, !gallery) {
        return res.json({ error: "Please Add Product Images", success: false });
    }

    const addProduct = new productModel({
        title,
        description,
        price,
        hintPrice,
        specs: JSON.parse(specs),
        image: image[0].originalname,
        gallery: gallery.map((e, i) => e.originalname),
    });

    try {
        await addProduct.save();
        return res.json({ "message": "Product Add Successfully", "success": true });
    } catch (error) {
        console.log(error);
        return res.json({ "error": error.toString(), "success": false });
    }
}




export const updateProduct = async (req, res) => {

    const { title, description, price, hintPrice, specs } = req.body;

    const { image, gallery } = req.files;

    if (!title, !description, !price, !hintPrice, !specs) {
        return res.json({ error: "Please Enter All Filds", success: false });
    }

    var product = {
        title,
        description,
        price,
        hintPrice,
        specs: JSON.parse(specs),
    }

    if (image) {
        product.push({ image: image[0].originalname })
    }

    if (gallery) {
        product.push({ gallery: gallery.map((e, i) => e.originalname), })
    }


    const addProduct = new productModel(procuct);

    try {
        await addProduct.save();
        return res.json({ "message": "Product Add Successfully", "success": true });
    } catch (error) {
        console.log(error);
        return res.json({ "error": error.toString(), "success": false });
    }
}