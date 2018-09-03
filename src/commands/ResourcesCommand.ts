import { Message } from 'discord.js'
import { ICommand, IResource } from '../interfaces/index'
import Command from './Command'

export default class ResourcesCommand extends Command implements ICommand {

  public name = 'ressources'
  public description = 'Affiche de nombreuses ressources/documentations'
  private resources: IResource[] = []

  public constructor (resources: IResource[]) {
    super()
    this.resources = resources
  }

  public async run (message: Message, args: string[]) {
    await message.channel.send(`Test ${this.resources}`)
  }

}
