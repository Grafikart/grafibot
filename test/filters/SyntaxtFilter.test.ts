import { SyntaxFilter } from '../../src/filters'
import { expect, chai, fakeMessage } from '../helpers'

const filter = new SyntaxFilter({
  '1111': /^(\[[^\]]+\]|<\:[a-z0-9]+\:[0-9]+>) .+ https?:\/\/\S*$/i
})
const match = [
  '[Test] dlzpepflef htttttp://google..fr',
  'Voila mon lien https://github.com/docker/docker-birthday-3'
]
const noMatch = [
  '[DOCKER] à l\'occasion du docker birthday, un git hub avec un cours et un TP: https://github.com/docker/docker-birthday-3',
  '<:css3:250692379638497280> some text http://demolink.fr'
]

describe('SyntaxFilter', () => {
  it('détecte les messages', () => {
    match.forEach(function (q) {
      let message = fakeMessage(q)
      message.channel.id = '1111'
      expect(filter.filter(message), q).to.be.true
      expect(message.author.createDM).to.be.called()
    })
  })

  it('laisse passer les messages', () => {
    noMatch.forEach(function (q) {
      let message = fakeMessage(q)
      message.channel.id = '1111'
      expect(filter.filter(message), q).to.be.false
      expect(message.author.createDM).to.not.be.called()
    })
  })

})
