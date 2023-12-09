import { nftGenerator } from "../helpers/nftGenerator";
import connectDB from "../lib/connectDB";
import persona from "../models/persona";
import users from "../models/users";
import WalletPersonaController from "./WalletPersonaController";

class AnalyseController {
    static async analyseNFTs(req, res) {
        try {
            await connectDB();
            const wallet_address = req?.body?.wallet_address;
            const user = await users.findOne({
                wallet_address: wallet_address
            });

            if (user) {
                const personasData = await WalletPersonaController.getPersonas(wallet_address);
                const personasFinalObj = JSON.parse(personasData.data);

                for (let i = 0; i < personasFinalObj.personas.length; i++) {
                    const imageData = await nftGenerator(personasFinalObj.personas[i]['name'], wallet_address);

                    // creating a persona according to GPT & DALL-E responses
                    await persona.create({
                        wallet_address: wallet_address,
                        user_id: user?._id,
                        persona_name: personasFinalObj.personas[i]['name'],
                        description: personasFinalObj.personas[i]['description'],
                        percentage: null,
                        image_url: imageData?.[0]?.url,
                        is_claimed: false,
                        minting_status: null,
                        nft_id: null,
                        minting_tx_id: null,
                        minted_token_id: null,
                        minted_contract_address: null,
                    });

                    await users.findOneAndUpdate({
                        _id: user?.id,
                    }, {
                        is_persona_analysed: true,
                    });
                }
                return res.status(200).json({
                    data: personasFinalObj,
                    msg: "NFTs analysed successfully",
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
export default AnalyseController;