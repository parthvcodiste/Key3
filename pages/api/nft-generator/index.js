import { createRouter } from "next-connect";
import NFTGeneratorController from "../../../src/controllers/NFTGeneratorController";

const router = createRouter();

router.post(async (req, res) => {
  await NFTGeneratorController.generateNFT(req, res);
}).get(async (req, res) => {
  await NFTGeneratorController.getGeneratedNFT(req, res);
});

export default router.handler();