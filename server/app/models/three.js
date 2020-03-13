const superagent = require("superagent");
const fs = require("fs");
const dayjs = require("dayjs");
const csv2mysql = require("csv2mysql");
const path = require("path");
const dbUtils = require("../../db");
const csvtojson = require("csvtojson");
const csvPath = path.resolve(__dirname, "../csv/three.csv");
console.log("开始时间" + dayjs().format("YYYYMMDD-hh:mm:ss"));
let sql = `truncate table three_wf`;
dbUtils.ruohuaPool(sql);

csvtojson({
  delimiter: ";",
  escape: " "
})
  // .fromStream(superagent.get("http://pim.coltorti.it:8080/csvExport/export/allProducts.csv").auth("vip", "05mDw01F"))
  .fromFile(csvPath)
  .subscribe((json) => {
    let {
      Image,
      Image1,
      Image2,
      Image3,
      Size,
      Brand,
      Name,
      Qty,
      Material,
      Season: singSeason,
      Year,
      Description,
      Variant,
      Discount,
      Categories
    } = json;
    let sizes = Size.split(",");
    let qty = Qty.split(",");

    sizes.forEach((v, index) => {
      let skuId = `${json["Sku Supplier"]} ${Variant} ${sizes[index]}`;
      let sex = Categories.split(">")[0];
      let size = `${json["Size Info"]} ${sizes[index]}`;
      let Color = `${json["Color detail"]} ${json["Color Supplier"]}`;
      let Season = `${Year} ${singSeason}`;
      let sql = `INSERT INTO three_wf (Description ,sex, Discount, RetailPrice, skuId, Color, Season ,Material,MadeIn,Name, Brand ,url1, url2, url3, url4, url5,  size, Qty ) VALUES ('${Description.replace(
        /'/g,
        "\\'"
      )}','${sex}' ,'${Discount}','${json["Retail Price"]}','${skuId}' ,'${Color.replace(
        /'/g,
        "\\'"
      )}' ,'${Season.replace(/'/g, "\\'")}' ,'${Material.replace(/'/g, "\\'")}','${json["Made in"]}' ,'${Name.replace(
        /'/g,
        "\\'"
      )}', '${Brand.replace(/'/g, "\\'")}' ,'${Image.replace(/'/g, "\\'")}', '${Image1.replace(
        /'/g,
        "\\'"
      )}', '${Image2.replace(/'/g, "\\'")}', '${Image3.replace(/'/g, "\\'")}', '${json["Product Url"].replace(
        /'/g,
        "\\'"
      )}', '${size}', '${qty[index]}')`;

      dbUtils
        .ruohuaPool(sql)
        .then((res) => {})
        .catch((err) => {
          // console.error(err);
        });
    });
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("done", () => {
    console.log(dayjs().format("YYYYMMDD-hh:mm:ss"));
    console.log("完成");
  });