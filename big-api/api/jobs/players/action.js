'use strict'

import {getPlayers} from './getPlayers'
import { Players } from '../../../models'
import Api from "@proak/response";

// Multi - Create''
export const respond = async () => {

  const response = await getPlayers();
  const data = JSON.parse(JSON.stringify(response.data));
  let arrayPlayers = {};
  for (const [key, value] of Object.entries(data)) {
    console.log(key, value);
    arrayPlayers.add(value);
  }

  try {
    const players = await addPlayers(arrayPlayers)
    return Api.response({ Items: players })
  } catch (error) {
    console.error('Error [team.members.get.action]', error)
    return (null, Api.errors(200, error.message))
  }

}

function addPlayers (data) {
  return new Promise((resolve, reject) => {
    Players.dynamodb().create(data, function (err, acc) {
      if (err === null) {
        resolve(acc)
      } else {
        console.error('Error [team.member.create.addTeamMember]', err)
        reject(err['message'])
      }
    })
  })
}

