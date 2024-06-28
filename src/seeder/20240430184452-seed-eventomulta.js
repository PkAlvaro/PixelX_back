module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('EventoMulta', [
    {
      id_casilla_evento: 1,
      monto: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/pdBLYFzP/evento-multa.png',
    },
    {
      id_casilla_evento: 2,
      monto: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/pdBLYFzP/evento-multa.png',
    },
    {
      id_casilla_evento: 3,
      monto: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/pdBLYFzP/evento-multa.png',
    },
    {
      id_casilla_evento: 4,
      monto: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/pdBLYFzP/evento-multa.png',
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('EventoMulta', null, {}),
};
