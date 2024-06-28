const Router = require('koa-router');

const router = new Router();

router.get('casillacarcel.list', '/', async (ctx) => {
  try {
    const casillacarcel = await ctx.orm.CasillaCarcel.findAll();
    ctx.body = casillacarcel;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
