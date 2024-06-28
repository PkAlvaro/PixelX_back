const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PropiedadJugador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.CasillaPropiedad, {
        foreignKey: 'id_propiedad',
      });
      this.belongsTo(models.Jugador, {
        foreignKey: 'id_jugador',
      });
    }
  }
  PropiedadJugador.init({
    id_jugador: DataTypes.INTEGER,
    id_propiedad: DataTypes.INTEGER,
    num_casas: DataTypes.INTEGER,
    vendida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'PropiedadJugador',
  });
  return PropiedadJugador;
};
