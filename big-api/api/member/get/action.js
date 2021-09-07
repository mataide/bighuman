'use strict'

import Api from '@proak/response'
import { customError } from '../../../lib/errors'
import validateRequest from '@proak/request-validator'
import { Players } from '../../../models'

export default async (event, cb) => {
  let members
  const { params: { teamId }, query } = validateRequest({})(event)

  try {
    if (query.lastName) {
      const players = await queryPlayersSortedByLastName({ teamId, name: query.role })

      return Api.response({ Items: players })
    }



    return Api.response(members)
  } catch (error) {
    console.error('Error [team.members.get.action]', error)
    cb(null, Api.errors(200, error.message))
  }
}

const queryPlayersSortedByLastName = async (data, lastName) => {
  try {
    let query = Players.dynamodb()
      .query(lastName)
      .usingIndex('last_name-index')
      .ascending()

    if (data.limit) {
      query = query.limit(data.limit)
    }

    const players = await query.execAsync()

    if (!players.Items.length) throw customError({ message: 'Players not found' })
    return players
  } catch (error) {
    console.error('Error ', error)
    throw error
  }
}

const queryPlayersSortedByStatus = async (data, status) => {
  try {
    let query = Players.dynamodb()
        .query(status)
        .usingIndex('active-index')
        .ascending()

    if (data.limit) {
      query = query.limit(data.limit)
    }

    const players = await query.execAsync()

    if (!players.Items.length) throw customError({ message: 'Players not found' })
    return players
  } catch (error) {
    console.error('Error ', error)
    throw error
  }
}

