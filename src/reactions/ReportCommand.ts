import { MessageReaction, User } from 'discord.js'
import { ILogger, IReactionCommand } from '../interfaces/index'

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
    reaction.remove(user).catch(console.error)
    const modoRole = reaction.message.guild.roles.find(r => r.name === 'Modo')
    const permalink = `https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`
    this.logger.log(`${modoRole.toString()} <@!${reaction.message.author.id}> a signalé le message ${permalink}
\`\`\`
${reaction.message.content}
\`\`\``)
  }

}
