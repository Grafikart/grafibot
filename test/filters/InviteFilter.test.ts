import { InviteFilter } from '../../src/filters'
import { fakeMessage } from '../helpers'
import MuteCommand from '../../src/commands/MuteCommand'

let muteCommand = {
  muteMember: jest.fn().mockImplementation(() => Promise.resolve())
}
let filter = new InviteFilter(muteCommand)

describe('InviteFilter', () => {
  it('détecte les invitation discord', () => {
    expect(
      filter.filter(
        fakeMessage(
          'Pour ce qui veulent mon groupe : https://discord.gg/jMwPGe'
        )
      )
    ).toBe(true)
    expect(
      filter.filter(
        fakeMessage(
          'Pour ce qui veulent mon groupe : https://discordapp.com/invite/rAuuD7Q'
        )
      )
    ).toBe(true)
    expect(
      filter.filter(
        fakeMessage(`Pour ce qui veulent mon groupe : 
    
    https://discord.gg/jMwPGe`)
      )
    ).toBe(true)
    expect(
      filter.filter(
        fakeMessage(
          'notre bot prevention: https://discordapp.com/oauth2/authorize?client_id=579748008804089891&scope=bot&permissions=252928'
        )
      )
    ).toBe(true)
    expect(
      filter.filter(
        fakeMessage(
          'Notre bot Anti-Raid: https://discordapp.com/oauth2/authorize?client_id=451361230901346314&scope=bot&permissions=8'
        )
      )
    ).toBe(true)
    expect(filter.filter(fakeMessage('Un message à propos de discord'))).toBe(
      false
    )
  })

  it("mute l'utilisateur", () => {
    expect(
      filter.filter(
        fakeMessage(
          'Pour ce qui veulent mon groupe : https://discord.gg/jMwPGe'
        )
      )
    ).toBe(true)
    expect(muteCommand.muteMember).toHaveBeenCalledTimes(1)
  })
})
