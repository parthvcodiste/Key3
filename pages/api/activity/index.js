import { createRouter } from "next-connect";
import ActivityController from "../../../src/controllers/ActivityController";

const router = createRouter();

router.get(async (req, res) => {
    await ActivityController.getActivitiesByWalletAddress(req, res);
});

export default router.handler();