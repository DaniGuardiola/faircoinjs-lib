# FaircoinJS (faircoinjs-lib)

FaircoinJS is a fork of `bitcoinjs-lib` with Faircoin support.

Adapted and maintained by [@DaniGuardiola](https://github.com/DaniGuardiola).

## Features

### 100% compatible with `bitcoinjs-lib`

FaircoinJS is just an extension, so the original functionality from BitcoinJS is maintained. This means that it behaves exactly as the original library, but with extended capabilities to work with Faircoin.

### Testnet enabled

The Faircoin testnet network is included in the extension.

### Unit tested

The unit tests have been extended with Faircoin-specific tests.

## Usage

```javascript
import faircoin from 'faircoinjs-lib'

// or

const faircoin = require('faircoinjs-lib')
```

There are only two additions to `bitcoinjs-lib`:

### Networks

Two networks:

- `faircoin`: livenet Faircoin blockchain network
- `faircoin-testnet`: testnet network

Parameters obtained from: https://github.com/faircoin/faircoin/wiki/FairCoin-developer-notes

### FairBlock

A new `FairBlock` class has been introduced which extends the base `Block` class, because Faircoin blocks are slightly different than Bitcoin's or Litecoin's. The main changes are:

- `Block#calculateTarget()` and `Block#checkProofOfWork()` do not make sense in Faircoin and therefore will throw when attempted to use
- Hexadecimal block headers are different in Faircoin:
 - They don't have `bits` nor `nonce` (those are two parameters involved in Bitcoin's Proof of Work)  
 - They have `creatorId` (CVN id) and `hashPayload` (TODO: what exactly is hashPayload?)
 - Due to these changes, length is `108 bytes` instead of Bitcoin's `80 bytes` block headers

Everything else works exactly the same as with Bitcoin.

If your app supports both Bitcoin (or a Bitcoin-like coin) and Faircoin, you probably want to write this:

```js
// modern JS import
import { FairBlock, Block } from 'faircoinjs-lib'

// NodeJS classic
const { FairBlock, Block } = require('faircoinjs-lib')
```

If you're only implementing Faircoin, you could just write:

```js
// modern JS import
import { FairBlock: Block } from 'faircoinjs-lib'

// NodeJS classic
const { FairBlock: Block } = require('faircoinjs-lib')
```

## To do

- [ ] Add testnet network
- [ ] Add tests for larger blocks with transactions
- [ ] Add tests for faircoin transactions
- [ ] Add more tests for addresses
- [ ] Add faircoin-specific functionality
- [ ] Add tests for ECPair?
- [ ] Integration tests?
- [ ] Allow randombytes reimplementation (for example using a React Native library)

## Documentation

The Faircoin specific documentation has been explained above, the rest works exactly the same as `bitcoinjs-lib`.

The documentation for `bitcoinjs-lib` is available on Github [bitcoinjs/bitcoinjs-lib#v3.3.2](https://github.com/bitcoinjs/bitcoinjs-lib/tree/v3.3.2).