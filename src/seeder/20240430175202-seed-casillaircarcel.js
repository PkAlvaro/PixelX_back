module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('CasillaIrCarcels', [
    {
      id_casilla: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('CasillaIrCarcels', null, {}),
};
