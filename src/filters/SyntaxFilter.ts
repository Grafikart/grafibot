import type { IFilter } from "../interfaces";
import type { Message, PartialMessage } from "discord.js";
import { sendDMorReplyAutoDelete } from "../utils/helpers";

type ISyntaxes = { [key: string]: RegExp };

/**
 * Supprime les messages qui ne respectent pas la syntaxe imposée à un salon.
 */
export class SyntaxFilter implements IFilter {
  private syntaxes: ISyntaxes;

  constructor(syntaxes: ISyntaxes) {
    this.syntaxes = syntaxes;
  }

  filter(message: Message<true> | PartialMessage<true>): boolean {
    if (message.partial) return false;

    if (
      Object.keys(this.syntaxes).includes(message.channel.id) &&
      message.content.match(this.syntaxes[message.channel.id]) === null
    ) {
      sendDMorReplyAutoDelete(
        message,
        `:octagonal_sign: Votre message a été supprimé car il ne respecte pas le format imposé par le channel
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
