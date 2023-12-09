import connectDB from "../lib/connectDB";
import persona from "../models/persona";

class PersonaController {
    static async getPersonas(req, res) {
        try {
            await connectDB();
            const wallet_address = req?.query?.wallet_address;
            const page = req?.query?.page;
            const limit = req?.query?.limit;

            const totalPersonas = await persona.countDocuments({
                wallet_address: wallet_address,
            });
            const personas = await persona.find({
                wallet_address: wallet_address,
            }).limit(limit).skip((page * limit) - limit);

            return res.status(200).json({
                data: {
                    records: personas,
                    total: totalPersonas,
                },
                msg: "Persona fetched successfully",
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
export default PersonaController;