const Router = require('koa-router');

const router = new Router();

router.get('casillatren.list', '/', async (ctx) => {
  try {
    const casillatren = await ctx.orm.CasillaTren.findAll();
    ctx.body = casillatren;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
