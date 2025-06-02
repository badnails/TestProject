import { Router } from "express";
import { get_transaction_details, validateUser, finalizeTransaction } from "../controllers/con_gateway.js";
const router = Router();

router.get('/get-trx-details', get_transaction_details);
router.get('/validate-user', validateUser)
router.post('/finalize-transaction', finalizeTransaction)

export default router;