import { Collection, Message, User } from 'discord.js'
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
    let messages = await message.channel.fetchMessages({
      limit: limit
    })
    if (limit <= 5) {
      this.log(message.author, messages).catch(console.error)
    }
    return message.channel.bulkDelete(messages).catch(console.error)
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
