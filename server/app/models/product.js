const path = require("path");
const fs = require("fs");
// const csvPath = path.resolve(__dirname, "../csv/three.csv");
const dayjs = require("dayjs");
const superagent = require("superagent");
const csvtojson = require("csvtojson");
const dbUtils = require("../../db");
const { parse } = require("json2csv");

Array.prototype.each = function(trans) {
  for (var i = 0; i < this.length; i++) this[i] = trans(this[i], i, this);
  return this;
};

Array.prototype.map = function(trans) {
  return [].concat(this).each(trans);
};

RegExp.escape = function(str) {
  return new String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
};

let replacements = {
  "'": "%asop$",
  // '";;"': '";"',
  "&nbsp;": " ",
  "&amp;": " ",
  "&#039;": " "
};

let regex = new RegExp(
  properties(replacements)
    .map(RegExp.escape)
    .join("|"),
  "g"
);

function properties(obj) {
  var props = [];
  for (var p in obj) props.push(p);
  return props;
}
let insertCount = 0;
function inputProducts2Db(url, user, passwd) {
  let convertData = [];
  let convertHeader = [];
  // First, Clear up table
  dbUtils.ruohuaPool("truncate table three_wf");

  csvtojson({
    delimiter: [";", ";;"]
  })
    .fromStream(
      superagent
        .get(url)
        .auth(user, passwd)
        .on("error", (err) => {
          console.log(err);
        })
    )
    // .fromFile(csvPath)
    .preRawData((csvRawData) => {
      let data = csvRawData.replace(regex, function($0) {
        return replacements[$0];
      });
      // csvNewData += data;
      return data;
    })
    .subscribe((json) => {
      // console.log(json);
      // productCount++;
      // console.log("Product Count:", productCount);

      try {
        let product = json,
          qtyAry = product["Qty Detail"].split(",");

        for (let i = 0; i < qtyAry.length; i++) {
          if (parseFloat(qtyAry[i]) !== 0) {
            const parsedProduct = parseProduct(product, i);

            //生成output数据
            if (convertData.length === 0) {
              for (let key in parsedProduct) {
                convertHeader.push(key);
              }
            }
            convertData.push(parsedProduct);

            //生成sql语句 并写入database
            const sql = generateSql("three_wf", parsedProduct);
            dbUtils
              .ruohuaPool(sql)
              .then((res) => {})
              .catch((err) => {
                console.error(err);
              });
          }
        }
      } catch (e) {
        console.error(e);
      }
    })
    .on("error", (err) => {
      console.log(err);
    })
    .on("done", () => {
      console.log(dayjs().format("YYYYMMDD-hh:mm:ss"));
      insertCount = 0;
      dbUtils.ruohuaPool("truncate table three_product");

      // 复制一份数据到新表
      let sql = `insert into three_product select * from three_wf`;
      dbUtils.ruohuaPool(sql);
      try {
        const csv = parse(convertData, { convertHeader });
        console.log("cav的大小", csv.length);
        const csvOutputPath = path.join(__dirname, "../../../dist/csv/three.csv");
        if (fs.existsSync(csvOutputPath)) {
          fs.unlinkSync(csvOutputPath);
          console.log("删除成功");
        } else {
          console.log("inexistence path：", csvOutputPath);
        }
        fs.writeFile(csvOutputPath, csv, () => {
          console.log("csv写入成功");
        });
      } catch (e) {
        console.error(e);
      }

      console.log("完成");
    });
}

// function replaceSingleQuote(data) {
//   return JSON.parse(JSON.stringify(data).replace(/'/g, "%asop$"));
// }

function parseProduct(product, index) {
  let sizeAry = product.Size.split(","),
    qtyAry = product["Qty Detail"].split(","),
    sizeAndFit = `${qtyAry[index]} ${product["Bag length"]} ${product["Bag height"]} ${product["Bag weight"]} ${product["Handle height"]} ${product["Shoulder bag length"]} ${product["Belt length"]} ${product["Belt height"]} ${product["Accessory length"]} ${product["Accessory height"]} ${product["Accessory weight"]} ${product["Heel height"]} ${product["Plateau height"]} ${product["Insole length"]}`;

  return {
    Description: product.Description,
    sex: product.Categories.split(">")[0],
    Discount: product.Discount,
    Categories: product.Categories,
    RetailPrice: product["Retail Price"],
    skuId: `${product["Sku Supplier"]} ${product.Variant} ${sizeAry[index]}`,
    Color: `${product["Color detail"]} ${product["Color Supplier"]}`,
    Season: `${product.Year} ${product.Season}`,
    Material: product.Material,
    MadeIn: product["Made in"],
    Name: product.Name,
    Brand: product.Brand,
    url1: product.Image,
    url2: product.Image1,
    url3: product.Image2,
    url4: product.Image3,
    url5: product["Product Url"],
    size: `${product["Size Info"]} ${sizeAry[index]}`,
    Qty: qtyAry[index],
    sizeAndFit: sizeAndFit
  };
}

function generateSql(tableName, product) {
  const sqlData = wrapSqlData(product);
  const sql = "INSERT INTO " + tableName + " (" + sqlData.header + ") VALUES (" + sqlData.values + ")";
  // console.log(sql);
  insertCount++;
  console.log("Insert Count", insertCount);
  return sql;
}

function wrapSqlData(product) {
  let header = "",
    values = "";

  for (let key in product) {
    header += `${key}, `;
    values += `'${product[key]}', `;
  }
  return {
    header: header.substring(0, header.lastIndexOf(",")),
    values: values.substring(0, values.lastIndexOf(","))
  };
}

// inputProducts2Db();

module.exports = { inputProducts2Db };
