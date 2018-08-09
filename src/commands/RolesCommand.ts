import { Message } from 'discord.js'
import { ICommand } from '../interfaces/index'
import Command from './Command'

interface IRoles {
  [name: string]: string
}

/**
 * Liste les rôles disponibles
 */
export default class RolesCommand extends Command implements ICommand {

  public name = 'roles'
  public description = 'Permet de lister les différents rôles'
  private roles: IRoles

  public constructor (roles: IRoles) {
    super()
    this.roles = roles
  }

  public async run (message: Message, args: string[]) {
    let roles = Object.keys(this.roles).join(', ')
    await this.replyDM(`Voici la liste des rôles : ${roles}`, message)
  }

}
