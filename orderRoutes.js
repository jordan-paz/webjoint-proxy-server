const express = require("express");
const router = express.Router();
const webjointApi = require("./webjoint-api");

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// @route         GET /cart
// @description   Get cart
// @access        Users
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { authorization } = req.headers;
    res.send(await webjointApi.getOrder(orderId, authorization));
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

    const response = await webjointApi.createOrder(
      deliveryAddress,
      authorization
    );
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

    const response = await webjointApi.addToOrder(
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
