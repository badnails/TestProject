import { Router } from "express";
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

export default router;