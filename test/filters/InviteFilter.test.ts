import { InviteFilter } from '../../src/filters'
import { expect, chai, fakeMessage } from '../helpers'
import MuteCommand from '../../src/commands/MuteCommand'

let mockMuteMember = jest.fn().mockImplementation(() => {
  return new Promise((resolve, reject) => {
    resolve()
  })
})
jest.mock('../../src/commands/MuteCommand', () => {
  return jest.fn().mockImplementation(() => {
    return {muteMember: mockMuteMember}
  })
})
let muteCommand = new MuteCommand()
let filter = new InviteFilter(muteCommand)

describe('InviteFilter', () => {
  beforeEach(() => {
    mockMuteMember.mockClear()
  })

  it('détecte les invitation discord', () => {
    expect(filter.filter(fakeMessage('Pour ce qui veulent mon groupe : https://discord.gg/jMwPGe'))).to.be.true
    expect(filter.filter(fakeMessage('Pour ce qui veulent mon groupe : https://discordapp.com/invite/rAuuD7Q'))).to.be.true
    expect(filter.filter(fakeMessage(`Pour ce qui veulent mon groupe : 
    
    https://discord.gg/jMwPGe`))).to.be.true
    expect(filter.filter(fakeMessage('notre bot prevention: https://discordapp.com/oauth2/authorize?client_id=579748008804089891&scope=bot&permissions=252928'))).to.be.true
    expect(filter.filter(fakeMessage('Notre bot Anti-Raid: https://discordapp.com/oauth2/authorize?client_id=451361230901346314&scope=bot&permissions=8'))).to.be.true
    expect(filter.filter(fakeMessage('Un message à propos de discord'))).to.be.false
  })

  it('mute l\'utilisateur', () => {
    expect(filter.filter(fakeMessage('Pour ce qui veulent mon groupe : https://discord.gg/jMwPGe'))).to.be.true
    expect(mockMuteMember.mock.calls.length).equal(1)
  })
})
