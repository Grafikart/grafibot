import type { ICommand } from "../interfaces";
import type { Message, PartialMessage } from "discord.js";

/**
 * Génère une commande générique à partir d'un template
 * - "@user" : remplacé par l'utilisateur
 * - "@content" : remplacé par le message de l'utilisateur
 * - "@url:content" : URL vers le message
 */
export class QuickCommand implements ICommand {
  public name: string;
  public description: string;
  private message: string;

  constructor(name: string, description: string, message: string) {
    this.name = name;
    this.description = description;
    this.message = message;
  }

  run(message: Message<true> | PartialMessage<true>, args: string[]) {
    message.delete().catch();
    let user = "";
    let content = args[0];
    if (args.length > 1) {
      user = args[0];
      content = args.slice(1).join(" ");
    }
    message.channel
      .send(
        this.message
          .replace("@user", user)
          .replace("@content", content)
          .replace("@url:content", encodeURIComponent(content)),
      )
      .catch();
  }
}
