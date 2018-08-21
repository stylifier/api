'use strict'

const data = [
  {
    code: '#16738F',
    name: 'BLUE',
  },
  {
    code: '#0000AA',
    name: 'BLUE',
  },
  {
    code: '#303481',
    name: 'BLUE',
  },
  {
    code: '#6a759b',
    name: 'BLUE',
  },
  {
    code: '#21273d',
    name: 'BLUE',
  },
  {
    code: '#b9d4f1',
    name: 'BLUE',
  },
  {
    code: '#6B8E23',
    name: 'GREEN',
  },
  {
    code: '#008000',
    name: 'GREEN',
  },
  {
    code: '#50c19a',
    name: 'GREEN',
  },
  {
    code: '#535238',
    name: 'GREEN',
  },
  {
    code: '#808080',
    name: 'GRAY',
  },
  {
    code: '#FFC0CB',
    name: 'RED',
  },
  {
    code: '#990000',
    name: 'RED',
  },
  {
    code: '#fe4e6e',
    name: 'RED',
  },
  {
    code: '#FFA500',
    name: 'ORANGE',
  },
  {
    code: '#654321',
    name: 'ORANGE',
  },
  {
    code: '#686354',
    name: 'ORANGE',
  },
  {
    code: '#FFFF00',
    name: 'YELLOW',
  },
  {
    code: '#F5F5DC',
    name: 'YELLOW',
  },
  {
    code: '#551A8B',
    name: 'PURPLE',
  },
  {
    code: '#433751',
    name: 'PURPLE',
  },
  {
    code: '#FFFFFF',
    name: 'WHITE',
  },
  {
    code: '#000000',
    name: 'BLACK',
  },
].map(t => Object.assign(t, {createdAt: new Date(), updatedAt: new Date()}))

module.exports = {
  up: (queryInterface, Datatypes) => {
    return queryInterface.createTable('color_codes', {
      id: {
        type: Datatypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: Datatypes.STRING,
      code: Datatypes.STRING,
    })
    .then(() =>
      queryInterface.sequelize.query(
        queryInterface.QueryGenerator.bulkInsertQuery('color_codes', data)))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('color_codes')
  }
}
