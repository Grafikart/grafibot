import { GuildMember, MessageReaction } from "discord.js";
import type { IReactionCommand } from "../interfaces";

/**
 * Supprime plusieurs messages
 */
export class SecCommand implements IReactionCommand {
  public name = "sec";
  public admin = true;

  run(reaction: MessageReaction, member: GuildMember) {
    reaction.users.remove(member.user).catch(console.error);
    const reactionMessage = reaction.message;
    const author = reactionMessage.author;
    if (!author) {
      return;
    }
    const message = `:anger: Pas besoin d'être aussi sec ! <@!${author.id}> si la question ne t'intérèsse pas abstiens-toi.`;
    if (reactionMessage.inGuild()) {
      reactionMessage.channel.send(message).catch(console.error);
    }
  }
}
