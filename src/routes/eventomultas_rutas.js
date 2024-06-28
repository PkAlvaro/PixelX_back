const Router = require('koa-router');

const router = new Router();

router.get('eventomulta.list', '/', async (ctx) => {
  try {
    const eventomulta = await ctx.orm.EventoMulta.findAll();
    ctx.body = eventomulta;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
