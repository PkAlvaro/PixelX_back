PORT = 3000;


const Koa = require('koa');
const KoaLogger = require('koa-logger');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const router = require('./routes');
const orm = require('./models');

// Crear instancia de Koa
const app = new Koa();

app.context.orm = orm;

app.use(cors());

// Middlewares de la app de Koa
app.use(KoaLogger());
app.use(koaBody());

app.use(router.routes());

// Middleware para decir Hola Mundo
app.use(async (ctx, next) => {
  ctx.body = 'Hola Mundo';
  await next();
});

module.exports = app;
