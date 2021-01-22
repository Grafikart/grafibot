import { Client, GuildMember, Role } from 'discord.js'
import { arrayDiff } from '../utils/helpers'
import { ILogger } from '../interfaces'
import got from 'got/dist/source'

type IRow = { discord_id: string }

export default class Premium {
  static client: Client
  static logger: ILogger

  static connect (client: Client, logger: ILogger) {
    this.client = client
    this.logger = logger
    this.client.on('ready', this.syncPremiums.bind(this))
  }

  static async syncPremiums () {
    let role = this.client.guilds.cache
      .first()
      .roles.cache.find(r => r.name === 'Premium')
    let [discord, site] = await Promise.all([
      this.getPremiumsFromDiscord(role),
      this.getPremiumsFromSite()
    ])
    let guild = this.client.guilds.cache.first()
    let toRemove = arrayDiff(discord, site)
    let toAdd = arrayDiff(site, discord)
    toRemove.forEach(id => {
      let member = guild.members.cache.find(m => m.id === id)
      if (member) {
        member.roles.remove(role).catch()
      }
    })
    toAdd.forEach(id => {
      let member = guild.members.cache.find(m => m.id === id)
      if (member) {
        member.roles.add(role).catch()
      }
    })
    setTimeout(this.syncPremiums.bind(this), 1000 * 60 * 10)
    return
  }

  static async getPremiumsFromDiscord (role: Role): Promise<string[]> {
    return this.client.guilds.cache
      .first()
      .members.cache.filter((member: GuildMember) =>
        member.roles.cache.has(role.id)
      )
      .map((member: GuildMember) => member.id)
  }

  static async getPremiumsFromSite (): Promise<string[]> {
    const response = await got('https://grafikart.fr/api/discord/premium')
    return JSON.parse(response.body);
  }
}
