module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('CasillaCarcels', [
    {
      id_casilla: 16,
      monto: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('CasillaCarcels', null, {}),
};
