import express from "express";
import pool from "./db.js";
const app = express();

app.use(express.json())

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

app.post("/create-payment", async (req, res)=>{
  console.log("Incoming Req");
  try{
    const {destAcc, amount} = req.body
    console.log("Body OK")
    const result = await pool.query('SELECT create_transaction($1, $2)', [destAcc, amount]);
    if(!result.rows[0]){
      console.log("Result OK")
    }
    trid = result.rows[0].create_transaction;
    paymentURL = `localhost:3000/pay/${trid}`;

    res.json({
      status: "Success",
      transactionID: trid,
      paymentURL: paymentURL
    });

  }catch(e){
    res.json({
      status: "Failed",
      transactionID: null
    })
  }
});

app.

app.listen(3000, () => {
  console.log(`Server running`);
});
