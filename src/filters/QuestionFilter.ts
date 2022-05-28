import { IFilter } from "../interfaces";
import { Message } from "discord.js";

/**
 * Vérifie si le message est une question ouverte
 */
export default class QuestionFilter implements IFilter {
  filter(message: Message): boolean {
    if (this.isQuestion(message.content.trim())) {
      message.channel
        .send(
          `:question: N'hésite pas à poser ta question directement <@!${message.author.id}>, il n'est pas utile de demander si quelqu'un connait quelque chose avant.`
        )
        .catch(console.error);
      return true;
    }
    return false;
  }

  private isQuestion(content: string): boolean {
    return (
      content.split(" ").length <= 10 &&
      content.match(
        /^(bonjour |salut )?([^ ]+ ){0,3}(qui s'y conna(î|i)(t|s)|des gens|(pour|pou(r|rr)a(î|i)t(s)?) m(\'|\")aid(e|é)(z|r)?|quelqu'un|qqun|qq|des personnes)[^\?]+\??$/i
      ) !== null
    );
  }
}
