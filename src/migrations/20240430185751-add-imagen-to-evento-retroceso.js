module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('EventoRetrocesos', 'imagen', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('EventoRetrocesos', 'imagen');
  },
};
