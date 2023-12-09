import Moralis from "moralis";


async function moralis() {
    let moralis = false;
    if (
        process.env.APP_ENVIRONMENT === "production" ||
        process.env.APP_ENVIRONMENT === "staging"
    ) {
        moralis = await Moralis.start({
            apiKey: process.env.MORALIS_API_KEY
        });
    } else {
        if (!global.moralis) {
            await Moralis.start({
                apiKey: process.env.MORALIS_API_KEY
            });
            global.moralis = true;
        }
        moralis = global.moralis;
    }
}

export default moralis;