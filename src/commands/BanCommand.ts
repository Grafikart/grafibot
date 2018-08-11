import { ICommand, ILogger } from '../interfaces'
import { Message } from 'discord.js'

export default class BanCommand implements ICommand {

  readonly name = 'ban'
  readonly description = 'Permet de bannir un utilisateur'
  readonly admin = true
  private readonly logger: ILogger

  constructor (logger: ILogger) {
    this.logger = logger
  }

  run (message: Message, args: string[]) {
    let reason = args.slice(1).join(' ')
    let member = message.mentions.members.first()
    this.logger.log(`<@!${message.author.id}> a banni <@!${member.id}>\n **Raison :** ${reason}`)
    message.mentions.members.first().ban({
      days: 7,
      reason: reason
    }).catch()
    message.delete().catch()
  }

}
