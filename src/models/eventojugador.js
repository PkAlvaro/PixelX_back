const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventoJugador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.EventoSalirCarcel, {
        foreignKey: 'id_evento',
      });
      this.belongsTo(models.Jugador, {
        foreignKey: 'id_jugador',
      });
    }
  }
  EventoJugador.init({
    id_jugador: DataTypes.INTEGER,
    id_evento: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'EventoJugador',
  });
  return EventoJugador;
};
