module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Partidas', 'ready', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Partidas', 'ready');
  },
};
