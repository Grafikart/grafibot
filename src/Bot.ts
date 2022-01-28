import { ICommand, IFilter, IReactionCommand } from './interfaces'
import {
  Client,
  GuildMember,
  Message,
  Role,
  MessageReaction,
  User, PartialMessage
} from 'discord.js'
import { modoRole } from './config.js'

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
      let roles = this.client.guilds.cache.first().roles
      this.modoRole = roles.cache.find(r => r.name === modoRole)
      this.modos = this.modoRole.members.map(member => member.id)
    })
    this.client.on('message', this.onMessage.bind(this))
    this.client.on('messageUpdate', (_, newMessage) => {
      this.onMessage(newMessage)
    })
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
    console.log('logged')
    await this.client.login(this.apiKey)
    console.log('logged')
    this.client.on('error', e => console.error(e.message))
    return
  }

  /**
   * Un message a été envoyé
   * @param {module:discord.js.Message} message
   */
  private onMessage (message: Message | PartialMessage) {
    return (
      (this.client.user && message.author.id === this.client.user.id) ||
      (message.content.startsWith('!') && this.runCommand(message) !== false) ||
      (message.channel.type !== 'DM' && this.runFilters(message) !== false)
    )
  }

  /**
   * Détecte l'ajout de réaction
   */
  private onReactionAdd (reaction: MessageReaction, member: GuildMember) {
    const command = this.reactionCommands.find(function (c) {
      return (
        c.name === reaction.emoji.name ||
        (c.support && c.support(reaction.emoji.name))
      )
    })
    if (command === undefined) return false
    if (command.admin === true && !this.isModo(member)) {
      return false
    }
    return command.run(reaction, member)
  }

  /**
   * Trouve la commande à lancer pour le message
   * @param {module:discord.js.Message} message
   */
  private runCommand (message: Message|PartialMessage) {
    const parts = message.content.split(' ')
    const commandName = parts[0].replace('!', '')
    const command: ICommand = this.commands.find(c => c.name === commandName)
    if (command === undefined) return false
    if (command.admin === true && !this.isModo(message.member)) {
      return false
    }
    return command.run(message, parts.slice(1))
  }

  /**
   * Renvoie le message sur tous les filtres
   * @param {module:discord.js.Message} message
   * @returns {boolean}
   */
  private runFilters (message: Message|PartialMessage): boolean {
    return this.filters.find(f => f.filter(message)) === undefined
  }

  private isModo (member: GuildMember): boolean {
    return member.roles.cache.find(r => r.name === modoRole) !== undefined
  }
}
