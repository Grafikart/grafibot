import {existsSync, writeFileSync, readFileSync} from 'fs'

type OptionValue = string | number

const path = './storage/options.json'

export class Options {

  static memory = false
  static initialized = false
  static data: Record<string, OptionValue> = {}

  static get (key: string, defaultValue?: OptionValue) {
    if (!this.initialized) {
      this.initialize()
    }
    return this.data[key] ?? defaultValue ?? null
  }

  static set (key: string, value: OptionValue) {
    if (!this.initialized) {
      this.initialize()
    }
    this.data[key] = value
    this.persist()
  }

  static clear () {
    this.data = {}
  }

  private static initialize () {
    this.initialized = true
    if (!this.memory) {
      if (!existsSync(path)) {
        writeFileSync(path, '{}')
      }
      this.data = JSON.parse(readFileSync(path).toLocaleString());
    }
    this.data = {}
  }

  private static persist () {
    if (!this.memory) {
      writeFileSync(path, JSON.stringify(this.data))
    }
  }

}
