const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Partida extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Participacion, {
        foreignKey: 'id',
      });
    }
  }
  Partida.init({
    orden: DataTypes.STRING,
    turnos: {
      type: DataTypes.INTEGER,
      defaultValue: 20,
    },
    ganador: DataTypes.STRING,
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'disponible',
    },
    codigo: {
      type: DataTypes.STRING,
      defaultValue: 'None',
    },
    numTurno: {
      type: DataTypes.INTEGER,
    },
    dadoActual: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    dadosInicio: {
      type: DataTypes.STRING,
    },
    turnoActualIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ready: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Partida',
  });
  return Partida;
};
