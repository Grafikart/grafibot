import * as dotenv from 'dotenv'
import Bot from './Bot'
import { HelpCommand, RoleCommand, RolesCommand, CleanCommand } from './commands'
import { Client, TextChannel } from 'discord.js'
import { loggerId, roles, syntax } from './config'
import Logger from './utils/Logger'
import { MentionFilter, CapslockFilter, ChocopainFilter, ErrorsFilter, InsultFilter, QuestionFilter, CodeFilter, SyntaxFilter } from './filters'

dotenv.config()

const logger = new Logger()
const client = new Client()

// On cherche le channel "log"
client.on('ready', function () {
  let channel = client.channels.find('id', loggerId) as TextChannel
  if (channel) {
    logger.channel = channel
  }
})

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
