import { IFilter } from '../interfaces'
import { Message } from 'discord.js'
import { sendDMorReplyAutoDelete } from '../utils/helpers'

export default class SyntaxFilter implements IFilter {

  private syntaxes: {[key: string]: RegExp } = {
    '245543980224217089': /^(\[[^\]]+\]|<\:[a-z0-9]+\:[0-9]+>) .+ https?:\/\/\S*$/i,
    '106702700409815040': /^(\[[^\]]+\]|<\:[a-z0-9]+\:[0-9]+>) .+ https?:\/\/\S*$/i
  }

  filter (message: Message): boolean {
    if (
      Object.keys(this.syntaxes).includes(message.channel.id) &&
      message.content.match(this.syntaxes[message.channel.id]) === null
    ) {
      sendDMorReplyAutoDelete(message, `:octagonal_sign: Votre message a été supprimé car il ne respecte pas le format imposé par le channel
\`\`\`
${message.cleanContent}
\`\`\``)
      return true
    }
    return false
  }

}
