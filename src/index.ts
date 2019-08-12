import * as dotenv from 'dotenv'
import Bot from './Bot'
import { MuteCommand, HelpCommand, RoleCommand, RolesCommand, CleanCommand, QuickCommand, BanCommand } from './commands'
import { Client } from 'discord.js'
import { roles, syntax } from './config'
import Logger from './utils/Logger'
import {
  CapslockFilter,
  ChocopainFilter,
  ErrorsFilter,
  // InsultFilter,
  // QuestionFilter,
  CodeFilter,
  SyntaxFilter,
  InviteFilter
} from './filters'
import Premium from './tasks/Premium'
import RSS from './tasks/RSS'
import sqlite3 from 'sqlite3'
import { ReportCommand } from './reactions'

dotenv.config()

const db = new sqlite3.Database('db.sqlite')
const client = new Client()
const logger = new Logger(client)
Premium.connect(client, logger)
RSS.connect(client)
const bot = new Bot(client, process.env.API_KEY)
const muteCommand = new MuteCommand(db, client, logger)
bot
  .addCommand(new BanCommand(logger))
  .addCommand(muteCommand)
  .addCommand(new RolesCommand(roles))
  .addCommand(new RoleCommand(roles))
  .addCommand(new CleanCommand(logger))
  .addCommand(new QuickCommand(
    'php',
    'Permet de renvoyer un utilisateur vers la doc de php (!php @user strpos)',
    ':mag: @user Je pense que cette fonction devrait t\'aider http://php.net/search.php?show=quickref&pattern=@content'
  ))
  .addCommand(new QuickCommand(
    'grafikart',
    'Permet de renvoyer un utilisateur vers un tutoriel grafikart (!grafikart @user rsync)',
    ':mag: @user Il y a sûrement déjà un tutoriel sur le sujet https://www.grafikart.fr/search?q=@content'
  ))
  .addCommand(new QuickCommand(
    'code',
    'Permet d\'indiquer à un utilisateur comment mieux poster sa question, ex: "!code @Grafikart#1849"',
    ':robot: N\'hésite pas à mieux décrire ton problème @user. Si tu le souhaite tu peux utiliser ce paste : \n https://paste.artemix.org/'
  ))
  .addCommand(new HelpCommand(bot.commands))
  .addReactionCommand(new ReportCommand(logger))
  .addFilter(new CapslockFilter())
  .addFilter(new ChocopainFilter())
  .addFilter(new ErrorsFilter())
  // .addFilter(new InsultFilter())
  // .addFilter(new QuestionFilter())
  .addFilter(new CodeFilter())
  .addFilter(new SyntaxFilter(syntax))
  .addFilter(new InviteFilter(muteCommand))
  .connect()
  .catch(function (e: string) {
    console.error(e)
  })
