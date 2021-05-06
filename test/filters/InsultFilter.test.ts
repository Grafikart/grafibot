import { fakeMessage } from '../helpers'
import { InsultFilter } from '../../src/filters'

const filter = new InsultFilter()
const match = ['vazy ntm !', 'yo ntm', 'pute']
const noMatch = [
  `scrollspy solutions, but has the following advantages:
     it is written on vanilla javascript,`,
  'Voila le lien https://imgur.com/a/kfHpd'
]

describe('QuestionFilter', () => {
  it('détecte les questions', () => {
    match.forEach(function (m) {
      let message = fakeMessage(m)
      expect(filter.filter(message)).toBe(true)
      expect(message.author.createDM).toHaveBeenCalled()
    })
  })

  it('laisse passer les messages', () => {
    noMatch.forEach(function (m) {
      let message = fakeMessage(m)
      expect(filter.filter(message)).toBe(false)
      expect(message.author.createDM).not.toHaveBeenCalled()
    })
  })
})
