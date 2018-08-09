import { Client, Guild, Message, TextChannel } from 'discord.js'
import Bot from '../src/Bot'

const chai = require('chai')
const spies = require('chai-spies')
chai.use(spies)
const sandbox = chai.spy.sandbox()
const expect = chai.expect

class Command {
  name = 'demo'
  description = 'demo'
  run (msg: Message, args: string[]) { return 'ok' }
}

describe('Command::run', function () {
  let client = new Client()
  let guild = new Guild(client, { emojis: [], id: '13123123' })
  let channel = new TextChannel(guild, { id: '123123' })
  let message = new Message(channel, {
    content: '!demo a1 a2',
    id: '13123123',
    attachments: [],
    embeds: [],
    author: {
      id: '123123123'
    }
  }, client)
  let bot = new Bot(client)
  let command = new Command()
  bot.addCommand(command)

  beforeEach(() => {
    sandbox.on(command, ['run'])
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should detect command', function () {
    client.emit('message', message)
    expect(command.run).to.have.been.called.with(message, ['a1', 'a2'])
  })
})
