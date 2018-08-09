import { Message } from 'discord.js'

export interface ILogger {
  log (message: string): void
}

export interface ICommand {
  name: string
  description: string
  admin?: boolean

  run (msg: Message, args: string[]): any
}
