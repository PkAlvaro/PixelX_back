const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Jugador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.ServicioTrenJugador, {
        foreignKey: 'id',
      });
      this.hasMany(models.PropiedadJugador, {
        foreignKey: 'id',
      });
      this.hasMany(models.EventoJugador, {
        foreignKey: 'id',
      });
      this.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
      });
      this.hasOne(models.Participacion, {
        foreignKey: 'id',
      });
    }
  }
  Jugador.init({
    id_usuario: DataTypes.INTEGER,
    posicion: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    color: DataTypes.STRING,
    dinero: {
      type: DataTypes.INTEGER,
      defaultValue: 1000,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'libre',
    },
  }, {
    sequelize,
    modelName: 'Jugador',
  });
  return Jugador;
};
