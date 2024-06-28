module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('EventoBonusAvances', 'imagen', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('EventoBonusAvances', 'imagen');
  },
};
