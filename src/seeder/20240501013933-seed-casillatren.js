/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('CasillaTrens', [
    {
      id_casilla: 10,
      precio: 300,
      renta: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id_casilla: 18,
      precio: 300,
      renta: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    },

  ]),
  down: (queryInterface) => queryInterface.bulkDelete('CasillaTrens', null, {}),
};
