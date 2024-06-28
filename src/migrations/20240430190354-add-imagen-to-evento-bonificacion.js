module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('EventoBonificacions', 'imagen', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('EventoBonificacions', 'imagen');
  },
};
