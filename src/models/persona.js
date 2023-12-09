import mongoose from "mongoose";

const Persona = mongoose.Schema(
    {
        wallet_address: String,
        user_id: mongoose.Types.ObjectId,
        persona_name: String,
        persona_description: String,
        distribution_percentage: Number,
        image_url: String,
        is_claimed: Boolean,
        nft_id: String,
        minting_status: String,
        minting_tx_id: String,
        minted_token_id: String,
        minted_contract_address: String,
    },
    {
        timestamps: true,
    },
);

export default mongoose.models.Persona || mongoose.model("Persona", Persona);