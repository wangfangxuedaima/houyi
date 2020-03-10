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
fs.createReadStream(csvPath)
  .pipe(
    csvtojson({
      delimiter: ";"
    })
  )
  .subscribe((json) => {
    let { Image, Image1, Image2, Image3, Size, Brand, Name } = json;
    let sizes = Size.split(",");
    console.log(sizes.length);
    if (sizes.length > 1) {
      sizes.forEach((v, index) => {
        let sql = `INSERT INTO three_wf (Name, Brand ,url1, url2, url3, url4, url5,  size, qtyDetail ) VALUES ('${Name}', '${Brand}' ,'${Image}', '${Image1}', '${Image2}', '${Image3}', '${json["Product Url"]}', '${json["Size Info"]} ${sizes[index]}', '${json["Qty Detail"][index]}')`;
        dbUtils.ruohuaPool(sql);
      });
    } else {
      let sql = `INSERT INTO three_wf (Name, Brand, url1, url2, url3, url4, url5,  size, qtyDetail ) VALUES ('${Name}', '${Brand}' , '${Image}', '${Image1}', '${Image2}', '${Image3}', '${json["Product Url"]}', '${json["Size Info"]} ${Size}' , ${json["Qty Detail"]})`;
      dbUtils.ruohuaPool(sql);
    }
  })
  .on("done", () => {
    console.log("完成");
  });
