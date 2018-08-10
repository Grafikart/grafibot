import { Client, GuildMember, Role } from 'discord.js'
import * as mysql from 'mysql2/promise'
import { arrayDiff } from '../utils/helpers'

type IRow = { discord_id: string }

export default class Premium {

  static client: Client

  static connect (client: Client) {
    this.client = client
    this.client.on('ready', this.syncPremiums.bind(this))
  }

  static async syncPremiums () {
    let role = this.client.guilds.first().roles.find('name', 'Premium')
    let [discord, site] = await Promise.all([
      this.getPremiumsFromDiscord(role),
      this.getPremiumsFromSite()
    ])
    let guild = this.client.guilds.first()
    let toRemove = arrayDiff(discord, site)
    let toAdd = arrayDiff(site, discord)
    toRemove.forEach(id => {
      let member = guild.members.find('id', id)
      if (member) {
        member.removeRole(role).catch()
      }
    })
    toAdd.forEach(id => {
      let member = guild.members.find('id', id)
      if (member) {
        member.addRole(role).catch()
      }
    })
    setTimeout(this.syncPremiums.bind(this), 1000 * 60 * 10)
    return
  }

  static async getPremiumsFromDiscord (role: Role): Promise<string[]> {
    return this.client.guilds.first().members
      .filter((member: GuildMember) => member.roles.has(role.id))
      .map((member: GuildMember) => member.id)
  }

  static async getPremiumsFromSite (): Promise<string[]> {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB
    })
    const [rows] = await connection.execute(
      'SELECT discord_id FROM users WHERE premium > NOW() AND discord_id IS NOT NULL AND discord_id != ""'
    )
    connection.destroy()
    return (rows as IRow[]).map(row => row.discord_id)
  }

}
