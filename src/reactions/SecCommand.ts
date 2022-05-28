import { GuildMember, MessageReaction, User } from "discord.js";
import { IReactionCommand } from "../interfaces";

/**
 * Supprime plusieurs messages
 */
export default class SecCommand implements IReactionCommand {
  public name = "sec";
  public admin = true;

  run(reaction: MessageReaction, member: GuildMember) {
    reaction.users.remove(member.user).catch(console.error);
    const author = reaction.message.author;
    if (!author) {
      return;
    }
    const message = `:anger: Pas besoin d'être aussi sec ! <@!${author.id}> si la question ne t'intérèsse pas abstiens-toi.`;
    reaction.message.channel.send(message).catch(console.error);
  }
}
