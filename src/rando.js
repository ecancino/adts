const { get, modify } = require('crocks/State')
const assign = require('crocks/helpers/assign')
const compose = require('crocks/helpers/compose')
const objOf = require('crocks/helpers/objOf')
const option = require('crocks/pointfree/option')
const prop = require('crocks/Maybe/prop')

// getKey : (Str, a) -> () -> State s a
const getKey = (key, def) => () => get(compose(option(def), prop(key)))
// putKey : Str -> a -> State s ()
const putKey = key => compose(modify, assign, objOf(key))
// newSeed : Int -> Int
const newSeed = seed => (1103515245 * seed + 12345) & 0x7fffffff
// calcValue : Int -> Float
const calcValue = seed => (seed >>> 16) / 0x7fff
// getSeed : () -> State GameState Int
const getSeed = getKey('seed', { seed: 0 })
// putSeed :  Int -> State GameState ()
const putSeed = putKey('seed')
// genSeed : () -> State GameState ()
const genSeed = () => getSeed().map(newSeed).chain(putSeed)
// evaluate : () -> State GameState Float
const evaluate = () => getSeed().map(calcValue)
// pullRandom : () -> State GameState Float
const pullRandom = () => genSeed().chain(evaluate)

module.exports = { pullRandom, getKey, putKey }
