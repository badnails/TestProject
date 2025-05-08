import express from "express";
import pool from "./db.js";
const app = express();

app.get("/query", async (req, res) => {
  try {
    const q = req.headers["sqlquery"];
    const result = await pool.query(q);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.listen(3000, () => {
  console.log(`Server running`);
});
