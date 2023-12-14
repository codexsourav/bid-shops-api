import { getBidWinner } from "../helper/getBidWinner.js";
import bidModel from "../models/bidModel.js";

export const getBidsBid = async (req, res) => {
    const { id } = req.params; // Extract the bid ID from request parameters
    try {
        const data = await bidModel.findOne({ _id: id });
        return res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', success: false, });
    }
}

export const getAllBids = async (req, res) => {
    try {
        const data = await bidModel.find().sort({ "date": -1 });
        var activeBisWithWinner = [];
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const winner = await getBidWinner(element.users);
            activeBisWithWinner.push({ ...element._doc, "winData": winner });
        }
        return res.json(activeBisWithWinner);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', success: false, });
    }
}

export const createNewBid = async (req, res) => {
    try {
        // Destructure and extract necessary data from request body
        const { image, title, desc, hintPrice, startDate, endDate, minPrice, rating, isSlide, slideImage } = req.body;

        // Validate required fields
        if (!image || !title || !desc || !hintPrice || !startDate || !endDate || !minPrice || !rating) {
            return res.status(400).json({ error: 'All fields are required', success: false, });
        }
        if (isSlide && slideImage == "") {
            return res.status(400).json({ error: 'Select A Slide Image', success: false });
        }
        // Create a new bid instance
        const newBid = new bidModel({
            image,
            title,
            desc,
            hintPrice,
            startDate,
            endDate,
            minPrice,
            isSlide,
            slideImage,
            rating,
        });

        // Save the bid to the database
        const savedBid = await newBid.save();

        res.status(201).json(savedBid); // Respond with the saved bid
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error', success: false, });
    }
}


export const deleteBidById = async (req, res) => {
    try {
        const { id } = req.params; // Extract the bid ID from request parameters

        // Validate if the ID is provided
        if (!id) {
            return res.status(400).json({ success: false, error: 'Bid ID is required' });
        }

        // Check if the bid exists
        const bid = await bidModel.findById(id);

        if (!bid) {
            return res.status(404).json({ success: false, error: 'Bid not found' });
        }

        // Delete the bid
        await bidModel.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Bid deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const updateBidById = async (req, res) => {
    try {
        const { id } = req.params; // Extract the bid ID from request parameters
        // Destructure and extract necessary data from request body
        const { image, title, desc, hintPrice, startDate, endDate, minPrice, rating, isSlide, slideImage } = req.body;

        // Validate required fields
        if (!image || !title || !desc || !hintPrice || !startDate || !endDate || !minPrice || !rating) {
            return res.status(400).json({ error: 'All fields are required', success: false });
        }
        if (isSlide && slideImage == "") {
            return res.status(400).json({ error: 'Select A Slide Image', success: false });
        }
        // Validate if the ID is provided
        if (!id) {
            return res.status(400).json({ success: false, error: 'Bid ID is required' });
        }

        // Check if the bid exists
        const bid = await bidModel.findById(id);

        if (!bid) {
            return res.status(404).json({ success: false, error: 'Bid not found' });
        }

        // Update the bid fields
        if (image) bid.image = image;
        if (title) bid.title = title;
        if (desc) bid.desc = desc;
        if (hintPrice) bid.hintPrice = hintPrice;
        if (startDate) bid.startDate = startDate;
        if (endDate) bid.endDate = endDate;
        if (minPrice) bid.minPrice = minPrice;
        if (rating) bid.rating = rating;
        bid.isSlide = isSlide;
        bid.slideImage = slideImage;

        // Save the updated bid
        const updatedBid = await bid.save();

        res.status(200).json({ success: true, updatedBid });
    } catch (error) {
        log
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const selectBidWinner = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, amount } = req.body;

        await bidModel.updateOne({ "_id": id }, {
            "$set": {
                selectWinner: true,
                winner: { user, amount, }
            }
        });
        res.send({ success: true, message: "Winner IS Updated" });
    } catch (e) {
        console.log(e);
        res.send({ success: false, error: e.toString() });
    }
}