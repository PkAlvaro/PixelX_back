module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Jugadors', 'posicion', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    });
    await queryInterface.changeColumn('Jugadors', 'dinero', {
      type: Sequelize.INTEGER,
      defaultValue: 1000,
    });
    await queryInterface.changeColumn('Jugadors', 'estado', {
      type: Sequelize.STRING,
      defaultValue: 'libre',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Jugadors', 'posicion', {
      type: Sequelize.INTEGER,
      // Elimina el valor por defecto si revertimos la migración
    });
    await queryInterface.changeColumn('Jugadors', 'dinero', {
      type: Sequelize.INTEGER,
      // Similar para el otro atributo
    });
    await queryInterface.changeColumn('Jugadors', 'estado', {
      type: Sequelize.STRING,
      // Similar para el otro atributo
    });
  },
};
