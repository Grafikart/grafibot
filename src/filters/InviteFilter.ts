import { GuildMember, Message } from 'discord.js'
import { IFilter } from '../interfaces'
import { sendDMorReply } from '../utils/helpers'

export interface MuteCommand {
  muteMember: (member: GuildMember, reason: string) => Promise<any>
}

/**
 * Evite les liens vers d'autres salon discord
 */
export default class InviteFilter implements IFilter {

  filter (message: Message): boolean {
    if (
      message.content.match(
        /(discord\.(gg|io|me|li)|discordapp\.com\/(invite|oauth2))\/[0-9A-Za-z]+/i
      ) !== null
    ) {

      sendDMorReply(message, "Les liens d'invitation discord sont interdit sur ce serveur")
        .then(() => message.member.timeout(10 * 60_1000, "Lien d'invitation discord"))
        .then(() => message.delete())
        .catch(console.error)
      return true
    }

    return false
  }
}
