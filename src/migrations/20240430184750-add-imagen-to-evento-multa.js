module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('EventoMulta', 'imagen', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('EventoMulta', 'imagen');
  },
};
