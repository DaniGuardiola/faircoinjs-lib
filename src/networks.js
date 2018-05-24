// network parameters:
// https://github.com/faircoin/faircoin/wiki/FairCoin-developer-notes

module.exports = {
  faircoin: {
    messagePrefix: '\x18Faircoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x5f,
    scriptHash: 0x24,
    wif: 0xdf
  }
  // TODO: testnet
}
