import { ChocopainFilter } from '../../src/filters'
import { expect, chai, fakeMessage } from '../helpers'

let filter = new ChocopainFilter()

describe('ChocopainFilter', () => {
  it('détecte les chocopains', () => {
    expect(filter.filter(fakeMessage('Ce matin j\'ai mangé un pain au chocolat il était délicieux'))).to.be.true
    expect(filter.filter(fakeMessage('J\'aime les chocolatines au chocolat !'))).to.be.true
    expect(filter.filter(fakeMessage('J\'aime les chocopains'))).to.be.false
  })

})
