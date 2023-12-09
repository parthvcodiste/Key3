import connectDB from "../lib/connectDB";
import activity from "../models/activity";

class ActivityController {
    static async getActivitiesByWalletAddress(req, res) {
        try {
            await connectDB();
            const wallet_address = req?.query?.wallet_address;
            const page = req?.query?.page;
            const limit = req?.query?.limit;

            const totalActivities = await activity.countDocuments({
                wallet_address: wallet_address,
            });
            const activitiesData = await activity.find({
                wallet_address: wallet_address,
            }).limit(limit).skip((page * limit) - limit);

            return res.status(200).json({
                data: {
                    records: activitiesData,
                    total: totalActivities,
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
export default ActivityController;