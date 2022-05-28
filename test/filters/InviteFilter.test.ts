import { describe, it, expect } from 'vitest'
import { InviteFilter } from "../../src/filters";
import { fakeMessage } from "../helpers";

let filter = new InviteFilter();

describe("InviteFilter", () => {
  it("détecte les invitation discord", () => {
    expect(
      filter.filter(
        fakeMessage(
          "Pour ce qui veulent mon groupe : https://discord.gg/jMwPGe"
        )
      )
    ).toBe(true);
    expect(
      filter.filter(
        fakeMessage(
          "Pour ce qui veulent mon groupe : https://discordapp.com/invite/rAuuD7Q"
        )
      )
    ).toBe(true);
    expect(
      filter.filter(
        fakeMessage(`Pour ce qui veulent mon groupe : 
    
    https://discord.gg/jMwPGe`)
      )
    ).toBe(true);
    expect(
      filter.filter(
        fakeMessage(
          "notre bot prevention: https://discordapp.com/oauth2/authorize?client_id=579748008804089891&scope=bot&permissions=252928"
        )
      )
    ).toBe(true);
    expect(
      filter.filter(
        fakeMessage(
          "Notre bot Anti-Raid: https://discordapp.com/oauth2/authorize?client_id=451361230901346314&scope=bot&permissions=8"
        )
      )
    ).toBe(true);
    expect(filter.filter(fakeMessage("Un message à propos de discord"))).toBe(
      false
    );
  });

  it("mute l'utilisateur", () => {
    const message = fakeMessage(
      "Pour ce qui veulent mon groupe : https://discord.gg/jMwPGe"
    );
    expect(filter.filter(message)).toBe(true);
    expect(message.member.timeout).toHaveBeenCalledTimes(1);
  });
});
