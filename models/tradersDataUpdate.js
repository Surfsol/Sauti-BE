const db = require("./model");
const data = require("./tradersData.js")

try {
  db.truncateTable("traders");
  console.log("\n** TRADERS TABLE **\n", Date(Date.now().toString()));
  const array = data.array
  db.batchInsert("traders", array)
  console.log("\n** TRADERS TABLE **\n", Date(Date.now().toString()))
} catch {
  console.log("Failed to update Traders table");
}