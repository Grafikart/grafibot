import { CapslockFilter } from "../../src/filters";
import { fakeMessage } from "../helpers";

let filter = new CapslockFilter();

describe("CapslockFilter", () => {
  it("détecte les message en majuscule", () => {
    let message = fakeMessage("POURQUOI PERSONNE NE M'AIDE !");
    expect(filter.filter(message)).toBe(true);
    expect(message.channel.send).toHaveBeenCalled();
  });

  it("laisse passer les mentions", () => {
    let message = fakeMessage("<@123121231232133> ?");
    expect(filter.filter(message)).toBe(false);
  });

  it("laisse passer les messages courts", () => {
    let message = fakeMessage("$_SESSION");
    expect(filter.filter(message)).toBe(false);
  });

  it("laisse passer les messages avec qu'un smiley en caps", () => {
    let message = fakeMessage("<:THIS6:123456123456>")
    expect(filter.filter(message)).toBe(false)
  })

  it("laisse passer les messages avec des smiley en caps", () => {
    let message = fakeMessage(
      "<:THIS6:123456123456> <:THIS6:123456123456> <:THIS6:123456123456> <:THIS6:123456123456>"
    )
    expect(filter.filter(message)).toBe(false)
  })

  it("ne laisse passer les messages avec des smiley et un message en caps", () => {
    let message = fakeMessage("ÇA URGE PAR CONTRE <:THIS6:123456123456>")
    expect(filter.filter(message)).toBe(true)
  })

  it("laisse passer le messages avec un smiley en caps et un message normal", () => {
    let message = fakeMessage("svp j'ai besoin d'aide <:THIS6:123456123456>")
    expect(filter.filter(message)).toBe(false)
  })
});
