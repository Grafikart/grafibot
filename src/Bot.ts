import { ICommand } from './interfaces/index'
import { Client, GuildMember, Message } from 'discord.js'
import { admin } from './config'

export default class Bot {

  public commands: ICommand[] = []
  private apiKey: string
  private client: Client
  private modos: string[]

  constructor (client: Client, apiKey: string = '') {
    this.apiKey = apiKey
    this.client = client
    this.client.on('ready', () => {
      this.modos = this.client.guilds.first().roles.find('id', admin).members.map(member => member.id)
    })
    this.client.on('guildMemberUpdate', this.onGuildMemberUpdate.bind(this))
    this.client.on('message', (msg: Message) => {
      if (msg.content.startsWith('!')) {
        this.runCommand(msg).catch(e => console.error(e))
      }
    })
  }

  /**
   * Lorsqu'une utilisateur est mis à jour
   * @param {module:discord.js.GuildMember} oldMember
   * @param {module:discord.js.GuildMember} newMember
   */
  onGuildMemberUpdate (oldMember: GuildMember, newMember: GuildMember) {
    if (!newMember.roles.equals(oldMember.roles)) {
      this.onRoleUpdate(newMember)
    }
  }

  onRoleUpdate (member: GuildMember) {
    let roles = member.roles
    if (
      roles.exists('id', admin) &&
      !this.modos.includes(member.id)
    ) {
      this.modos.push(member.id)
    } else if (
      !roles.exists('id', admin) &&
      this.modos.includes(member.id)
    ) {
      this.modos = this.modos.filter(m => m !== member.id)
    }
  }

  /**
   * Ajoute une commande au bot
   * @param {ICommand} command
   * @returns {Bot}
   */
  addCommand (command: ICommand): Bot {
    this.commands.push(command)
    return this
  }

  /**
   * Connecte le bot
   */
  async connect () {
    try {
      await this.client.login(this.apiKey)
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Trouve la commande à lancer pour le message
   * @param {module:discord.js.Message} message
   */
  private async runCommand (message: Message) {
    let parts = message.content.split(' ')
    let commandName = parts[0].replace('!', '')
    let command: ICommand = this.commands.find(c => c.name === commandName)
    if (command === undefined) return false
    if (command.admin === true) {
      if (this.modos.includes(message.author.id)) {
        return command.run(message, parts.slice(1))
      } else {
        return new Promise((resolve) => resolve())
      }
    }
    return command.run(message, parts.slice(1))
  }

}
