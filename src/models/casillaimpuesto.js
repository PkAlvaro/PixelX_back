const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CasillaImpuesto extends Model {
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
    }
  }
  CasillaImpuesto.init({
    id_casilla: DataTypes.INTEGER,
    monto: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CasillaImpuesto',
  });
  return CasillaImpuesto;
};
