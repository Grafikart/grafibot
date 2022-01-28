import { Message } from 'discord.js'
import { ICommand } from '../interfaces'
import { sendDMorReply } from '../utils/helpers'

interface ICommandList {
  [name: string]: string
}

export default class HelpCommand implements ICommand {
  public name = 'help'
  public description = 'Affiche cette aide'
  private commands: ICommand[] = []

  public constructor (commands: ICommand[]) {
    this.commands = commands
  }

  public async run (message: Message, args: string[]) {
    let commands: ICommandList = this.commands.reduce(function (
      acc: ICommandList,
      command
    ) {
      if (command.admin !== true) {
        acc[command.name] = command.description
      }
      return acc
    },
    {})
    let commandsName = Object.keys(commands).sort()
    let help = commandsName
      .map(function (name) {
        return `**!${name}**: ${commands[name]}`
      })
      .join('\n')
    await sendDMorReply(
      message,
      `Voici la liste de mes commandes disponibles :

${help}

Un bug / un problème avec le bot ? https://github.com/Grafikart/grafibot/issues`,
    )
  }
}
