import type { IFilter } from "../interfaces";
import type { Message, PartialMessage } from "discord.js";

/**
 * Réagit au message ne contenant qu'une mention "@user"
 */
export class MentionFilter implements IFilter {
  private regexp = /^\<\@([0-9]+)\>$/i;

  filter(message: Message<true> | PartialMessage<true>): boolean {
    if (message.partial) return false;

    if (
      message.content.startsWith("<@") &&
      message.content.match(this.regexp) !== null
    ) {
      message.channel
        .send(
          `:robot: Merci de ne pas mentionner un autre utilisateur sans message <@!${message.author.id}>`,
        )
        .catch();
      return true;
    }
    return false;
  }
}
