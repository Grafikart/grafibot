import { Message } from 'discord.js'

export interface ILogger {
  log (message: string): void
}

export interface ICommand {
  readonly name: string
  readonly description: string
  readonly admin?: boolean

  run (msg: Message, args: string[]): any
}

export interface IFilter {
  filter (msg: Message): boolean
}
