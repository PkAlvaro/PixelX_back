const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const authUtils = require('../lib/auth/jwt');

const router = new Router();

router.post('user.id', '/get/id', async (ctx) => {
  try {
    const token = ctx.request.header.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userID = decoded.user.id;
    ctx.body = {
      id: userID,
    };
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

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

// Ver el estado de los usuarios segun id
router.get('usuario.estado', '/:id/estado', async (ctx) => {
  try {
    const usuario = await ctx.orm.Usuario.findByPk(ctx.params.id);
    if (usuario) {
      ctx.body = usuario.estado;
      ctx.status = 200;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Usuario no encontrado.' };
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.patch('usuario.cambiarEstado', '/:id/suspender', authUtils.isAdmin, async (ctx) => {
  try {
    const usuario = await ctx.orm.Usuario.findByPk(ctx.params.id);
    if (usuario) {
      const { estado } = ctx.request.body;
      usuario.estado = estado;
      await usuario.save();

      ctx.body = {
        message: 'Estado del usuario actualizado correctamente.',
        usuario,
      };
      ctx.status = 200;
    } else {
      ctx.body = { error: 'Usuario no encontrado.' };
      ctx.status = 404;
    }
  } catch (error) {
    ctx.body = { error: 'Error al actualizar el estado del usuario.' };
    ctx.status = 400;
  }
});

module.exports = router;
