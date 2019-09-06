import { IFilter } from '../interfaces'
import { Message } from 'discord.js'
import { sendDMorReplyAutoDelete } from '../utils/helpers'

type ISyntaxes = { [key: string]: RegExp }

export default class SyntaxFilter implements IFilter {
  private syntaxes: ISyntaxes

  constructor (syntaxes: ISyntaxes) {
    this.syntaxes = syntaxes
  }

  filter (message: Message): boolean {
    if (
      Object.keys(this.syntaxes).includes(message.channel.id) &&
      message.content.match(this.syntaxes[message.channel.id]) === null
    ) {
      sendDMorReplyAutoDelete(
        message,
        `:octagonal_sign: Votre message a été supprimé car il ne respecte pas le format imposé par le channel
\`\`\`
${message.cleanContent}
\`\`\``
      ).catch()
      message.delete().catch()
      return true
    }
    return false
  }
}
