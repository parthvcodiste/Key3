import { createRouter } from "next-connect";
import LoginController from "../../../src/controllers/LoginController";

const router = createRouter();

router.post(async (req, res) => {
    await LoginController.login(req, res);
}).put(async (req, res) => {
    await LoginController.update(req, res);
}).get(async (req, res) => {
    await LoginController.get(req, res);
});

export default router.handler();