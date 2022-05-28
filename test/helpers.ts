import { vi } from 'vitest'
import { Client, Guild, Message, MessageAttachment, MessageEmbed, TextChannel } from 'discord.js'

process.on('unhandledRejection', () => null)

const fakeMessage = function (content: string): any {
  let client = new Client({ intents: [] })
  // @ts-ignore
  let guild = new Guild(client, { emojis: [], id: 13123123 })
  // @ts-ignore
  let channel = new TextChannel(guild, { id: 123123 })
  // @ts-ignore
  let messagee = new Message(
    client,
    {
      content,
      id: 1241244,
      attachments: [],
      embeds: [],
      author: {
        id: 1242143123
      }
    }
  )
  const message = {
    client,
    content,
    id: 1241244,
    attachments: [] as MessageAttachment[],
    embed: [] as MessageEmbed[],
    member: {
      timeout: () => Promise.resolve('')
    },
    author: {
      createDM: () => Promise.resolve('')
    },
    channel,
    delete: () => Promise.resolve(message),
    reply: () => Promise.resolve(message),
    createDM: () => Promise.resolve(message)
  }
  // Spy everything
  vi
    .spyOn(message.channel, 'send')
    .mockImplementation(() => Promise.resolve(message))
  vi
    .spyOn(message, 'delete')
    .mockImplementation(() => Promise.resolve(message))
  vi
    .spyOn(message.member, 'timeout')
    .mockImplementation(() => Promise.resolve(''))
  vi
    .spyOn(message, 'reply')
    .mockImplementation(() => Promise.resolve(message))
  vi
    .spyOn(message.author, 'createDM')
    .mockImplementation(() => Promise.reject())
  return message
}

export { fakeMessage }
