import { Message } from 'discord.js'

/**
 * Vérifie si le message est une erreur connue
 */
export default class ErrorsFilter {
  private errors: { [key: string]: string } = {
    'Cannot modify header information - headers already sent by':
      'https://www.grafikart.fr/formations/deboguer-code-php/headers-already-sent',
    'Trying to get property of non-object':
      'https://www.grafikart.fr/formations/deboguer-code-php/property-of-non-object',
    'Parse error: syntax error, unexpected':
      'https://www.grafikart.fr/formations/deboguer-code-php/syntax-error',
    'Undefined index: ':
      'https://www.grafikart.fr/formations/deboguer-code-php/undefined-index'
  }

  filter (message: Message): boolean {
    let error = Object.keys(this.errors).find(
      e => message.content.match(new RegExp(e, 'i')) !== null
    )
    if (error) {
      message.channel
        .send(
          `:mag_right: Hey je connais cette erreur <@!${
            message.author.id
          }> ! N'hésite pas à regarder cette vidéo elle t'aidera à mieux comprendre de quoi il en retourne ${
            this.errors[error]
          }`
        )
        .catch(console.error)
      return true
    }
    return false
  }
}
