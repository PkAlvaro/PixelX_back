/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PropiedadJugadors', {
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
      id_propiedad: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CasillaPropiedads',
          key: 'id',
        },
      },
      num_casas: {
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
    await queryInterface.dropTable('PropiedadJugadors');
  },
};
