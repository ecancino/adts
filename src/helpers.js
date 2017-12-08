const log = require('better-log')
const bimap = require('crocks/pointfree/bimap')
const compose = require('crocks/helpers/compose')

const { displayCard, displayCards } = require('./deck')

const look = bimap(
  x => displayCard(x.option({})),
  displayCards
)
const show = compose(log, look)

module.exports = { show, log, look }
