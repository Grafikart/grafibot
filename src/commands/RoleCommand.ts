import { Message, Role } from 'discord.js'
import { ICommand } from '../interfaces/index'
import Command from './Command'

interface IRoles {
  [name: string]: string
}

/**
 * Attribue / Supprime un rôle
 */
export default class RoleCommand extends Command implements ICommand {

  public name = 'role'
  public description = 'Permet de s\'attribuer/se retirer un rôle, ex: "!role BackEnd"'
  private roles: IRoles

  public constructor (roles: IRoles) {
    super()
    this.roles = roles
  }

  public async run (message: Message, args: string[]) {
    if (args.length === 0 || this.roles[args[0].toLowerCase()] === undefined) {
      return this.replyDM('Je ne connais pas ce rôle :(', message)
    }
    let guild = message.client.guilds.first()
    let member = await guild.fetchMember(message.author, false)
    let roleId = this.roles[args[0].toLowerCase()]
    let role = member.roles.find('id', roleId)
    if (role) {
      await member.removeRole(role)
      return this.replyDM(`Rôle ${args[0]} supprimé !`, message)
    } else {
      await member.addRole(new Role(guild, { id: roleId }))
      return this.replyDM(`Rôle ${args[0]} ajouté !`, message)
    }
  }

}
