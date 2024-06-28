const Router = require('koa-router');

const router = new Router();

router.get('eventoretroceso.list', '/', async (ctx) => {
  try {
    const eventoretroceso = await ctx.orm.EventoRetroceso.findAll();
    ctx.body = eventoretroceso;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
