import { IFilter, ILogger } from '../interfaces'
import { Message, MessageReaction, TextChannel } from 'discord.js'
import flru from 'flru'
import { append } from '../utils/list'

/**
 * Filtre pour éviter les raids (plusieurs utilisateurs qui spam des messages en simultané)
 */
export class RaidFilter implements IFilter {
  private limit = 3 // Nombre de message
  private interval = 5 // Intervalle (en seconde)
  private cache = flru(50) // Nombre d'utilisateur à suivre en parallèle
  private voteThreshold = 5 // Quantité de vote qui déclenche le ban
  private logger: ILogger
  private locked = false
  private voteDuration = 10000

  constructor (logger: ILogger) {
    this.logger = logger
  }

  filter (message: Message): boolean {
    const timeStampList = append(
      this.cache.get(message.author.id) ?? [],
      message.createdTimestamp / 1000,
      this.limit
    )
    if (timeStampList.length >= this.limit) {
      const delay = timeStampList[timeStampList.length - 1] - timeStampList[0]
      if (delay < this.interval && !this.locked) {
        this.startVerification(message).catch(console.error)
        return true
      }
    }
    this.cache.set(message.author.id, timeStampList)
    return false
  }

  /**
   * Lance le processus de vérification de l'utilisateur avec un vote
   */
  private async startVerification (message: Message) {
    this.locked = true
    try {
      const channel = message.channel as TextChannel
      // On bloque la possibilité d'écrire sur le salon
      await channel
        .updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: false })
        .catch(console.error)
      if (!channel.name.includes('🔒')) {
        channel.setName(`🔒-${channel.name}`).catch(console.error)
      }
      // On lance le vote
      const reply = await message.reply(
        'a posté trop de message rapidement. Est-ce un bot ? Oui 🇴 / Non : 🇳'
      )
      reply.react('🇴').catch(console.error)
      reply.react('🇳').catch(console.error)
      const timer = setTimeout(() => {
        channel.client.off('messageReactionAdd', listener)
        this.endVerification(reply)
      }, this.voteDuration)
      const listener = (reaction: MessageReaction) => {
        if (
          reaction.emoji.name === '🇴' &&
          reaction.count >= this.voteThreshold &&
          reaction.message.id === reply.id
        ) {
          this.ban(message)
          this.endVerification(reply)
          clearTimeout(timer)
          channel.client.off('messageReactionAdd', listener)
        }
      }
      channel.client.on('messageReactionAdd', listener)
    } catch (e) {
      this.locked = false
    }
  }

  /**
   * Banni l'utilisateur associé au message
   */
  private ban (message: Message) {
    this.logger.log(
      `Ban pour raid ${message.author.toString()} : \n\n ${message.content}`
    )
    message.author
      .send(
        "Votre compte a été banni du serveur **Grafikart** en raison d'un nombre trop important de messages à la suite. En cas d'erreur vous pouvez le signaler par email https://grafikart.fr/contact"
      )
      .catch(() => null)
    message.guild.members
      .ban(message.author, {
        days: 1,
        reason: `Raid "${message.content}"`
      })
      .catch(console.error)
  }

  /**
   * On termine le processus de vérification en nettoyant ce qui a été fait avant
   */
  private async endVerification (message: Message) {
    this.locked = false
    try {
      await message.delete()
      const channel = message.channel as TextChannel
      channel.setName(channel.name.replace('🔒-', '')).catch(console.error)
      channel
        .updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: null })
        .catch(console.error)
    } catch (e) {
      console.error(e)
    }
  }
}
