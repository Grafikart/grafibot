import * as dotenv from "dotenv";
import Bot from "./Bot";
import {
  MuteCommand,
  HelpCommand,
  CleanCommand,
  QuickCommand,
  BanCommand,
} from "./commands";
import { Client, GatewayIntentBits } from "discord.js";
import Logger from "./utils/Logger";
import {
  CapslockFilter,
  ChocopainFilter,
  ErrorsFilter,
  RegleFilter,
  DontAskFilter,
  CodeFilter,
  InviteFilter,
  LmgtfyFilter,
} from "./filters";
import { Premium } from "./tasks/Premium";
import { RSS } from "./tasks/RSS";
import {
  JeSaisToutCommand,
  ReportCommand,
  SecCommand,
  RuleCommand,
} from "./reactions";
import { RaidFilter } from "./filters/RaidFilter";
import { NicknamesCleaner } from "./tasks/NicknamesCleaner";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
});
const logger = new Logger(client);
Premium.connect(client, logger);
RSS.connect(client);
NicknamesCleaner.connect(client);
const bot = new Bot(client, process.env["API_KEY"]);
bot
  .addCommand(new BanCommand(logger))
  .addCommand(new MuteCommand(logger))
  .addCommand(new CleanCommand(logger))
  .addCommand(
    new QuickCommand(
      "php",
      "Permet de renvoyer un utilisateur vers la doc de php (!php @user strpos)",
      ":mag: @user Je pense que cette fonction devrait t'aider http://php.net/search.php?show=quickref&pattern=@url:content",
    ),
  )
  .addCommand(
    new QuickCommand(
      "grafikart",
      "Permet de renvoyer un utilisateur vers un tutoriel grafikart (!grafikart @user rsync)",
      ":mag: @user Il y a sûrement déjà un tutoriel sur le sujet https://grafikart.fr/recherche?q=@url:content",
    ),
  )
  .addCommand(
    new QuickCommand(
      "code",
      'Permet d\'indiquer à un utilisateur comment mieux poster sa question, ex: "!code @Grafikart#1849"',
      ":robot: N'hésite pas à mieux décrire ton problème @user. Si tu le souhaite tu peux utiliser ce service de partage de code : \n https://paste.mozilla.org/",
    ),
  )
  .addCommand(new HelpCommand(bot.commands))
  .addReactionCommand(new ReportCommand(logger))
  .addReactionCommand(new SecCommand())
  .addReactionCommand(new JeSaisToutCommand())
  .addReactionCommand(new RuleCommand(logger))
  .addFilter(new CapslockFilter())
  .addFilter(new ChocopainFilter())
  .addFilter(new ErrorsFilter())
  .addFilter(new RegleFilter())
  .addFilter(new DontAskFilter())
  .addFilter(new LmgtfyFilter())
  .addFilter(new CodeFilter())
  .addFilter(new InviteFilter())
  .addFilter(new RaidFilter(logger))
  .connect()
  .catch(function (e: string) {
    console.error(e);
  });
