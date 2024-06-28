const Router = require('koa-router');
const dotenv = require('dotenv');
const jwtMiddleware = require('koa-jwt');

const usuarios = require('./routes/usuarios_rutas');
const casillas = require('./routes/casillas_rutas');
const casillapropiedades = require('./routes/casillapropiedads_rutas');
const casillaeventos = require('./routes/casillaeventos_rutas');
const eventobonificacions = require('./routes/eventobonificacions_rutas');
const eventobonusavances = require('./routes/eventobonusavances_rutas');
const eventomultas = require('./routes/eventomultas_rutas');
const eventoretrocesos = require('./routes/eventoretrocesos_rutas');
const eventosalircarcels = require('./routes/eventosalircarcels_rutas');
const casillacarcel = require('./routes/casillacarcels_rutas');
const casillaircarcel = require('./routes/casillaircarcels_rutas');
const casillaimpuestos = require('./routes/casillaimpuestos_rutas');
const casillapartidas = require('./routes/casillapartidas_rutas');
const casillatrens = require('./routes/casillatrens_rutas');
const partida = require('./routes/partida_rutas');

const authRoutes = require('./routes/session/authentication');

dotenv.config();

// PrePartida
const prepartida = require('./routes/prepartida_rutas');

//
const router = new Router();

router.use('/auth', authRoutes.routes());

// Desde esta linea hacia abajo todas las rutas requeriran un JWT (login)
router.use(jwtMiddleware({ secret: process.env.JWT_SECRET }));
router.use('/usuarios', usuarios.routes());

router.use('/casillas', casillas.routes());

router.use('/eventobonificacions', eventobonificacions.routes());
router.use('/eventobonusavances', eventobonusavances.routes());
router.use('/eventomultas', eventomultas.routes());
router.use('/eventoretrocesos', eventoretrocesos.routes());
router.use('/eventosalircarcels', eventosalircarcels.routes());

router.use('/casillacarcel', casillacarcel.routes());
router.use('/casillaircarcel', casillaircarcel.routes());
router.use('/casillaimpuestos', casillaimpuestos.routes());
router.use('/casillapartidas', casillapartidas.routes());
router.use('/casillatrens', casillatrens.routes());
router.use('/casillapropiedades', casillapropiedades.routes());
router.use('/casillaeventos', casillaeventos.routes());

router.use('/prepartida', prepartida.routes());
router.use('/partida', partida.routes());

module.exports = router;
