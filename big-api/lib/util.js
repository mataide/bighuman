'use strict'

const { reduce } = require('lodash')
const constants = require('@proak/constants')

const Utils = {
  success (result) {
    console.log(JSON.stringify(result, null, 2))
  },
  sleep (time) {
    const endAt = new Date(new Date().getTime() + time)
    while (new Date().getTime() < endAt) {}
  },
  error ({ message }) { console.error(message) },
  isObject (value) {
    return typeof value === 'object' &&
        value != null &&
        !(value instanceof Date)
  },
  convertBinaryValue (record, fieldName) {
    if (record[fieldName]) {
      record[fieldName] = Buffer.from(record[fieldName]).toString()
    }
    return record
  },
  getModelName (name) {
    return `${name.toLowerCase()}_${constants('PROFILE')}`
  },
  required (name) {
    throw new Error(`${name} is required`)
  }
}

module.exports = Utils
