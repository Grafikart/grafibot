import { RegleFilter } from '../../src/filters'
import { fakeMessage } from '../helpers'

const filter = new RegleFilter()
const match = ['Règle 0']
const noMatch = ['Je test les règle 1']

describe('RegleFilter', () => {
  it('détecte les messages', () => {
    match.forEach(function (q) {
      let message = fakeMessage(q)
      expect(filter.filter(message)).toBe(true)
      expect(message.channel.send).toHaveBeenCalled()
    })
  })

  it('laisse passer les messages', () => {
    noMatch.forEach(function (q) {
      let message = fakeMessage(q)
      expect(filter.filter(message)).toBe(false)
      expect(message.channel.send).not.toHaveBeenCalled()
    })
  })
})
