import { Message } from 'discord.js'

export default class Command {

  protected async replyDM (reply: string, message: Message): Promise<any> {
    try {
      let channel = await message.author.createDM()
      await channel.send(reply)
    } catch (e) {
      await message.reply(reply)
    }
    if (message.channel.type !== 'dm') {
      await message.delete()
    }
    return
  }

}
