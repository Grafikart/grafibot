import { Client, Guild, Message, TextChannel } from 'discord.js'

process.on('unhandledRejection', () => null)

const fakeMessage = function (content: string): Message {
  let client = new Client()
  let guild = new Guild(client, { emojis: [], id: '13123123' })
  let channel = new TextChannel(guild, { id: '123123' })
  let message = new Message(
    client,
    {
      content,
      id: 'messageID',
      attachments: [],
      embeds: [],
      author: {
        id: 'authorID'
      }
    },
    channel
  )
  // Spy everything
  jest
    .spyOn(message.channel, 'send')
    .mockImplementation(() => Promise.resolve(message))
  jest
    .spyOn(message, 'delete')
    .mockImplementation(() => Promise.resolve(message))
  jest
    .spyOn(message, 'reply')
    .mockImplementation(() => Promise.resolve(message))
  jest
    .spyOn(message.author, 'createDM')
    .mockImplementation(() => Promise.reject())
  return message
}

export { fakeMessage }
