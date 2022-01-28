import { GuildMember, Message, MessageReaction, PartialMessage } from 'discord.js'

export interface ILogger {
  log(message: string): void
}

export interface ICommand {
  readonly name: string
  readonly description: string
  readonly admin?: boolean

  run(msg: Message | PartialMessage, args: string[]): any
}

export interface IReactionCommand {
  readonly name?: string
  readonly admin?: boolean

  run(reaction: MessageReaction, member: GuildMember): any
  support?(reactionName: string): boolean
}

export interface IFilter {
  filter(msg: Message|PartialMessage): boolean
}
