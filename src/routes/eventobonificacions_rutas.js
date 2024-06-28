const Router = require('koa-router');

const router = new Router();

router.get('eventobonificacion.list', '/', async (ctx) => {
  try {
    const eventobonificacion = await ctx.orm.EventoBonificacion.findAll();
    ctx.body = eventobonificacion;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
