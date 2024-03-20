import type { IFilter } from "../interfaces";
import { Message } from "discord.js";

/**
 * Empêche les liens dontasktoask en les remplaçant par un message plus familier
 */
export class DontAskFilter implements IFilter {
  filter(message: Message): boolean {
    if (message.content.includes("https://dontasktoask.com")) {
      message.channel
        .send(
          `:question: Hey, si tu as une question spécifique n'hésite pas à poser ta question directement (en donnant un peu de détail sur ta problématique).`,
        )
        .catch(console.error);
      message.delete().catch(console.error);
      return true;
    }
    return false;
  }
}
