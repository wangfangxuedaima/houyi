const dbUtils = require("../../db");

const ThreeController = {
  async getList(ctx) {
    const { pageSize = 1000, pageNum = 1 } = ctx.request.query;
    let sql = `select count(*) as records from three_wf`;
    records = await dbUtils.ruohuaPool(sql);
    total = Math.ceil(records / pageSize);
    let data = await dbUtils.ruohuaPool(sql);
    sql = `select * from three_wf limit ${pageNum - 1} * ${pageSize} ${pageSize}`;
    let rows = await dbUtils.ruohuaPool(sql);
    data = {
      rows,
      page: Number(pageNum),
      records,
      total
    };
    ctx.body = data;
  }
};

module.exports = ThreeController;
