const superagent = require("superagent");
const fs = require("fs");
const dayjs = require("dayjs");
const csv2mysql = require("csv2mysql");
const path = require("path");
const dbUtils = require("../../db");
const csvtojson = require("csvtojson");
const csvPath = path.resolve(__dirname, "../csv/three.csv");
console.log("开始时间" + dayjs().format("YYYYMMDD-hh:mm:ss"));

superagent
  .get("http://pim.coltorti.it:8080/csvExport/export/allProducts.csv")
  .auth("vip", "05mDw01F")
  .pipe(fs.createWriteStream(csvPath))
  .on("data", (chunk) => {
    console.log(chunk);
  })
  .on("finish", () => {
    console.log(">>>>>.完成");
  });
