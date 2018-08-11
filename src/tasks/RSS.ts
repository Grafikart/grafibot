import RSSParser, { IFeedItem } from 'rss-parser'
import { Client, TextChannel } from 'discord.js'
import { CronJob } from 'cron'

export default class RSS {

  static url = 'https://www.grafikart.fr/feed.rss'
  static lastTime: string = null
  static client: Client

  static connect (client: Client) {
    let job = new CronJob('0 2 10-18 * * *', this.parseRSS.bind(this), null, false)
    this.client = client
    this.client.on('ready', () => {
      job.start()
      this.parseRSS()
    })
  }

  /**
   * Parse le flux RSS et envoie les messages
   * @returns {Promise<void>}
   */
  static async parseRSS () {
    let parser = new RSSParser()
    let feed = await parser.parseURL(this.url)
    if (this.lastTime === null) {
      this.lastTime = feed.items[0].isoDate
      return
    }
    let channel = this.client.guilds.first().channels.find(channel => channel.name === 'annonces') as TextChannel
    if (channel === null) return
    feed.items.forEach((item: IFeedItem) => {
      if (item.isoDate > this.lastTime) {
        channel.send(this.message(item)).catch()
        this.lastTime = item.isoDate
      }
    })
  }

  /**
   * Renvoie le message à poster
   * @param {IFeedItem} item
   * @returns {string}
   */
  static message (item: IFeedItem): string {
    let parts = item.title.split(':')
    return `**<:grafikart:250692379638497280> Nouveau ${parts[0]}** ${parts.slice(1).join(':')} ${item.link}`
  }

}
