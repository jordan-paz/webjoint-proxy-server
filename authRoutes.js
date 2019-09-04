const express = require("express");
const router = express.Router();
const cors = require("cors");
const webjointApi = require("./webjoint-api");

router.use(cors());

router.post("/login", async (req, res) => {
  try {
    res.send(await webjointApi.login(req.body.email, req.body.password));
  } catch (err) {
    console.log("error:" + err);
    return res.status(500).send("Server Error");
  }
});

router.get("/checkEmail/:email", async (req, res) => {
  try {
    res.send(await webjointApi.checkEmail(req.params.email));
  } catch (err) {
    console.log("error:" + err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
