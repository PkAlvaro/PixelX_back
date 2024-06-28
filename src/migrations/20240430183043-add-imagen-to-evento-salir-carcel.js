module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('EventoSalirCarcels', 'imagen', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('EventoSalirCarcels', 'imagen');
  },
};
