module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('CasillaEventos', [
    {
      id_casilla: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_casilla: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_casilla: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_casilla: 19,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('CasillaEventos', null, {}),
};
