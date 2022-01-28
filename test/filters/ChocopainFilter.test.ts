import { ChocopainFilter } from '../../src/filters/index.js'
import { fakeMessage } from '../helpers'

let filter = new ChocopainFilter()

describe('ChocopainFilter', () => {
  it('détecte les chocopains', () => {
    expect(
      filter.filter(
        fakeMessage(
          "Ce matin j'ai mangé un pain au chocolat il était délicieux"
        )
      )
    ).toBe(true)
    expect(
      filter.filter(fakeMessage("J'aime les chocolatines au chocolat !"))
    ).toBe(true)
    expect(filter.filter(fakeMessage("J'aime les chocopains"))).toBe(false)
  })
})
