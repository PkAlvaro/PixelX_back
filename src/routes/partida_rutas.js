const Router = require('koa-router');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const router = new Router();

router.post('cambiar.turno', '/cambiar/turno', async (ctx) => {
  try {
    const partida = await ctx.orm.Partida.findByPk(ctx.request.body.idPartida);
    if (partida) {
      partida.turnoActualIndex = (partida.turnoActualIndex + 1) % 3;
      await partida.save();
      ctx.status = 200;
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('anadir.dado', '/anadir', async (ctx) => {
  try {
    const { idPartida, idJugador, numero } = ctx.request.body;

    if (!idPartida || !idJugador || !numero) {
      ctx.throw(400, 'Todos los parámetros son requeridos');
    }

    const partida = await ctx.orm.Partida.findByPk(idPartida);

    if (!partida) {
      ctx.throw(404, 'Partida no encontrada');
    }

    // Inicializa dadosInicio si es null o undefined
    if (!partida.dadosInicio) {
      partida.dadosInicio = `${numero},${idJugador}`;
      await partida.save();
      ctx.status = 200;
      return;
    }

    // Genera el nuevo valor de dadosInicio
    const nuevosDados = `,${numero},${idJugador}`;

    if (partida.dadosInicio) {
      partida.dadosInicio += nuevosDados;
    } else {
      partida.dadosInicio = nuevosDados;
    }

    await partida.save();

    const partidaActualizada = await ctx.orm.Partida.findByPk(idPartida);

    console.log(partidaActualizada);

    ctx.body = partidaActualizada;
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = { error: error.message };
    ctx.status = 400;
  }
});

router.get('lanzar.dado', '/lanzar', async (ctx) => {
  try {
    // Generar un numero random entre 1 y 6
    const numero = Math.floor(Math.random() * 6) + 1;
    ctx.status = 200;
    const response = { numero };
    ctx.body = response;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('verificar.orden', '/verificar/orden', async (ctx) => {
  try {
    const {
      idPartida, dado1, jugador1ID, dado2, jugador2ID, dado3, jugador3ID,
    } = ctx.request.body;

    console.log(ctx.request.body);

    const partida = await ctx.orm.Partida.findByPk(idPartida);
    if (!partida) {
      ctx.status = 404;
      ctx.body = { message: 'Partida no encontrada' };
      return;
    }

    const resultados = [
      { dado: dado1, jugadorID: jugador1ID },
      { dado: dado2, jugadorID: jugador2ID },
      { dado: dado3, jugadorID: jugador3ID },
    ];

    console.log(resultados);
    resultados.sort((a, b) => b.dado - a.dado);

    // Extraer los IDs de los jugadores en orden y guardarlos en un string separado por comas
    const ordenJugadores = resultados.map((r) => r.jugadorID).join(',');
    console.log(ordenJugadores);
    partida.orden = ordenJugadores;
    console.log(partida.orden);
    await partida.save();
    console.log(partida.orden);

    // Determinar si hay un empate en cualquier combinación de los dados
    const tie = resultados[0].dado === resultados[1].dado
    || resultados[1].dado === resultados[2].dado
    || resultados[0].dado === resultados[2].dado;

    ctx.status = 200;
    ctx.body = {
      message: 'Orden de jugadores actualizado',
      ordenJugadores: partida.orden,
      winnerID: resultados[0].jugadorID,
      tie,
    };
  } catch (error) {
    ctx.body = { message: error.message };
    ctx.status = 400;
  }
});

router.post('mover.jugador', '/mover', async (ctx) => {
  try {
    // Recibir la cantidad de movimientos que ha hecho el jugador en el request
    const cantidad = ctx.request.body.cantidad_movimientos;

    // Buscar la partida
    const partida = await ctx.orm.Partida.findByPk(ctx.request.body.id_partida);

    if (!partida) {
      ctx.status = 404;
      ctx.body = 'Partida no encontrada';
    }
    const jugador = await ctx.orm.Jugador.findByPk(ctx.request.body.id_jugador);
    if (jugador) {
      // Actualizar atributo posicion del jugador en la base de datos
      if ((jugador.posicion + cantidad) % 20 === 0) {
        jugador.posicion = 20;
      } else {
        jugador.posicion = (jugador.posicion + cantidad) % 20;
      }
      await jugador.save();
      ctx.status = 200;
    }
    ctx.body = jugador;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

async function saldoSuficiente(jugador, cantidadDinero) {
  return jugador.dinero >= cantidadDinero;
}

async function comprarPropiedad(jugador, propiedad, ctx) {
  const jugadorAuxiliar = jugador;
  if (saldoSuficiente(jugador, propiedad.precio)) {
    jugadorAuxiliar.dinero -= propiedad.precio;
    await jugador.save();
    let propiedadJugador;
    try {
      propiedadJugador = await ctx.orm.PropiedadJugador.create(
        {
          id_jugador: jugador.id,
          id_propiedad: propiedad.id,
          num_casas: 1,
        },
      );
    } catch (error) {
      ctx.status = 407;
      ctx.body = error;
      return;
    }

    ctx.body = propiedadJugador;
    ctx.status = 200;
  } else {
    ctx.body = 'Saldo insuficiente';
    ctx.status = 400;
  }
}

async function verificarCasas(jugador, propiedad, numCasas, ctx) {
  const propiedadJugador = await ctx.orm.PropiedadJugador.findOne(
    {
      where:
      {
        id_jugador: jugador.id,
        id_propiedad: propiedad.id,
      },
    },
  );
  return propiedadJugador.num_casas < 4 && propiedadJugador.num_casas + numCasas <= 4;
}

async function comprarCasas(jugador, propiedad, numCasas, ctx) {
  const jugadorAuxiliar = jugador;
  if (saldoSuficiente(jugador, propiedad.precio * numCasas)) {
    if (verificarCasas(jugador, propiedad, numCasas, ctx)) {
      console.log('comprando casas');
      console.log('Dinero jugador:', jugadorAuxiliar.dinero, typeof (jugadorAuxiliar.dinero));
      console.log('Precio propiedad:', propiedad.precio, typeof (propiedad.precio));
      console.log('Numero de casas:', numCasas, typeof (numCasas));

      jugadorAuxiliar.dinero -= propiedad.precio * numCasas;
      await jugador.save();
      const propiedadJugador = await ctx.orm.PropiedadJugador.findOne(
        {
          where:
          {
            id_jugador: jugador.id,
            id_propiedad: propiedad.id,
          },
        },
      );
      if (!propiedadJugador) {
        ctx.status = 400;
        ctx.body = 'No se puede comprar casas en una propiedad que no se posee';
        return;
      }
      console.log('Numero de casas antes de comprar:', propiedadJugador.num_casas, typeof (propiedadJugador.num_casas));
      propiedadJugador.num_casas += numCasas;
      await propiedadJugador.save();
      ctx.body = propiedadJugador;
      ctx.status = 200;
    } else {
      ctx.status = 400;
      ctx.body = 'No se pueden comprar mas de 4 casas';
    }
  } else {
    ctx.status = 400;
    ctx.body = 'Saldo insuficiente';
  }
}

async function comprarPropiedadTren(jugador, tren, ctx) {
  const jugadorAuxiliar = jugador;
  if (saldoSuficiente(jugador, tren.precio)) {
    jugadorAuxiliar.dinero -= tren.precio;
    await jugador.save();
    let servicioTrenJugador;
    try {
      servicioTrenJugador = await ctx.orm.ServicioTrenJugador.create(
        {
          id_jugador: jugador.id,
          id_servicio: tren.id,
          num_trenes: 1,
        },
      );
    } catch (error) {
      ctx.status = 407;
      ctx.body = error;
      return;
    }

    ctx.body = servicioTrenJugador;
    ctx.status = 200;
  } else {
    ctx.body = 'Saldo insuficiente';
    ctx.status = 400;
  }
}

async function verificarTrenes(jugador, tren, numTrenes, ctx) {
  const servicioTrenJugador = await ctx.orm.ServicioTrenJugador.findOne(
    {
      where:
      {
        id_jugador: jugador.id,
        id_servicio: tren.id,
      },
    },
  );
  return servicioTrenJugador.num_trenes < 4 && servicioTrenJugador.num_trenes + numTrenes <= 4;
}

async function comprarTrenes(jugador, tren, numTrenes, ctx) {
  const jugadorAuxiliar = jugador;
  if (saldoSuficiente(jugador, tren.precio * numTrenes)) {
    if (verificarTrenes(jugador, tren, numTrenes, ctx)) {
      jugadorAuxiliar.dinero -= tren.precio * numTrenes;
      await jugador.save();
      const servicioTrenJugador = await ctx.orm.ServicioTrenJugador.findOne(
        {
          where:
          {
            id_jugador: jugador.id,
            id_servicio: tren.id,
          },
        },
      );
      if (!servicioTrenJugador) {
        ctx.status = 400;
        ctx.body = 'No se puede comprar trenes en una propiedad que no se posee';
        return;
      }
      servicioTrenJugador.num_trenes += numTrenes;
      await servicioTrenJugador.save();
      ctx.body = servicioTrenJugador;
      ctx.status = 200;
    } else {
      ctx.status = 400;
      ctx.body = 'No se pueden comprar mas de 4 trenes';
    }
  } else {
    ctx.status = 400;
    ctx.body = 'Saldo insuficiente';
  }
}

router.post('comprar.casilla', '/comprar', async (ctx) => {
  try {
    // Buscar la partida
    const partida = await ctx.orm.Partida.findByPk(ctx.request.body.id_partida);
    const jugador = await ctx.orm.Jugador.findByPk(ctx.request.body.id_jugador);

    if (!partida) {
      ctx.status = 404;
      ctx.body = 'Partida no encontrada';
    }
    // Buscar la casilla
    const casilla = await ctx.orm.Casilla.findByPk(ctx.request.body.id_casilla);
    const propiedad = await ctx.orm.CasillaPropiedad.findOne({ where: { id_casilla: casilla.id } });
    const servicioTren = await ctx.orm.CasillaTren.findOne({ where: { id_casilla: casilla.id } });
    if (propiedad) {
      const propiedadJugador = await ctx.orm.PropiedadJugador.findOne(
        { where: { id_jugador: jugador.id, id_propiedad: propiedad.id } },
      );

      if (propiedadJugador) {
        await comprarCasas(jugador, propiedad, 1, ctx);
      } else {
        await comprarPropiedad(jugador, propiedad, ctx);
      }
    } else if (servicioTren) {
      const servicioTrenJugador = await ctx.orm.ServicioTrenJugador.findOne(
        { where: { id_jugador: jugador.id, id_servicio: servicioTren.id } },
      );

      if (!servicioTrenJugador) {
        await comprarPropiedadTren(jugador, servicioTren, ctx);
      } else {
        await comprarTrenes(jugador, servicioTren, 1, ctx);
      }
    }
  } catch (error) {
  ctx.body = error;
  ctx.status = 400;
  }
});

async function pagarAlquiler(jugador, propiedadJugador, propietario, propiedad, ctx) {
  const jugadorAuxiliar = jugador;
  const propietarioAuxiliar = propietario;
  jugadorAuxiliar.dinero -= (propiedadJugador.num_casas * propiedad.renta);
  await jugadorAuxiliar.save();
  propietarioAuxiliar.dinero += propiedadJugador.num_casas * propiedad.renta;
  await propietarioAuxiliar.save();
  ctx.status = 200;
  ctx.body = jugador;
}

async function pagarAlquilerTren(jugador, servicioTrenJugador, propietario, tren, ctx) {
  const jugadorAuxiliar = jugador;
  const propietarioAuxiliar = propietario;
  jugadorAuxiliar.dinero -= (servicioTrenJugador.num_trenes * tren.renta);
  await jugadorAuxiliar.save();
  propietarioAuxiliar.dinero += servicioTrenJugador.num_trenes * tren.renta;
  await propietarioAuxiliar.save();
  ctx.status = 200;
  ctx.body = jugador;
}

router.post('pagar.alquiler', '/pagar/renta', async (ctx) => {
  try {
    // Buscar la partida
    console.log('BOOOOOOOODYY');
    console.log(ctx.request.body);
    if (![2, 3, 5, 7, 9, 10, 12, 13, 14, 17, 18, 20].includes(ctx.request.body.id_casilla)) {
      ctx.body = {
        hasRent: false,
      };
      return;
    }

    const partida = await ctx.orm.Partida.findByPk(ctx.request.body.id_partida);

    if (!partida) {
      ctx.status = 404;
      ctx.body = 'Partida no encontrada';
      console.log('Partida no encontrada');
    }
    // Buscar la casilla
    const casilla = await ctx.orm.Casilla.findByPk(ctx.request.body.id_casilla);
    if (casilla && ![10, 18].includes(ctx.request.body.id_casilla)) {
      const propiedad = await ctx.orm.CasillaPropiedad.findOne(
        {
          where:
          {
            id_casilla: casilla.id,
          },
        },
      );
      // Buscar al propietario de la casilla
      const jugadoresPartida = await ctx.orm.Participacion.findAll(
        {
          where:
          {
            id_partida: partida.id,
          },
        },
      );
      // Acceder a la lista de jugadores
      const jugadores = jugadoresPartida.map((participacion) => participacion.id_jugador);
      // Buscar al propietario en la tabla PropiedadJugador que esta dentro de la lista de jugadores

      const propiedadJugador = await ctx.orm.PropiedadJugador.findOne(
        {
          where:
          {
            id_propiedad: propiedad.id,
            id_jugador:
            {
              [Op.in]: jugadores,
            },
            vendida: false,
          },
        },
      );

      if (!propiedadJugador) {
        ctx.body = { hasRent: false };
        return;
      }

      const propietario = await ctx.orm.Jugador.findByPk(propiedadJugador.id_jugador);
      // Buscar al jugador que paga
      const jugador = await ctx.orm.Jugador.findByPk(ctx.request.body.id_jugador);

      if (jugador.id === propietario.id) {
        ctx.body = { hasRent: false };
        return;
      }

      await pagarAlquiler(jugador, propiedadJugador, propietario, propiedad, ctx);

      ctx.body = { hasRent: true, monto: propiedadJugador.num_casas * propiedad.renta };
      // Actualizar atributo dinero de propietario y jugador en la base de datos
    } else {
      // Pagar renta de tren
      const tren = await ctx.orm.CasillaTren.findOne(
        { where: { id_casilla: ctx.request.body.id_casilla } },
      );
      console.log('CHU CHU');
      const jugadoresPartida = await ctx.orm.Participacion.findAll(
        {
          where:
          {
            id_partida: partida.id,
          },
        },
      );

      const jugadores = jugadoresPartida.map((participacion) => participacion.id_jugador);

      const servicioTrenJugador = await ctx.orm.ServicioTrenJugador.findOne(
        {
          where:
          {
            id_servicio: tren.id,
            id_jugador:
            {
              [Op.in]: jugadores,
            },
            vendida: false,
          },
        },
      );

      if (!servicioTrenJugador) {
        ctx.body = { hasRent: false };
        return;
      }

      const propietario = await ctx.orm.Jugador.findByPk(servicioTrenJugador.id_jugador);
      const jugador = await ctx.orm.Jugador.findByPk(ctx.request.body.id_jugador);

      if (jugador.id === propietario.id) {
        ctx.body = { hasRent: false };
        return;
      }

      await pagarAlquilerTren(jugador, servicioTrenJugador, propietario, tren, ctx);
      ctx.body = { hasRent: true, monto: servicioTrenJugador.num_trenes * tren.renta };
    }
  } catch (error) {
    ctx.body = error;
    console.log(error);
    ctx.status = 400;
  }
});

/// /// HASTA AQUI LLEGAMOS EL 11 DE MAYO //////

router.post('pagar.impuesto', '/pagar/impuesto/:id', async (ctx) => {
  try {
    // Buscar la partida
    const partida = await ctx.orm.Partida.findByPk(ctx.request.body.id_partida);
    console.log(ctx.request.body);

    if (!partida) {
      ctx.status = 404;
      ctx.body = 'Partida no encontrada';
    }
    // Buscar la casilla
    const casilla = await ctx.orm.CasillaImpuesto.findOne({ where: { id_casilla: ctx.params.id } });
    console.log(casilla);
    if (casilla) {
      // Buscar al jugador que paga
      const jugador = await ctx.orm.Jugador.findByPk(ctx.request.body.id_jugador);
      console.log(casilla);
      // Actualizar atributo dinero de jugador en la base de datos
      console.log(typeof (casilla.monto));
      console.log(typeof (jugador.dinero));
      jugador.dinero -= casilla.monto;
      await jugador.save();
      ctx.status = 200;
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

// POR IMPLEMENTAR ENTREGA 4

router.post('vender.propiedad', '/vender', async (ctx) => {
  try {
    const jugador = await ctx.orm.Jugador.findByPk(ctx.request.body.id_jugador);
    const casilla = await ctx.orm.Casilla.findByPk(ctx.request.body.id_casilla);

    const propiedad = await ctx.orm.CasillaPropiedad.findOne({ where: { id_casilla: casilla.id } });
    const servicioTren = await ctx.orm.CasillaTren.findOne({ where: { id_casilla: casilla.id } });

    if (propiedad) {
      const propiedadJugador = await ctx.orm.PropiedadJugador.findOne(
        { where: { id_jugador: jugador.id, id_propiedad: propiedad.id } },
      );
      if (propiedadJugador) {
        if (propiedadJugador.num_casas === 1) {
          jugador.dinero += propiedad.precio;
          propiedadJugador.vendida = true;
          await jugador.save();
          await propiedadJugador.save();
          ctx.status = 200;
        } else {
          jugador.dinero += propiedad.precio;
          propiedadJugador.num_casas -= 1;
          await jugador.save();
          await propiedadJugador.save();
          ctx.status = 200;
        }
        ctx.body = propiedadJugador;
      } else if (servicioTren) {
        const servicioTrenJugador = await ctx.orm.ServicioTrenJugador.findOne(
          { where: { id_jugador: jugador.id, id_servicio: servicioTren.id } },
        );
        if (servicioTrenJugador) {
          if (servicioTrenJugador.num_trenes === 1) {
            jugador.dinero += servicioTren.precio;
            servicioTrenJugador.vendida = true;
            await jugador.save();
            await servicioTrenJugador.save();
            ctx.status = 200;
          } else {
            jugador.dinero += servicioTren.precio;
            servicioTrenJugador.num_trenes -= 1;
            await jugador.save();
            await servicioTrenJugador.save();
            ctx.status = 200;
          }
        }
        ctx.body = servicioTrenJugador;
      }
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

async function hasOwner(jugadorID, partidaID, casillaID, ctx) {
  const participaciones = await ctx.orm.Participacion.findAll(
    { where: { id_partida: partidaID } },
  );
  const jugadores = participaciones.map((participacion) => participacion.id_jugador);
  const propiedad = await ctx.orm.CasillaPropiedad.findOne({ where: { id_casilla: casillaID } });
  const servicioTren = await ctx.orm.CasillaTren.findOne({ where: { id_casilla: casillaID } });
  if (!propiedad && !servicioTren) {
    return false;
  }
  if (propiedad) {
    for (let i = 0; i < jugadores.length; i += 1) {
      const propiedadJugador = await ctx.orm.PropiedadJugador.findOne(
        { where: { id_jugador: jugadores[i], id_propiedad: propiedad.id, vendida: false } },
      );
      if (propiedadJugador && jugadores[i] !== jugadorID) {
        return true;
      }
    }
  } else if (servicioTren) {
    for (let i = 0; i < jugadores.length; i += 1) {
      const servicioTrenJugador = await ctx.orm.ServicioTrenJugador.findOne(
        { where: { id_jugador: jugadores[i], id_servicio: servicioTren.id, vendida: false } },
      );
      if (servicioTrenJugador && jugadores[i] !== jugadorID) {
        return true;
      }
    }
  }
  return false;
}

router.post('partida.check.propiedad.owner', '/check/owner', async (ctx) => {
  try {
    const jugador = await ctx.orm.Jugador.findByPk(ctx.request.body.id_jugador);

    const hasOtherOwner = await hasOwner(
      jugador.id,
      ctx.request.body.id_partida,
      ctx.request.body.id_casilla,
      ctx,
    );

    if (hasOtherOwner) {
      ctx.body = { owner: false, otherOwner: true };
      return;
    }

    const propiedad = await ctx.orm.CasillaPropiedad.findOne(
      { where: { id_casilla: ctx.request.body.id_casilla } },
    );

    const servicioTren = await ctx.orm.CasillaTren.findOne(
      { where: { id_casilla: ctx.request.body.id_casilla } },
    );

    if (!propiedad && !servicioTren) {
      ctx.body = { owner: false, canBuy: false };
      ctx.status = 200;
      return;
    }
    if (propiedad) {
      const propiedadJugador = await ctx.orm.PropiedadJugador.findOne(
        { where: { id_jugador: jugador.id, id_propiedad: propiedad.id, vendida: false } },
      );

      if (propiedadJugador) {
        ctx.body = {
          owner: true,
          numCasas: propiedadJugador.num_casas,
          canBuy: jugador.dinero >= propiedad.precio,
        };
        ctx.status = 200;
        return;
      }
    } else if (servicioTren) {
      const servicioTrenJugador = await ctx.orm.ServicioTrenJugador.findOne(
        { where: { id_jugador: jugador.id, id_servicio: servicioTren.id, vendida: false } },
      );

      if (servicioTrenJugador) {
        ctx.body = {
          owner: true,
          numCasas: servicioTrenJugador.num_trenes,
          canBuy: jugador.dinero >= servicioTren.precio,
        };
        ctx.status = 200;
        return;
      }
    }

    if (hasOtherOwner) {
      ctx.body = { owner: true };
      ctx.status = 200;
      return;
    }
    ctx.body = { owner: false, canBuy: jugador.dinero >= propiedad.precio };
    ctx.status = 200;
  } catch (error) {
    console.log(error);
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('partida.start', '/start', async (ctx) => {
  try {
    console.log(ctx.request.body);
    const partida = await ctx.orm.Partida.findByPk(ctx.request.body.idPartida);
    if (partida) {
      partida.ready = true;
      console.log(partida.ready);
      await partida.save();
      console.log(partida.ready);
    }
    ctx.body = partida;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

// Eliminar partida

router.post('partida.info', '/info', async (ctx) => {
  try {
    const token = ctx.request.header.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const userID = decoded.user.id;

    const partida = await ctx.orm.Partida.findByPk(ctx.request.body.id_partida);
    if (partida) {
      const participaciones = await ctx.orm.Participacion.findAll(
        {
          where:
          {
            id_partida: partida.id,
          },
        },
      );
      const jugadores = [];
      const ordenJugadoresSideBar = [];
      const propiedadesCasa = [];
      const propiedadesTren = [];

      for (let i = 0; i < participaciones.length; i += 1) {
        const jugador = await ctx.orm.Jugador.findByPk(participaciones[i].id_jugador);
        const usuario = await ctx.orm.Usuario.findByPk(jugador.id_usuario);

        const propiedadesJugador = await ctx.orm.PropiedadJugador.findAll(
          { where: { id_jugador: jugador.id, vendida: false } },
        );
        const propiedadesJugadorInfo = [];
        const propiedadJugadorList = [];

        for (let j = 0; j < propiedadesJugador.length; j += 1) {
          const propiedad = await ctx.orm.CasillaPropiedad.findByPk(
            propiedadesJugador[j].id_propiedad,
          );

          propiedadesJugadorInfo.push(propiedad);
          propiedadJugadorList.push([propiedad.id_casilla, propiedadesJugador[j].num_casas]);
        }

        propiedadesCasa.push({
          id_jugador: jugador.id,
          propiedades: propiedadJugadorList,
        });

        const serviciosJugador = await ctx.orm.ServicioTrenJugador.findAll(
          { where: { id_jugador: jugador.id, vendida: false } },
        );
        const serviciosJugadorInfo = [];
        const serviciosJugadorList = [];

        for (let j = 0; j < serviciosJugador.length; j += 1) {
          const servicio = await ctx.orm.CasillaTren.findByPk(
            serviciosJugador[j].id_servicio,
          );
          serviciosJugadorInfo.push(servicio);
          serviciosJugadorList.push([servicio.id_casilla, serviciosJugador[j].num_trenes]);
        }

        propiedadesTren.push({
          id_jugador: jugador.id,
          servicios: serviciosJugadorList,
        });

        const eventosJugador = await ctx.orm.EventoJugador.findAll(
          { where: { id_jugador: jugador.id, expired: false } },
        );

        const jugadorInfo = {
          ...jugador.dataValues,
          username: usuario.username,
          propiedades: propiedadesJugadorInfo,
          servicios: serviciosJugadorInfo,
          cantidadEventosSalirCarcel: eventosJugador.length,
        };

        if (jugador.id_usuario === userID) {
          ordenJugadoresSideBar.push(jugadorInfo);
        }
        jugadores.push(jugadorInfo);
      } // Lista de jugadores en orden para la sidebar

      for (let i = 0; i < jugadores.length; i += 1) {
        if (jugadores[i].id_usuario !== userID) {
          ordenJugadoresSideBar.push(jugadores[i]);
        }
      }
      console.log(propiedadesCasa);
      console.log(propiedadesTren);
      // propiedadesJugador1 = [[id_casilla, numCasas], [id_casilla, numCasas] ...]
      if (partida.orden) {
        const orden = partida.orden.split(',');
        const jugadoresOrdenados = [];
        for (let i = 0; i < orden.length; i += 1) {
          const jugador = jugadores.find((j) => j.id === parseInt(orden[i], 10));
          jugadoresOrdenados.push(jugador);
        }

        ctx.body = [
          ...jugadoresOrdenados,
          ...ordenJugadoresSideBar,
          partida.numTurno,
          partida.dadosInicio,
          partida.turnoActualIndex,
          propiedadesCasa,
          partida.ready,
          propiedadesTren,
        ];
      } else {
        ctx.body = [
          ...jugadores,
          ...ordenJugadoresSideBar,
          partida.numTurno,
          partida.dadosInicio,
          partida.turnoActualIndex,
          propiedadesCasa,
          partida.ready,
          propiedadesTren,
        ];
      }
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('change.turn', '/change/turn', async (ctx) => {
  try {
    const partida = await ctx.orm.Partida.findByPk(ctx.request.body.id_partida);
    if (partida) {
      partida.numTurno -= 1;
      await partida.save();
    }
    ctx.body = partida;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('jugador.free', '/free', async (ctx) => {
  try {
    const jugador = await ctx.orm.Jugador.findByPk(ctx.request.body.id_jugador);
    if (jugador) {
      jugador.estado = 'free';
      await jugador.save();
    }
    ctx.body = jugador;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('evento.aleatorio', '/aleatorio', async (ctx) => {
  try {
    const { idCasilla, idJugador } = ctx.request.body;

    if (![4, 8, 15, 19].includes(idCasilla)) {
      ctx.status = 400;
      ctx.body = { error: 'Casilla no tiene evento aleatorio' };
      return;
    }

    // Obtener eventos
    const eventosMulta = await ctx.orm.EventoMulta.findAll();
    const eventosBonusAvance = await ctx.orm.EventoBonusAvance.findAll();
    const eventosRetroceso = await ctx.orm.EventoRetroceso.findAll();
    const eventosBonificacion = await ctx.orm.EventoBonificacion.findAll();
    const eventosSalirCarcel = await ctx.orm.EventoSalirCarcel.findAll();

    // Etiquetar eventos
    const todosEventos = [
      ...eventosMulta.map((evento) => ({ ...evento.toJSON(), tipo: 'Multa' })),
      ...eventosBonusAvance.map((evento) => ({ ...evento.toJSON(), tipo: 'BonusAvance' })),
      ...eventosRetroceso.map((evento) => ({ ...evento.toJSON(), tipo: 'Retroceso' })),
      ...eventosBonificacion.map((evento) => ({ ...evento.toJSON(), tipo: 'Bonificacion' })),
      ...eventosSalirCarcel.map((evento) => ({ ...evento.toJSON(), tipo: 'SalirCarcel' })),
    ];

    // Seleccionar un evento aleatorio
    const eventoAleatorio = todosEventos[Math.floor(Math.random() * todosEventos.length)];

    const jugador = await ctx.orm.Jugador.findByPk(idJugador);

    const oldpos = jugador.posicion;
    let newpos;

    switch (eventoAleatorio.tipo) {
      case 'Multa':
        console.log(jugador);
        jugador.dinero -= eventoAleatorio.monto;
        await jugador.save();
        break;

      case 'BonusAvance':
        if ((jugador.posicion + eventoAleatorio.cantidad_aumentada) % 20 === 0) {
            jugador.posicion = 20;
            newpos = 20;
            if (oldpos > newpos && newpos <= 5) {
              jugador.dinero += 100;
            }
        } else {
            jugador.posicion = (jugador.posicion + eventoAleatorio.cantidad_aumentada) % 20;
            newpos = (jugador.posicion + eventoAleatorio.cantidad_aumentada) % 20;
            if (oldpos > newpos && newpos <= 5) {
              jugador.dinero += 100;
            }
        }
        await jugador.save();
        break;

      case 'Retroceso':
        if ((jugador.posicion - eventoAleatorio.num_casillas) % 20 === 0) {
          jugador.posicion = 20;
      } else {
          jugador.posicion = (jugador.posicion - eventoAleatorio.num_casillas + 20) % 20;
      }
      await jugador.save();
      break;

      case 'Bonificacion':
        jugador.dinero += eventoAleatorio.monto;
        await jugador.save();
        break;

      case 'SalirCarcel':
        try {
            await ctx.orm.EventoJugador.create(
              {
                id_jugador: jugador.id,
                id_evento: eventoAleatorio.id,
              },
            );
          } catch (error) {
            ctx.status = 400;
            ctx.body = { error: 'Se ocuparon los eventos disponibles' };
            return;
          }
          break;

      default:
        break;
  }

    ctx.body = eventoAleatorio;
  } catch (error) {
    console.error(error);
    console.log(error);
    ctx.status = 400;
    ctx.body = { error: 'Error al obtener evento aleatorio' };
  }
});

router.post('evento.partida', '/sumarinicio', async (ctx) => {
  try {
    const { idPartida, idJugador } = ctx.request.body;
    const partida = await ctx.orm.Partida.findByPk(idPartida);
    const jugador = await ctx.orm.Jugador.findByPk(idJugador);

    if (!partida) {
      ctx.status = 404;
      ctx.body = { error: 'Partida no encontrada' };
    } else if (!jugador) {
      ctx.status = 404;
      ctx.body = { error: 'Jugador no encontrado' };
    } else {
      jugador.dinero += 100;
      await jugador.save();
      ctx.status = 200;
      ctx.body = { message: 'Se ha sumado 100 al jugador' };
      console.log('SI SE SUMA ALO ALO');
      console.log(jugador.dinero);
      console.log('SI SE SUMA ALO ALO');
      console.log('SI SE SUMA ALO ALO');
    }
  } catch (error) {
    console.error(error);
    ctx.status = 400;
    ctx.body = { error: 'Error al sumar 100 al jugador' };
  }
});

// HACER UNA RUTA PARA OBTENER AL JUGADOR ACTUAL DEL COMPUTADOR

router.post('partida.status', '/status', async (ctx) => {
  try {
    const partida = await ctx.orm.Partida.findByPk(ctx.request.body.idPartida);
    if (partida) {
      const participaciones = await ctx.orm.Participacion.findAll(
        {
          where:
          {
            id_partida: partida.id,
          },
        },
      );
      const response = {
        participaciones: participaciones.length,
        status: partida.estado,
      };
      ctx.body = response;
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('check.ganador', '/ganador', async (ctx) => {
  try {
    const { idPartida } = ctx.request.body;
    const { jugadoresID } = ctx.request.body; // list
    const patrimonioJugadores = {};
    const partida = await ctx.orm.Partida.findByPk(idPartida);

    for (let i = 0; i < jugadoresID.length; i += 1) {
      const jugador = await ctx.orm.Jugador.findByPk(jugadoresID[i]);
      let patrimonioTotal = jugador.dinero;
      const propiedadesJugador = await ctx.orm.PropiedadJugador.findAll(
        { where: { id_jugador: jugador.id } },
      );
      const serviciosJugador = await ctx.orm.ServicioTrenJugador.findAll(
        { where: { id_jugador: jugador.id } },
      );
      for (let j = 0; j < propiedadesJugador.length; j += 1) {
        const propiedad = await ctx.orm.CasillaPropiedad.findByPk(
          propiedadesJugador[j].id_propiedad,
        );
        patrimonioTotal += (propiedad.precio / 2) * propiedadesJugador[j].num_casas;
      }
      for (let j = 0; j < serviciosJugador.length; j += 1) {
        const servicio = await ctx.orm.CasillaTren.findByPk(
          serviciosJugador[j].id_servicio,
        );
        patrimonioTotal += (servicio.precio / 2) * serviciosJugador[j].num_trenes;
      }

      patrimonioJugadores[jugador.id] = patrimonioTotal;
    }

    const ganadorID = Object.keys(patrimonioJugadores).reduce(
      (a, b) => (patrimonioJugadores[a] > patrimonioJugadores[b] ? a : b),
    );
    const jugadorGanador = await ctx.orm.Jugador.findByPk(ganadorID);
    const usuarioGanador = await ctx.orm.Usuario.findByPk(jugadorGanador.id_usuario);

    partida.ganador = usuarioGanador.username;
    partida.estado = 'finalizada';
    await partida.save();

    // Highscore usuario
    const token = ctx.request.header.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userID = decoded.user.id;
    if (jugadorGanador.id_usuario === userID) {
      usuarioGanador.highscore += 1;
      await usuarioGanador.save();
    }

    ctx.body = {
 ganador: partida.ganador,
      patrimonioJugadores,
usuarioGanadorHighscore: usuarioGanador.highscore,
};
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('evento.ircarcel', '/carcel', async (ctx) => {
  try {
    const { idJugador } = ctx.request.body;
    const eventoSalir = await ctx.orm.EventoJugador.findOne({
      where: {
        id_jugador: idJugador,
        expired: false,
      },
    });

    if (!eventoSalir) {
      // Si el jugador tiene el evento "Salir de la cárcel", no pierde turno
      const jugador = await ctx.orm.Jugador.findByPk(idJugador);
      jugador.posicion = 16;
      jugador.estado = 'carcel';
      await jugador.save();

      ctx.body = { luck: false, message: 'Jugador enviado a la cárcel' };
    } else {
      eventoSalir.expired = true;
      await eventoSalir.save();
      ctx.body = { luck: true, message: 'Usaste una carta de Salir de la carcel, puedes continuar con tu turno' };
    }

    ctx.status = 200;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Ocurrió un error al procesar la solicitud.' };
    console.error('Error en el servidor:', error);
  }
});

router.post('bancarrota', '/bancarrota', async (ctx) => {
  try {
    const { idJugador } = ctx.request.body;
    const jugador = await ctx.orm.Jugador.findByPk(idJugador);
    jugador.dinero = 0;
    jugador.estado = 'bancarrota';
    await jugador.save();
    ctx.body = jugador;
    ctx.status = 200;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Ocurrió un error al procesar la solicitud.' };
    console.error('Error en el servidor:', error);
  }
});
router.post('check.highscore', '/highscore', async (ctx) => {
  try {
    const usuarios = await ctx.orm.Usuario.findAll({
      order: [['highscore', 'DESC']], // Ordenar por highscore de manera descendente
      limit: 5, // Limitar la búsqueda a los mejores 5 usuarios
    });
    console.log(usuarios);

    // Mapear los datos que queremos enviar en la respuesta
    const ranking = usuarios.map((usuario) => ({
      username: usuario.username,
      highscore: usuario.highscore,

    }));
    console.log(ranking);

    ctx.body = ranking;
    ctx.status = 200;
  } catch (error) {
    ctx.body = { error: 'Error al obtener el ranking de highscores' };
    ctx.status = 400;
  }
});

// POR IMPLEMENTAR ENTREGA 4

// router.post('partida.iniciar', '/iniciar', async (ctx) => {
//   try {
//     const partida = await ctx.orm.Partida.findByPk(ctx.request.body.idPartida);
//     if (partida) {
//       partida.estado = 'iniciada';
//       await partida.save();
//       ctx.status = 200;
//     }
//   } catch (error) {
//     ctx.body = error;
//     ctx.status = 400;
//   }
// });

// informacion jugador actual

module.exports = router;
