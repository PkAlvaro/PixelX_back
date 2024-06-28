module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Usuarios', 'rol', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'usuario',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Usuarios', 'rol');
  },
};
