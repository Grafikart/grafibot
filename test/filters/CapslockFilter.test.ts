import { CapslockFilter } from '../../src/filters'
import { expect, chai, fakeMessage } from '../helpers'

let filter = new CapslockFilter()

describe('CapslockFilter', () => {
  it('détecte les message en majuscule', () => {
    let message = fakeMessage('POURQUOI PERSONNE NE M\'AIDE !')
    expect(filter.filter(message)).to.be.true
    expect(message.channel.send).to.have.been.called.once
  })

  it('laisse passer les mentions', () => {
    let message = fakeMessage('<@123121231232133> ?')
    expect(filter.filter(message)).to.be.false
  })

  it('laisse passer les messages courts', () => {
    let message = fakeMessage('$_SESSION')
    expect(filter.filter(message)).to.be.false
  })
})
