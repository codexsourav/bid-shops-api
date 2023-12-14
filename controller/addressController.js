import usersModel from '../models/usersModel.js';



export const updateUserAddress = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
        } = req.body;


        // Update the address fields
        const address = {
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
        };

        // Save the updated user with the new address
        const updatedUser = await usersModel.findOneAndUpdate(
            { _id: req.authUser._id },
            { $set: { address } },
            { returnDocument: 'after' }
        );

        res.status(200).json({ success: true, res: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


