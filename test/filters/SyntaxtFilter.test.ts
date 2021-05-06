import { SyntaxFilter } from '../../src/filters'
import { fakeMessage } from '../helpers'

const filter = new SyntaxFilter({
  '1111': /^(\[[^\]]+\]|<\:[a-z0-9]+\:[0-9]+>)( |\n)(.|\n)+( |\n)<?https?:\/\/\S*>?$/im
})
const bad = [
  '[Test] dlzpepflef htttttp://google..fr',
  'Voila un lien sans categorie https://github.com/docker/docker-birthday-3'
]
const good = [
  "[DOCKER] à l'occasion du docker birthday, un git hub avec un cours et un TP: https://github.com/docker/docker-birthday-3",
  '[DOCKER] Un exemple avec saut de ligne \n https://github.com/docker/docker-birthday-3',
  '[DOCKER]\nUne description\nlongue\nhttps://github.com/docker/docker-birthday-3',
  '[DOCKER] Exemple sans card <https://github.com/docker/docker-birthday-3>',
  '<:css3:250692379638497280> some text http://demolink.fr'
]

describe('SyntaxFilter', () => {
  it('laisse passer les messages sur un autre channel', () => {
    let message = fakeMessage(bad[0])
    message.channel.id = '22'
    expect(filter.filter(message)).toBe(false)
    expect(message.author.createDM).not.toHaveBeenCalled()
  })

  it('détecte les mauvais messages', () => {
    bad.forEach(function (q) {
      let message = fakeMessage(q)
      message.channel.id = '1111'
      expect(filter.filter(message)).toBe(true)
      expect(message.author.createDM).toHaveBeenCalled()
    })
  })

  it('laisse passer les bon messages', () => {
    good.forEach(function (q) {
      let message = fakeMessage(q)
      message.channel.id = '1111'
      expect(filter.filter(message)).toBe(false)
      expect(message.author.createDM).not.toHaveBeenCalled()
    })
  })
})
