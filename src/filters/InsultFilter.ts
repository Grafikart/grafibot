import type { IFilter } from "../interfaces";
import type { Message, PartialMessage } from "discord.js";
import { sendDMorReply } from "../utils/helpers";

/**
 * Supprime un message en cas d'insulte
 */
export class InsultFilter implements IFilter {
  private badwords =
    "pute|connard|enculé|bite|ntm|pd|fdp|tepu|salope|conasse|iench|pétasse|catin|bouffone|bouffon|truie";

  filter(message: Message<true> | PartialMessage<true>): boolean {
    if (message.partial) return false;

    let regex = new RegExp(`(\\b)(${this.badwords})(\\b)`, "i");
    if (message.content.match(regex) !== null) {
      sendDMorReply(
        message,
        `Hey ! pas d'insulte sur le chan, votre message a été supprimé :disappointed_relieved:
\`\`\`
${message.cleanContent}
\`\`\``,
      ).catch();
      message.delete().catch();
      return true;
    }
    return false;
  }
}
