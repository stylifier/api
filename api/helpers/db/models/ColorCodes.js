'use strict'

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('color_codes', {
    id: {
      type: Datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: Datatypes.STRING,
    code: Datatypes.STRING,
  })

  model.getColorCodes = function() {
    return this.findAll({
      limit: 20000,
      attributes: ['name', 'code'],
    })
  }

  return model
}
