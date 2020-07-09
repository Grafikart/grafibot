import { RegleFilter } from '../../src/filters'
import { expect, chai, fakeMessage } from '../helpers'

const filter = new RegleFilter()
const match = ['Règle 0']
const noMatch = ['Je test les règle 1']

describe('RegleFilter', () => {
  it('détecte les messages', () => {
    match.forEach(function (q) {
      let message = fakeMessage(q)
      expect(filter.filter(message), q).to.be.true
      expect(message.channel.send).to.be.called()
    })
  })

  it('laisse passer les messages', () => {
    noMatch.forEach(function (q) {
      let message = fakeMessage(q)
      expect(filter.filter(message), q).to.be.false
      expect(message.channel.send).to.not.be.called()
    })
  })
})
