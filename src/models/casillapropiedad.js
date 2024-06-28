const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CasillaPropiedad extends Model {
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
      this.hasOne(models.PropiedadJugador, {
        foreignKey: 'id',
      });
    }
  }
  CasillaPropiedad.init({
    id_casilla: DataTypes.INTEGER,
    precio: DataTypes.INTEGER,
    renta: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CasillaPropiedad',
  });
  return CasillaPropiedad;
};
