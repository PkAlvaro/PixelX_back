/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EventoJugadors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_jugador: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Jugadors',
          key: 'id',
        },
      },
      id_evento: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CasillaEventos',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EventoJugadors');
  },
};
