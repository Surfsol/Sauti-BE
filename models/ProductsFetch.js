const fetch = require("node-fetch");
const fs = require("fs");

let url =
  "http://sautiafrica.org/queryengine/apis/assets/dictionaries.php?api=1&data=products";

let settings = { method: "Get" };

let data;
let productNames = async () => {
  let response = await fetch(url, settings);
  if (!response.ok) {
    throw new Error("HTTP error! status: ${response.status}");
  } else {
    let data = await response.json();
    data = JSON.stringify(data);
    let file = "module.exports = {products :" + data + "}";
    fs.writeFile("models/productNames.js", file, function (err) {
      if (err) throw err;
      console.log("saved");
    });
  }
};

productNames().then(console.log);

module.exports = { productNames };