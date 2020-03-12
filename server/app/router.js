/**
 * 路由配置
 * @author xiaominliu
 * @date 2019-12-13
 */
const Router = require("koa-router");
const router = new Router();

const PageController = require("./controller/page");
const ThreeController = require("./controller/three");

// 页面
router.get("/mango", PageController.index);

router.get("/threeList", ThreeController.getList);

module.exports = router;
