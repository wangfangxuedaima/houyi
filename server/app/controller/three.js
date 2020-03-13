const dbUtils = require("../../db");

const ThreeController = {
  async getList(ctx) {
    const { pageSize = 1000, pageNum = 1, skuId } = ctx.request.query;
    let sql = `select count(*) as records from three_wf where skuId like '${skuId}%'`;
    let records = await dbUtils.ruohuaPool(sql);
    records = records[0].records;
    total = Math.ceil(records / pageSize);
    let headerNum = (pageNum - 1) * pageSize;
    sql = `select * from three_wf where skuId like '%${skuId}%' limit ${headerNum}, ${pageSize}`;
    let rows = await dbUtils.ruohuaPool(sql);
    ctx.body = {
      rows,
      page: Number(pageNum),
      records,
      total
    };
  }
};

module.exports = ThreeController;
