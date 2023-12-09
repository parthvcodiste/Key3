import mongoose from "mongoose";

const User = mongoose.Schema(
    {
        wallet_address: String,
        name: String,
        avatar_url: String,
        cover_url: String,
        bio: String,
        is_nft_fetched: Boolean,
        is_persona_analysed: Boolean,
    },
    {
        timestamps: true,
    },
);

export default mongoose.models.User || mongoose.model("User", User);