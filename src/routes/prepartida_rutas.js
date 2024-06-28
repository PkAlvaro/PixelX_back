const Router = require('koa-router');

const router = new Router();

async function crearPartida(ctx, codigo = 'None', turnos = 20) {
  try {
    const partida = await ctx.orm.Partida.create(ctx.request.body);
    if (codigo !== 'None') {
      partida.codigo = codigo;
      partida.turnos = turnos;
      await partida.save();
    }
    ctx.body = partida;
    ctx.status = 201;
    return partida;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
    throw error;
  }
}

async function crearJugador(ctx) {
  try {
    const jugador = await ctx.orm.Jugador.create(ctx.request.body);
    ctx.status = 201;
    return jugador;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
    throw error;
  }
}

async function crearParticipacion(ctx, jugador) {
  try {
    await ctx.orm.Participacion.create({
      id_jugador: jugador.id,
      id_partida: ctx.body.id,
    });
    ctx.status = 201;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
}

async function crearLogicadeEntradaPartida(ctx, partida) {
  const participacion = await ctx.orm.Participacion.findAll({ where: { id_partida: partida.id } });
  // Verificar si el usuario ya esta en la partida
  for (let i = 0; i < participacion.length; i += 1) {
    const jugadorAux = await ctx.orm.Jugador.findByPk(participacion[i].id_jugador);
    if (jugadorAux.id_usuario === ctx.request.body.id_usuario) {
      ctx.body = 'Ya estas en la partida';
      ctx.status = 400;
      return ctx.body;
    }
  }
  const jugador = await crearJugador(ctx);
  // Crear participacion
  await crearParticipacion(ctx, jugador, partida);

  // Asignar color al jugador
  const participaciones = await ctx.orm.Participacion.findAll(
    { where: { id_partida: partida.id } },
  );
  if (participaciones.length === 1) {
    jugador.color = 'rojo';
  } else if (participaciones.length === 2) {
    jugador.color = 'morado';
  } else if (participaciones.length === 3) {
    jugador.color = 'verde';
  }
  await jugador.save();

  // Cambiar estado de partida a en curso
  const cantJugadores = await ctx.orm.Participacion.count({ where: { id_partida: partida.id } });
  const partidaAuxiliar = partida;
  if (cantJugadores === 3) {
    partidaAuxiliar.estado = 'full';
    partidaAuxiliar.ready = true;
    await partidaAuxiliar.save();
  }
  return ctx.body;
}

async function crearCodigoPartida(ctx) {
  try {
    const min = 100000;
    const max = 999999;
    let codigo = Math.floor(Math.random() * (max - min + 1) + min);
    codigo = codigo.toString();
    while (await ctx.orm.Partida.findOne({ where: { codigo, estado: 'disponible' } })) {
      codigo = Math.floor(Math.random() * (max - min + 1) + min);
      codigo = codigo.toString();
    }
    return codigo;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
    throw error;
  }
}

router.get('partida.list', '/', async (ctx) => {
  try {
    const partida = await ctx.orm.Partida.findAll();
    ctx.body = partida;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('partida.search', '/buscar/publica', async (ctx) => {
  try {
    const partida = await ctx.orm.Partida.findOne({ where: { estado: 'disponible', codigo: 'None' }, order: [['createdAt', 'ASC']] });
    if (partida) {
      ctx.body = partida;
      ctx.status = 200;
      // UNIRSE:
      // Crear jugador
      await crearLogicadeEntradaPartida(ctx, partida);
      // no se si poner body aqui
    } else {
      try {
        await crearPartida(ctx);
        await crearLogicadeEntradaPartida(ctx, ctx.body);
        ctx.status = 201;
      } catch (error) {
        ctx.body = error;
        ctx.status = 400;
      }
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('partida.search', '/buscar/privada', async (ctx) => {
  try {
    const partida = await ctx.orm.Partida.findOne({ where: { codigo: ctx.request.body.codigo } });

    if (partida && partida.estado === 'disponible') {
      ctx.body = partida;
      ctx.status = 200;
      // UNIRSE:
      // Crear jugador
      await crearLogicadeEntradaPartida(ctx, partida);
    } else {
      ctx.body = 'Partida llena o no encontrada';
      ctx.status = 400;
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('partida.create', '/crear/privada', async (ctx) => {
  try {
    // LOGICA CODIGO DE PARTIDA
    // Hacer un codigo de partida de 6 digitos unico
    const codigo = await crearCodigoPartida(ctx);
    const numTurnos = ctx.request.body.turnos;

    const partida = await crearPartida(ctx, codigo, numTurnos);
    if (partida) {
      await crearLogicadeEntradaPartida(ctx, partida);
      ctx.status = 200;
      ctx.body = partida;
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
