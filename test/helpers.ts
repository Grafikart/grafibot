import { Client, Guild, Message, TextChannel } from 'discord.js'
import chai from 'chai'
import spies from 'chai-spies'

chai.use(spies)

process.on('unhandledRejection', () => null)

const fakeMessage = function (content: string): Message {
  let client = new Client()
  let guild = new Guild(client, { emojis: [], id: '13123123' })
  let channel = new TextChannel(guild, { id: '123123' })
  let message = new Message(channel, {
    content,
    id: '13123123',
    attachments: [],
    embeds: [],
    author: {
      id: '123123123'
    }
  }, client)
  message.author.createDM = function () {
    return new Promise((resolve, reject) => reject())
  }
  chai.spy.on(message.channel, ['send'])
  chai.spy.on(message, ['delete', 'reply'])
  chai.spy.on(message.author, ['createDM'])
  return message
}

const expect = chai.expect

export {
  chai,
  expect,
  fakeMessage
}
