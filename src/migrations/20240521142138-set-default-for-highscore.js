module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Usuarios', 'highscore', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Usuarios', 'highscore', {
      type: Sequelize.INTEGER,
    }
    );
  },
};
