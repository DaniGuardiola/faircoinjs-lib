/* global describe, it, beforeEach */

var assert = require('assert')
const { FairBlock } = require('../main')

var fixtures = require('./fixtures/fairblock')

describe('FairBlock', function () {
  describe('version', function () {
    it('should be interpreted as an int32le', function () {
      var blockHex = 'ffffffff00000000000000000000000000000000000000000000000000000000000000004141414141414141414141414141414141414141414141414141414141414141f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2010000000200000000'
      var block = FairBlock.fromHex(blockHex)
      assert.equal(-1, block.version)
      assert.equal(1, block.timestamp)
    })
  })

  describe('calculateTarget', function () {
    it('throws (does not make sense on Faircoin)', function () {
      assert.throws(() => FairBlock.calculateTarget(), 'Faircoin does not support Proof of Work')
    })
  })

  describe('fromBuffer/fromHex', function () {
    fixtures.valid.forEach(function (f) {
      it('imports ' + f.description, function () {
        var block = FairBlock.fromHex(f.hex)

        assert.strictEqual(block.version, f.version)
        assert.strictEqual(block.prevHash.toString('hex'), f.prevHash)
        assert.strictEqual(block.merkleRoot.toString('hex'), f.merkleRoot)
        assert.strictEqual(block.hashPayload.toString('hex'), f.hashPayload)
        assert.strictEqual(block.timestamp, f.timestamp)
        assert.strictEqual(!block.transactions, f.hex.length === 216)
      })
    })

    fixtures.invalid.forEach(function (f) {
      it('throws on ' + f.exception, function () {
        assert.throws(function () {
          FairBlock.fromHex(f.hex)
        }, new RegExp(f.exception))
      })
    })
  })

  describe('toBuffer/toHex', function () {
    fixtures.valid.forEach(function (f) {
      var block

      beforeEach(function () {
        block = FairBlock.fromHex(f.hex)
      })

      it('exports ' + f.description, function () {
        assert.strictEqual(block.toHex(true), f.hex.slice(0, 216))
        assert.strictEqual(block.toHex(), f.hex)
      })
    })
  })

  describe('getHash/getId', function () {
    fixtures.valid.forEach(function (f) {
      var block

      beforeEach(function () {
        block = FairBlock.fromHex(f.hex)
      })

      it('returns ' + f.id + ' for ' + f.description, function () {
        assert.strictEqual(block.getHash().toString('hex'), f.hash)
        assert.strictEqual(block.getId(), f.id)
      })
    })
  })

  describe('getUTCDate', function () {
    fixtures.valid.forEach(function (f) {
      var block

      beforeEach(function () {
        block = FairBlock.fromHex(f.hex)
      })

      it('returns UTC date of ' + f.id, function () {
        var utcDate = block.getUTCDate().getTime()

        assert.strictEqual(utcDate, f.timestamp * 1e3)
      })
    })
  })

  describe('calculateMerkleRoot', function () {
    it('should throw on zero-length transaction array', function () {
      assert.throws(function () {
        FairBlock.calculateMerkleRoot([])
      }, /Cannot compute merkle root for zero transactions/)
    })

    fixtures.valid.forEach(function (f) {
      if (f.hex.length === 216) return

      var block

      beforeEach(function () {
        block = FairBlock.fromHex(f.hex)
      })

      it('returns ' + f.merkleRoot + ' for ' + f.id, function () {
        assert.strictEqual(FairBlock.calculateMerkleRoot(block.transactions).toString('hex'), f.merkleRoot)
      })
    })
  })

  describe('checkMerkleRoot', function () {
    fixtures.valid.forEach(function (f) {
      if (f.hex.length === 216) return

      var block

      beforeEach(function () {
        block = FairBlock.fromHex(f.hex)
      })

      it('returns ' + f.valid + ' for ' + f.id, function () {
        assert.strictEqual(block.checkMerkleRoot(), true)
      })
    })
  })

  describe('checkProofOfWork', function () {
    it('throws (does not make sense on Faircoin)', function () {
      assert.throws(() => new FairBlock().checkProofOfWork(), 'Faircoin does not support Proof of Work')
    })
  })
})
