import { Router } from "express";
import { get_transaction_details, generate_trx_id } from "../controllers/con_gateway.js";
import {apiAuth} from "../middleware/apiAuth.js"
const router = Router();

router.post("/query", async (req, res) => {
  try {
    if (!req.pool) {
      return res.status(500).send("Database connection not available");
    }
    const query = req.body.query;
    const result = await req.pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

router.get('/get-trx-details/:id', apiAuth, get_transaction_details);
router.post('/create-trx', apiAuth, generate_trx_id);

export default router;