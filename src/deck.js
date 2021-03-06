const Pair = require('crocks/Pair')
const Last = require('crocks/Last')

const assign = require('crocks/helpers/assign')
const chain = require('crocks/pointfree/chain')
const liftA2 = require('crocks/helpers/liftA2')
const map = require('crocks/pointfree/map')
const safe = require('crocks/Maybe/safe')
const isDefined = require('crocks/predicates/isDefined')

const { pullRandom, getKey, putKey } = require('./rando')

const suits = [
  { suit: '♠', color: 'dark' },
  { suit: '♣', color: 'dark' },
  { suit: '♥', color: 'light' },
  { suit: '♦', color: 'light' },
]

const values = [
  { value: 1, face: 'A' },
  { value: 2, face: '2' },
  { value: 3, face: '3' },
  { value: 4, face: '4' },
  { value: 5, face: '5' },
  { value: 6, face: '6' },
  { value: 7, face: '7' },
  { value: 8, face: '8' },
  { value: 9, face: '9' },
  { value: 10, face: '10' },
  { value: 11, face: 'J' },
  { value: 12, face: 'Q' },
  { value: 13, face: 'K' },
]

// Card : { value: Int, face: Str, suit: Str, color: Str }
// Deck : Pair (Last Card) [ Card ]

// deck : Deck
const deck = Pair( Last.empty(), liftA2(assign, suits, values) )
// displayCard : Card -> String
const displayCard = ({ face, suit }) => `${face}${suit}`
// displayCards : [ Card ] -> [ String ]
const displayCards = map(displayCard)
// emptyDeck : Deck
const emptyDeck = () => Pair(Last.empty(), [])
// getDeck : State GameState Deck
const getDeck = getKey('deck', { deck: emptyDeck() })
// putDeck : State GameState ()
const putDeck = putKey('deck')
// limitTo : Float -> Int -> Int
const limitTo = rn => limit => (rn * limit) | 0
// isValid : a -> Maybe a
const isValid = safe(isDefined)
// deckLength : Deck -> Int
const deckLength = deck => deck.snd().length
// drawCardAt : Int -> [ Card ] -> Deck
const drawCardAt = idx => cs => Pair(
  Last(isValid(cs[idx])),
  cs.slice(0, idx).concat(cs.slice(idx + 1))
)
// getLength : () -> State GameState Int
const getLength = () => getDeck().map(deckLength)
// limit : Float -> State GameState Int
const limit = rn => getLength().map(limitTo(rn))
// drawCard : Int -> State GameState ()
const drawCard = idx => getDeck().map(chain(drawCardAt(idx))).chain(putDeck)
// pickRandom : () => State GameState Int
const pickRandom = () => pullRandom().chain(limit).chain(drawCard)

module.exports = { pickRandom, deck, displayCard, displayCards }
