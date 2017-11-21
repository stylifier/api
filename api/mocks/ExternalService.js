'use strict'

class ExternalService {
  constructor(config, logger) {
    console.warn('RUNNING MOCK BACKEND')
    this.logger = logger || console
    this.logger.info = () => {}
  }

  search() {
    return Promise.accept([{
      username: 'test',
      name: 'test',
      followers: 1,
      avatar: ''
    }])
  }
}

module.exports = ExternalService
