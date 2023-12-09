import moralis from "../lib/moralis";
import Moralis from "moralis";

import OpenAI from 'openai';
const { OPENAPI_API_KEY } = process.env;
const openai = new OpenAI({
    apiKey: OPENAPI_API_KEY
});

class WalletPersonaController {
    static async getPersonas(wallet_address) {
        try {
            await moralis();
            const response = await Moralis.EvmApi.nft.getWalletNFTCollections({
                "chain": "0x1",
                "address": wallet_address,
                limit: 100,
            });

            if (response) {
                var nft_collection_count = []
                for (var idx = 0; idx < response['result'].length; idx++) {
                    // if (response['result'][idx] in nft_collection_count) {
                    //     nft_collection_count['result'][idx]
                    // }
                    nft_collection_count.push(response['result'][idx]['name'])
                }


                const prompt = `I own NFTs in the following collections: ${nft_collection_count}. Using what you know about these collections, describe me in up to 4 personas.`

                const completion = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `You are a helpful assistant designed to output JSON in the following format:
                            {"personas": [{"name": persona_name, "description": description}]}`,
                        },
                        { role: "user", content: prompt },
                    ],
                    model: "gpt-4-1106-preview",
                    response_format: { type: "json_object" },
                });

                return {
                    "data": completion.choices[0].message.content,
                    "msg": "personas generated successfully"
                }
            } else {
                return {
                    msg: "An error occurred in fetching wallet collection details"
                }
            }
        }


        catch (error) {
            console.log(error);
            return res.status(400).json({
                data: error,
                msg: "error"
            });
        }
    }
}

export default WalletPersonaController;