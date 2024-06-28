const Router = require('koa-router');

const router = new Router();

router.get('casilla.list', '/', async (ctx) => {
  try {
    const casilla = await ctx.orm.Casilla.findAll();
    ctx.body = casilla;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.get('casilla.show', '/:id', async (ctx) => {
  try {
    const casilla = await ctx.orm.Casilla.findByPk(ctx.params.id);
    if (!casilla) {
      ctx.status = 404;
      return;
    }
    ctx.body = casilla;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
