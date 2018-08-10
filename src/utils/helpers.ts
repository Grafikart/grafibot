import { Message } from 'discord.js'

export const sendDMorReply = async function (message: Message, content: string) {
  return message.author
    .createDM()
    .then((channel) => channel.send(content))
    .catch(() => message.reply(content.split('\n')[0]))
}
