import { Message } from 'discord.js'

/**
 * Vérifie si le message est une erreur connue
 */
export default class ErrorsFilter {
  private errors: { [key: string]: string } = {
    'Cannot modify header information - headers already sent by':
      'https://www.grafikart.fr/tutoriels/headers-already-sent-871',
    'Trying to get property of non-object':
      'https://www.grafikart.fr/tutoriels/property-of-non-object-873',
    'Parse error: syntax error, unexpected':
      'https://www.grafikart.fr/tutoriels/syntax-error-874',
    'Undefined index: ':
      'https://www.grafikart.fr/tutoriels/undefined-index-872',
    'Cannot read property ':
      'https://www.grafikart.fr/tutoriels/javascript-cannot-read-property-1348',
    'RegeneratorRuntime is not defined':
      'https://www.grafikart.fr/tutoriels/javascript-regeneratorruntime-1349'
  }

  filter(message: Message): boolean {
    let error = Object.keys(this.errors).find(
      e => message.content.match(new RegExp(e, 'i')) !== null
    )
    if (error) {
      message.channel
        .send(
          `:mag_right: Hey je connais cette erreur <@!${message.author.id}> ! N'hésite pas à regarder cette vidéo elle t'aidera à mieux comprendre de quoi il en retourne ${this.errors[error]}`
        )
        .catch(console.error)
      return true
    }
    return false
  }
}
