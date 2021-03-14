import { Collection, Message, MessageEmbed, NewsChannel, User } from 'discord.js'
import { ICommand, ILogger } from '../interfaces/index'
import Command from './Command'

/**
 * Supprime plusieurs messages
 */
export default class CleanCommand extends Command implements ICommand {
  public name = 'clean'
  public description = 'Permet de supprimer X messages, ex: "!clean !messages"'
  public admin = true
  private logger: ILogger

  constructor (logger: ILogger) {
    super()
    this.logger = logger
  }

  async run (message: Message, args: string[]) {
    const limit = args[0] ? parseInt(args[0], 10) + 1 : 2
    const reason = args[1] ? args.slice(1).join(' ') : null
    let messages = await message.channel.messages.fetch({
      limit: limit
    })
    if (reason) {
      const embed = new MessageEmbed()
        .setImage("https://media.giphy.com/media/6NtM0tLYeLwT6/giphy.gif")
        .setColor("#c62828")
        .addField('Message supprimés', messages.array().length, true)
        .addField('Raison', reason, true)
      message.channel.send(embed).catch(console.error)
    } else if (limit <= 5) {
      this.log(message.author, messages).catch(console.error)
    }
    return (message.channel as NewsChannel).bulkDelete(messages).catch(console.error)
  }

  private async log (member: User, messages: Collection<string, Message>) {
    let deletions = messages
      .map(message => {
        return message.author.username + ': ' + message.cleanContent
      })
      .slice(1)
      .reverse()
      .join('\n')
    return this.logger
      .log(`:x: <@!${member.id}> a supprimé les messages suivant :
\`\`\`
${deletions}
\`\`\``)
  }
}
