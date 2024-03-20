import { beforeEach, describe, expect, test, vi } from "vitest";
import { Premium } from "../../src/tasks/Premium";
import { Client, Collection } from "discord.js";

const addRole = vi.fn().mockImplementation(() => Promise.resolve(null));
const removeRole = vi.fn().mockImplementation(() => Promise.resolve(null));
const members = new Collection();
const roles = new Collection();
roles.set("1", { name: "Premium", id: "1" });
for (let i = 0; i < 10; i++) {
  members.set(i.toString(), {
    id: i.toString(),
    roles: {
      add: addRole,
      remove: removeRole,
    },
  });
}

describe("Premium", function () {
  beforeEach(() => {
    Premium.connect(new Client({ intents: [] }), { log: () => null });
    vi.spyOn(Premium, "getPremiumsFromSite").mockImplementation(() =>
      Promise.resolve(["1", "2", "3", "4"]),
    );
    vi.spyOn(Premium, "getPremiumsFromDiscord").mockImplementation(() =>
      Promise.resolve(["4", "5"]),
    );
    // @ts-ignore
    vi.spyOn(Premium.client.guilds.cache, "first").mockImplementation(() => ({
      members: { cache: members },
      roles: { cache: roles },
    }));
  });

  test("doit ajouter les membres", function () {
    return Premium.syncPremiums().then(function () {
      expect(addRole).toBeCalledTimes(3);
      expect(removeRole).toBeCalledTimes(1);
    });
  });
});
