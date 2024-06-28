const Router = require('koa-router');

const router = new Router();

router.get('casillaevento.list', '/', async (ctx) => {
  try {
    const casillaevento = await ctx.orm.CasillaEvento.findAll();
    ctx.body = casillaevento;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
