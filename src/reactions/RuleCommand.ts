import { IReactionCommand } from '../interfaces'
import { MessageReaction, User } from 'discord.js'

export default class RuleCommand implements IReactionCommand {
  public buffer: string[] = [] // Mémorise les messages pour éviter les doublons

  public support (reactionName: string): boolean {
    return ['0️⃣', '2️⃣', '3️⃣', '5️⃣', '6️⃣', '7️⃣'].includes(reactionName)
  }

  public run (reaction: MessageReaction, user: User): any {
    let message = null
    switch (reaction.emoji.name) {
      case '0️⃣':
        message =
          "N'hésite pas à mieux décrire ton problème. Si tu le souhaite tu peux utiliser ce paste : \n https://paste.artemix.org/"
      case '2️⃣':
        message = `Les remarques du genre "c'est nul", "X est à chier" ne servent à rien. Essaie de donner plus de détail plus objectifs...`
      case '3️⃣':
        message = `Essaie d'adapter ta réponse au niveau des personnes qui posent une question. Donner trop d'information peut être contre-productif.`
      case '5️⃣':
        message = `Ne redirigez pas la personne vers une recherche sans offrir de contexte. Si tu n'as pas le temps d'aider alors abstiens toi ;)`
      case '6️⃣':
        message = `N'essaie pas d'agir à la place des modérateurs, si un message est inadapté tu peux le signaler à l'aide de la réaction :report:`
      case '7️⃣':
        message = `Ne mentionne pas les autres utilisateurs pour rien.`
    }
    if (message) {
      if (this.bufferIncludes(reaction.message.id)) {
        reaction.remove(reaction.users.first())
        return null
      }
      reaction.message.reply(
        `:robot: **règle ${reaction.emoji.name}** : ${message}`
      )
      this.bufferPush(reaction.message.id)
      console.log(this.buffer)
      reaction.remove(reaction.users.first())
    }
  }

  public bufferIncludes (id: string): boolean {
    return this.buffer.includes(id)
  }

  public bufferPush (id: string): void {
    this.buffer.push(id)
    this.buffer = this.buffer.slice(-10)
  }
}
