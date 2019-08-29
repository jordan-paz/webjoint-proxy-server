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
const getOrder = async (orderid, authorization) => {
  const url = `https://app.webjoint.com/prod/api/orders/${orderid}`;
  try {
    return await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Referer: "https://sacramentoconfidential.webjoint.com/shop/index.html",
        Authorization: authorization
      }
    })
      .then(response => response.json())
      .catch(error => {
        console.log(error);
      });
  } catch (err) {
    console.log("error:" + err);
    return res.status(500).send("Server Error");
  }
};

// MUST PASS IDTOKEN AS AUTHORIZATION!!! //
const createOrder = (deliveryAddress, authorization) => {
  try {
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
      body: deliveryAddress
    }).then(response => {
      return response.json();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

const addToOrder = (orderId, productId, quantity, authorization) => {
  try {
    const url = `https://app.webjoint.com/prod/api/orders/${orderId}/addToCart/${productId}/${quantity}?facilityId=51`;
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Referer: "https://sacramentoconfidential.webjoint.com/shop/index.html",
        Authorization: authorization
      }
    }).then(response => {
      return response.json();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

// @route         GET /cart
// @description   Get cart
// @access        Users
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { authorization } = req.headers;
    res.send(await getOrder(orderId, authorization));
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
    const { deliveryAddress } = req.body;

    const response = await createOrder(deliveryAddress, authorization);
    if (response.name === "ShopClosedError") {
      return res.status(200).json({
        error: "SHOP_CLOSED",
        msg: "Sorry, the shop is closed"
      });
    }
    res.send(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

// @route         POST /addToOrder
// @description   Add a product to order
// @access        Users
router.post("/:orderId/addToOrder/:productId/:quantity?", async (req, res) => {
  try {
    let quantity;
    if (req.params.quantity) {
      quantity = req.params.quantity;
    } else {
      quantity = 1;
    }
    const { orderId, productId } = req.params;
    const { authorization } = req.headers;

    const response = await addToOrder(
      orderId,
      productId,
      quantity,
      authorization
    );

    if (response.name === "ShopClosedError") {
      return res.status(200).json({
        error: "SHOP_CLOSED",
        msg: "Sorry, the shop is closed"
      });
    }
    return res.send(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
