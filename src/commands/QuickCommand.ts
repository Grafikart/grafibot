import { ICommand } from "../interfaces";
import { Message } from "discord.js";

export default class QuickCommand implements ICommand {
  public name: string;
  public description: string;
  private message: string;

  constructor(name: string, description: string, message: string) {
    this.name = name;
    this.description = description;
    this.message = message;
  }

  run(message: Message, args: string[]) {
    message.delete().catch();
    let user = "";
    let content = args[0];
    if (args.length > 1) {
      user = args[0];
      content = args.slice(1).join(" ");
    }
    message.channel
      .send(
        this.message
          .replace("@user", user)
          .replace("@content", content)
          .replace("@url:content", encodeURIComponent(content))
      )
      .catch();
  }
}
