module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    status: DataTypes.STRING,
    type: DataTypes.STRING
  })
  User.prototype.comparePassword = function (password) {
    console.log(this.password)
    if (password == this.password) {
      return true
    } else {
      return false
    }
  }
  User.associate = function (models) { }
  return User
}