const { deck, pickRandom } = require('./deck')
const { show } = require('./helpers')

const initialState = { seed: Date.now(), deck }

const game = pickRandom()
  .chain(pickRandom)
  .chain(pickRandom)
  .chain(pickRandom)
  .chain(pickRandom)
  .chain(pickRandom)
  .chain(pickRandom)
  .chain(pickRandom)
  .execWith(initialState)





show(game.deck)
