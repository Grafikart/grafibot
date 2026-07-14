import type { ICommand, ILogger } from "../interfaces";
import type { Message, PartialMessage } from "discord.js";

/**
 * Commande de modération qui bannit le membre mentionné avec une raison.
 */
export class BanCommand implements ICommand {
  readonly name = "ban";
  readonly description = "Permet de bannir un utilisateur";
  readonly admin = true;
  private readonly logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  run(message: Message<true> | PartialMessage<true>, args: string[]) {
    if (message.partial) return;

    let reason = args.slice(1).join(" ");
    let member = message?.mentions?.members?.first();
    if (!member) {
      return;
    }
    this.logger.log(
      `<@!${message.author.id}> a banni <@!${member.id}>\n **Raison :** ${reason}`,
    );
    member
      .ban({
        deleteMessageSeconds: 7 * 24 * 60 * 60,
        reason: reason,
      })
      .catch();
    message.delete().catch();
  }
}
