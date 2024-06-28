const Router = require('koa-router');

const router = new Router();

router.get('casillapartida.list', '/', async (ctx) => {
  try {
    const casillapartida = await ctx.orm.CasillaPartida.findAll();
    ctx.body = casillapartida;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
