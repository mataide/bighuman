'use strict'

const { cloneDeep, reduce } = require('lodash')
const camelcase = require('camelcase')
const constants = require('@proak/constants')
const dynogels = require('@proak/dynogels')
const { getModelName, required } = require('../lib/util')

const model = function (data) {
  this.data = data
}

model.prototype.validate = function () {
  let DynamoModel = model.dynamodb()
  const instance = new DynamoModel(this.data)
  return DynamoModel.validate(instance)
}

const cleanData = data => {
  const document = cloneDeep(data)
  delete document['aws:rep:updating']
  delete document['aws:rep:deleting']
  delete document['aws:rep:updatetime']
  delete document['aws:rep:updateregion']
  return document
}

const cleanDataModel = data => {
  if (data) {
    Reflect.deleteProperty(data.attrs, 'aws:rep:updating')
    Reflect.deleteProperty(data.attrs, 'aws:rep:deleting')
    Reflect.deleteProperty(data.attrs, 'aws:rep:updatetime')
    Reflect.deleteProperty(data.attrs, 'aws:rep:updateregion')
  }
  return data
}

const createDynamoDbModel = (name, schema) => {
  dynogels.AWS.config.update(constants('dynamodb'))
  const tableName = `${camelcase(name, { pascalCase: true })}-${constants('PROFILE')}`
  const model = dynogels.define(tableName, {
    ...schema,
    tableName
  })

  // Remove aws field details before performing any action on the model
  const updateAsync = model.updateAsync
  model.updateAsync = (data, ...options) => {
    const document = cleanData(data)
    return updateAsync(document, ...options)
  }

  const update = model.update
  model.update = (data, options, callback) => {
    const document = cleanData(data)
    return update(document, options, callback)
  }

  const getAsync = model.getAsync
  model.getAsync = (...args) => getAsync(...args).then(cleanDataModel)

  return model
}

const createModel = ({ name, redshift, dynamodb, firestore }) => {
  const newModel = cloneDeep(model)

  if (dynamodb) {
    newModel.dynamodb = () => createDynamoDbModel(name, dynamodb)
  }

  return newModel
}

module.exports = createModel
