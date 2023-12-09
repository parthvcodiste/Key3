//import { jwtDecodedInformation } from "../helpers/Auth/Auth";
//import NFTGeneratorService from "../services/NFTGeneratorService";
//import UserInformationService from "../services/UserInformationService"
import OpenAI from 'openai';
const { OPENAPI_API_KEY } = process.env;

const openai = new OpenAI({
  apiKey: OPENAPI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

class NFTGeneratorController {
    static async generateNFT(req, res) {
        try {
            // const user = await jwtDecodedInformation(req, res);
            // if (!user) {
            //     return res.status(403).json({
            //         status: 403,
            //         message: "This user can not be found.",
            //     });
            // }
            // const userData = await UserInformationService.getUserInformation(
            //     "user.email"
            // );
            const personaName = req?.body?.persona;
            const walletAddress = req?.body?.wallet;
            
            const prompt = "Generate a brightly colored poster themed around " + personaName + ". This poster will be used a modern NFT";
            //const prompt = "Create a poster with strong colors for a user with a persona " + personaName + " and insert a text over the image " + walletAddress;
            //const prompt = "Generate eight distinct and visually engaging metaverse avatar icons, each one uniquely designed. Each avatar should exhibit a professional style that would fit into a theoretical Web3 project. The characters should be fictional, with a variety of features including diverse hairstyles, facial features, outfits, and accessories. It's important that each icon has a strong and distinctive identity, yet all should convey the common thread of colorful, digital-themed artistry that's characteristic of the metaverse. Each avatar should represent no sex or have any cultural similarities."; 

            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                //quality: "hd",
                size: "1024x1024",
              });
              // Send back image url
            
            console.log(response);

            return res.status(200).json({
                data: response.data.url,
                msg: "NFT Created Successfully"
            });

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                data: error,
                msg: "error"
            });
        }
    }

    static async getGeneratedNFT(req, res) {
        try {
            const personaName = req?.body?.persona;
            const walletAddress = req?.body?.wallet;

            return res.status(200).json({
                data: personaName,
                msg: "NFT Created Successfully"
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export default NFTGeneratorController;
