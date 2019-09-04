const fetch = require("node-fetch");

module.exports = {
  login: (email, password) => {
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
  },

  checkEmail: email => {
    const url = `https://app.webjoint.com/prod/api/users/check?email=${email}`;
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Referer: "https://sacramentoconfidential.webjoint.com/shop/index.html"
      }
    }).then(response => response.json());
  },

  signUp: () => {
    const url = `https://app.webjoint.com/prod/api/users`;
  },

  getOrder: async (orderid, authorization) => {
    const url = `https://app.webjoint.com/prod/api/orders/${orderid}`;
    try {
      return await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Referer:
            "https://sacramentoconfidential.webjoint.com/shop/index.html",
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
  },

  createOrder: (deliveryAddress, authorization) => {
    try {
      const url = `https://app.webjoint.com/prod/api/facilities/51/createOrder/Website/Delivery`;
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Referer:
            "https://sacramentoconfidential.webjoint.com/shop/index.html",
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
  },

  addToOrder: (orderId, productId, quantity, authorization) => {
    try {
      const url = `https://app.webjoint.com/prod/api/orders/${orderId}/addToCart/${productId}/${quantity}?facilityId=51`;
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Referer:
            "https://sacramentoconfidential.webjoint.com/shop/index.html",
          Authorization: authorization
        }
      }).then(response => {
        return response.json();
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server Error");
    }
  }
};
