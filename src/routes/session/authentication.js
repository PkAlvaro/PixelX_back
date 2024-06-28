const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const router = new Router();

router.post('authenticacion.signup', '/signup', async (ctx) => {
  const authInfo = ctx.request.body;
  const username = await ctx.orm.Usuario.findOne({ where: { username: authInfo.username } });
    if (username) {
        ctx.body = `El username ${authInfo.username} ya está registrado`;
        ctx.status = 400;
        return;
    }
  let user = await ctx.orm.Usuario.findOne({ where: { email: authInfo.email } });
  if (user) {
    ctx.body = `El email ${authInfo.email} ya está registrado`;
    ctx.status = 400;
    return;
  }
  try {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(authInfo.password, saltRounds);

    user = await ctx.orm.Usuario.create(
        {
            nombre: authInfo.nombre,
            username: authInfo.username,
            password: hashPassword,
            email: authInfo.email,
        },
    );
    ctx.body = {
        username: user.username,
        email: user.email,
    };
    ctx.status = 201;
    } catch (error) {
        ctx.body = error;
        ctx.status = 400;
  }
});

router.post('authenticacion.login', '/login', async (ctx) => {
    let user;
    const authInfo = ctx.request.body;
    console.log(authInfo);
    try {
        user = await ctx.orm.Usuario.findOne(
            {
                where:
                {
                    email: authInfo.email,
                },
            },
        );
    } catch (error) {
        ctx.body = error;
        ctx.status = 400;
    }
    if (!user) {
        ctx.body = `El usuario con el email '${authInfo.email}' no encontrado`;
        ctx.status = 404;
        return;
    }

    const validPassword = await bcrypt.compare(authInfo.password, user.password);

    if (validPassword) {
        ctx.body = {
            username: user.username,
            email: user.email,
        };
        ctx.status = 200;
    } else {
        ctx.body = 'Contraseña incorrecta';
        ctx.status = 400;
        return;
    }

    let scopeSample;
    if (user.rol === 'admin') {
        scopeSample = ['admin', 'user'];
    } else {
        scopeSample = ['user'];
    }
    const expirationSeconds = 60 * 60 * 24;
    const JWT_PRIVATE_KEY = process.env.JWT_SECRET;
    const token = jwt.sign(
        {
            scope: scopeSample,
            user: {
                id: user.id,
            },
         },
        JWT_PRIVATE_KEY,
        { subject: user.id.toString() },
        { expiresIn: expirationSeconds },
    );
    ctx.body = {
        access_token: token,
        token_type: 'Bearer',
        expires_in: expirationSeconds,
    };
    ctx.status = 200;
});

module.exports = router;
