import { Message } from 'discord.js'
import { IFilter } from '../interfaces'
import MuteCommand from '../commands/MuteCommand'

/**
 * Evite la guerre Chocolatine / Pain au chocolat
 */
export default class InviteFilter implements IFilter {

  private muteCommand: MuteCommand

  constructor (muteCommand: MuteCommand) {
    this.muteCommand = muteCommand
  }

  filter (message: Message): boolean {
    if (message.content.match(/(discord\.(gg|io|me|li)|discordapp\.com\/(invite|oauth2))\/[0-9A-Za-z]+/i) !== null) {
      if (message.content.match(/(discord\.(gg|io|me|li)|discordapp\.com\/(invite|oauth2))\/rAuuD7Q/i)) return false
      this.muteCommand
        .muteMember(message.member, 'Les liens d\'invitation discord sont interdit sur ce serveur')
        .then(function () {
          return message.delete()
        })
        .catch(console.error)
      return true
    }

    return false
  }

}
