/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ServicioTrenJugadors', {
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
      id_servicio: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CasillaTrens',
          key: 'id',
        },
      },
      num_trenes: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('ServicioTrenJugadors');
  },
};
