import axios from "axios";
import connectDB from "../lib/connectDB";
import persona from "../models/persona";
import mongoose from "mongoose";
import activity from "../models/activity";

const QUICK_NODE_URL = process.env.QUICK_NODE_URL;

class NFTMintAirdropController {
    // Mint And AirDrop NFT
    static async mintAndAirdropPersonaNFT(req, res) {
        try {
            await connectDB();
            const persona_id = req?.body?.persona_id;
            const personaData = await persona.findOne({
                _id: new mongoose.Types.ObjectId(persona_id),
            });

            if (personaData) {
                const requestData = {
                    "jsonrpc": "2.0",
                    "method": "cm_mintNFT",
                    "params": [
                        "default-polygon",
                        `polygon:${personaData?.wallet_address}`,
                        {
                            "name": personaData?.persona_name,
                            "image": personaData?.image_url,
                            "description": String(personaData?.percentage),
                        },
                    ],
                };

                const response = await axios.post(QUICK_NODE_URL, requestData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 200) {
                    await persona.findOneAndUpdate({
                        _id: new mongoose.Types.ObjectId(persona_id),
                    }, {
                        minting_status: response?.data?.result?.onChain?.status,
                        is_claimed: true,
                        nft_id: response?.data?.result?.id,
                    });
                    return res.status(200).json({
                        data: response?.data?.result?.onChain?.status,
                        msg: "NFT minted successfully",
                    });
                } else {
                    return res.status(500).json({
                        msg: "Minting failed",
                    });
                }
            } else {
                return res.status(404).json({
                    msg: "Persona not found"
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

    // Mint status for NFT 
    static async statusOfMint(req, res) {
        try {
            await connectDB();
            const persona_id = req?.query?.id;
            const personaData = await persona.findOne({
                _id: new mongoose.Types.ObjectId(persona_id),
            });

            if (personaData) {
                const requestData = {
                    "jsonrpc": "2.0",
                    "method": "cm_getNFTMintStatus",
                    "params": [
                        "default-polygon",
                        personaData?.nft_id,
                    ]
                };
    
                const response = await axios.post(QUICK_NODE_URL, requestData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 200) {
                    if (response?.data?.result?.onChain?.status === "success") {
                        await activity.create({
                            wallet_address: personaData?.wallet_address,
                            user_id: personaData?.user_id,
                            transaction_id: response?.data?.result?.onChain?.txId,
                            persona_id: personaData?._id,
                        });
                    }
                    await persona.findOneAndUpdate({
                        _id: new mongoose.Types.ObjectId(persona_id),
                    }, {
                        minting_status: response?.data?.result?.onChain?.status,
                        minting_tx_id: response?.data?.result?.onChain?.txId,
                        minted_token_id: response?.data?.result?.onChain?.tokenId,
                        minted_contract_address: response?.data?.result?.onChain?.contractAddress,
                    });
                    return res.status(200).json({
                        data: response.data,
                        msg: "NFT status fetched successfully",
                    });
                } else {
                    return res.status(500).json({
                        msg: "Status of nft fetching failed",
                    });
                }
            } else {
                return res.status(404).json({
                    msg: "Persona not found"
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

export default NFTMintAirdropController;