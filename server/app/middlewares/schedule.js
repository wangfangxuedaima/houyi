const schedule = require("node-schedule");
const dayjs = require("dayjs");
const rule = new schedule.RecurrenceRule();
const Product = require("../models/product");
rule.minute = [0, 30];

module.exports = (ctx, next) => {
  try {
    schedule.scheduleJob(rule, () => {
      console.log("开始时间" + dayjs().format("YYYYMMDD-hh:mm:ss"));
      Product.inputProducts2Db("http://pim.coltorti.it:8080/csvExport/export/allProducts.csv", "vip", "05mDw01F");
    });
  } catch (error) {
    throw { code: 500, message: error.message };
  }
};
