const Router = require('koa-router');
const authUtils = require('../lib/auth/jwt');

const router = new Router();

router.post('usuario.create', '/registrarse', async (ctx) => {
  try {
    const usuario = await ctx.orm.Usuario.create(ctx.request.body);
    ctx.body = usuario;
    ctx.status = 201;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('usuario.login', '/', async (ctx) => {
  try {
    const usuario = await ctx.orm.Usuario.findOne(
      {
        where:
        {
          username: ctx.request.body.username,
          password: ctx.request.body.password,
        },
      },
    );

    if (usuario) {
      ctx.body = usuario;
      ctx.status = 200;
    } else {
      ctx.body = 'Usuario no encontrado';
      ctx.status = 404;
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.patch('usuario.admin', '/:id', async (ctx) => {
  try {
    const usuario = await ctx.orm.Usuario.findByPk(ctx.params.id);
    if (usuario) {
      // Actualizar atributo rol a admin
      usuario.rol = 'admin';
      await usuario.save();
      ctx.body = usuario;
      ctx.status = 200;
    } else {
      ctx.status = 404;
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

//

router.get('usuario.list', '/', authUtils.isAdmin, async (ctx) => {
  try {
    const usuario = await ctx.orm.Usuario.findAll();
    ctx.body = usuario;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.get('usuario.show', '/:id', async (ctx) => {
  try {
    const usuario = await ctx.orm.Usuario.findByPk(ctx.params.id);
    ctx.body = usuario;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

// Este no busca soolo por la llave primaria, sino que busca por cualquier campo con condiciones
// Se puede usar findone y findall
// Ver documentacion de sequelize

router.get('usuario.show', '/:id', async (ctx) => {
  try {
    const usuario = await ctx.orm.Usuario.findOne({ where: { id: ctx.params.id } });
    ctx.body = usuario;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
