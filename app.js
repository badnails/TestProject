import express from "express";
import pool from "./db.js";
import cors from "cors";
import rootRouter from "./routes/root.js";
import gatewayRouter from "./routes/gateway.js";
import {InfoGetter} from "./middleware/getter.js";

const app = express();
const corsOptions = {
  origin: 'http://127.0.0.1:5173', // your Vite dev server URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // add your custom headers if any
  credentials: true, // if you send cookies or auth headers
};

app.use(cors(corsOptions));

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