const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Fetch cart data from webjoint API //
const getOrder = (
  companyid,
  facilityid,
  customerid,
  orderid,
  authorization
) => {
  const url = `https://app.webjoint.com/prod/api/orders/${companyid}-${facilityid}-${customerid}-${orderid}`;

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Referer: "https://sacramentoconfidential.webjoint.com/shop/index.html",
      Authorization: authorization
    }
  }).then(response => response.json());
};

// MUST PASS IDTOKEN AS AUTHORIZATION!!! //
const createOrder = (deliveryAddress, authorization) => {
  const url = `https://app.webjoint.com/prod/api/facilities/51/createOrder/Website/Delivery`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Referer: "https://sacramentoconfidential.webjoint.com/shop/index.html",
      Authorization: authorization,
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(deliveryAddress)
  }).then(response => response.json());
};

const addToOrder = ({
  companyid,
  facilityid,
  customerid,
  orderid,
  productid,
  variantid,
  authorization
}) => {
  const url = `https://app.webjoint.com/prod/api/orders/${companyid}-${facilityid}-${customerid}-${orderid}/addToCart/${companyid}-${facilityid}-${productid}-${variantid}/1?facilityId=51`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Referer: "https://sacramentoconfidential.webjoint.com/shop/index.html",
      Authorization: authorization
    }
  }).then(response => response.json());
};

// @route         GET /cart
// @description   Get cart
// @access        Users
router.get("/order", async (req, res) => {
  try {
    const {
      companyid,
      facilityid,
      customerid,
      orderid,
      authorization
    } = req.headers;
    res.send(
      await getOrder(companyid, facilityid, customerid, orderid, authorization)
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

// @route         POST /createCart
// @description   Create cart
// @access        Users
router.post("/createOrder", async (req, res) => {
  try {
    const { authorization } = req.headers;
    const deliveryAddress = req.body;
    res.send(await createOrder(deliveryAddress, authorization));
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

// @route         POST /createOrder
// @description   Create order
// @access        Users
router.post("/addToOrder", async (req, res) => {
  try {
    res.send(await addToOrder(req.headers));
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
