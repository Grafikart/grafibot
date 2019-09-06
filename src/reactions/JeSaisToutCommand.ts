import { MessageReaction, User } from 'discord.js'
import { IReactionCommand } from '../interfaces/index'

/**
 * Supprime plusieurs messages
 */
export default class JeSaisToutCommand implements IReactionCommand {
  public name = 'brain'
  public admin = true

  run (reaction: MessageReaction, user: User) {
    reaction.remove(user).catch(console.error)
    const author = reaction.message.author
    // const message = `Merci pour la précision @XXX mais on s'en fiche`
    const message = `:brain: Inutile de donner trop d'informations <@!${
      author.id
    }> ! Je suis heureux de savoir que vous en savez tant mais ce n'est pas le sujet.`
    reaction.message.channel.send(message).catch(console.error)
  }
}
