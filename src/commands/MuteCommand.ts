import { ICommand, ILogger } from '../interfaces'
import { Message } from 'discord.js'
import { sendDMorReply } from '../utils/helpers.js'

const minute = 60 * 1000

export default class MuteCommand implements ICommand {
  readonly name = 'mute'
  readonly description = 'Permet de mute un utilisateur'
  readonly admin = true
  private readonly logger: ILogger

  constructor (logger: ILogger) {
    this.logger = logger
  }

  async run (message: Message, args: string[]) {
    let member = message.mentions.members.first()
    let reason = args.slice(1).join(' ')
    this.logger.log(
      `<@!${message.author.id}> a mute <@!${member.id}>\n **Raison :** ${reason}`
    )
    await sendDMorReply(message, `Vous avez été muté pour la raison suivante \n\n > *${reason.trim()}* \n\n, merci de respecter les règles de ce serveur.`)
    await member.timeout(10 * minute, reason.trim())
    return true
  }
}
