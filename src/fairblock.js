const { Block, Transaction } = require('bitcoinjs-lib')
const varuint = require('varuint-bitcoin')

class FairBlock extends Block {
  constructor () {
    super()
    // remove proof of work logic
    delete this.bits
    delete this.nonce
    // add proof of cooperation logic
    this.hashPayload = null
    this.creatorId = null
  }

  static calculateTarget () {
    throw new Error('Faircoin does not support Proof of Work')
  }

  checkProofOfWork () {
    throw new Error('Faircoin does not support Proof of Work')
  }

  static fromHex (hex) {
    return FairBlock.fromBuffer(Buffer.from(hex, 'hex'))
  }

  static fromBuffer (buffer) {
    if (buffer.length < 108) throw new Error('Buffer too small (< 108 bytes)')

    var offset = 0
    function readSlice (n) {
      offset += n
      return buffer.slice(offset - n, offset)
    }

    function readUInt32 () {
      var i = buffer.readUInt32LE(offset)
      offset += 4
      return i
    }

    function readInt32 () {
      var i = buffer.readInt32LE(offset)
      offset += 4
      return i
    }

    var block = new FairBlock()
    block.version = readInt32()
    block.prevHash = readSlice(32)
    block.merkleRoot = readSlice(32)
    block.hashPayload = readSlice(32)
    block.timestamp = readUInt32()
    block.creatorId = readUInt32()

    if (buffer.length === 108) return block

    function readVarInt () {
      var vi = varuint.decode(buffer, offset)
      offset += varuint.decode.bytes
      return vi
    }

    function readTransaction () {
      var tx = Transaction.fromBuffer(buffer.slice(offset), true)
      offset += tx.byteLength()
      return tx
    }

    var nTransactions = readVarInt()
    block.transactions = []

    for (var i = 0; i < nTransactions; ++i) {
      var tx = readTransaction()
      block.transactions.push(tx)
    }

    return block
  }

  // TODO: buffer, offset compatibility
  toBuffer (headersOnly) {
    var buffer = Buffer.allocUnsafe(this.byteLength(headersOnly))

    var offset = 0
    function writeSlice (slice) {
      slice.copy(buffer, offset)
      offset += slice.length
    }

    function writeInt32 (i) {
      buffer.writeInt32LE(i, offset)
      offset += 4
    }
    function writeUInt32 (i) {
      buffer.writeUInt32LE(i, offset)
      offset += 4
    }

    writeInt32(this.version)
    writeSlice(this.prevHash)
    writeSlice(this.merkleRoot)
    writeSlice(this.hashPayload)
    writeUInt32(this.timestamp)
    writeUInt32(this.creatorId)

    if (headersOnly || !this.transactions) return buffer

    varuint.encode(this.transactions.length, buffer, offset)
    offset += varuint.encode.bytes

    this.transactions.forEach(function (tx) {
      var txSize = tx.byteLength() // TODO: extract from toBuffer?
      tx.toBuffer(buffer, offset)
      offset += txSize
    })

    return buffer
  }

  byteLength (headersOnly) {
    if (headersOnly || !this.transactions) return 108

    return 108 + varuint.encodingLength(this.transactions.length) + this.transactions.reduce(function (a, x) {
      return a + x.byteLength()
    }, 0)
  }
}

module.exports = FairBlock
