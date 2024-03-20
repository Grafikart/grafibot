import type { IFilter } from "../interfaces";
import { Message } from "discord.js";

/**
 * Empêche les liens lmgtfy en les remplaçant par un message plus familier
 */
export class LmgtfyFilter implements IFilter {
  filter(message: Message): boolean {
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
