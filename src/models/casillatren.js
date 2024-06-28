const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CasillaTren extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Casilla, {
        foreignKey: 'id_casilla',
      });
      this.hasOne(models.ServicioTrenJugador, {
        foreignKey: 'id',
      });
    }
  }
  CasillaTren.init({
    id_casilla: DataTypes.INTEGER,
    precio: DataTypes.INTEGER,
    renta: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CasillaTren',
  });
  return CasillaTren;
};
