import type { ICommand, IFilter, IReactionCommand } from "./interfaces";
import {
  ChannelType,
  type Client,
  type GuildMember,
  type Message,
  type MessageReaction,
  type PartialMessage,
  type PartialMessageReaction,
  type PartialUser,
  type User,
} from "discord.js";
import { modoRole } from "./config";

export default class Bot {
  public commands: ICommand[] = []; // Liste les commandes à utiliser
  private reactionCommands: IReactionCommand[] = [];
  private filters: IFilter[] = []; // Liste les filtres à utiliser
  private apiKey: string; // Clef d'api
  private client: Client;

  constructor(client: Client, apiKey: string = "") {
    this.apiKey = apiKey;
    this.client = client;
    this.client.on("ready", () => {
      const guild = this.client.guilds.cache.first();
      if (!guild) {
        throw new Error("Impossible de récupérer les rôles");
      }
      let roles = guild.roles;
      const foundModoRole = roles.cache.find((r) => r.name === modoRole);
      if (foundModoRole === undefined) {
        throw new Error("Impossible de récupérer le rôle modérateur");
      }
    });
    this.client.on("messageCreate", this.onMessage.bind(this));
    this.client.on("messageUpdate", (_, newMessage) => {
      this.onMessage(newMessage);
    });
    this.client.on("messageReactionAdd", this.onReactionAdd.bind(this));
  }

  /**
   * Ajoute une commande au bot
   */
  addCommand(command: ICommand): Bot {
    this.commands.push(command);
    return this;
  }

  /**
   * Ajoute un filtre au bot
   * @param {IFilter} filter
   */
  addFilter(filter: IFilter): Bot {
    this.filters.push(filter);
    return this;
  }

  /**
   * Ajoute une commande au bot
   */
  addReactionCommand(command: IReactionCommand): Bot {
    this.reactionCommands.push(command);
    return this;
  }

  /**
   * Connecte le bot
   */
  async connect() {
    await this.client.login(this.apiKey);
    console.log("Bot connected, listening...");
    this.client.on("error", (e) => console.error(e.message));
    return;
  }

  /**
   * Un message a été envoyé
   */
  private onMessage(message: Message | PartialMessage) {
    if (!message.author || !message.content) {
      return;
    }
    // Le bot a envoyé le message
    if (this.client.user && message.author.id === this.client.user.id) {
      return;
    }
    if (message.content.startsWith("!") && this.runCommand(message)) {
      return;
    }
    if (message.channel.type !== ChannelType.DM && this.runFilters(message)) {
      return;
    }
  }

  /**
   * Détecte l'ajout de réaction
   */
  private async onReactionAdd(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    const command = this.reactionCommands.find(function (c) {
      return (
        c.name === reaction.emoji.name ||
        (c.support && c.support(reaction?.emoji?.name ?? ""))
      );
    });
    if (command === undefined) return;
    const member = await reaction.message.guild?.members.fetch(user.id);
    if (!member) return;
    if (command.admin === true && !this.isModo(member)) {
      return;
    }
    return command.run(reaction, member);
  }

  /**
   * Trouve la commande à lancer pour le message
   */
  private runCommand(message: Message | PartialMessage) {
    if (!message.content || !message.member) {
      return;
    }
    const parts = message.content.split(" ");
    const commandName = parts[0].replace("!", "");
    const command = this.commands.find((c) => c.name === commandName);
    if (command === undefined) return false;
    if (command.admin === true && !this.isModo(message.member)) {
      return false;
    }
    return command.run(message, parts.slice(1));
  }

  /**
   * Renvoie le message sur tous les filtres
   */
  private runFilters(message: Message | PartialMessage): boolean {
    return this.filters.find((f) => f.filter(message)) === undefined;
  }

  private isModo(member: GuildMember): boolean {
    return member.roles.cache.find((r) => r.name === modoRole) !== undefined;
  }
}
