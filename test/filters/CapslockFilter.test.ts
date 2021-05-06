import { CapslockFilter } from '../../src/filters'
import { fakeMessage } from '../helpers'

let filter = new CapslockFilter()

describe('CapslockFilter', () => {
  it('détecte les message en majuscule', () => {
    let message = fakeMessage("POURQUOI PERSONNE NE M'AIDE !")
    expect(filter.filter(message)).toBe(true)
    expect(message.channel.send).toHaveBeenCalled()
  })

  it('laisse passer les mentions', () => {
    let message = fakeMessage('<@123121231232133> ?')
    expect(filter.filter(message)).toBe(false)
  })

  it('laisse passer les messages courts', () => {
    let message = fakeMessage('$_SESSION')
    expect(filter.filter(message)).toBe(false)
  })
})
