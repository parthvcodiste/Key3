import { createRouter } from "next-connect";
import AnalyseController from "../../../src/controllers/AnalyseController";

const router = createRouter();

router.post(async (req, res) => {
    await AnalyseController.analyseNFTs(req, res);
});

export default router.handler();