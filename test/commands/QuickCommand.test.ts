import QuickCommand from '../../src/commands/QuickCommand'
import { expect, fakeMessage } from '../helpers'

describe('QuickCommand', function () {
  let fakeCommand = new QuickCommand(
    'a',
    'description',
    'message @user @content'
  )

  it('devrait avoir le bon nom', function () {
    expect(fakeCommand.name).to.be.equals('a')
  })

  it('devrait supprimer le message', function () {
    let message = fakeMessage('!a <@12345> salut les gens')
    fakeCommand.run(message, message.content.split(' ').slice(1))
    expect(message.delete).to.be.called()
    expect(message.channel.send).to.be.called.with(
      `message <@12345> salut les gens`
    )
  })
})
