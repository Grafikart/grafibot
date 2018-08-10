import { MentionFilter } from '../../src/filters'
import { expect, chai, fakeMessage } from '../helpers'

const filter = new MentionFilter()
const match = [
  '<@123123213>'
]
const noMatch = [
  '<@123123213> Salut ça va ?'
]

describe('MentionFilter', () => {
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
