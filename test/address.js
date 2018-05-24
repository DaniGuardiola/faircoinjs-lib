/* global describe, it */

var assert = require('assert')

const faircoinjs = require('../main')

var baddress = faircoinjs.address
var networks = faircoinjs.networks
var bscript = faircoinjs.script
var fixtures = require('./fixtures/address.json')

describe('address', function () {
  describe('fromBase58Check', function () {
    fixtures.standard.forEach(function (f) {
      if (!f.base58check) return

      it('decodes ' + f.base58check, function () {
        var decode = baddress.fromBase58Check(f.base58check)

        assert.strictEqual(decode.version, f.version)
        assert.strictEqual(decode.hash.toString('hex'), f.hash)
      })
    })
  })

  describe('fromOutputScript', function () {
    fixtures.standard.forEach(function (f) {
      it('encodes ' + f.script.slice(0, 30) + '... (' + f.network + ')', function () {
        var script = bscript.fromASM(f.script)
        var address = baddress.fromOutputScript(script, networks[f.network])

        assert.strictEqual(address, f.base58check)
      })
    })
  })

  describe('toBase58Check', function () {
    fixtures.standard.forEach(function (f) {
      if (!f.base58check) return

      it('encodes ' + f.hash + ' (' + f.network + ')', function () {
        var address = baddress.toBase58Check(Buffer.from(f.hash, 'hex'), f.version)

        assert.strictEqual(address, f.base58check)
      })
    })
  })

  describe('toOutputScript', function () {
    fixtures.standard.forEach(function (f) {
      it('decodes ' + f.script.slice(0, 30) + '... (' + f.network + ')', function () {
        var script = baddress.toOutputScript(f.base58check, networks[f.network])

        assert.strictEqual(bscript.toASM(script), f.script)
      })
    })
  })
})
