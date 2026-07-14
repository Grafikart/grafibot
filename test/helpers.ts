import { vi } from "vitest";
import { Client, Guild, type Message, TextChannel } from "discord.js";

process.on("unhandledRejection", () => null);

const fakeMessage = function (content: string): Message<true> {
  let client = new Client({ intents: [] });
  // @ts-ignore
  let guild = new Guild(client, { emojis: [], id: 13123123 });
  // @ts-ignore
  let channel = new TextChannel(guild, { id: 123123 }, client);
  const message = {
    client,
    content,
    partial: false,
    id: 1241244,
    attachments: [],
    embed: [],
    member: {
      id: "member-id",
      timeout: () => Promise.resolve(""),
    },
    author: {
      id: "author-id",
      createDM: () => Promise.resolve(""),
    },
    channel,
    inGuild: () => true,
    delete: () => Promise.resolve(message),
    reply: () => Promise.resolve(message),
    createDM: () => Promise.resolve(message),
  };
  // Spy everything
  vi.spyOn(message.channel, "send").mockImplementation(() =>
    Promise.resolve(message as unknown as Message<true>),
  );
  vi.spyOn(message, "delete").mockImplementation(() =>
    Promise.resolve(message),
  );
  vi.spyOn(message.member, "timeout").mockImplementation(() =>
    Promise.resolve(""),
  );
  vi.spyOn(message, "reply").mockImplementation(() =>
    Promise.resolve(message),
  );
  vi.spyOn(message.author, "createDM").mockImplementation(() =>
    // @ts-ignore
    Promise.reject(),
  );
  return message as unknown as Message<true>;
};

export { fakeMessage };
