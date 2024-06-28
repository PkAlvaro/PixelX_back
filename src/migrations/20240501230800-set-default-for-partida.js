module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Partidas', 'turnos', {
      type: Sequelize.INTEGER,
      defaultValue: 20,
    });
    await queryInterface.changeColumn('Partidas', 'codigo', {
      type: Sequelize.STRING,
      defaultValue: 'None',
    });
    await queryInterface.changeColumn('Partidas', 'estado', {
      type: Sequelize.STRING,
      defaultValue: 'disponible',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Partidas', 'turnos', {
      type: Sequelize.INTEGER,
      // Elimina el valor por defecto si revertimos la migración
    });
    await queryInterface.changeColumn('Partidas', 'codigo', {
      type: Sequelize.STRING,
      // Similar para el otro atributo
    });
    await queryInterface.changeColumn('Partidas', 'estado', {
      type: Sequelize.STRING,
      // Similar para el otro atributo
    });
  },
};
