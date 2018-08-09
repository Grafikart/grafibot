import { TextChannel } from 'discord.js'
import { ILogger } from '../interfaces'

export default class Logger implements ILogger {

  private _channel: TextChannel

  set channel (channel: TextChannel) {
    this._channel = channel
  }

  async log (message: string) {
    if (this._channel) {
      return this._channel.send(message)
    }
    return
  }

}
