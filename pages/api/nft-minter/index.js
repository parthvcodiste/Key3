import { createRouter } from "next-connect";
import NFTMintAirdropController from "../../../src/controllers/NFTMintAirdropController";

const router = createRouter();

router.post(async (req, res) => {
  await NFTMintAirdropController.mintAndAirdropPersonaNFT(req, res);
}).get(async (req, res) => {
  await NFTMintAirdropController.statusOfMint(req, res);
});

export default router.handler();