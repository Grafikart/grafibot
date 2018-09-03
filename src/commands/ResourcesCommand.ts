import { Message, RichEmbed } from 'discord.js'
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
    return message.channel.send(this.createEmbed())
  }

  private createEmbed () {
    const resourcesEmbed = new RichEmbed()
    this.resources.map(resource => resourcesEmbed.addField(resource.name, resource.website))
    resourcesEmbed.setColor('#78AB4E')
    return resourcesEmbed
  }

}
