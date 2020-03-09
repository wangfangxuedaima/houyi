/**
 * 路由配置
 * @author xiaominliu
 * @date 2019-12-13
 */
const Router = require("koa-router");
const router = new Router();

const PageController = require("./controller/page");

// 页面
router.get("/mango", PageController.index);

module.exports = router;
