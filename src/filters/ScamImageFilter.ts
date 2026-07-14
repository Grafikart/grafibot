import type {IFilter, ILogger} from "../interfaces";
import type {Message, PartialMessage} from "discord.js";
import {sendDMorReply} from "../utils/helpers.ts";

type LastMessage = {channelId: string, content: string | null, authorId: string, onDelete: () => void}

/**
 * Détecte et bloque les tentatives d'arnaque par image ou lien, notamment les
 * messages identiques publiés rapidement dans plusieurs salons.
 */
export class ScamImageFilter implements IFilter {
  private lastMsg: LastMessage | null = null

  constructor(private logger: ILogger) {
  }

  filter(msg: Message<true> | PartialMessage<true>): boolean {
    if (!msg.member || msg.attachments.size === 0) {
      return false;
    }

    const lastMsg: LastMessage = {
      authorId: msg.member.id,
      channelId: msg.channelId,
      content: msg.content,
      onDelete: () => msg.delete()
    }

    // The message is a copy of another channel message
    if (this.isDuplicated(lastMsg) && this.lastMsg) {
      this.logger.log(
        `:warning: Message suspect (scam potentiel :  de <@!${msg.author?.id}> supprimé dans <#${msg.channelId}>\n${msg.content}`,
      );

      msg.member.timeout(10 * 60_000, `Scam potentiel`) // Timeout to avoid further spam
      sendDMorReply(
        msg,
        "Ton message a été supprimé car il ressemble à une arnaque (compte compromis ?). Si c'est une erreur, contacte un modérateur.",
      )
      msg.delete()
      this.lastMsg.onDelete()
      this.lastMsg = null
      return true;
    }

    this.lastMsg = lastMsg
    return false;
  }

  private isDuplicated(msg: LastMessage): boolean {
    if (this.lastMsg === null) {
      return false;
    }
    return this.lastMsg.authorId === msg.authorId && this.lastMsg.content === msg.content && this.lastMsg.channelId !== msg.channelId;
  }

}
