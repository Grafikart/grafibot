import { vi } from "vitest";
import { Client, Guild, TextChannel } from "discord.js";

process.on("unhandledRejection", () => null);

const fakeMessage = function (content: string): any {
  let client = new Client({ intents: [] });
  // @ts-ignore
  let guild = new Guild(client, { emojis: [], id: 13123123 });
  // @ts-ignore
  let channel = new TextChannel(guild, { id: 123123 }, client);
  const message = {
    client,
    content,
    id: 1241244,
    attachments: [],
    embed: [],
    member: {
      timeout: () => Promise.resolve(""),
    },
    author: {
      createDM: () => Promise.resolve(""),
    },
    channel,
    delete: () => Promise.resolve(message),
    reply: () => Promise.resolve(message),
    createDM: () => Promise.resolve(message),
  };
  // Spy everything
  vi.spyOn(message.channel, "send").mockImplementation(() =>
    Promise.resolve(message),
  );
  vi.spyOn(message, "delete").mockImplementation(() =>
    Promise.resolve(message),
  );
  vi.spyOn(message.member, "timeout").mockImplementation(() =>
    Promise.resolve(""),
  );
  vi.spyOn(message, "reply").mockImplementation(() => Promise.resolve(message));
  vi.spyOn(message.author, "createDM").mockImplementation(() =>
    // @ts-ignore
    Promise.reject(),
  );
  return message;
};

export { fakeMessage };
