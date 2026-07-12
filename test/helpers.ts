import { vi } from "vitest";
import { Client, Guild, TextChannel } from "discord.js";

process.on("unhandledRejection", () => null);

const fakeMessage = function (
  content: string,
  options: {
    authorId?: number;
    channelId?: number;
    attachmentCount?: number;
    joinedTimestamp?: number | null;
  } = {},
): any {
  let client = new Client({ intents: [] });
  // @ts-ignore
  let guild = new Guild(client, { emojis: [], id: 13123123 });
  // @ts-ignore
  let channel = new TextChannel(
    guild,
    { id: options.channelId ?? 123123 },
    client,
  );
  const message = {
    client,
    content,
    id: 1241244,
    attachments: { size: options.attachmentCount ?? 0 },
    embed: [],
    member: {
      joinedTimestamp: options.joinedTimestamp ?? null,
      timeout: () => Promise.resolve(""),
    },
    author: {
      id: options.authorId ?? 1,
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
