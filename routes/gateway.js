import { Router } from "express";
import {validateUser, finalizeTransaction} from "../controllers/con_gateway.js";
const router = Router();


router.post('/validate-user', validateUser)
router.post('/finalize-transaction', finalizeTransaction)

export default router;