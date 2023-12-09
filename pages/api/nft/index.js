import { createRouter } from "next-connect";
import NFTController from "../../../src/controllers/NFTController";

const router = createRouter();

router.get(async (req, res) => {
    await NFTController.getNFTsByWalletAddress(req, res);
});

export default router.handler();