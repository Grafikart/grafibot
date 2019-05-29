import { ICommand, IFilter, IReactionCommand } from './interfaces/index'
import { Client, GuildMember, Message, Role, MessageReaction, User } from 'discord.js'
import { modoRole } from './config'

export default class Bot {

  public commands: ICommand[] = [] // Liste les commandes à utiliser
  private reactionCommands: IReactionCommand[] = []
  private filters: IFilter[] = [] // Liste les filtres à utiliser
  private apiKey: string // Clef d'api
  private client: Client
  private modos: string[] // Liste des modérateurs
  private modoRole: Role

  constructor (client: Client, apiKey: string = '') {
    this.apiKey = apiKey
    this.client = client
    this.client.on('ready', () => {
      let roles = this.client.guilds.first().roles
      this.modoRole = roles.find('name', 'Modo')
      this.modos = this.modoRole.members.map(member => member.id)
    })
    this.client.on('guildMemberUpdate', this.onGuildMemberUpdate.bind(this))
    this.client.on('message', this.onMessage.bind(this))
    this.client.on('messageUpdate', (_, newMessage: Message) => this.onMessage(newMessage))
    this.client.on('messageReactionAdd', this.onReactionAdd.bind(this))
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
   * Ajoute un filtre au bot
   * @param {IFilter} filter
   */
  addFilter (filter: IFilter): Bot {
    this.filters.push(filter)
    return this
  }

  /**
   * Ajoute une commande au bot
   */
  addReactionCommand (command: IReactionCommand): Bot {
    this.reactionCommands.push(command)
    return this
  }

  /**
   * Connecte le bot
   */
  async connect () {
    await this.client.login(this.apiKey)
    this.client.on('error', e => console.error(e.message))
    return
  }

  /**
   * Un message a été envoyé
   * @param {module:discord.js.Message} message
   */
  private onMessage (message: Message) {
    return (this.client.user && message.author.id === this.client.user.id) ||
      (message.content.startsWith('!') && this.runCommand(message) !== false) ||
      (message.channel.type !== 'dm' && this.runFilters(message) !== false)
  }

  /**
   * Lorsqu'une utilisateur est mis à jour
   * @param {module:discord.js.GuildMember} oldMember
   * @param {module:discord.js.GuildMember} newMember
   */
  private onGuildMemberUpdate (oldMember: GuildMember, newMember: GuildMember) {
    if (!newMember.roles.equals(oldMember.roles)) {
      this.onRoleUpdate(newMember)
    }
  }

  /**
   * Lorsqu'un utilisateur a changé de rôle
   * @param {module:discord.js.GuildMember} member
   */
  private onRoleUpdate (member: GuildMember) {
    let roles = member.roles
    if (
      roles.exists('id', this.modos) &&
      !this.modos.includes(member.id)
    ) {
      this.modos.push(member.id)
    } else if (
      !roles.exists('id', this.modos) &&
      this.modos.includes(member.id)
    ) {
      this.modos = this.modos.filter(m => m !== member.id)
    }
  }

  /**
   * Détecte l'ajout de réaction
   */
  private onReactionAdd (reaction: MessageReaction, user: User) {
    const command = this.reactionCommands.find(c => c.name === reaction.emoji.name)
    const member = reaction.message.guild.member(user)
    if (command === undefined) return false
    if (command.admin === true && !this.isModo(member)) {
      return false
    }
    return command.run(reaction, user)
  }

  /**
   * Trouve la commande à lancer pour le message
   * @param {module:discord.js.Message} message
   */
  private runCommand (message: Message) {
    const parts = message.content.split(' ')
    const commandName = parts[0].replace('!', '')
    const command: ICommand = this.commands.find(c => c.name === commandName)
    const member = message.guild.member(message.author)
    if (command === undefined) return false
    if (command.admin === true && !this.isModo(member)) {
      return false
    }
    return command.run(message, parts.slice(1))
  }

  /**
   * Renvoie le message sur tous les filtres
   * @param {module:discord.js.Message} message
   * @returns {boolean}
   */
  private runFilters (message: Message): boolean {
    return this.filters.find(f => f.filter(message)) === undefined
  }

  private isModo (member: GuildMember): boolean {
    return member.roles.find(r => r.name === modoRole) !== null
  }
}
