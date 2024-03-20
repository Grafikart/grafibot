import type {
  GuildMember,
  Message,
  MessageReaction,
  PartialMessage,
  PartialMessageReaction,
} from "discord.js";

export interface ILogger {
  log(message: unknown): void;
}

export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly admin?: boolean;

  run(msg: Message | PartialMessage, args: string[]): any;
}

export interface IReactionCommand {
  readonly name?: string;
  readonly admin?: boolean;

  run(
    reaction: MessageReaction | PartialMessageReaction,
    member: GuildMember,
  ): any;
  support?(reactionName: string): boolean;
}

export interface IFilter {
  filter(msg: Message | PartialMessage): boolean;
}
