import { describe, it, expect, beforeEach } from "vitest";
import {
  ScamImageFilter,
  CROSSPOST_CHANNEL_THRESHOLD,
} from "../../src/filters/ScamImageFilter";
import { fakeMessage } from "../helpers";

const logger = { log: () => {} };
let filter: ScamImageFilter;

beforeEach(() => {
  filter = new ScamImageFilter(logger);
});

describe("ScamImageFilter", () => {
  it("laisse passer une image postée par un ancien membre dans un seul salon", () => {
    const message = fakeMessage("Regardez ma photo", {
      attachmentCount: 1,
      joinedTimestamp: Date.now() - 365 * 24 * 60 * 60 * 1000,
    });
    expect(filter.filter(message)).toBe(false);
  });

  it("laisse passer un message texte sans image d'un nouveau membre", () => {
    const message = fakeMessage("Bonjour à tous !", {
      attachmentCount: 0,
      joinedTimestamp: Date.now(),
    });
    expect(filter.filter(message)).toBe(false);
  });

  it("bloque une image postée par un membre tout juste arrivé", async () => {
    const message = fakeMessage("J'ai gagné 1000$ !", {
      attachmentCount: 1,
      joinedTimestamp: Date.now(),
    });
    expect(filter.filter(message)).toBe(true);
    expect(message.member.timeout).toHaveBeenCalledTimes(1);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(message.delete).toHaveBeenCalledTimes(1);
  });

  it("bloque une image postée dans plusieurs salons en moins d'une minute", () => {
    const oldJoin = Date.now() - 365 * 24 * 60 * 60 * 1000;
    for (let channelId = 1; channelId < CROSSPOST_CHANNEL_THRESHOLD; channelId++) {
      const message = fakeMessage("Regarde ce que j'ai gagné", {
        authorId: 42,
        channelId,
        attachmentCount: 1,
        joinedTimestamp: oldJoin,
      });
      expect(filter.filter(message)).toBe(false);
    }

    const last = fakeMessage("Regarde ce que j'ai gagné", {
      authorId: 42,
      channelId: CROSSPOST_CHANNEL_THRESHOLD,
      attachmentCount: 1,
      joinedTimestamp: oldJoin,
    });
    expect(filter.filter(last)).toBe(true);
    expect(last.member.timeout).toHaveBeenCalledTimes(1);
  });

  it("ne compte pas les salons différents entre deux utilisateurs distincts", () => {
    const oldJoin = Date.now() - 365 * 24 * 60 * 60 * 1000;
    const userA = fakeMessage("photo", {
      authorId: 1,
      channelId: 1,
      attachmentCount: 1,
      joinedTimestamp: oldJoin,
    });
    const userB = fakeMessage("photo", {
      authorId: 2,
      channelId: 2,
      attachmentCount: 1,
      joinedTimestamp: oldJoin,
    });
    expect(filter.filter(userA)).toBe(false);
    expect(filter.filter(userB)).toBe(false);
  });
});
