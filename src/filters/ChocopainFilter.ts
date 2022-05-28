import { Message } from "discord.js";

/**
 * Evite la guerre Chocolatine / Pain au chocolat
 */
export default class ChocopainFilter {
  filter(message: Message): boolean {
    if (message.content.match(/pain au chocolat|chocolatine/i) !== null) {
      message.channel
        .send(
          `:croissant: Afin d'éviter tout débat merci d'utiliser le mot consacré **chocopain** pour désigner cette patisserie`
        )
        .catch(console.error);
      return true;
    }
    return false;
  }
}
