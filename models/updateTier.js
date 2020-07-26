require("dotenv").config();

const db = require("./model");



function addDays(date, days) {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
}

const updateExDate = [];

try {
  db.getDataBankUsers().then(user => {
    valuesArr = Object.values(user);
    let count = 0;
    for (let i = 0; i < valuesArr.length; i++) {
      let regDate = valuesArr[i].registration_date;
      let today = new Date();
      let endFree = addDays(regDate, 14);

      if (endFree < today && valuesArr[i].tier === "FREE") {
        valuesArr[i].tier = "EXPIRED";
        updateExDate.push(valuesArr[i]);
      } else {
        updateExDate.push(valuesArr[i]);
      }
    }
    //console.log(typeof updateExDate);
    try {
        console.log("\n** TRADERS TABLE **\n", Date(Date.now().toString()));
        // THIS DELETES ALL ENTRIES IN TABLE - COMMENT OUT THIS LINE WHEN TESTING
        db.truncateTable("databank_users_tier");
        // THIS INSERTS ~11,000 ENTRIES INTO TABLE - COMMENT OUT THIS LINE WHEN TESTING
        db.batchInsert("databank_users_tier", updateExDate);
      } catch {
        console.log("Failed to batch insert");
      }
  });
} catch ({ message }) {
  console.log("Failed to find", message);
}
