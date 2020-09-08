const fetch = require("node-fetch");
const fs = require("fs");
//get market names from Lance's site and write them to marketNames.js
let url =
  "http://sautiafrica.org/queryengine/apis/assets/dictionaries.php?api=1&data=markets";

let settings = { method: "Get" };


let marketNames = async () => {
  let response = await fetch(url, settings);
  if (!response.ok) {
    throw new Error("HTTP error! status: ${response.status}");
  } else {
    let data = await response.json();
    data = JSON.stringify(data);
    let file = "module.exports = {markets test ran :" + data + "}";
    fs.writeFile("models/marketNames.js", file, function (err) {
      if (err) throw err;
      console.log("saved");
    });
  }
};

marketNames().then(console.log);

module.exports = { marketNames };
