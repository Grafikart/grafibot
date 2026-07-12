import { GuildMember, Message } from "discord.js";
import type { IFilter, ILogger } from "../interfaces";
import { sendDMorReply } from "../utils/helpers";
import flru from "flru";

export const NEW_MEMBER_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // Compte considéré comme récent (7 jours)
export const CROSSPOST_INTERVAL = 60 * 1000; // Fenêtre de temps pour le cross-post (1 minute)
export const CROSSPOST_CHANNEL_THRESHOLD = 5; // Nombre de salons différents déclenchant l'alerte
export const SHORT_TEXT_WORD_THRESHOLD = 5; // Nombre de mots en dessous duquel le texte est jugé quasi vide

interface AttachmentActivity {
  channelId: string;
  timestamp: number;
}

/**
 * Détecte les comptes (souvent piratés) qui postent une image accompagnée
 * d'un lien dans plusieurs salons en peu de temps (ex: fausse capture
 * d'écran "vous avez gagné" façon MrBeast), ou un compte tout juste arrivé
 * qui poste directement une image.
 */
export class ScamImageFilter implements IFilter {
  private cache = flru(100);
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  filter(message: Message): boolean {
    if (!message.member || message.attachments.size === 0) {
      return false;
    }

    const activity = this.trackActivity(message);
    const isNewMember = this.isNewMember(message.member);
    const isCrossPosting = this.isCrossPosting(activity);
    const isShortText = this.isShortText(message);

    if (!isCrossPosting && !(isNewMember && isShortText)) {
      return false;
    }

    this.flag(message, { isNewMember, isCrossPosting, isShortText });
    return true;
  }

  /**
   * Garde une trace des salons où l'utilisateur a posté une image récemment
   */
  private trackActivity(message: Message): AttachmentActivity[] {
    const now = Date.now();
    const previous: AttachmentActivity[] = this.cache.get(
      message.author.id,
    ) ?? [];
    const activity = [
      ...previous.filter((a) => now - a.timestamp < CROSSPOST_INTERVAL),
      { channelId: message.channel.id, timestamp: now },
    ];
    this.cache.set(message.author.id, activity);
    return activity;
  }

  private isCrossPosting(activity: AttachmentActivity[]): boolean {
    const distinctChannels = new Set(activity.map((a) => a.channelId));
    return distinctChannels.size >= CROSSPOST_CHANNEL_THRESHOLD;
  }

  private isNewMember(member: GuildMember): boolean {
    return (
      member.joinedTimestamp !== null &&
      Date.now() - member.joinedTimestamp < NEW_MEMBER_THRESHOLD
    );
  }

  private isShortText(message: Message): boolean {
    const wordCount = message.content.trim().split(/\s+/).filter(Boolean).length;
    return wordCount < SHORT_TEXT_WORD_THRESHOLD;
  }

  /**
   * Sanctionne et journalise le message suspect
   */
  private flag(
    message: Message,
    reasons: { isNewMember: boolean; isCrossPosting: boolean; isShortText: boolean },
  ) {
    const reasonLabel = [
      reasons.isNewMember ? "compte récent" : null,
      reasons.isCrossPosting ? "image postée dans plusieurs salons" : null,
      reasons.isShortText ? "message quasi vide" : null,
    ]
      .filter(Boolean)
      .join(", ");

    this.logger.log(
      `:warning: Message suspect (scam potentiel : ${reasonLabel}) de <@!${message.author.id}> supprimé dans <#${message.channel.id}>\n${message.content}`,
    );

    message.member
      ?.timeout(10 * 60_000, `Scam potentiel (${reasonLabel})`)
      .then(() =>
        sendDMorReply(
          message,
          "Ton message a été supprimé car il ressemble à une arnaque (compte compromis ?). Si c'est une erreur, contacte un modérateur.",
        ),
      )
      .then(() => message.delete())
      .catch(console.error);
  }
}
