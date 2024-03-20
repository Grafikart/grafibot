import type { Client, Presence } from "discord.js";
import { randomItem } from "../utils/array.ts";
import { adjectives, animals } from "../utils/dictionnary.ts";

/**
 * Evite les pseudonymes avec des caractères spéciaux
 */
export class NicknamesCleaner {
  static client: Client;

  static connect(client: Client) {
    this.client = client;
    this.client.on("presenceUpdate", this.cleanUsernames.bind(this));
  }

  static cleanUsernames(oldPresence: Presence | null, presence: Presence) {
    if (
      !presence.member ||
      oldPresence ||
      !this.needsCleaning(presence.member.displayName)
    ) {
      return;
    }
    const cleanedUsername = this.cleanUsername(presence.member.displayName);
    if (cleanedUsername !== presence.member.displayName) {
      presence.member.setNickname(cleanedUsername).catch(() => null);
      return;
    }
  }

  static cleanUsername(username: string) {
    const cleanUsername = username
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replaceAll("$", "S")
      .replaceAll("ø", "o")
      .replaceAll("Λ", "A")
      .replaceAll("Δ", "A")
      .replaceAll("Ξ", "E")
      .replace(/([^\w\-_ '.@|])/gi, "") // Retire les caractères spéciaux restants
      .replace(/^[^[^a-z]+/gi, "") // Retire les caractères spéciaux en début de chaine
      .replace(/[^a-z0-9]+$/gi, "") // Retire les - _ en fin de chaine
      .trim();
    if (cleanUsername === "") {
      return `${randomItem(animals)} ${randomItem(adjectives)}`;
    }
    return cleanUsername;
  }

  static needsCleaning(username: string): boolean {
    return /^[0-9]/.test(username) || /[^a-z0-9\-_ '.@|]/gi.test(username);
  }
}
