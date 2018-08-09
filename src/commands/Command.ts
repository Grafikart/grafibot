import { Message } from 'discord.js'

export default class Command {

  protected async replyDM (reply: string, message: Message): Promise<any> {
    try {
      await message.author.dmChannel.send(reply)
    } catch (e) {
      await message.reply(reply)
    }
    if (message.channel.type !== 'dm') {
      await message.delete()
    }
    return
  }

}
