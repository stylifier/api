'use strict'

module.exports = {
  up: (queryInterface, Datatypes) => {
    return queryInterface.addColumn('threads', 'from_last_message_at', {
      type: Datatypes.DATE,
      defaultValue: null
    })
    .then(() =>
      queryInterface.addColumn('threads', 'to_last_message_at', {
        type: Datatypes.DATE,
        defaultValue: null
      }))
    .then(() =>
      queryInterface.addColumn('threads', 'from_last_message_read_at', {
        type: Datatypes.DATE,
        defaultValue: null
      }))
    .then(() =>
      queryInterface.addColumn('threads', 'to_last_message_read_at', {
        type: Datatypes.DATE,
        defaultValue: null
      }))
  },

  down: (queryInterface, Datatypes) => {
    return queryInterface.removeColumn('threads', 'from_last_message_at')
    .then(() =>
      queryInterface.removeColumn('threads', 'to_last_message_at'))
    .then(() =>
      queryInterface.removeColumn('threads', 'from_last_message_read_at'))
    .then(() =>
      queryInterface.removeColumn('threads', 'to_last_message_read_at'))
  }
}
