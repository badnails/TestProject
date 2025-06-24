import { validate as uuidValidate } from 'uuid';

export async function apiAuth(req, res, next) {
  try {
    const apikey = req.headers["apikey"];
    const destAcc = req.body.destAcc;

    if (!apikey || !destAcc) {
      return errorHandler(400, { valid: false, message: "Missing API key or destination account" }, res);
    }

    if (!uuidValidate(apikey)) {
      return errorHandler(400, { valid: false, message: "Malformed API key" }, res);
    }

    const query = "SELECT * FROM apikey WHERE apikey = $1";
    const result = await req.pool.query(query, [apikey]);

    if (result.rows.length === 0) {
      return errorHandler(403, { valid: false, message: "Invalid API key" }, res);
    }

    const keyData = result.rows[0];

    if (!keyData.isactive) {
      const expDate = new Date(keyData.expires_on).toISOString();
      return errorHandler(403, { valid: false, message: `API key expired on ${expDate}` }, res);
    }

    if (destAcc.toString() !== keyData.accountid) {
      return errorHandler(403, { valid: false, message: "API key does not match destination account" }, res);
    }

    next();

  } catch (err) {
    console.error("API Auth error:", err);
    return errorHandler(500, { valid: false, message: "Internal server error" }, res);
  }
}

function errorHandler(status, json, res) {
  return res.status(status).json(json);
}