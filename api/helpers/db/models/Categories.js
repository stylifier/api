'use strict'

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('categories', {
    id: {
      type: Datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    address: Datatypes.STRING,
    lable: Datatypes.STRING,
    active: Datatypes.BOOLEAN,
  })

  model.getActiveCategories = function() {
    return this.findAll({
      limit: 20000,
      attributes: ['lable', 'address'],
      where: {active: true},
    })
  }

  return model
}
