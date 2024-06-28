const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ServicioTrenJugador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.CasillaTren, {
        foreignKey: 'id_servicio',
      });
      this.belongsTo(models.Jugador, {
        foreignKey: 'id_jugador',
      });
    }
  }
  ServicioTrenJugador.init({
    id_jugador: DataTypes.INTEGER,
    id_servicio: DataTypes.INTEGER,
    num_trenes: DataTypes.INTEGER,
    vendida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'ServicioTrenJugador',
  });
  return ServicioTrenJugador;
};
