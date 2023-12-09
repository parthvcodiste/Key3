import mongoose from "mongoose";

const NFT = mongoose.Schema(
    {
        user_id: mongoose.Types.ObjectId,
        wallet_address: String,
        token_address: String,
        token_id: String,
        contract_type: String,
        name: String,
        symbol: String,
        token_uri: String,
        metadata: String,
        token_hash: String,
        image: String,
    },
    {
        timestamps: true,
    },
);

export default mongoose.models.NFT || mongoose.model("NFT", NFT);