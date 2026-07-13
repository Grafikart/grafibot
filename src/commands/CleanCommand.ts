import type {PartialMessage} from "discord.js";
import {EmbedBuilder, Message, NewsChannel,} from "discord.js";
import type {ICommand} from "../interfaces";

/**
 * Supprime plusieurs messages
 */
export class CleanCommand implements ICommand {
  public name = "clean";
  public description = 'Permet de supprimer X messages, ex: "!clean !messages"';
  public admin = true;
  constructor() {}

  async run(message: Message<true> | PartialMessage<true>, args: string[]) {
    const limit = args[0] ? parseInt(args[0], 10) + 1 : 2;
    const reason = args[1] ? args.slice(1).join(" ") : null;
    let messages = await message.channel.messages.fetch({
      limit: limit,
    });
    if (reason) {
      const embed = new EmbedBuilder()
        .setImage("https://media.giphy.com/media/6NtM0tLYeLwT6/giphy.gif")
        .setColor("#c62828")
        .addFields([
          {
            name: "Message supprimés",
            value: messages.size.toString(),
            inline: true,
          },
          { name: "Raison", value: reason, inline: true },
        ]);
      message.channel.send({ embeds: [embed] }).catch(console.error);
    }
    return (message.channel as NewsChannel)
      .bulkDelete(messages)
      .catch(console.error);
  }
}
