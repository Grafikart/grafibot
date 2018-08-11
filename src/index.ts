import * as dotenv from 'dotenv'
import Bot from './Bot'
import { HelpCommand, RoleCommand, RolesCommand, CleanCommand } from './commands'
import { Client } from 'discord.js'
import { roles, syntax } from './config'
import Logger from './utils/Logger'
import { MentionFilter, CapslockFilter, ChocopainFilter, ErrorsFilter, InsultFilter, QuestionFilter, CodeFilter, SyntaxFilter } from './filters'
import Premium from './tasks/Premium'
import RSS from './tasks/RSS'

dotenv.config()

const client = new Client()
const logger = new Logger(client)
Premium.connect(client)
RSS.connect(client)
const bot = new Bot(client, process.env.API_KEY)
bot
  .addCommand(new HelpCommand(bot.commands))
  .addCommand(new RolesCommand(roles))
  .addCommand(new RoleCommand(roles))
  .addCommand(new CleanCommand(logger))
  .addFilter(new CapslockFilter())
  .addFilter(new ChocopainFilter())
  .addFilter(new ErrorsFilter())
  .addFilter(new InsultFilter())
  .addFilter(new QuestionFilter())
  .addFilter(new CodeFilter())
  .addFilter(new MentionFilter())
  .addFilter(new SyntaxFilter(syntax))
  .connect()
  .catch(function (e) {
    console.error(e)
  })
