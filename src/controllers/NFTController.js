import mongoose from "mongoose";
import connectDB from "../lib/connectDB";
import nfts from "../models/nfts";

class NFTController {
    static async getNFTsByWalletAddress(req, res) {
        try {
            await connectDB();
            const wallet_address = req?.query?.wallet_address;
            const page = req?.query?.page;
            const limit = req?.query?.limit;

            const totalNFTs = await nfts.countDocuments({
                wallet_address: wallet_address,
            });
            const nftData = await nfts.find({
                wallet_address: wallet_address,
            }).limit(limit).skip((page * limit) - limit);

            return res.status(200).json({
                data: {
                    records: nftData,
                    total: totalNFTs,
                },
                msg: "NFTs fetched successfully",
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                data: error,
                msg: "error"
            });
        }
    }
}
export default NFTController;