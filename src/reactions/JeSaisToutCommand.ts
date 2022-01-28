import { GuildMember, MessageReaction } from 'discord.js'
import { IReactionCommand } from '../interfaces'
import { sendDMorReply } from '../utils/helpers.js'

/**
 * Supprime plusieurs messages
 */
export default class JeSaisToutCommand implements IReactionCommand {
  public name = 'brain'
  public admin = true

  run (reaction: MessageReaction, member: GuildMember) {
    reaction.remove().catch(console.error)
    const author = reaction.message.author
    const quote = (str: string) =>
      str
        .split('\n')
        .map(s => `> ${s}`)
        .join('\n')
    const message = `:brain: Inutile de donner plus d'informations que nécessaire <@!${
      author.id
    }>.

${quote(reaction.message.content)}

Essaie d'adapter ta réponse au niveau de la discussion, donner trop d'informations peut être déroutant et finalement nuire à la discussion.`
    sendDMorReply(reaction.message, message)
  }
}
