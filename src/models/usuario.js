const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Jugador, {
        foreignKey: 'id',
      });
    }
  }
  Usuario.init({
    nombre: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    highscore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rol: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};
