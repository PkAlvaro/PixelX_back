const Router = require('koa-router');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const router = new Router();

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

    resultados.sort((a, b) => b.dado - a.dado);

    // Extraer los IDs de los jugadores en orden y guardarlos en un string separado por comas
    const ordenJugadores = resultados.map((r) => r.jugadorID).join(',');

    partida.orden = ordenJugadores;
    await partida.save();

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
  return propiedadJugador.num_casas < 4 || propiedadJugador.num_casas + numCasas <= 4;
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

    await comprarPropiedad(jugador, propiedad, ctx);
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.post('construir.casa', '/construir', async (ctx) => {
  try {
    // Buscar la partida
    const partida = await ctx.orm.Partida.findByPk(ctx.request.body.id_partida);

    if (!partida) {
      ctx.status = 404;
      ctx.body = 'Partida no encontrada';
    }
    // Buscar la casilla
    const casilla = await ctx.orm.Casilla.findByPk(ctx.request.body.id_casilla);

    // Buscar la propiedad
    const propiedad = await ctx.orm.CasillaPropiedad.findOne({ where: { id_casilla: casilla.id } });
    // Buscar al jugador
    const jugador = await ctx.orm.Jugador.findByPk(ctx.request.body.id_jugador);
    // Buscar la relacion entre el jugador y la propiedad
    // Actualizar el numero de casas de la propiedad
    const { numCasas } = ctx.request.body;
    await comprarCasas(jugador, propiedad, numCasas, ctx);
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

router.post('pagar.alquiler', '/pagar/renta', async (ctx) => {
  try {
    // Buscar la partida
    const partida = await ctx.orm.Partida.findByPk(ctx.request.body.id_partida);

    if (!partida) {
      ctx.status = 404;
      ctx.body = 'Partida no encontrada';
      console.log('Partida no encontrada');
    }
    // Buscar la casilla
    const casilla = await ctx.orm.Casilla.findByPk(ctx.request.body.id_casilla);
    if (casilla) {
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
          },
        },
      );
      const propietario = await ctx.orm.Jugador.findByPk(propiedadJugador.id_jugador);
      // Buscar al jugador que paga
      const jugador = await ctx.orm.Jugador.findByPk(ctx.request.body.id_jugador);

      await pagarAlquiler(jugador, propiedadJugador, propietario, propiedad, ctx);
      // Actualizar atributo dinero de propietario y jugador en la base de datos
    }
  } catch (error) {
    ctx.body = error;
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

// router.post('vender.propiedad', '/vender/:id', async (ctx) => {
//   try {
//     // Buscar la partida
//     const partida = await ctx.orm.Partida.findByPk(ctx.request.body.id_partida);

//     if (!partida) {
//       ctx.status = 404;
//       ctx.body = 'Partida no encontrada';
//     }
//     // Buscar la casilla
//     const casilla = await ctx.orm.Casilla.findByPk(ctx.params.id);
//     if (casilla) {
//       // Buscar al jugador
//       const jugador = await ctx.orm.Jugador.findByPk(ctx.request.body.id_jugador);
//       // Actualizar atributo dinero de jugador en la base de datos
//       jugador.dinero += casilla.precio;
//       // Actualizar atributo propietario de la casilla en la base de datos
//       casilla.propietario = null;
//       await jugador.save();
//       await casilla.save();
//       ctx.status = 200;
//     }
//   } catch (error) {
//     ctx.body = error;
//     ctx.status = 400;
//   }
// });

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
      for (let i = 0; i < participaciones.length; i += 1) {
        const jugador = await ctx.orm.Jugador.findByPk(participaciones[i].id_jugador);
        const usuario = await ctx.orm.Usuario.findByPk(jugador.id_usuario);
        const propiedadesJugador = await ctx.orm.PropiedadJugador.findAll(
          { where: { id_jugador: jugador.id } },
        );
        const propiedadesJugadorInfo = [];
        for (let j = 0; j < propiedadesJugador.length; j += 1) {
          const propiedad = await ctx.orm.CasillaPropiedad.findByPk(
            propiedadesJugador[j].id_propiedad,
          );
          propiedadesJugadorInfo.push(propiedad);
        }
        const serviciosJugador = await ctx.orm.ServicioTrenJugador.findAll(
          { where: { id_jugador: jugador.id } },
        );
        const serviciosJugadorInfo = [];
        for (let j = 0; j < serviciosJugador.length; j += 1) {
          const servicio = await ctx.orm.CasillaTren.findByPk(
            serviciosJugador[j].id_servicio,
          );
          serviciosJugadorInfo.push(servicio);
        }
        const eventosJugador = await ctx.orm.EventoJugador.findAll(
          { where: { id_jugador: jugador.id } },
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
        ];
      } else {
        ctx.body = [
          ...jugadores,
          ...ordenJugadoresSideBar,
        ];
      }
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
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
