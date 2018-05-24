const bitcoinjs = require('bitcoinjs-lib')

const faircoinNetworks = require('./src/networks')
const FairBlock = require('./src/fairblock')

// adding Faircoin networks
Object.assign(bitcoinjs.networks, faircoinNetworks)

// adding Faircoin Block
Object.assign(bitcoinjs, { FairBlock })

module.exports = bitcoinjs
