import { MessageReaction, User } from 'discord.js'
import { IReactionCommand } from '../interfaces/index'

/**
 * Supprime plusieurs messages
 */
export default class SecCommand implements IReactionCommand {
  public name = 'sec'
  public admin = true

  run (reaction: MessageReaction, user: User) {
    reaction.users.remove(user).catch(console.error)
    const author = reaction.message.author
    const message = `:anger: Pas besoin d'être aussi sec ! <@!${author.id}> si la question ne t'intérèsse pas abstiens-toi.`
    reaction.message.channel.send(message).catch(console.error)
  }
}
