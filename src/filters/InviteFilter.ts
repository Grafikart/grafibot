import { Message } from "discord.js";
import { IFilter } from "../interfaces";
import { sendDMorReply } from "../utils/helpers";

/**
 * Evite les liens vers d'autres salon discord
 */
export default class InviteFilter implements IFilter {
  filter(message: Message): boolean {
    if (
      message.content.match(
        /(discord\.(gg|io|me|li)|discordapp\.com\/(invite|oauth2))\/[0-9A-Za-z]+/i
      ) !== null
    ) {
      message.member
        .timeout(10 * 60_000, "Lien d'invitation discord")
        .then(() =>
          sendDMorReply(
            message,
            "Les liens d'invitation discord sont interdit sur ce serveur"
          )
        )
        .then(() => message.delete())
        .catch(console.error);
      return true;
    }

    return false;
  }
}
