const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventoSalirCarcel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.CasillaEvento, {
        foreignKey: 'id_casilla_evento',
      });
      this.hasOne(models.EventoJugador, {
        foreignKey: 'id',
      });
    }
  }
  EventoSalirCarcel.init({
    id_casilla_evento: DataTypes.INTEGER,
    imagen: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'EventoSalirCarcel',
  });
  return EventoSalirCarcel;
};
