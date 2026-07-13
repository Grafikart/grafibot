import type { Message, PartialMessage } from "discord.js";
import type { IFilter } from "../interfaces";

/**
 * Evite la guerre Chocolatine / Pain au chocolat
 */
export class ChocopainFilter implements IFilter {
  filter(message: Message<true> | PartialMessage<true>): boolean {
    if (message.partial) return false;

    if (message.content.match(/pain au chocolat|chocolatine/i) !== null) {
      message.channel
        .send(
          `:croissant: Afin d'éviter tout débat merci d'utiliser le mot consacré **chocopain** pour désigner cette patisserie`,
        )
        .catch(console.error);
      return true;
    }
    return false;
  }
}
