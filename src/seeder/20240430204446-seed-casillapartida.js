module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('CasillaPartidas', [
    {
      id_casilla: 1,
      monto: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('CasillaPartidas', null, {}),
};
