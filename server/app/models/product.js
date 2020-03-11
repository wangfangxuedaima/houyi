const path = require("path");
const dayjs = require("dayjs");
const superagent = require("superagent");
const csvtojson = require("csvtojson");
const csvPath = path.resolve(__dirname, "../csv/three.csv");
const dbUtils = require("../../db");

function inputProducts2Db(url, user, passwd) {
  // First, Clear up table
  dbUtils.ruohuaPool("truncate table three_wf");

  csvtojson({
    delimiter: ";",
    escape: " "
  })
    .fromStream(superagent.get(url).auth(user, passwd))
    // .fromFile(csvPath)
    .subscribe((json) => {
      try {
        let product = replaceSingleQuote(json),
          qtyAry = product.Qty.split(",");

        for (let i = 0; i < qtyAry.length; i++) {
          if (parseFloat(qtyAry[i]) !== 0) {
            const parsedProduct = parseProduct(product, i);
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
      console.log("完成");
    });
}

function replaceSingleQuote(data) {
  return JSON.parse(JSON.stringify(data).replace(/'/g, "%asop$"));
}

function parseProduct(product, index) {
  // console.log(product);
  let sizeAry = product.Size.split(","),
    qtyAry = product.Qty.split(","),
    sizeAndFit = `${qtyAry[index]} ${product["Bag length"]} ${product["Bag height"]} ${product["Bag weight"]} ${product["Handle height"]} ${product["Shoulder bag length"]} ${product["Belt length"]} ${product["Belt height"]} ${product["Accessory length"]} ${product["Accessory height"]} ${product["Accessory weight"]} ${product["Heel height"]} ${product["Plateau height"]} ${product["Insole length"]}`;

  return {
    Description: product.Description,
    sex: product.Categories.split(">")[0],
    Discount: product.Discount,
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

// let count = 0;

function generateSql(tableName, product) {
  const sqlData = wrapSqlData(product);
  const sql = "INSERT INTO " + tableName + " (" + sqlData.header + ") VALUES (" + sqlData.values + ")";
  // console.log(sql);
  // count++;
  // console.log(count);
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

// inputProducts2Sql();

module.exports = { inputProducts2Db };
