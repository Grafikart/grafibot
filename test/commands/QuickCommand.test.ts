import { describe, it, expect } from 'vitest'
import QuickCommand from '../../src/commands/QuickCommand'
import { fakeMessage } from '../helpers'

describe('QuickCommand', function () {
  let fakeCommand = new QuickCommand(
    'a',
    'description',
    'message @user @content'
  )

  it('devrait avoir le bon nom', function () {
    expect(fakeCommand.name).toBe('a')
  })

  it('devrait supprimer le message', function () {
    let message = fakeMessage('!a <@12345> salut les gens')
    fakeCommand.run(message, message.content.split(' ').slice(1))
    expect(message.delete).toHaveBeenCalled()
    expect(message.channel.send).toHaveBeenCalledWith(
      `message <@12345> salut les gens`
    )
  })
})
