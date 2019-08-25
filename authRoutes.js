const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const cors = require("cors");

router.use(cors());

const login = (email, password) => {
  const url = "https://app.webjoint.com/prod/api/users/login";
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Referer: "https://sacramentoconfidential.webjoint.com/shop/index.html"
    }
  }).then(response => response.json());
};

router.post("/login", async (req, res) => {
  try {
    res.send(await login(req.body.email, req.body.password));
  } catch (err) {
    console.log("error:" + err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
