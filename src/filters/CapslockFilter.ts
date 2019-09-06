import { Message } from 'discord.js'

/**
 * Evite les capslock
 */
export default class CapslockFilter {
  filter (message: Message): boolean {
    if (this.isCapslock(message.content)) {
      message.channel
        .send(`:scream_cat: Pas la peine de hurler <@!${message.author.id}>`)
        .catch(console.error)
      return true
    }
    return false
  }

  private isCapslock (content: string): boolean {
    return (
      content === content.toUpperCase() &&
      content.length > 15 &&
      content.match(/[A-Z]{4,}/) !== null
    )
  }
}
