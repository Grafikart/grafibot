import { MessageReaction, User } from 'discord.js'
import { ILogger, IReactionCommand } from '../interfaces/index'
import { modoRole } from '../config'

/**
 * Supprime plusieurs messages
 */
export default class ReportCommand implements IReactionCommand {
  public name = 'report'
  private logger: ILogger

  constructor (logger: ILogger) {
    this.logger = logger
  }

  run (reaction: MessageReaction, user: User) {
    reaction.remove().catch(console.error)
    const modos = reaction.message.guild.roles.cache.find(
      r => r.name === modoRole
    )
    const permalink = `https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`
    this.logger.log(`${modos.toString()} <@!${
      user.id
    }> a signalé le message ${permalink}
\`\`\`
${reaction.message.content}
\`\`\``)
  }
}
