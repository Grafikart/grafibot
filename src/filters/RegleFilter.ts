import { IFilter } from "../interfaces";
import { Message } from "discord.js";

/**
 * Réagit au message contenant "règle X"
 */
export default class MentionFilter implements IFilter {
  private regexp = /^règle [0-9].*/i;

  filter(message: Message): boolean {
    if (
      message.content.match(this.regexp) !== null
    ) {
      message.channel
        .send(
          `:robot: Pas besoin de faire la police  <@!${message.author.id}>, si tu juge un message inadapté, utilise la réaction :report: pour signaler le message`
        )
        .catch();
      return true;
    }
    return false;
  }
}
