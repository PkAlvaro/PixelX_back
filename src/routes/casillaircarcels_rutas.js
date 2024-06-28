const Router = require('koa-router');

const router = new Router();

router.get('casillaircarcel.list', '/', async (ctx) => {
  try {
    const casillaircarcel = await ctx.orm.CasillaIrCarcel.findAll();
    ctx.body = casillaircarcel;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
