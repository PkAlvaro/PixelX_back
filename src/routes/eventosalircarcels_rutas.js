const Router = require('koa-router');

const router = new Router();

router.get('eventosalircarcel.list', '/', async (ctx) => {
  try {
    const eventosalircarcel = await ctx.orm.EventoSalirCarcel.findAll();
    ctx.body = eventosalircarcel;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
