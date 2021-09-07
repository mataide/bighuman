'use strict'

import GET from './get/action'
import lambdaHandler from '@proak/lambda-handler'

const actions = {
  GET
}

export default lambdaHandler(actions)
