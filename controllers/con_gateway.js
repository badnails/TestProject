import bcrypt from "bcrypt";

export async function get_transaction_details(req, res) {
  try {
    const trxID = req.params.id;

    if (!trxID) {
      return res.status(400).json({
        valid: false,
        message: "Transaction ID not provided",
      });
    }

    const query = `
            SELECT 
                u.transactiontypename, 
                a.username, 
                t.subamount, 
                t.feesamount, 
                t.transactionstatus,
                t.completiontimestamp
            FROM transactions t 
            JOIN transactiontype u ON t.transactiontypeid = u.transactiontypeid 
            JOIN accounts a ON t.destinationaccountid = a.accountid 
            WHERE t.transactionid = $1
        `;

    const { rows } = await req.pool.query(query, [trxID]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        valid: false,
        message: "Transaction not found",
      });
    }

    const trx = rows[0];

    // if (trx.transactiontypename !== expType) {
    //   return res.status(400).json({
    //     valid: false,
    //     message: "Invalid transaction type",
    //   });
    // }

    // if (trx.transactionstatus === "COMPLETED") {
    //   return res.status(400).json({
    //     valid: false,
    //     message: "Bill has already been paid",
    //   });
    // }

    return res.status(200).json({
      valid: true,
      transactionDetails: {
        status: trx.transactionstatus,
        recipient: trx.username,
        subamount: trx.subamount,
        feesamount: trx.feesamount,
        completed_on: !trx.completiontimestamp ? null : trx.completiontimestamp,
      },
    });
  } catch (err) {
    console.error("Error fetching transaction details:", err);
    return res.status(500).json({
      valid: false,
      message: "Internal Server Error",
    });
  }
}

export async function validateUser(req, res) {
  try {
    const amount = req.body.amount;

    if (amount > req.user.availablebalance) {
      return res.status(403).json({
        valid: false,
        message: "Insufficient Balance",
      });
    }

    return res.status(200).json({
      valid: true,
      message: "User Validated",
    });

  } catch (error) {
    console.error("User Validation Error", error);
    return res.status(500).json({
      valid: false,
      message: "ISE",
    });
  }
}

export async function finalizeTransaction(req, res) {
  try {
    const {password, transactionid} = req.body;
    console.log(password+' '+transactionid+' '+req.user.accountid);
    const response = await req.pool.query(
      "SELECT pinhash FROM accounts WHERE accountid=$1",
      [req.user.accountid]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        valid: false,
        message: "Invalid Username",
      });
    }

    const match = await bcrypt.compare(password, response.rows[0].pinhash);
    console.log(password + " " + response.rows[0].pinhash + " " + match);
    if (match) {
      const final_res = await req.pool.query(
        "SELECT * FROM finalize_transaction($1, $2)",
        [transactionid, req.user.accountid]
      );
      if (final_res.rows.length === 0) {
        return res.status(404).json({
          valid: false,
          message: "Transaction Failed",
        });
      }

      const data = final_res.rows[0].finalize_transaction;
      console.log(data);

      res.status(200).json({
        valid: data.valid,
        message: data.message,
      });
    } else {
      return res.status(403).json({
        valid: false,
        messagge: "Invalid PIN",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      valid: false,
      message: "DB unreachable",
    });
  }
}

export async function generate_trx_id(req, res) {
  try {
    const { amount } = req.body;
    if ( !amount)
      return res.status(400).json({
        valid: false,
        message: "Amount missing",
      });

    const query = `SELECT create_trx_id($1, $2, $3)`;
    const result = await req.pool.query(query, [req.user.accountid, 1, amount]);
    console.log(result.rows[0]);
    return res.status(200).json({
      valid: true,
      transacitonId: result.rows[0].create_trx_id
    })
  } catch (error) {
    console.error("Error generating transaction ID:", error);
    return res.status(500).json({
      valid: false,
      message: "Internal Server Error",
    });
  }
}
