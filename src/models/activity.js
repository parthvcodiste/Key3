import mongoose from "mongoose";

const Activity = mongoose.Schema(
    {
        wallet_address: String,
        user_id: mongoose.Types.ObjectId,
        transaction_id: String,
        persona_id: mongoose.Types.ObjectId,
    },
    {
        timestamps: true,
    },
);

export default mongoose.models.Activity || mongoose.model("Activity", Activity);