import { createRouter } from "next-connect";
import FetchNFTsController from "../../../src/controllers/FetchNFTsController";

const router = createRouter();

router.post(async (req, res) => {
    await FetchNFTsController.fetchNFTs(req, res);
});

export default router.handler();