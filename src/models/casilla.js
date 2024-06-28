const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Casilla extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.CasillaCarcel, {
        foreignKey: 'id',
      });
      this.hasOne(models.CasillaImpuesto, {
        foreignKey: 'id',
      });
      this.hasMany(models.CasillaEvento, {
        foreignKey: 'id',
      });
      this.hasOne(models.CasillaIrCarcel, {
        foreignKey: 'id',
      });
      this.hasMany(models.CasillaPropiedad, {
        foreignKey: 'id',
      });
      this.hasMany(models.CasillaTren, {
        foreignKey: 'id',
      });
    }
  }
  Casilla.init({
    mensaje: DataTypes.STRING,
    imagen: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Casilla',
  });
  return Casilla;
};
