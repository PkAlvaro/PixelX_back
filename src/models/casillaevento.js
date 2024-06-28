const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CasillaEvento extends Model {
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
      this.hasMany(models.EventoSalirCarcel, {
        foreignKey: 'id',
      });
      this.hasMany(models.EventoMulta, {
        foreignKey: 'id',
      });
      this.hasMany(models.EventoBonusAvance, {
        foreignKey: 'id',
      });
      this.hasMany(models.EventoRetroceso, {
        foreignKey: 'id',
      });
      this.hasMany(models.EventoBonificacion, {
        foreignKey: 'id',
      });
    }
  }
  CasillaEvento.init({
    id_casilla: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CasillaEvento',
  });
  return CasillaEvento;
};
