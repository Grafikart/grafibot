import { Client, GuildMember, Role } from "discord.js";
import { arrayDiff } from "../utils/helpers";
import { ILogger } from "../interfaces";
import got from "got";

export default class Premium {
  static client: Client;
  static logger: ILogger;

  static connect(client: Client, logger: ILogger) {
    this.client = client;
    this.logger = logger;
    this.client.on("ready", this.syncPremiums.bind(this));
  }

  static async syncPremiums() {
    const role = this.client.guilds.cache
      .first()
      ?.roles.cache.find((r) => r.name === "Premium");
    const guild = this.client.guilds.cache.first();
    if (!role || !guild) {
      return;
    }
    const [discord, site] = await Promise.all([
      this.getPremiumsFromDiscord(role),
      this.getPremiumsFromSite(),
    ]);
    const toRemove = arrayDiff(discord, site);
    const toAdd = arrayDiff(site, discord);
    for (const id of toRemove) {
      const member = guild.members.cache.find((m) => m.id === id);
      if (member) {
        member.roles.remove(role).catch();
      }
    }
    for (const id of toAdd) {
      const member = guild.members.cache.find((m) => m.id === id);
      if (member) {
        member.roles.add(role).catch();
      }
    }
    setTimeout(this.syncPremiums.bind(this), 1000 * 60 * 10);
    return;
  }

  static async getPremiumsFromDiscord(role: Role): Promise<string[]> {
    return (
      this.client.guilds.cache
        .first()
        ?.members.cache.filter((member: GuildMember) =>
          member.roles.cache.has(role.id)
        )
        .map((member: GuildMember) => member.id) ?? []
    );
  }

  static async getPremiumsFromSite(): Promise<string[]> {
    const response = await got("https://grafikart.fr/api/discord/premium");
    return JSON.parse(response.body);
  }
}
