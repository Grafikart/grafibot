import {beforeEach, describe, expect, it, vi} from "vitest";
import type {Message} from "discord.js";
import {ScamImageFilter} from "../../src/filters";
import {fakeMessage} from "../helpers";

const logger = {log: vi.fn()};
let filter: ScamImageFilter;

function imageMessage(content: string, authorId: string, channelId: string, attachmentCount = 1): Message<true> {
  const message = fakeMessage(content);
  Object.assign(message, {
    attachments: {size: attachmentCount},
    channelId,
    member: {...message.member, id: authorId},
    author: {...message.author, id: authorId},
  });
  return message;
}

beforeEach(() => {
  filter = new ScamImageFilter(logger);
  logger.log.mockClear();
});

describe("ScamImageFilter", () => {
  it("laisse passer une image postée dans un seul salon", () => {
    const message = imageMessage("Regardez ma photo", "member-id", "channel-1");

    expect(filter.filter(message)).toBe(false);
    expect(message.delete).not.toHaveBeenCalled();
  });

  it("laisse passer un message texte sans image", () => {
    const message = imageMessage("Bonjour à tous !", "member-id", "channel-1", 0);

    expect(filter.filter(message)).toBe(false);
    expect(message.delete).not.toHaveBeenCalled();
  });

  it("bloque une image identique postée dans plusieurs salons par le même membre", () => {
    const firstMessage = imageMessage("Regarde ce que j'ai gagné", "member-id", "channel-1");
    const secondMessage = imageMessage("Regarde ce que j'ai gagné", "member-id", "channel-2");

    expect(filter.filter(firstMessage)).toBe(false);
    expect(filter.filter(secondMessage)).toBe(true);
    expect(secondMessage.member!.timeout).toHaveBeenCalledTimes(1);
    expect(firstMessage.delete).toHaveBeenCalledTimes(1);
    expect(secondMessage.delete).toHaveBeenCalledTimes(1);
  });

  it("ne confond pas deux utilisateurs qui postent la même image dans des salons différents", () => {
    const firstMessage = imageMessage("photo", "member-a", "channel-1");
    const secondMessage = imageMessage("photo", "member-b", "channel-2");

    expect(filter.filter(firstMessage)).toBe(false);
    expect(filter.filter(secondMessage)).toBe(false);
    expect(secondMessage.member!.timeout).not.toHaveBeenCalled();
  });
});
