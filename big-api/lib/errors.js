'use strict'

import { isBoom } from '@hapi/boom'

const customError = (errorDetails = {}) => {
  if (isBoom(errorDetails)) return errorDetails

  const error = Error()
  return { ...error, ...errorDetails }
}

module.exports = {
  customError
}
