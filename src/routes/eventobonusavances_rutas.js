const Router = require('koa-router');

const router = new Router();

router.get('eventobonusavance.list', '/', async (ctx) => {
  try {
    const eventobonusavance = await ctx.orm.EventoBonusAvance.findAll();
    ctx.body = eventobonusavance;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
