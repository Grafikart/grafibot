import { Message } from 'discord.js'
import { IFilter } from '../interfaces'
import { sendDMorReply } from '../utils/helpers'

export default class CodeFilter implements IFilter {

  filter (message: Message) {
    if (
      message.content.split('\n').length > 20 &&
      message.content.match(/([\{\}\[\]$;])/mg).length > 3
    ) {
      sendDMorReply(message, `:space_invader: Woops trop de code, poste ton code sur hastebin : http://hastebin.com/uzufecurol.php avec ce template si tu veux plus d'aide.

Pour rappel voila le message que tu as essayé d'envoyer :

\`\`\`
${message.cleanContent}
\`\`\``)
        .catch()
        .then(() => message.delete())
        .catch()
      return true
    }
    return false
  }

}
