import Premium from '../../src/tasks/Premium'
import { chai, expect } from '../helpers'
import { Client, Collection } from 'discord.js'

const nothing = () => new Promise(resolve => resolve(null))
const addRole = chai.spy(nothing)
const removeRole = chai.spy(nothing)

const members = new Collection()
const roles = new Collection()
roles.set('1', { name: 'Premium', id: '1' })
for (let i = 0; i < 10; i++) {
  members.set(i.toString(), {
    id: i.toString(),
    addRole: addRole,
    removeRole: removeRole
  })
}
const client = {
  guilds: {
    cache: {
      first: function () {
        return {
          members: members,
          roles: roles
        }
      }
    }
  }
}

Premium.getPremiumsFromSite = function () {
  return new Promise(resolve => resolve(['1', '2', '3', '4']))
}

Premium.getPremiumsFromDiscord = function () {
  return new Promise(resolve => resolve(['4', '5']))
}
Premium.client = client as Client

describe('Premium', function () {
  test('doit ajouter les membres', function (done) {
    Premium.syncPremiums().then(function () {
      expect(addRole).to.be.called.exactly(3)
      expect(removeRole).to.be.called.exactly(1)
      done()
    })
  })
})
