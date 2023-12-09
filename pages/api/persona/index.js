import { createRouter } from "next-connect";
import PersonaController from "../../../src/controllers/PersonaController";

const router = createRouter();

router.get(async (req, res) => {
    await PersonaController.getPersonas(req, res);
});

export default router.handler();