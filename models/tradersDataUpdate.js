const db = require("./model");
const data = require("./tradersData.js")

try {
  console.log("\n** TRADERS TABLE **\n", Date(Date.now().toString()))
  const array = data.array
  db.batchInsert("traders", array);
} catch {
  console.log("Failed to update Traders table");
}