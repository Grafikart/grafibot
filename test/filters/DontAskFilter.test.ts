import { DontAskFilter } from '../../src/filters'
import { fakeMessage } from '../helpers'

const filter = new DontAskFilter()
const handled = ['https://dontasktoask.com']
const notHandled = [
  'eu, dis toujours',
  "Quelqu'un qui est callé en php pourrait me dire comment détecter la session utilisateur en PHP ?",
  'si je fais ça ça veut dire que je ne publie aucune autre vidéo pendant 2/3 semaines',
  "Pourquoi s'emebeter avec plein de methodes pour les getters et setters ?"
]

describe('DontAskFilter', () => {
  it('détecte les liens dontasktoask', () => {
    handled.forEach(function (q) {
      let message = fakeMessage(q)
      expect(filter.filter(message)).toBeTruthy()
      expect(message.channel.send).toHaveBeenCalled()
      expect(message.delete).toHaveBeenCalled()
    })
  })

  it('laisse passer les messages normaux', () => {
    notHandled.forEach(function (q) {
      let message = fakeMessage(q)
      expect(filter.filter(message)).toBeFalsy()
      expect(message.channel.send).not.toHaveBeenCalled()
    })
  })
})
