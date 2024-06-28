const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventoRetroceso extends Model {
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
    }
  }
  EventoRetroceso.init({
    id_casilla_evento: DataTypes.INTEGER,
    num_casillas: DataTypes.INTEGER,
    imagen: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'EventoRetroceso',
  });
  return EventoRetroceso;
};
