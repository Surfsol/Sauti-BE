const db = require("./model");

try {
  console.log("\n** TRADERS TABLE **\n", Date(Date.now().toString()));
  // THIS DELETES ALL ENTRIES IN TABLE - COMMENT OUT THIS LINE WHEN TESTING
  db.truncateTable("traders");
} catch {
  console.log("Failed to delete traders table");
}