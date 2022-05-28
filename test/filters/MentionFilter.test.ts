import { describe, it, expect } from "vitest";
import { MentionFilter } from "../../src/filters";
import { fakeMessage } from "../helpers";

const filter = new MentionFilter();
const match = ["<@123123213>"];
const noMatch = ["<@123123213> Salut ça va ?"];

describe("MentionFilter", () => {
  it("détecte les messages", () => {
    match.forEach(function (q) {
      let message = fakeMessage(q);
      expect(filter.filter(message)).toBe(true);
      expect(message.channel.send).toHaveBeenCalled();
    });
  });

  it("laisse passer les messages", () => {
    noMatch.forEach(function (q) {
      let message = fakeMessage(q);
      expect(filter.filter(message)).toBe(false);
      expect(message.channel.send).not.toHaveBeenCalled();
    });
  });
});
