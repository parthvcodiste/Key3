import OpenAI from 'openai';
const { OPENAPI_API_KEY } = process.env;

export const nftGenerator = async (personaName, walletAddress) => {
    const openai = new OpenAI({
        apiKey: OPENAPI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
    });

    const prompt = "Create a poster with strong colors for a user with a persona " + personaName + " and insert a text over the image " + walletAddress;

    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
    });

    return response?.data;
}