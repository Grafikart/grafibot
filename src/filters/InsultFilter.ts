import { IFilter } from '../interfaces'
import { Message, User } from 'discord.js'

/**
 * Supprime un message en cas d'insulte
 */
export default class InsultFilter implements IFilter {

  private badwords = 'pute|connard|enculé|bite|ntm|pd|fdp|tepu|salope|conasse|iench|pétasse|catin|bouffone|bouffon|truie'

  filter (message: Message): boolean {
    let regex = new RegExp(`(\\b)(${this.badwords})(\\b)`, 'i')
    if (message.content.match(regex) !== null) {
      this.sendDM(message.author, `Hey ! pas d'insulte sur le chan, votre message a été supprimé :disappointed_relieved:
\`\`\`
${message.cleanContent}
\`\`\``).then(null)
      return true
    }
    return false
  }

  async sendDM (user: User, message: string) {
    return user.createDM()
      .then(channel => channel.send(message))
      .catch(null)
  }

}
