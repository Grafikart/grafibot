import { Client, TextChannel } from "discord.js";
import type { ILogger } from "../interfaces";

export default class Logger implements ILogger {
  private channel?: TextChannel;

  constructor(client: Client) {
    client.on("ready", () => {
      const channel = client.guilds.cache
        .first()
        ?.channels.cache.find((c) => c.name === "logs");
      if (!channel) {
        throw new Error('Impossible de trouver le salon "logs"');
      }
      this.channel = channel as TextChannel;
    });
  }

  async log(message: string) {
    if (this.channel) {
      return this.channel.send(message);
    }
    return;
  }
}
