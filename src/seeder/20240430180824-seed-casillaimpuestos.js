module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('CasillaImpuestos', [
    {
      id_casilla: 11,
      monto: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('CasillaImpuestos', null, {}),
};
