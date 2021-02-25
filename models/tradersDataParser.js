require("dotenv").config();
let unserializer = require("php-unserialize");
const { tradersDictionary } = require("./tradersDataDictionary");

const db = require("./model");

let cor = 0;
let ageVar = 0;
let borderCrossingVar = 0;
let borderLocationVar = 0;
let educationVar = 0;
let genderVar = 0;
let languageVar = 0;
let primaryVar = 0;
let growVar = 0;
let apostrophe = 0;
let allgender = 0;
let noComma = 0;

// tradersDataParser.js withdraws user information from PHP serialized data in `platform_sessions2` table in database
// Many users have submit more than one request so there are ~80,000 entries in `platform_sessions2` but only ~11,000 users in `traders` table
// This applies all user details to their phone number such as: age, gender, education, border crossing frequency, etc.

// ==== SEE BOTTOM OF FILE BEFORE RUNNING ====
// To run the file during testing, run: node ./models/tradersDataParser.js

// First Lance's Data is saved in array = []
try {
  db.findLanceData().then(sessions => {
    let array = [];

    sessions.map(element => {
      let object = {};
      object.cell_num = element.cell_num;
      array.push(object);
    });

    // At this point, "array" contains a bunch of phone numbers, some that appear multiple times
    // The loop below removes all duplicate phone numbers, so they only appear once, and form the skeleton of what the object will look like
    const distinctUsers = [];
    const map = new Map();
    for (const item of array) {
      // for each element of the array that contains duplicates
      if (!map.has(item.cell_num)) {
        //if map does not contain an object with the cell_num (userid), it includes it and pushes it to result
        map.set(item.cell_num, true);
        distinctUsers.push({
          cell_num: item.cell_num,
          gender: null,
          age: null,
          education: null,
          crossing_freq: null,
          produce: null,
          primary_income: null,
          language: null,
          country_of_residence: null,
          crossing_location: null
        });
      }
    }
    getGender(sessions, distinctUsers);
  });

  // These functions fill in the 'null' values in the user object:
  // gender, age, education, crossing frequency, produce, primary income, language, and country of residence
  getGender = (sessions, distinctUsers) => {
    let arrayWithGender = distinctUsers;
    sessions.map(element => {
      let num = element.cell_num;
      if (
        element.data.includes("survey-1-gender") ||
        element.data.includes("TMEA_Gender") ||
        element.data.includes("survey-id20-gender")
      ) {
        allgender += 1;
        const unSerialData = unserializer.unserialize(element.data);
        let value;
        if (unSerialData["survey-1-gender"]) {
          value = unSerialData["survey-1-gender"]["0"];
          genderVar += 1;
          arrayWithGender.map(user => {
            if (user.cell_num === num) {
              user.gender = tradersDictionary[value];
            }
          });
        } else if (
          unSerialData["TMEA_Gender"]
          //tradersDictionary.unSerialData["TMEA_Gender"]["0"]
        ) {
          genderVar += 1;
          value = unSerialData["TMEA_Gender"]["0"];
          arrayWithGender.map(user => {
            if (user.cell_num === num) {
              user.gender = tradersDictionary[value];
            }
          });
        } else if (unSerialData["survey-id20-gender"]) {
          genderVar += 1;
          value = unSerialData["survey-id20-gender"]["0"];
          arrayWithGender.map(user => {
            if (user.cell_num === num) {
              user.gender = tradersDictionary[value];
            }
          });
        }
      }
    });

    getAge(sessions, arrayWithGender);
  };

  getAge = (sessions, arrayWithGender) => {
    let arrayWithAge = arrayWithGender;

    sessions.map(element => {
      let num = element.cell_num;
      if (element.data.includes("survey-1-age")) {
        const unSerialData = unserializer.unserialize(element.data);
        if (unSerialData["survey-1-age"]["0"] !== undefined) {
          ageVar += 1;
          let value = unSerialData["survey-1-age"]["0"];
          switch (value) {
            case "10-20":
              value = "<20";
              break;
            case "20-30":
              value = "21-30";
              break;
            case "30-40":
              value = "31-40";
              break;
            case "40-50":
              value = "41-50";
              break;
            case "60-70":
              value = ">60";
              break;
            default:
              break;
          }
          arrayWithAge.map(user => {
            if (user.cell_num === num) {
              user.age = value;
            }
          });
        }
      }
    });

    getEducation(sessions, arrayWithAge);
  };

  getEducation = (sessions, arrayWithAge) => {
    let arrayWithEducation = arrayWithAge;
    sessions.map(element => {
      let num = element.cell_num;
      if (element.data.includes("survey-1-education")) {
        const unSerialData = unserializer.unserialize(element.data);
        let value = unSerialData["survey-1-education"]["0"];
        if (tradersDictionary[value]) {
          arrayWithEducation.map(user => {
            if (user.cell_num === num) {
              user.education = tradersDictionary[value];
            }
          });
        }
      }
    });

    getCrossingFreq(sessions, arrayWithEducation);
  };

  getCrossingFreq = (sessions, arrayWithEducation) => {
    let arrayWithCrossingFreq = arrayWithEducation;
    sessions.map(element => {
      let num = element.cell_num;
      if (element.data.includes("survey-1-crossingfreq")) {
        const unSerialData = unserializer.unserialize(element.data);
        let value = unSerialData["survey-1-crossingfreq"]["0"];
        if (tradersDictionary[value]) {
          arrayWithCrossingFreq.map(user => {
            if (user.cell_num === num) {
              user.crossing_freq = tradersDictionary[value];
            }
          });
        }
      }
    });
    getProduce(sessions, arrayWithCrossingFreq);
  };

  getProduce = (sessions, arrayWithCrossingFreq) => {
    let arrayWithProduce = arrayWithCrossingFreq;
    sessions.map(element => {
      let num = element.cell_num;
      if (element.data.includes("survey-2-produce")) {
        const unSerialData = unserializer.unserialize(element.data);
        const value = unSerialData["survey-2-produce"]["0"];
        if (tradersDictionary[value]) {
          arrayWithProduce.map(user => {
            if (user.cell_num === num) {
              user.produce = tradersDictionary[value];
            }
          });
        }
      }
    });
    getPrimaryIncome(sessions, arrayWithProduce);
  };

  getPrimaryIncome = (sessions, arrayWithProduce) => {
    let arrayWithPrimaryIncome = arrayWithProduce;
    sessions.map(element => {
      let num = element.cell_num;
      if (element.data.includes("survey-1-primaryincome")) {
        const unSerialData = unserializer.unserialize(element.data);
        const value = unSerialData["survey-1-primaryincome"]["0"];
        if (tradersDictionary[value]) {
          arrayWithPrimaryIncome.map(user => {
            if (user.cell_num === num) {
              primaryVar += 1;
              user.primary_income = tradersDictionary[value];
            }
          });
        }
      }
    });

    getLanguage(sessions, arrayWithPrimaryIncome);
  };

  getLanguage = (sessions, arrayWithPrimaryIncome) => {
    let arrayWithLanguage = arrayWithPrimaryIncome;
    sessions.map(element => {
      let num = element.cell_num;
      let strElement = element.data;
      if (strElement.includes("'")) {
        if (strElement.includes("English")) {
          arrayWithLanguage.map(user => {
            if (user.cell_num === num) {
              user.language = "English";
            }
          });
        } else if (strElement.includes("Swahili")) {
          arrayWithLanguage.map(user => {
            if (user.cell_num === num) {
              user.language = "Swahili";
            }
          });
        } else if (strElement.includes("Luganda")) {
          arrayWithLanguage.map(user => {
            if (user.cell_num === num) {
              user.language = "Luganda";
            }
          });
        } else if (strElement.includes("Kinyarwanda")) {
          arrayWithLanguage.map(user => {
            if (user.cell_num === num) {
              user.language = "Kinyarwanda";
            }
          });
        } else if (strElement.includes("Lukiga")) {
          arrayWithLanguage.map(user => {
            if (user.cell_num === num) {
              user.language = "Lukiga";
            }
          });
        }
      }
      if (strElement.includes("language") && !strElement.includes("'")) {
        const unSerialData = unserializer.unserialize(strElement);
        let value = unSerialData["language"]["0"];
        if (unSerialData[value]) {
          languageVar += 1;
          arrayWithLanguage.map(user => {
            if (user.cell_num === num) {
              user.language = tradersDictionary.data;
            }
          });
        }
      }
    });
    getCountry(sessions, arrayWithLanguage);
  };

  getCountry = (sessions, arrayWithLanguage) => {
    let arrayWithCountry = arrayWithLanguage;

    arrayWithCountry.map(user => {
      let num = user.cell_num;
      if (/^254/.test(num)) {
        cor += 1;
        user.country_of_residence = "KEN";
      } else if (/^256/.test(num)) {
        cor += 1;
        user.country_of_residence = "UGA";
      } else if (/^250/.test(num)) {
        cor += 1;
        user.country_of_residence = "RWA";
      } else if (/^255/.test(num)) {
        cor += 1;
        user.country_of_residence = "TZA";
      }
    });

    getcrossing_location(sessions, arrayWithCountry);
  };
  let arrayBorder = [];
  getcrossing_location = (sessions, arrayWithCountry) => {
    let arrayWithCrossingLocation = arrayWithCountry;
    sessions.map(element => {
      let num = element.cell_num;
      if (element.data.includes("survey-1-border")) {
        const unSerialData = unserializer.unserialize(element.data);
        let value;
        if (!unSerialData["survey-1-border"]) {
          value = unSerialData["survey-1-borderexp"]["0"];
        } else {
          value = unSerialData["survey-1-border"]["0"];
          if (tradersDictionary[value]) {
            borderLocationVar += 1;
            arrayWithCrossingLocation.map(user => {
              if (user.cell_num === num) {
                arrayBorder.push(tradersDictionary[value]);
                user.crossing_location = tradersDictionary[value];
              }
            });
          }
        }
      }
    });

    let setBorder = [...new Set(arrayBorder)];

    console.log({
      cor,
      ageVar,
      borderCrossingVar,
      borderLocationVar,
      educationVar,
      genderVar,
      languageVar,
      primaryVar,
      growVar,
      apostrophe,
      setBorder,
      allgender,
      noComma
    });

    try {
      console.log("\n** TRADERS TABLE **\n", Date(Date.now().toString()));
      // THIS DELETES ALL ENTRIES IN TABLE - COMMENT OUT THIS LINE WHEN TESTING
      db.truncateTable("traders");
      // THIS INSERTS ~11,000 ENTRIES INTO TABLE - COMMENT OUT THIS LINE WHEN TESTING
      db.batchInsert("traders", arrayWithCrossingLocation);
    } catch {
      console.log("Failed to batch insert");
    }
  };
} catch ({ message }) {
  console.log("Failed file", message);
}

// country of res: 15366
// age :1373
// border crossing: 1275
// border location: 939
// education level: 2154
// gender : 2466
// language:  15026
// primary income: 1141
// grow own: 747
