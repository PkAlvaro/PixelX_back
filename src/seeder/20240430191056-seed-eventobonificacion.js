module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('EventoBonificacions', [
    {
      id_casilla_evento: 1,
      monto: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/15LX9Py1/evento-bonificacion.png',
    },
    {
      id_casilla_evento: 2,
      monto: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/15LX9Py1/evento-bonificacion.png',
    },
    {
      id_casilla_evento: 3,
      monto: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/15LX9Py1/evento-bonificacion.png',
    },
    {
      id_casilla_evento: 4,
      monto: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/15LX9Py1/evento-bonificacion.png',
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('EventoBonificacions', null, {}),
};
