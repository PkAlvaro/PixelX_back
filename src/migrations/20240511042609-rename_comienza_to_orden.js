module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Partidas', 'comienza', 'orden');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Partidas', 'orden', 'comienza');
  },
};
