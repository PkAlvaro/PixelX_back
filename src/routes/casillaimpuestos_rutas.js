const Router = require('koa-router');

const router = new Router();

router.get('casillaimpuesto.list', '/', async (ctx) => {
  try {
    const casillaimpuesto = await ctx.orm.CasillaImpuesto.findAll();
    ctx.body = casillaimpuesto;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
