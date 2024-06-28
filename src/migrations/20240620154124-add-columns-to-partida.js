'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Partidas', 'numTurno', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('Partidas', 'dadoActual', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    });
    await queryInterface.addColumn('Partidas', 'dadosInicio', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Partidas', 'turnoActualIndex', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Partidas', 'numTurno');
    await queryInterface.removeColumn('Partidas', 'dadoActual');
    await queryInterface.removeColumn('Partidas', 'dadosInicio');
    await queryInterface.removeColumn('Partidas', 'turnoActualIndex');
  }
};