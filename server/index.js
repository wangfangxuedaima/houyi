"use strict";
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const helmet = require("koa-helmet");
const render = require("koa-art-template");
const cors = require("koa2-cors");
const schedule = require("./app/middlewares/schedule");
const config = require("./config");
const router = require("./app/router");
const corsHandler = require("./app/middlewares/cors");
const { logger, accessLogger } = require("./app/util/logger.js");
const app = new Koa();

app.use(accessLogger());
app.use(cors(corsHandler));

// 挂载日志模块
app.use(async (ctx, next) => {
  ctx.util = {
    logger: logger
  };
  await next();
});
schedule();
render(app, config.template);
app.use(bodyParser());
app.use(helmet());
app.use(router.routes());
app.use(require("koa-static")(config.static));
//捕获异常记录错误日志
app.on("error", (err, ctx) => {
  logger.error(err);
});
app.listen(config.port, () => {
  console.log(`[${new Date().toLocaleString()}] listening on port: ${config.port}`);
});
