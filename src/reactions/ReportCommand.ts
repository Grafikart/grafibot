import { GuildMember, MessageReaction } from "discord.js";
import type { ILogger, IReactionCommand } from "../interfaces";
import { modoRole } from "../config";

/**
 * Supprime plusieurs messages
 */
export class ReportCommand implements IReactionCommand {
  public name = "report";
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  run(reaction: MessageReaction, member: GuildMember) {
    reaction.remove().catch(console.error);
    const modos = reaction?.message?.guild?.roles.cache.find(
      (r) => r.name === modoRole,
    );
    if (!modos || !reaction?.message?.guild?.id) {
      return;
    }
    const permalink = `https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`;
    this.logger.log(`${modos.toString()} <@!${
      member.id
    }> a signalé le message ${permalink}
\`\`\`
${reaction.message.content}
\`\`\``);
  }
}
