const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Participacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Jugador, {
        foreignKey: 'id_jugador',
      });
      this.belongsTo(models.Partida, {
        foreignKey: 'id_partida',
      });
    }
  }
  Participacion.init({
    id_partida: DataTypes.INTEGER,
    id_jugador: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Participacion',
  });
  return Participacion;
};
