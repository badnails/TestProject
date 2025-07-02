export async function InfoGetter(req, res, next) {
  try {
    const { username } = req.body;

    if (!username) {
      return errorHandler(400, { valid: false, message: "Username is required" }, res);
    }

    const get = await req.pool.query(
      `SELECT accountid, accounttype, availablebalance, accountstatus 
       FROM accounts 
       WHERE username = $1`,
      [username]
    );

    if (get.rows.length === 0) {
      return errorHandler(404, { valid: false, message: "Username not found" }, res);
    }

    const { accountid, accounttype, availablebalance, accountstatus } = get.rows[0];

    if (accountstatus !== "ACTIVE") {
      return errorHandler(403, {
        valid: false,
        message: `Account status invalid: ${accountstatus}`
      }, res);
    }

    req.user = {
      accountid,
      accounttype,
      availablebalance,
      accountstatus
    };

    next();

  } catch (err) {
    console.error("API Auth error:", err);
    return errorHandler(500, { valid: false, message: "Internal server error" }, res);
  }
}

function errorHandler(status, json, res) {
  return res.status(status).json(json);
}
