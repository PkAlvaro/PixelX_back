const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CasillaPartida extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CasillaPartida.init({
    id_casilla: DataTypes.INTEGER,
    monto: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CasillaPartida',
  });
  return CasillaPartida;
};
