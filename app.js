import express from "express";
import pool from "./db.js";
import cors from "cors";
import rootRouter from "./routes/root.js";
import gatewayRouter from "./routes/gateway.js";
import {InfoGetter} from "./middleware/getter.js";

const app = express();
app.use(cors());

app.use(express.json());

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});


app.use((req, res, next) => {
  if(pool){
    req.pool = pool;
    next();
  }else{
    res.status(500).json({
      error: "DB Connection Failed"
    })
  }
}
);

app.use("/api", rootRouter);
app.use("/api/gateway", InfoGetter, gatewayRouter);

const port = process.env.PORT || 8080;

app.use((err, req, res, next) => {
  console.error("Unhandled middleware error:", err);
  res.status(500).json({ valid: false, message: "Unexpected server error" });
});


app.listen(port, () => {
  console.log(`Server running on ${port}`);
});