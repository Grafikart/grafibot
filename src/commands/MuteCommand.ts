import { ICommand, ILogger } from '../interfaces'
import { Client, GuildMember, Message, Role, TextChannel } from 'discord.js'
import { Database } from 'sqlite3'
import { CronJob } from 'cron'
import { durationToString } from '../utils/helpers'

const minute = 60 * 1000
const hour = 60 * minute
const day = 24 * hour

export default class MuteCommand implements ICommand {

  readonly name = 'mute'
  readonly description = 'Permet de mute un utilisateur'
  readonly admin = true
  private jobs: {[k: string]: CronJob[]} = {}
  private readonly client: Client
  private readonly levels = [
    {
      duration: 10 * minute,
      forget: day
    },
    {
      duration: hour,
      forget: 3 * day
    },
    {
      duration: day,
      forget: 5 * day
    },
    {
      duration: 3 * day,
      forget: 7 * day
    },
    {
      duration: 7 * day,
      forget: 10 * day
    }
  ]
  private readonly logger: ILogger
  private readonly db: Database

  constructor (db: Database, client: Client, logger: ILogger) {
    this.db = db
    this.logger = logger
    this.client = client
    this.client.on('ready', this.resetJobs.bind(this))
  }

  async run (message: Message, args: string[]) {
    let member = message.mentions.members.first()
    let reason = args.slice(1).join(' ')
    this.logger.log(`<@!${message.author.id}> a mute <@!${member.id}>\n **Raison :** ${reason}`)
    this.muteMember(member, reason).catch()
    return true
  }

  /**
   * Mute un utilisateur
   * @param {module:discord.js.GuildMember} member
   * @param {string} reason
   * @returns {Promise<void>}
   */
  private async muteMember (member: GuildMember, reason: string) {
    let role = this.getMutedRole()
    let lvl = await this.incrementLevelForUser(member)
    let duration = durationToString(this.levels[lvl].duration)
    await member.addRole(role)
    this.getMutedChannel().send(`<@!${member.id}> Vous avez été muté pour la raison suivante \n\n > *${reason.trim()}* \n\n Le mute sera levé dans **${duration}**, merci de respecter les règles de ce serveur.`).catch()
    this.addJobsFor(member, lvl)
  }

  /**
   * Regénère les "jobs" à partir de la base de données
   */
  private resetJobs () {
    this.db.each('SELECT id, lvl, muted_at FROM mutes', (err, row) => {
      if (err === null) {
        let member = this.client.guilds.first().members.find('id', row.id)
        if (member) {
          this.addJobsFor(member, row.lvl)
        }
      }
    })
  }

  /**
   * Crée les 2 "jobs" pour décrémenter le niveau d'agression et supprimer le rôle
   * @param {module:discord.js.GuildMember} member
   * @param {number} lvl
   */
  private addJobsFor (member: GuildMember, lvl: number) {
    let date = Date.now()
    let level = this.levels[lvl]
    let role = this.getMutedRole()
    let jobs = []
    if (member.roles.has(role.id)) {
      jobs.push(new CronJob({
        cronTime: new Date(date + level.duration),
        start: true,
        onTick: function () {
          member.removeRole(role).catch()
        }
      }))
    }
    jobs.push(new CronJob({
      cronTime: new Date(date + level.forget),
      start: true,
      onTick: () => {
        this.decrementLevelForUser(member).catch()
      }
    }))
    if (this.jobs[member.id]) {
      this.jobs[member.id].forEach(job => job.stop())
    }
    this.jobs[member.id] = jobs
  }

  /**
   * Récupère le role "muted"
   * @returns {module:discord.js.Role}
   */
  private getMutedRole (): Role {
    return this.client.guilds.first().roles.find('name', 'muted')
  }

  /**
   * Récupère le role "muted"
   * @returns {module:discord.js.Role}
   */
  private getMutedChannel (): TextChannel {
    return this.client.guilds.first().channels.find('name', 'muted') as TextChannel
  }

  private async decrementLevelForUser (member: GuildMember): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT lvl FROM mutes WHERE id = ?', [member.id], (err, row) => {
        if (err !== null) return reject(err)
        if (row.lvl === 0) {
          this.db.run('DELETE FROM mutes WHERE id = ?', [member.id])
        } else {
          this.db.run('UPDATE mutes SET lvl = lvl - 1, muted_at = ? WHERE id = ?', [member.id, Date.now()])
          this.addJobsFor(member, row.lvl - 1)
        }
        resolve(row.lvl - 1)
      })
    })
  }

  /**
   * Récupère le niveau "d'agression" d'un utilisateur
   * @returns {Promise<any>}
   * @param member
   */
  private async incrementLevelForUser (member: GuildMember): Promise<any> {
    return new Promise((resolve, reject) => {
      let db = this.db
      db.run(
        'UPDATE mutes SET muted_at = ?, lvl = lvl + 1 WHERE id = ?',
        [Date.now(), member.id],
        function (err: any, row: any) {
          if (err !== null) return reject(err)
          if (this.changes > 0) {
            db.get('SELECT lvl FROM mutes WHERE id = ?', [member.id], function (err, row) {
              if (err === null) return resolve(row.lvl)
              return reject(err)
            })
          } else {
            db.run('INSERT INTO mutes (id, muted_at) VALUES (?, ?)', [member.id, Date.now()])
            resolve(0)
          }
        })
    })
  }

}
