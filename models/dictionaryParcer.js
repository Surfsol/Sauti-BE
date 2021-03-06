const { categories, procedureComm } = require("./dictionary.js");
const { markets } = require("./marketNames");
const { products } = require("./productNames");
const { catOrder } = require("./graphLabels.js");

// ==== SEE BOTTOM OF FILE BEFORE RUNNING ====
// To run the file during testing, run: node ./models/sessionsDataParser.js

module.exports = function dictionaryParcer(data) {
  //  line 13 can be uncommented for testing and the mock object at the bottom of the file will also have to be uncommented
  //   data = mockObject;

  translatedData = [];

  data.forEach(obj => {
    Object.entries(obj).forEach(entry => {
      if (
        typeof entry[1] === "string" &&
        (entry[0] === "procedurecommoditycat" ||
          entry[0] === "procedurecommodity" ||
          entry[0] === "commoditymarket" ||
          entry[0] === "commoditycat" ||
          entry[0] === "commodityproduct")
      ) {
        obj[entry[0]] = toCaps(entry[1]);
      } //this will capitalize the first letter of each word of select props (these are the only 5 needed for changes)

      if (entry[0] === "commodityproduct") {
        if (products[entry[1]]) {
          obj[entry[0]] = products[entry[1]];
        } else {
          obj[entry[0]] = undefined;
        }
      }
      // will run translations and corections for products against the dictionary

      // if (typeof entry[1] === "string" && entry[0] === "proceduredest") {
      //   if (entry[1].includes("->")) {
      //     obj[entry[0]] = destFormat(entry[1]);
      //   }
      // } // removes the arrow from proceduredest and exchange direction

      if (entry[0] === "commoditymarket" && typeof entry[1] === "string") {
        entry[1] = toCaps(entry[1]);
        if (markets[entry[1]]) {
          obj[entry[0]] = markets[entry[1]];
        } else {
          obj[entry[0]] = undefined;
        }
      } // normalizes the market entries against the dictionary

      // translates from dictionary.js categories
      if (entry[0] === "commoditycat" && typeof entry[1] === "string") {
        // if entry[1] is a key in the dictionary
        // make sure in caps
        entry[1] = toCaps(entry[1]);
        if (Object.keys(categories).includes(entry[1])) {
          //translate
          entry[1] = categories[entry[1]];
          entry[0] = entry[1];
        } else {
          // if not in keys, set it to undefined
          entry[0] = undefined;
        }
      }

      // translates from dictionary.js procedureComm
      if (entry[0] === "procedurecommodity" && typeof entry[1] === "string") {
        // if entry[1] is a key in the dictionary
        // make sure in caps
        entry[1] = toCaps(entry[1]);
        if (Object.keys(procedureComm).includes(entry[1])) {
          //translate
          entry[1] = procedureComm[entry[1]];
          entry[0] = entry[1];
        } else {
          // if not in keys, set it to undefined
          entry[0] = undefined;
        }
      }

      if (typeof entry[1] === "string" && entry[0] === "commodityproduct") {
        const productArray = [];
        Object.entries(products).forEach(entries => {
          productArray.push(entries[0], entries[1]);
        });

        if (!productArray.includes(obj[entry[0]])) {
          obj.commodityproduct = undefined;
        }
      } // removes products that aren't present in the dictionaryParser

      if (typeof entry[1] === "string" && entry[0] === "commoditycat") {
        const categoryArray = [];
        Object.entries(categories).forEach(entries => {
          categoryArray.push(entries[0], entries[1]);
        });

        if (!categoryArray.includes(obj[entry[0]])) {
          obj.commoditycat = undefined;
        }
      } //removes categories that are not present in the dictionaryParser

      //checks if the entry type in proceeduredest is valid
      if (entry[0] === "proceduredest" && entry[1] !== undefined) {
        if (!catOrder.proceduredest.labels.includes(entry[1])) {
          obj.proceduredest = undefined;
        }
      }

      if (entry[0] === "procedurecommoditycat" && entry[1] !== undefined) {
        if (!catOrder.procedurecommoditycat.labels.includes(entry[1])) {
          obj.procedurecommoditycat = undefined;
        }
      }
      if (entry[0] === "procedureorigin" && entry[1] !== undefined) {
        if (!catOrder.procedureorigin.labels.includes(entry[1])) {
          obj.procedureorigin = undefined;
        }
      }
      if (entry[0] === "commoditycountry" && entry[1] !== undefined) {
        if (!catOrder.commoditycountry.labels.includes(entry[1])) {
          obj.commoditycountry = undefined;
        }
      }

      if (entry[0] === "exchangedirection" && entry[1] !== undefined) {
        if (!catOrder.exchangedirection.labels.includes(entry[1])) {
          obj.exchangedirection = undefined;
        }
      }
    });
    translatedData.push(obj);
  });
  return translatedData;
};

function toCaps(str) {
  str = str.toLowerCase();

  if (/ market/.test(str)) {
    str = str.replace(" market", "");
  } // Removes the word market wherever it appears so the values are the same (i.e. Busia Market becomes Busia)

  var splitStr = str.split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // Capitalizes the first letter in each string
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

// function destFormat(str) {
//   const arrow = new RegExp("->");
//   if (arrow.test(str)) {
//     str = str.split("->")[1];
//     return str;
//   }
// } //removes the arrows

//You can uncomment and use this mock object for testing.
// const mockObject = [
//   {
//     platform_sessions_id: 45495,
//     cell_num: "254000045495",
//     procedurecommodity: "Dried / Preserved Tilapia",
//     procedurecommoditycat: "VegetablE",
//     proceduredest: "maize",
//     procedurerequireddocument: undefined,
//     procedurerelevantagency: undefined,
//     procedureorigin: "EAC",
//     commoditycountry: "KEN",
//     commoditymarket: "KITale Market",
//     commoditycat: "chicken",
//     commodityproduct: "ibitunguru-umweru",
//     exchangedirection: "KES",
//     created_date: "2020-04-13T22:04:20.000Z"
//   },
//   {
//     platform_sessions_id: 45495,
//     cell_num: "254000045495",
//     procedurecommodity: "groundNuts",
//     procedurecommoditycat: "ANIMAL PRODUCT",
//     proceduredest: "KEN->UGA",
//     procedurerequireddocument: undefined,
//     procedurerelevantagency: undefined,
//     procedureorigin: "EAC",
//     commoditycountry: "KEN",
//     commoditymarket: "Peatnut Butter Market",
//     commoditycat: "Jelly",
//     commodityproduct: "Beans",
//     exchangedirection: "KES->UGX",
//     created_date: "2020-04-13T22:04:20.000Z"
//   },
//   {
//     platform_sessions_id: 45495,
//     cell_num: "254000045495",
//     procedurecommodity: "Pawpaws(papaya)",
//     procedurecommoditycat: "ANIMAL PRODUCT",
//     proceduredest: "KEN->UGA",
//     procedurerequireddocument: undefined,
//     procedurerelevantagency: undefined,
//     procedureorigin: "EAC",
//     commoditycountry: "KEN",
//     commoditymarket: "MBSA",
//     commoditycat: "farm input",
//     commodityproduct: "super rice",
//     exchangedirection: "KES->UGX",
//     created_date: "2020-04-13T22:04:20.000Z"
//   }
// ];
