import { describe, it, expect, vi } from "vitest";
import { Message } from "discord.js";
import Bot from "../src/Bot";
import { fakeMessage } from "./helpers";
import { ICommand, IFilter } from "../src/interfaces";

const generateCommand = function (name: string): ICommand {
  let command = {
    name: name,
    description: name,
    run(msg: Message, args: string[]): void {
      return;
    },
  };
  vi.spyOn(command, "run");
  return command;
};

const generateFilter = function (content: string): IFilter {
  let filter = {
    filter(message: Message) {
      let triggered = message.content === content;
      if (triggered) message.channel.send("filtered !");
      return triggered;
    },
  };
  vi.spyOn(filter, "filter");
  return filter;
};

describe("Commands", function () {
  let message = fakeMessage("!demo a1 a2");
  let bot = new Bot(message.client);
  let command = generateCommand("demo");
  bot.addCommand(command);

  it("should detect command", function () {
    message.client.emit("message", message);
    expect(command.run).toHaveBeenCalledWith(message, ["a1", "a2"]);
  });
});

describe("Filters", function () {
  it("laisse passer les messages", function () {
    let message = fakeMessage("c");
    let filtera = generateFilter("a");
    let filterb = generateFilter("b");
    let bot = new Bot(message.client);
    bot.addFilter(filtera);
    bot.addFilter(filterb);
    message.client.emit("message", message);
    expect(message.channel.send).not.toHaveBeenCalled();
  });

  it("filtre les messages", function () {
    let message = fakeMessage("a");
    let filtera = generateFilter("a");
    let filterb = generateFilter("b");
    let bot = new Bot(message.client);
    bot.addFilter(filtera);
    bot.addFilter(filterb);
    message.client.emit("message", message);
    expect(message.channel.send).toHaveBeenCalled();
    expect(filtera.filter).toHaveBeenCalled();
    expect(filterb.filter).not.toHaveBeenCalled();
  });

  it("ne filtre pas les messages proventant ", function () {
    let message = fakeMessage("a");
    message.channel.type = "DM";
    let filtera = generateFilter("a");
    let bot = new Bot(message.client).addFilter(filtera);
    message.client.emit("message", message);
    expect(message.channel.send).not.toHaveBeenCalled();
    expect(filtera.filter).not.toHaveBeenCalled();
  });
});
