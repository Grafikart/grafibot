import { describe, it, expect } from "vitest";
import { ErrorsFilter } from "../../src/filters";
import { fakeMessage } from "../helpers";

let filter = new ErrorsFilter();

describe("ErrorsFilter", () => {
  const erroredMessage =
    "yep sa dit que le soucis est ligne 46 mais que le problème commence ligne 43 Warning: Cannot modify header information - headers already sent by (output started at /Applications/MAMP/htdocs/header.php:43) in";

  it("détecte les erreurs", () => {
    expect(filter.filter(fakeMessage(erroredMessage))).toBe(true);
    expect(
      filter.filter(
        fakeMessage(
          "J'ai un problème avec l'erreur : Notice: Trying to get property of non-object in"
        )
      )
    ).toBe(true);
    expect(filter.filter(fakeMessage("Ce matin j'ai mangé une banane"))).toBe(
      false
    );
  });

  it("envoie un message", () => {
    let message = fakeMessage(erroredMessage);
    filter.filter(message);
    expect(message.channel.send).toHaveBeenCalled();
  });
});
