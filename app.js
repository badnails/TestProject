import express from "express";
import pool from "./db.js";
import cors from "cors";
import rootRouter from "./routes/root.js";
import gatewayRouter from "./routes/gateway.js";

const app = express();
app.use(cors());
app.use(express.json());

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
app.use("/api/gateway", gatewayRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});