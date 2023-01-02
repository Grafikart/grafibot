import RSSParser from "rss-parser";
import { Client, TextChannel } from "discord.js";
import { CronJob } from "cron";
import { Options } from '../utils/Options'

type FeedItem = {
  link: string;
  isoDate: string;
  title: string;
};

export default class RSS {
  static url = "https://www.grafikart.fr/feed.rss";
  static client: Client;

  static connect(client: Client) {
    let job = new CronJob(
      "0 2 10-18 * * *",
      this.parseRSS.bind(this),
      null,
      false
    );
    this.client = client;
    this.client.on("ready", () => {
      job.start();
      this.parseRSS().catch();
    });
  }

  /**
   * Parse le flux RSS et envoie les messages
   * @returns {Promise<void>}
   */
  static async parseRSS() {
    let feed = await new RSSParser().parseURL(this.url);
    let lastTime = Options.get('rssLastTime');
    if (lastTime === null) {
      lastTime = feed.items[0].isoDate!;
      Options.set('rssLastTime', lastTime)
      return;
    }
    let channel = this.client.guilds.cache
      .first()
      ?.channels.cache.find(
        (channel) => channel.name === "annonces"
      ) as TextChannel;
    if (channel === undefined) return;
    feed.items.forEach((item: FeedItem) => {
      if (lastTime === undefined || item.isoDate > lastTime) {
        channel.send(this.message(item)).catch();
        Options.set('rssLastTime', item.isoDate);
      }
    });
  }

  /**
   * Renvoie le message à poster
   * @param {FeedItem} item
   * @returns {string}
   */
  static message(item: FeedItem): string {
    let parts = item.title.split(":");
    return `**<:grafikart:250692379638497280> ${
      parts[0] ? `Nouveau ${parts[0]}` : "Nouvel article"
    }** ${parts.slice(1).join(":")} ${item.link}`;
  }
}
