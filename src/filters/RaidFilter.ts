import type { IFilter, ILogger } from "../interfaces";
import {
  type Message,
  type MessageReaction,
  type PartialMessage,
  type PartialMessageReaction,
  TextChannel,
} from "discord.js";
import flru from "flru";
import { append } from "../utils/list";

/**
 * Filtre pour éviter les raids (plusieurs utilisateurs qui spam des messages en simultané)
 */
export class RaidFilter implements IFilter {
  private limit = 5; // Nombre de message
  private interval = 3; // Intervalle (en seconde)
  private cache = flru(50); // Nombre d'utilisateur à suivre en parallèle
  private voteThreshold = 5; // Quantité de vote qui déclenche le ban
  private logger: ILogger;
  private locked = false;
  private voteDuration = 5; // Durée du vote en seconde

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  filter(message: Message<true> | PartialMessage<true>): boolean {
    if (message.partial) return false;

    const timeStampList = append(
      this.cache.get(message.author.id) ?? [],
      Date.now() / 1000,
      this.limit,
    );
    if (timeStampList.length >= this.limit) {
      const delay = timeStampList[timeStampList.length - 1] - timeStampList[0];
      if (delay < this.interval && !this.locked) {
        this.startVerification(message).catch(this.logger.log);
        return true;
      }
    }
    this.cache.set(message.author.id, timeStampList);
    return false;
  }

  /**
   * Lance le processus de vérification de l'utilisateur avec un vote
   */
  private async startVerification(message: Message<true>) {
    this.locked = true;
    try {
      const channel = message.channel as TextChannel;
      this.logger.log(
        `Verouillage du salon #${channel.name} à cause du message ${message.url}`,
      );
      // On bloque la possibilité d'écrire sur le salon
      await channel.permissionOverwrites
        .edit(channel.guild.roles.everyone, { SendMessages: false })
        .catch(this.logger.log);
      // On lance le vote
      const reply = await message.reply(
        "a posté trop de message rapidement. Est-ce un bot ? Oui 🇴 / Non : 🇳",
      );
      reply.react("🇴").catch(this.logger.log);
      reply.react("🇳").catch(this.logger.log);
      // On débloque le salon à la fin du vote
      const timer = setTimeout(() => {
        channel.client.off("messageReactionAdd", listener);
        this.endVerification(reply);
      }, this.voteDuration * 1000);
      // Ou lorsque le nombre de vote positif dépasse le threshold
      const listener = (reaction: MessageReaction | PartialMessageReaction) => {
        if (
          reaction.emoji.name === "🇴" &&
          (reaction.count ?? 0) >= this.voteThreshold &&
          reaction.message.id === reply.id
        ) {
          this.endVerification(reply);
          this.ban(message);
          clearTimeout(timer);
          channel.client.off("messageReactionAdd", listener);
        }
      };
      channel.client.on("messageReactionAdd", listener);
    } catch (e) {
      this.locked = false;
    }
  }

  /**
   * Banni l'utilisateur associé au message
   */
  private ban(message: Message<true>) {
    this.logger.log(
      `Ban pour raid ${message.author.toString()} : \n\n ${message.content}`,
    );
    message.author
      .send(
        "Votre compte a été banni du serveur **Grafikart** en raison d'un nombre trop important de messages à la suite. En cas d'erreur vous pouvez le signaler par email https://grafikart.fr/contact",
      )
      .catch(() => null);
    message.guild?.members
      .ban(message.author, {
        deleteMessageSeconds: 60 * 60 * 24,
        reason: `Raid "${message.content}"`,
      })
      .catch(this.logger.log);
  }

  /**
   * On termine le processus de vérification en nettoyant ce qui a été fait avant
   */
  private async endVerification(message: Message<true>) {
    this.logger.log(
      `Deverouillage du salon #${(message.channel as TextChannel).name}`,
    );
    this.locked = false;
    try {
      await message.delete();
      const channel = message.channel as TextChannel;
      channel.permissionOverwrites
        .edit(channel.guild.roles.everyone, { SendMessages: null })
        .catch(this.logger.log);
    } catch (e) {
      this.logger.log(e);
    }
  }
}
