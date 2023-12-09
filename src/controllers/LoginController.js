import connectDB from "../lib/connectDB";
import users from "../models/users";

class LoginController {
    static async login(req, res) {
        try {
            await connectDB();
            const user = await users.findOne({ wallet_address: req?.body?.wallet_address });
            if (user) {
                return res.status(200).json({
                    data: user,
                    newUser: false,
                    msg: "User fetched successfully",
                });
            } else {
                const newUser = await users.create({
                    wallet_address: req?.body?.wallet_address,
                    name: "",
                    avatar_url: "",
                    cover_url: "",
                    bio: "",
                    is_nft_fetched: false,
                    is_persona_analysed: false,
                });

                return res.status(200).json({
                    data: newUser,
                    newUser: true,
                    msg: "User created successfully",
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                data: error,
                msg: "error"
            });
        }
    }

    static async update(req, res) {
        try {
            await connectDB();
            const user = await users.findOne({ wallet_address: req?.body?.wallet_address });
            if (user) {
                const dataToBeUpdated = req.body;
                delete dataToBeUpdated.wallet_address;
                const updatedProfile = await users.findOneAndUpdate({
                    _id: user._id,
                }, {
                    ...dataToBeUpdated
                }, {
                    new: true,
                });
                return res.status(200).json({
                    data: updatedProfile,
                    msg: "User profile updated successfully",
                });
            } else {
                return res.status(404).json({
                    msg: "User not found",
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                data: error,
                msg: "error"
            });
        }
    }

    static async get(req, res) {
        try {
            await connectDB();
            const user = await users.findOne({ wallet_address: req?.query?.wallet_address });
            if (user) {
                
                return res.status(200).json({
                    data: user,
                    msg: "User profile retrieved successfully",
                });
            } else {
                return res.status(404).json({
                    msg: "User not found",
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                data: error,
                msg: "error"
            });
        }
    }
}
export default LoginController;