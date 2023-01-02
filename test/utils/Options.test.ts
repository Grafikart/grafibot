import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { Options } from '../../src/utils/Options'

describe('Cache', () => {

  beforeAll(() => {
    Options.memory = true
  })

  beforeEach(() => {
    Options.clear()
  })

  afterAll(() => {
    Options.memory = false
  })

  it('should return default value', () => {
    expect(Options.get('date')).toBe(null)
    expect(Options.get('date', 20)).toBe(20)
  })

  it('should return the value set previously', () => {
    Options.set('date', 10)
    expect(Options.get('date', 20)).toBe(10)
  })

})
