module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('EventoSalirCarcels', [
    {
      id_casilla_evento: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/LX66y83L/evento-salir-carcel.png',
    },
    {
      id_casilla_evento: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/LX66y83L/evento-salir-carcel.png',
    },
    {
      id_casilla_evento: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/LX66y83L/evento-salir-carcel.png',
    },
    {
      id_casilla_evento: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/LX66y83L/evento-salir-carcel.png',
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('EventoSalirCarcels', null, {}),
};
