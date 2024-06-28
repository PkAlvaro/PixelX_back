const Router = require('koa-router');

const router = new Router();

router.get('casillapropiedad.list', '/', async (ctx) => {
  try {
    const casillapropiedad = await ctx.orm.CasillaPropiedad.findAll();
    ctx.body = casillapropiedad;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
