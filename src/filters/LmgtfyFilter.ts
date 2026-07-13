import type { IFilter } from "../interfaces";
import type { Message, PartialMessage } from "discord.js";

/**
 * Empêche les liens lmgtfy en les remplaçant par un message plus familier
 */
export class LmgtfyFilter implements IFilter {
  filter(message: Message<true> | PartialMessage<true>): boolean {
    if (message.partial) return false;

    if (message.content.includes("lmgtfy.")) {
      message.channel
        .send(
          `:mag: Plutôt que de rediriger vers **lmgtfy** n'hésite pas à expliquer comment bien rechercher et identifier les résultats pertinents.`,
        )
        .catch(console.error);
      message.delete().catch(console.error);
      return true;
    }
    return false;
  }
}
