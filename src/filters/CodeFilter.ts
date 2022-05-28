import { Message } from "discord.js";
import { IFilter } from "../interfaces";
import { sendDMorReply } from "../utils/helpers";

export default class CodeFilter implements IFilter {
  filter(message: Message) {
    if (
      message.content &&
      message.content.split("\n").length > 40 &&
      (message.content.match(/([\{\}\[\]$;])/gm)?.length ?? 0) > 3
    ) {
      sendDMorReply(
        message,
        `:space_invader: Woops trop de code ! Merci d'utiliser ce service de partage de code : https://paste.mozilla.org/ si tu veux plus d'aide.

Pour rappel voila le message que tu as essayé d'envoyer :

\`\`\`
${message.cleanContent}
\`\`\``
      )
        .catch()
        .then(() => message.delete())
        .catch();
      return true;
    }
    return false;
  }
}
