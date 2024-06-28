module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Partidas', 'codigo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Partidas', 'codigo');
  },
};
