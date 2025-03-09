/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@colyseus/msgpackr/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@colyseus/msgpackr/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALWAYS: () => (/* reexport safe */ _pack_js__WEBPACK_IMPORTED_MODULE_0__.ALWAYS),
/* harmony export */   C1: () => (/* reexport safe */ _unpack_js__WEBPACK_IMPORTED_MODULE_1__.C1),
/* harmony export */   DECIMAL_FIT: () => (/* reexport safe */ _pack_js__WEBPACK_IMPORTED_MODULE_0__.DECIMAL_FIT),
/* harmony export */   DECIMAL_ROUND: () => (/* reexport safe */ _pack_js__WEBPACK_IMPORTED_MODULE_0__.DECIMAL_ROUND),
/* harmony export */   Decoder: () => (/* reexport safe */ _unpack_js__WEBPACK_IMPORTED_MODULE_1__.Decoder),
/* harmony export */   Encoder: () => (/* reexport safe */ _pack_js__WEBPACK_IMPORTED_MODULE_0__.Encoder),
/* harmony export */   FLOAT32_OPTIONS: () => (/* reexport safe */ _unpack_js__WEBPACK_IMPORTED_MODULE_1__.FLOAT32_OPTIONS),
/* harmony export */   NEVER: () => (/* reexport safe */ _pack_js__WEBPACK_IMPORTED_MODULE_0__.NEVER),
/* harmony export */   Packr: () => (/* reexport safe */ _pack_js__WEBPACK_IMPORTED_MODULE_0__.Packr),
/* harmony export */   RESERVE_START_SPACE: () => (/* reexport safe */ _pack_js__WEBPACK_IMPORTED_MODULE_0__.RESERVE_START_SPACE),
/* harmony export */   RESET_BUFFER_MODE: () => (/* reexport safe */ _pack_js__WEBPACK_IMPORTED_MODULE_0__.RESET_BUFFER_MODE),
/* harmony export */   REUSE_BUFFER_MODE: () => (/* reexport safe */ _pack_js__WEBPACK_IMPORTED_MODULE_0__.REUSE_BUFFER_MODE),
/* harmony export */   Unpackr: () => (/* reexport safe */ _unpack_js__WEBPACK_IMPORTED_MODULE_1__.Unpackr),
/* harmony export */   addExtension: () => (/* reexport safe */ _pack_js__WEBPACK_IMPORTED_MODULE_0__.addExtension),
/* harmony export */   clearSource: () => (/* reexport safe */ _unpack_js__WEBPACK_IMPORTED_MODULE_1__.clearSource),
/* harmony export */   decode: () => (/* reexport safe */ _unpack_js__WEBPACK_IMPORTED_MODULE_1__.decode),
/* harmony export */   decodeIter: () => (/* reexport safe */ _iterators_js__WEBPACK_IMPORTED_MODULE_2__.decodeIter),
/* harmony export */   encode: () => (/* reexport safe */ _pack_js__WEBPACK_IMPORTED_MODULE_0__.encode),
/* harmony export */   encodeIter: () => (/* reexport safe */ _iterators_js__WEBPACK_IMPORTED_MODULE_2__.encodeIter),
/* harmony export */   isNativeAccelerationEnabled: () => (/* reexport safe */ _unpack_js__WEBPACK_IMPORTED_MODULE_1__.isNativeAccelerationEnabled),
/* harmony export */   mapsAsObjects: () => (/* binding */ mapsAsObjects),
/* harmony export */   pack: () => (/* reexport safe */ _pack_js__WEBPACK_IMPORTED_MODULE_0__.pack),
/* harmony export */   roundFloat32: () => (/* reexport safe */ _unpack_js__WEBPACK_IMPORTED_MODULE_1__.roundFloat32),
/* harmony export */   unpack: () => (/* reexport safe */ _unpack_js__WEBPACK_IMPORTED_MODULE_1__.unpack),
/* harmony export */   unpackMultiple: () => (/* reexport safe */ _unpack_js__WEBPACK_IMPORTED_MODULE_1__.unpackMultiple),
/* harmony export */   useRecords: () => (/* binding */ useRecords)
/* harmony export */ });
/* harmony import */ var _pack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pack.js */ "./node_modules/@colyseus/msgpackr/pack.js");
/* harmony import */ var _unpack_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./unpack.js */ "./node_modules/@colyseus/msgpackr/unpack.js");
/* harmony import */ var _iterators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./iterators.js */ "./node_modules/@colyseus/msgpackr/iterators.js");



const useRecords = false
const mapsAsObjects = true


/***/ }),

/***/ "./node_modules/@colyseus/msgpackr/iterators.js":
/*!******************************************************!*\
  !*** ./node_modules/@colyseus/msgpackr/iterators.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decodeIter: () => (/* binding */ decodeIter),
/* harmony export */   encodeIter: () => (/* binding */ encodeIter),
/* harmony export */   packIter: () => (/* binding */ packIter),
/* harmony export */   unpackIter: () => (/* binding */ unpackIter)
/* harmony export */ });
/* harmony import */ var _pack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pack.js */ "./node_modules/@colyseus/msgpackr/pack.js");
/* harmony import */ var _unpack_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./unpack.js */ "./node_modules/@colyseus/msgpackr/unpack.js");



/**
 * Given an Iterable first argument, returns an Iterable where each value is packed as a Buffer
 * If the argument is only Async Iterable, the return value will be an Async Iterable.
 * @param {Iterable|Iterator|AsyncIterable|AsyncIterator} objectIterator - iterable source, like a Readable object stream, an array, Set, or custom object
 * @param {options} [options] - msgpackr pack options
 * @returns {IterableIterator|Promise.<AsyncIterableIterator>}
 */
function packIter (objectIterator, options = {}) {
  if (!objectIterator || typeof objectIterator !== 'object') {
    throw new Error('first argument must be an Iterable, Async Iterable, or a Promise for an Async Iterable')
  } else if (typeof objectIterator[Symbol.iterator] === 'function') {
    return packIterSync(objectIterator, options)
  } else if (typeof objectIterator.then === 'function' || typeof objectIterator[Symbol.asyncIterator] === 'function') {
    return packIterAsync(objectIterator, options)
  } else {
    throw new Error('first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a Promise')
  }
}

function * packIterSync (objectIterator, options) {
  const packr = new _pack_js__WEBPACK_IMPORTED_MODULE_0__.Packr(options)
  for (const value of objectIterator) {
    yield packr.pack(value)
  }
}

async function * packIterAsync (objectIterator, options) {
  const packr = new _pack_js__WEBPACK_IMPORTED_MODULE_0__.Packr(options)
  for await (const value of objectIterator) {
    yield packr.pack(value)
  }
}

/**
 * Given an Iterable/Iterator input which yields buffers, returns an IterableIterator which yields sync decoded objects
 * Or, given an Async Iterable/Iterator which yields promises resolving in buffers, returns an AsyncIterableIterator.
 * @param {Iterable|Iterator|AsyncIterable|AsyncIterableIterator} bufferIterator
 * @param {object} [options] - unpackr options
 * @returns {IterableIterator|Promise.<AsyncIterableIterator}
 */
function unpackIter (bufferIterator, options = {}) {
  if (!bufferIterator || typeof bufferIterator !== 'object') {
    throw new Error('first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a promise')
  }

  const unpackr = new _unpack_js__WEBPACK_IMPORTED_MODULE_1__.Unpackr(options)
  let incomplete
  const parser = (chunk) => {
    let yields
    // if there's incomplete data from previous chunk, concatinate and try again
    if (incomplete) {
      chunk = Buffer.concat([incomplete, chunk])
      incomplete = undefined
    }

    try {
      yields = unpackr.unpackMultiple(chunk)
    } catch (err) {
      if (err.incomplete) {
        incomplete = chunk.slice(err.lastPosition)
        yields = err.values
      } else {
        throw err
      }
    }
    return yields
  }

  if (typeof bufferIterator[Symbol.iterator] === 'function') {
    return (function * iter () {
      for (const value of bufferIterator) {
        yield * parser(value)
      }
    })()
  } else if (typeof bufferIterator[Symbol.asyncIterator] === 'function') {
    return (async function * iter () {
      for await (const value of bufferIterator) {
        yield * parser(value)
      }
    })()
  }
}
const decodeIter = unpackIter
const encodeIter = packIter

/***/ }),

/***/ "./node_modules/@colyseus/msgpackr/pack.js":
/*!*************************************************!*\
  !*** ./node_modules/@colyseus/msgpackr/pack.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALWAYS: () => (/* binding */ ALWAYS),
/* harmony export */   DECIMAL_FIT: () => (/* binding */ DECIMAL_FIT),
/* harmony export */   DECIMAL_ROUND: () => (/* binding */ DECIMAL_ROUND),
/* harmony export */   Encoder: () => (/* binding */ Encoder),
/* harmony export */   FLOAT32_OPTIONS: () => (/* reexport safe */ _unpack_js__WEBPACK_IMPORTED_MODULE_0__.FLOAT32_OPTIONS),
/* harmony export */   NEVER: () => (/* binding */ NEVER),
/* harmony export */   Packr: () => (/* binding */ Packr),
/* harmony export */   RECORD_SYMBOL: () => (/* binding */ RECORD_SYMBOL),
/* harmony export */   RESERVE_START_SPACE: () => (/* binding */ RESERVE_START_SPACE),
/* harmony export */   RESET_BUFFER_MODE: () => (/* binding */ RESET_BUFFER_MODE),
/* harmony export */   REUSE_BUFFER_MODE: () => (/* binding */ REUSE_BUFFER_MODE),
/* harmony export */   addExtension: () => (/* binding */ addExtension),
/* harmony export */   encode: () => (/* binding */ encode),
/* harmony export */   pack: () => (/* binding */ pack),
/* harmony export */   setWriteStructSlots: () => (/* binding */ setWriteStructSlots)
/* harmony export */ });
/* harmony import */ var _unpack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./unpack.js */ "./node_modules/@colyseus/msgpackr/unpack.js");

let textEncoder
try {
	textEncoder = new TextEncoder()
} catch (error) {}
let extensions, extensionClasses
const hasNodeBuffer = typeof Buffer !== 'undefined'
const ByteArrayAllocate = hasNodeBuffer ?
	function(length) { return Buffer.allocUnsafeSlow(length) } : Uint8Array
const ByteArray = hasNodeBuffer ? Buffer : Uint8Array
const MAX_BUFFER_SIZE = hasNodeBuffer ? 0x100000000 : 0x7fd00000
let target, keysTarget
let targetView
let position = 0
let safeEnd
let bundledStrings = null
let writeStructSlots
const MAX_BUNDLE_SIZE = 0x5500 // maximum characters such that the encoded bytes fits in 16 bits.
const hasNonLatin = /[\u0080-\uFFFF]/
const RECORD_SYMBOL = Symbol('record-id')
class Packr extends _unpack_js__WEBPACK_IMPORTED_MODULE_0__.Unpackr {
	constructor(options) {
		super(options)
		this.offset = 0
		let typeBuffer
		let start
		let hasSharedUpdate
		let structures
		let referenceMap
		let encodeUtf8 = ByteArray.prototype.utf8Write ? function(string, position) {
			return target.utf8Write(string, position, 0xffffffff)
		} : (textEncoder && textEncoder.encodeInto) ?
			function(string, position) {
				return textEncoder.encodeInto(string, target.subarray(position)).written
			} : false

		let packr = this
		if (!options)
			options = {}
		let isSequential = options && options.sequential
		let hasSharedStructures = options.structures || options.saveStructures
		let maxSharedStructures = options.maxSharedStructures
		if (maxSharedStructures == null)
			maxSharedStructures = hasSharedStructures ? 32 : 0
		if (maxSharedStructures > 8160)
			throw new Error('Maximum maxSharedStructure is 8160')
		if (options.structuredClone && options.moreTypes == undefined) {
			this.moreTypes = true
		}
		let maxOwnStructures = options.maxOwnStructures
		if (maxOwnStructures == null)
			maxOwnStructures = hasSharedStructures ? 32 : 64
		if (!this.structures && options.useRecords != false)
			this.structures = []
		// two byte record ids for shared structures
		let useTwoByteRecords = maxSharedStructures > 32 || (maxOwnStructures + maxSharedStructures > 64)
		let sharedLimitId = maxSharedStructures + 0x40
		let maxStructureId = maxSharedStructures + maxOwnStructures + 0x40
		if (maxStructureId > 8256) {
			throw new Error('Maximum maxSharedStructure + maxOwnStructure is 8192')
		}
		let recordIdsToRemove = []
		let transitionsCount = 0
		let serializationsSinceTransitionRebuild = 0

		this.pack = this.encode = function(value, encodeOptions) {
			if (!target) {
				target = new ByteArrayAllocate(8192)
				targetView = target.dataView || (target.dataView = new DataView(target.buffer, 0, 8192))
				position = 0
			}
			safeEnd = target.length - 10
			if (safeEnd - position < 0x800) {
				// don't start too close to the end,
				target = new ByteArrayAllocate(target.length)
				targetView = target.dataView || (target.dataView = new DataView(target.buffer, 0, target.length))
				safeEnd = target.length - 10
				position = 0
			} else
				position = (position + 7) & 0x7ffffff8 // Word align to make any future copying of this buffer faster
			start = position
			if (encodeOptions & RESERVE_START_SPACE) position += (encodeOptions & 0xff)
			referenceMap = packr.structuredClone ? new Map() : null
			if (packr.bundleStrings && typeof value !== 'string') {
				bundledStrings = []
				bundledStrings.size = Infinity // force a new bundle start on first string
			} else
				bundledStrings = null
			structures = packr.structures
			if (structures) {
				if (structures.uninitialized)
					structures = packr._mergeStructures(packr.getStructures())
				let sharedLength = structures.sharedLength || 0
				if (sharedLength > maxSharedStructures) {
					//if (maxSharedStructures <= 32 && structures.sharedLength > 32) // TODO: could support this, but would need to update the limit ids
					throw new Error('Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to ' + structures.sharedLength)
				}
				if (!structures.transitions) {
					// rebuild our structure transitions
					structures.transitions = Object.create(null)
					for (let i = 0; i < sharedLength; i++) {
						let keys = structures[i]
						if (!keys)
							continue
						let nextTransition, transition = structures.transitions
						for (let j = 0, l = keys.length; j < l; j++) {
							let key = keys[j]
							nextTransition = transition[key]
							if (!nextTransition) {
								nextTransition = transition[key] = Object.create(null)
							}
							transition = nextTransition
						}
						transition[RECORD_SYMBOL] = i + 0x40
					}
					this.lastNamedStructuresLength = sharedLength
				}
				if (!isSequential) {
					structures.nextId = sharedLength + 0x40
				}
			}
			if (hasSharedUpdate)
				hasSharedUpdate = false
			let encodingError;
			try {
				if (packr.randomAccessStructure && value && value.constructor && value.constructor === Object)
					writeStruct(value);
				else
					pack(value)
				let lastBundle = bundledStrings;
				if (bundledStrings)
					writeBundles(start, pack, 0)
				if (referenceMap && referenceMap.idsToInsert) {
					let idsToInsert = referenceMap.idsToInsert.sort((a, b) => a.offset > b.offset ? 1 : -1);
					let i = idsToInsert.length;
					let incrementPosition = -1;
					while (lastBundle && i > 0) {
						let insertionPoint = idsToInsert[--i].offset + start;
						if (insertionPoint < (lastBundle.stringsPosition + start) && incrementPosition === -1)
							incrementPosition = 0;
						if (insertionPoint > (lastBundle.position + start)) {
							if (incrementPosition >= 0)
								incrementPosition += 6;
						} else {
							if (incrementPosition >= 0) {
								// update the bundle reference now
								targetView.setUint32(lastBundle.position + start,
									targetView.getUint32(lastBundle.position + start) + incrementPosition)
								incrementPosition = -1; // reset
							}
							lastBundle = lastBundle.previous;
							i++;
						}
					}
					if (incrementPosition >= 0 && lastBundle) {
						// update the bundle reference now
						targetView.setUint32(lastBundle.position + start,
							targetView.getUint32(lastBundle.position + start) + incrementPosition)
					}
					position += idsToInsert.length * 6;
					if (position > safeEnd)
						makeRoom(position)
					packr.offset = position
					let serialized = insertIds(target.subarray(start, position), idsToInsert)
					referenceMap = null
					return serialized
				}
				packr.offset = position // update the offset so next serialization doesn't write over our buffer, but can continue writing to same buffer sequentially
				if (encodeOptions & REUSE_BUFFER_MODE) {
					target.start = start
					target.end = position
					return target
				}
				return target.subarray(start, position) // position can change if we call pack again in saveStructures, so we get the buffer now
			} catch(error) {
				encodingError = error;
				throw error;
			} finally {
				if (structures) {
					resetStructures();
					if (hasSharedUpdate && packr.saveStructures) {
						let sharedLength = structures.sharedLength || 0
						// we can't rely on start/end with REUSE_BUFFER_MODE since they will (probably) change when we save
						let returnBuffer = target.subarray(start, position)
						let newSharedData = prepareStructures(structures, packr);
						if (!encodingError) { // TODO: If there is an encoding error, should make the structures as uninitialized so they get rebuilt next time
							if (packr.saveStructures(newSharedData, newSharedData.isCompatible) === false) {
								// get updated structures and try again if the update failed
								return packr.pack(value, encodeOptions)
							}
							packr.lastNamedStructuresLength = sharedLength
							// don't keep large buffers around
							if (target.length > 0x40000000) target = null
							return returnBuffer
						}
					}
				}
				// don't keep large buffers around, they take too much memory and cause problems (limit at 1GB)
				if (target.length > 0x40000000) target = null
				if (encodeOptions & RESET_BUFFER_MODE)
					position = start
			}
		}
		const resetStructures = () => {
			if (serializationsSinceTransitionRebuild < 10)
				serializationsSinceTransitionRebuild++
			let sharedLength = structures.sharedLength || 0
			if (structures.length > sharedLength && !isSequential)
				structures.length = sharedLength
			if (transitionsCount > 10000) {
				// force a rebuild occasionally after a lot of transitions so it can get cleaned up
				structures.transitions = null
				serializationsSinceTransitionRebuild = 0
				transitionsCount = 0
				if (recordIdsToRemove.length > 0)
					recordIdsToRemove = []
			} else if (recordIdsToRemove.length > 0 && !isSequential) {
				for (let i = 0, l = recordIdsToRemove.length; i < l; i++) {
					recordIdsToRemove[i][RECORD_SYMBOL] = 0
				}
				recordIdsToRemove = []
			}
		}
		const packArray = (value) => {
			var length = value.length
			if (length < 0x10) {
				target[position++] = 0x90 | length
			} else if (length < 0x10000) {
				target[position++] = 0xdc
				target[position++] = length >> 8
				target[position++] = length & 0xff
			} else {
				target[position++] = 0xdd
				targetView.setUint32(position, length)
				position += 4
			}
			for (let i = 0; i < length; i++) {
				pack(value[i])
			}
		}
		const pack = (value) => {
			if (position > safeEnd)
				target = makeRoom(position)

			var type = typeof value
			var length
			if (type === 'string') {
				let strLength = value.length
				if (bundledStrings && strLength >= 4 && strLength < 0x1000) {
					if ((bundledStrings.size += strLength) > MAX_BUNDLE_SIZE) {
						let extStart
						let maxBytes = (bundledStrings[0] ? bundledStrings[0].length * 3 + bundledStrings[1].length : 0) + 10
						if (position + maxBytes > safeEnd)
							target = makeRoom(position + maxBytes)
						let lastBundle
						if (bundledStrings.position) { // here we use the 0x62 extension to write the last bundle and reserve space for the reference pointer to the next/current bundle
							lastBundle = bundledStrings
							target[position] = 0xc8 // ext 16
							position += 3 // reserve for the writing bundle size
							target[position++] = 0x62 // 'b'
							extStart = position - start
							position += 4 // reserve for writing bundle reference
							writeBundles(start, pack, 0) // write the last bundles
							targetView.setUint16(extStart + start - 3, position - start - extStart)
						} else { // here we use the 0x62 extension just to reserve the space for the reference pointer to the bundle (will be updated once the bundle is written)
							target[position++] = 0xd6 // fixext 4
							target[position++] = 0x62 // 'b'
							extStart = position - start
							position += 4 // reserve for writing bundle reference
						}
						bundledStrings = ['', ''] // create new ones
						bundledStrings.previous = lastBundle;
						bundledStrings.size = 0
						bundledStrings.position = extStart
					}
					let twoByte = hasNonLatin.test(value)
					bundledStrings[twoByte ? 0 : 1] += value
					target[position++] = 0xc1
					pack(twoByte ? -strLength : strLength);
					return
				}
				let headerSize
				// first we estimate the header size, so we can write to the correct location
				if (strLength < 0x20) {
					headerSize = 1
				} else if (strLength < 0x100) {
					headerSize = 2
				} else if (strLength < 0x10000) {
					headerSize = 3
				} else {
					headerSize = 5
				}
				let maxBytes = strLength * 3
				if (position + maxBytes > safeEnd)
					target = makeRoom(position + maxBytes)

				if (strLength < 0x40 || !encodeUtf8) {
					let i, c1, c2, strPosition = position + headerSize
					for (i = 0; i < strLength; i++) {
						c1 = value.charCodeAt(i)
						if (c1 < 0x80) {
							target[strPosition++] = c1
						} else if (c1 < 0x800) {
							target[strPosition++] = c1 >> 6 | 0xc0
							target[strPosition++] = c1 & 0x3f | 0x80
						} else if (
							(c1 & 0xfc00) === 0xd800 &&
							((c2 = value.charCodeAt(i + 1)) & 0xfc00) === 0xdc00
						) {
							c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff)
							i++
							target[strPosition++] = c1 >> 18 | 0xf0
							target[strPosition++] = c1 >> 12 & 0x3f | 0x80
							target[strPosition++] = c1 >> 6 & 0x3f | 0x80
							target[strPosition++] = c1 & 0x3f | 0x80
						} else {
							target[strPosition++] = c1 >> 12 | 0xe0
							target[strPosition++] = c1 >> 6 & 0x3f | 0x80
							target[strPosition++] = c1 & 0x3f | 0x80
						}
					}
					length = strPosition - position - headerSize
				} else {
					length = encodeUtf8(value, position + headerSize)
				}

				if (length < 0x20) {
					target[position++] = 0xa0 | length
				} else if (length < 0x100) {
					if (headerSize < 2) {
						target.copyWithin(position + 2, position + 1, position + 1 + length)
					}
					target[position++] = 0xd9
					target[position++] = length
				} else if (length < 0x10000) {
					if (headerSize < 3) {
						target.copyWithin(position + 3, position + 2, position + 2 + length)
					}
					target[position++] = 0xda
					target[position++] = length >> 8
					target[position++] = length & 0xff
				} else {
					if (headerSize < 5) {
						target.copyWithin(position + 5, position + 3, position + 3 + length)
					}
					target[position++] = 0xdb
					targetView.setUint32(position, length)
					position += 4
				}
				position += length
			} else if (type === 'number') {
				if (value >>> 0 === value) {// positive integer, 32-bit or less
					// positive uint
					if (value < 0x20 || (value < 0x80 && this.useRecords === false) || (value < 0x40 && !this.randomAccessStructure)) {
						target[position++] = value
					} else if (value < 0x100) {
						target[position++] = 0xcc
						target[position++] = value
					} else if (value < 0x10000) {
						target[position++] = 0xcd
						target[position++] = value >> 8
						target[position++] = value & 0xff
					} else {
						target[position++] = 0xce
						targetView.setUint32(position, value)
						position += 4
					}
				} else if (value >> 0 === value) { // negative integer
					if (value >= -0x20) {
						target[position++] = 0x100 + value
					} else if (value >= -0x80) {
						target[position++] = 0xd0
						target[position++] = value + 0x100
					} else if (value >= -0x8000) {
						target[position++] = 0xd1
						targetView.setInt16(position, value)
						position += 2
					} else {
						target[position++] = 0xd2
						targetView.setInt32(position, value)
						position += 4
					}
				} else {
					let useFloat32
					if ((useFloat32 = this.useFloat32) > 0 && value < 0x100000000 && value >= -0x80000000) {
						target[position++] = 0xca
						targetView.setFloat32(position, value)
						let xShifted
						if (useFloat32 < 4 ||
								// this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
								((xShifted = value * _unpack_js__WEBPACK_IMPORTED_MODULE_0__.mult10[((target[position] & 0x7f) << 1) | (target[position + 1] >> 7)]) >> 0) === xShifted) {
							position += 4
							return
						} else
							position-- // move back into position for writing a double
					}
					target[position++] = 0xcb
					targetView.setFloat64(position, value)
					position += 8
				}
			} else if (type === 'object' || type === 'function') {
				if (!value)
					target[position++] = 0xc0
				else {
					if (referenceMap) {
						let referee = referenceMap.get(value)
						if (referee) {
							if (!referee.id) {
								let idsToInsert = referenceMap.idsToInsert || (referenceMap.idsToInsert = [])
								referee.id = idsToInsert.push(referee)
							}
							target[position++] = 0xd6 // fixext 4
							target[position++] = 0x70 // "p" for pointer
							targetView.setUint32(position, referee.id)
							position += 4
							return
						} else
							referenceMap.set(value, { offset: position - start })
					}
					let constructor = value.constructor
					if (constructor === Object) {
						writeObject(value)
					} else if (constructor === Array) {
						packArray(value)
					} else if (constructor === Map) {
						if (this.mapAsEmptyObject) target[position++] = 0x80
						else {
							length = value.size
							if (length < 0x10) {
								target[position++] = 0x80 | length
							} else if (length < 0x10000) {
								target[position++] = 0xde
								target[position++] = length >> 8
								target[position++] = length & 0xff
							} else {
								target[position++] = 0xdf
								targetView.setUint32(position, length)
								position += 4
							}
							for (let [key, entryValue] of value) {
								pack(key)
								pack(entryValue)
							}
						}
					} else {
						for (let i = 0, l = extensions.length; i < l; i++) {
							let extensionClass = extensionClasses[i]
							if (value instanceof extensionClass) {
								let extension = extensions[i]
								if (extension.write) {
									if (extension.type) {
										target[position++] = 0xd4 // one byte "tag" extension
										target[position++] = extension.type
										target[position++] = 0
									}
									let writeResult = extension.write.call(this, value)
									if (writeResult === value) { // avoid infinite recursion
										if (Array.isArray(value)) {
											packArray(value)
										} else {
											writeObject(value)
										}
									} else {
										pack(writeResult)
									}
									return
								}
								let currentTarget = target
								let currentTargetView = targetView
								let currentPosition = position
								target = null
								let result
								try {
									result = extension.pack.call(this, value, (size) => {
										// restore target and use it
										target = currentTarget
										currentTarget = null
										position += size
										if (position > safeEnd)
											makeRoom(position)
										return {
											target, targetView, position: position - size
										}
									}, pack)
								} finally {
									// restore current target information (unless already restored)
									if (currentTarget) {
										target = currentTarget
										targetView = currentTargetView
										position = currentPosition
										safeEnd = target.length - 10
									}
								}
								if (result) {
									if (result.length + position > safeEnd)
										makeRoom(result.length + position)
									position = writeExtensionData(result, target, position, extension.type)
								}
								return
							}
						}
						// check isArray after extensions, because extensions can extend Array
						if (Array.isArray(value)) {
							packArray(value)
						} else {
							// use this as an alternate mechanism for expressing how to serialize
							if (value.toJSON) {
								const json = value.toJSON()
								// if for some reason value.toJSON returns itself it'll loop forever
								if (json !== value)
									return pack(json)
							}

							// if there is a writeFunction, use it, otherwise just encode as undefined
							if (type === 'function')
								return pack(this.writeFunction && this.writeFunction(value));

							// no extension found, write as plain object
							writeObject(value)
						}
					}
				}
			} else if (type === 'boolean') {
				target[position++] = value ? 0xc3 : 0xc2
			} else if (type === 'bigint') {
				if (value < (BigInt(1)<<BigInt(63)) && value >= -(BigInt(1)<<BigInt(63))) {
					// use a signed int as long as it fits
					target[position++] = 0xd3
					targetView.setBigInt64(position, value)
				} else if (value < (BigInt(1)<<BigInt(64)) && value > 0) {
					// if we can fit an unsigned int, use that
					target[position++] = 0xcf
					targetView.setBigUint64(position, value)
				} else {
					// overflow
					if (this.largeBigIntToFloat) {
						target[position++] = 0xcb
						targetView.setFloat64(position, Number(value))
					} else if (this.useBigIntExtension && value < 2n**(1023n) && value > -(2n**(1023n))) {
						target[position++] = 0xc7
						position++;
						target[position++] = 0x42 // "B" for BigInt
						let bytes = [];
						let alignedSign;
						do {
							let byte = value & 0xffn;
							alignedSign = (byte & 0x80n) === (value < 0n ? 0x80n : 0n);
							bytes.push(byte);
							value >>= 8n;
						} while (!((value === 0n || value === -1n) && alignedSign));
						target[position-2] = bytes.length;
						for (let i = bytes.length; i > 0;) {
							target[position++] = Number(bytes[--i]);
						}
						return
					} else {
						throw new RangeError(value + ' was too large to fit in MessagePack 64-bit integer format, use' +
							' useBigIntExtension or set largeBigIntToFloat to convert to float-64')
					}
				}
				position += 8
			} else if (type === 'undefined') {
				if (this.encodeUndefinedAsNil)
					target[position++] = 0xc0
				else {
					target[position++] = 0xd4 // a number of implementations use fixext1 with type 0, data 0 to denote undefined, so we follow suite
					target[position++] = 0
					target[position++] = 0
				}
			} else {
				throw new Error('Unknown type: ' + type)
			}
		}

		const writePlainObject = (this.variableMapSize || this.coercibleKeyAsNumber) ? (object) => {
			// this method is slightly slower, but generates "preferred serialization" (optimally small for smaller objects)
			let keys = Object.keys(object)
			let length = keys.length
			if (length < 0x10) {
				target[position++] = 0x80 | length
			} else if (length < 0x10000) {
				target[position++] = 0xde
				target[position++] = length >> 8
				target[position++] = length & 0xff
			} else {
				target[position++] = 0xdf
				targetView.setUint32(position, length)
				position += 4
			}
			let key
			if (this.coercibleKeyAsNumber) {
				for (let i = 0; i < length; i++) {
					key = keys[i]
					let num = Number(key)
					pack(isNaN(num) ? key : num)
					pack(object[key])
				}

			} else {
				for (let i = 0; i < length; i++) {
					pack(key = keys[i])
					pack(object[key])
				}
			}
		} :
		(object) => {
			target[position++] = 0xde // always using map 16, so we can preallocate and set the length afterwards
			let objectOffset = position - start
			position += 2
			let size = 0
			for (let key in object) {
				if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key)) {
					pack(key)
					pack(object[key])
					size++
				}
			}
			target[objectOffset++ + start] = size >> 8
			target[objectOffset + start] = size & 0xff
		}

		const writeRecord = this.useRecords === false ? writePlainObject :
		(options.progressiveRecords && !useTwoByteRecords) ?  // this is about 2% faster for highly stable structures, since it only requires one for-in loop (but much more expensive when new structure needs to be written)
		(object) => {
			let nextTransition, transition = structures.transitions || (structures.transitions = Object.create(null))
			let objectOffset = position++ - start
			let wroteKeys
			for (let key in object) {
				if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key)) {
					nextTransition = transition[key]
					if (nextTransition)
						transition = nextTransition
					else {
						// record doesn't exist, create full new record and insert it
						let keys = Object.keys(object)
						let lastTransition = transition
						transition = structures.transitions
						let newTransitions = 0
						for (let i = 0, l = keys.length; i < l; i++) {
							let key = keys[i]
							nextTransition = transition[key]
							if (!nextTransition) {
								nextTransition = transition[key] = Object.create(null)
								newTransitions++
							}
							transition = nextTransition
						}
						if (objectOffset + start + 1 == position) {
							// first key, so we don't need to insert, we can just write record directly
							position--
							newRecord(transition, keys, newTransitions)
						} else // otherwise we need to insert the record, moving existing data after the record
							insertNewRecord(transition, keys, objectOffset, newTransitions)
						wroteKeys = true
						transition = lastTransition[key]
					}
					pack(object[key])
				}
			}
			if (!wroteKeys) {
				let recordId = transition[RECORD_SYMBOL]
				if (recordId)
					target[objectOffset + start] = recordId
				else
					insertNewRecord(transition, Object.keys(object), objectOffset, 0)
			}
		} :
		(object) => {
			let nextTransition, transition = structures.transitions || (structures.transitions = Object.create(null))
			let newTransitions = 0
			for (let key in object) if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key)) {
				nextTransition = transition[key]
				if (!nextTransition) {
					nextTransition = transition[key] = Object.create(null)
					newTransitions++
				}
				transition = nextTransition
			}
			let recordId = transition[RECORD_SYMBOL]
			if (recordId) {
				if (recordId >= 0x60 && useTwoByteRecords) {
					target[position++] = ((recordId -= 0x60) & 0x1f) + 0x60
					target[position++] = recordId >> 5
				} else
					target[position++] = recordId
			} else {
				newRecord(transition, transition.__keys__ || Object.keys(object), newTransitions)
			}
			// now write the values
			for (let key in object)
				if (typeof object.hasOwnProperty !== 'function' || object.hasOwnProperty(key)) {
					pack(object[key])
				}
		}

		// craete reference to useRecords if useRecords is a function
		const checkUseRecords = typeof this.useRecords == 'function' && this.useRecords;

		const writeObject = checkUseRecords ? (object) => {
			checkUseRecords(object) ? writeRecord(object) : writePlainObject(object)
		} : writeRecord

		const makeRoom = (end) => {
			let newSize
			if (end > 0x1000000) {
				// special handling for really large buffers
				if ((end - start) > MAX_BUFFER_SIZE)
					throw new Error('Packed buffer would be larger than maximum buffer size')
				newSize = Math.min(MAX_BUFFER_SIZE,
					Math.round(Math.max((end - start) * (end > 0x4000000 ? 1.25 : 2), 0x400000) / 0x1000) * 0x1000)
			} else // faster handling for smaller buffers
				newSize = ((Math.max((end - start) << 2, target.length - 1) >> 12) + 1) << 12
			let newBuffer = new ByteArrayAllocate(newSize)
			targetView = newBuffer.dataView || (newBuffer.dataView = new DataView(newBuffer.buffer, 0, newSize))
			end = Math.min(end, target.length)
			if (target.copy)
				target.copy(newBuffer, 0, start, end)
			else
				newBuffer.set(target.slice(start, end))
			position -= start
			start = 0
			safeEnd = newBuffer.length - 10
			return target = newBuffer
		}
		const newRecord = (transition, keys, newTransitions) => {
			let recordId = structures.nextId
			if (!recordId)
				recordId = 0x40
			if (recordId < sharedLimitId && this.shouldShareStructure && !this.shouldShareStructure(keys)) {
				recordId = structures.nextOwnId
				if (!(recordId < maxStructureId))
					recordId = sharedLimitId
				structures.nextOwnId = recordId + 1
			} else {
				if (recordId >= maxStructureId)// cycle back around
					recordId = sharedLimitId
				structures.nextId = recordId + 1
			}
			let highByte = keys.highByte = recordId >= 0x60 && useTwoByteRecords ? (recordId - 0x60) >> 5 : -1
			transition[RECORD_SYMBOL] = recordId
			transition.__keys__ = keys
			structures[recordId - 0x40] = keys

			if (recordId < sharedLimitId) {
				keys.isShared = true
				structures.sharedLength = recordId - 0x3f
				hasSharedUpdate = true
				if (highByte >= 0) {
					target[position++] = (recordId & 0x1f) + 0x60
					target[position++] = highByte
				} else {
					target[position++] = recordId
				}
			} else {
				if (highByte >= 0) {
					target[position++] = 0xd5 // fixext 2
					target[position++] = 0x72 // "r" record defintion extension type
					target[position++] = (recordId & 0x1f) + 0x60
					target[position++] = highByte
				} else {
					target[position++] = 0xd4 // fixext 1
					target[position++] = 0x72 // "r" record defintion extension type
					target[position++] = recordId
				}

				if (newTransitions)
					transitionsCount += serializationsSinceTransitionRebuild * newTransitions
				// record the removal of the id, we can maintain our shared structure
				if (recordIdsToRemove.length >= maxOwnStructures)
					recordIdsToRemove.shift()[RECORD_SYMBOL] = 0 // we are cycling back through, and have to remove old ones
				recordIdsToRemove.push(transition)
				pack(keys)
			}
		}
		const insertNewRecord = (transition, keys, insertionOffset, newTransitions) => {
			let mainTarget = target
			let mainPosition = position
			let mainSafeEnd = safeEnd
			let mainStart = start
			target = keysTarget
			position = 0
			start = 0
			if (!target)
				keysTarget = target = new ByteArrayAllocate(8192)
			safeEnd = target.length - 10
			newRecord(transition, keys, newTransitions)
			keysTarget = target
			let keysPosition = position
			target = mainTarget
			position = mainPosition
			safeEnd = mainSafeEnd
			start = mainStart
			if (keysPosition > 1) {
				let newEnd = position + keysPosition - 1
				if (newEnd > safeEnd)
					makeRoom(newEnd)
				let insertionPosition = insertionOffset + start
				target.copyWithin(insertionPosition + keysPosition, insertionPosition + 1, position)
				target.set(keysTarget.slice(0, keysPosition), insertionPosition)
				position = newEnd
			} else {
				target[insertionOffset + start] = keysTarget[0]
			}
		}
		const writeStruct = (object) => {
			let newPosition = writeStructSlots(object, target, start, position, structures, makeRoom, (value, newPosition, notifySharedUpdate) => {
				if (notifySharedUpdate)
					return hasSharedUpdate = true;
				position = newPosition;
				let startTarget = target;
				pack(value);
				resetStructures();
				if (startTarget !== target) {
					return { position, targetView, target }; // indicate the buffer was re-allocated
				}
				return position;
			}, this);
			if (newPosition === 0) // bail and go to a msgpack object
				return writeObject(object);
			position = newPosition;
		}
	}
	useBuffer(buffer) {
		// this means we are finished using our own buffer and we can write over it safely
		target = buffer
		targetView = new DataView(target.buffer, target.byteOffset, target.byteLength)
		position = 0
	}
	set position (value) {
		position = value;
	}
	get position() {
		return position;
	}
	set buffer (buffer) {
		target = buffer;
	}
	get buffer () {
		return target;
	}
	clearSharedData() {
		if (this.structures)
			this.structures = []
		if (this.typedStructs)
			this.typedStructs = []
	}
}

function copyBinary(source, target, targetOffset, offset, endOffset) {
	while (offset < endOffset) {
		target[targetOffset++] = source[offset++]
	}
}

extensionClasses = [ Date, Set, Error, RegExp, ArrayBuffer, Object.getPrototypeOf(Uint8Array.prototype).constructor /*TypedArray*/, _unpack_js__WEBPACK_IMPORTED_MODULE_0__.C1Type ]
extensions = [{
	pack(date, allocateForWrite, pack) {
		let seconds = date.getTime() / 1000
		if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds >= 0 && seconds < 0x100000000) {
			// Timestamp 32
			let { target, targetView, position} = allocateForWrite(6)
			target[position++] = 0xd6
			target[position++] = 0xff
			targetView.setUint32(position, seconds)
		} else if (seconds > 0 && seconds < 0x100000000) {
			// Timestamp 64
			let { target, targetView, position} = allocateForWrite(10)
			target[position++] = 0xd7
			target[position++] = 0xff
			targetView.setUint32(position, date.getMilliseconds() * 4000000 + ((seconds / 1000 / 0x100000000) >> 0))
			targetView.setUint32(position + 4, seconds)
		} else if (isNaN(seconds)) {
			if (this.onInvalidDate) {
				allocateForWrite(0)
				return pack(this.onInvalidDate())
			}
			// Intentionally invalid timestamp
			let { target, targetView, position} = allocateForWrite(3)
			target[position++] = 0xd4
			target[position++] = 0xff
			target[position++] = 0xff
		} else {
			// Timestamp 96
			let { target, targetView, position} = allocateForWrite(15)
			target[position++] = 0xc7
			target[position++] = 12
			target[position++] = 0xff
			targetView.setUint32(position, date.getMilliseconds() * 1000000)
			targetView.setBigInt64(position + 4, BigInt(Math.floor(seconds)))
		}
	}
}, {
	pack(set, allocateForWrite, pack) {
		if (this.setAsEmptyObject) {
			allocateForWrite(0);
			return pack({})
		}
		let array = Array.from(set)
		let { target, position} = allocateForWrite(this.moreTypes ? 3 : 0)
		if (this.moreTypes) {
			target[position++] = 0xd4
			target[position++] = 0x73 // 's' for Set
			target[position++] = 0
		}
		pack(array)
	}
}, {
	pack(error, allocateForWrite, pack) {
		let { target, position} = allocateForWrite(this.moreTypes ? 3 : 0)
		if (this.moreTypes) {
			target[position++] = 0xd4
			target[position++] = 0x65 // 'e' for error
			target[position++] = 0
		}
		pack([ error.name, error.message, error.cause ])
	}
}, {
	pack(regex, allocateForWrite, pack) {
		let { target, position} = allocateForWrite(this.moreTypes ? 3 : 0)
		if (this.moreTypes) {
			target[position++] = 0xd4
			target[position++] = 0x78 // 'x' for regeXp
			target[position++] = 0
		}
		pack([ regex.source, regex.flags ])
	}
}, {
	pack(arrayBuffer, allocateForWrite) {
		if (this.moreTypes)
			writeExtBuffer(arrayBuffer, 0x10, allocateForWrite)
		else
			writeBuffer(hasNodeBuffer ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer), allocateForWrite)
	}
}, {
	pack(typedArray, allocateForWrite) {
		let constructor = typedArray.constructor
		if (constructor !== ByteArray && this.moreTypes)
			writeExtBuffer(typedArray, _unpack_js__WEBPACK_IMPORTED_MODULE_0__.typedArrays.indexOf(constructor.name), allocateForWrite)
		else
			writeBuffer(typedArray, allocateForWrite)
	}
}, {
	pack(c1, allocateForWrite) { // specific 0xC1 object
		let { target, position} = allocateForWrite(1)
		target[position] = 0xc1
	}
}]

function writeExtBuffer(typedArray, type, allocateForWrite, encode) {
	let length = typedArray.byteLength
	if (length + 1 < 0x100) {
		var { target, position } = allocateForWrite(4 + length)
		target[position++] = 0xc7
		target[position++] = length + 1
	} else if (length + 1 < 0x10000) {
		var { target, position } = allocateForWrite(5 + length)
		target[position++] = 0xc8
		target[position++] = (length + 1) >> 8
		target[position++] = (length + 1) & 0xff
	} else {
		var { target, position, targetView } = allocateForWrite(7 + length)
		target[position++] = 0xc9
		targetView.setUint32(position, length + 1) // plus one for the type byte
		position += 4
	}
	target[position++] = 0x74 // "t" for typed array
	target[position++] = type
	if (!typedArray.buffer) typedArray = new Uint8Array(typedArray)
	target.set(new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength), position)
}
function writeBuffer(buffer, allocateForWrite) {
	let length = buffer.byteLength
	var target, position
	if (length < 0x100) {
		var { target, position } = allocateForWrite(length + 2)
		target[position++] = 0xc4
		target[position++] = length
	} else if (length < 0x10000) {
		var { target, position } = allocateForWrite(length + 3)
		target[position++] = 0xc5
		target[position++] = length >> 8
		target[position++] = length & 0xff
	} else {
		var { target, position, targetView } = allocateForWrite(length + 5)
		target[position++] = 0xc6
		targetView.setUint32(position, length)
		position += 4
	}
	target.set(buffer, position)
}

function writeExtensionData(result, target, position, type) {
	let length = result.length
	switch (length) {
		case 1:
			target[position++] = 0xd4
			break
		case 2:
			target[position++] = 0xd5
			break
		case 4:
			target[position++] = 0xd6
			break
		case 8:
			target[position++] = 0xd7
			break
		case 16:
			target[position++] = 0xd8
			break
		default:
			if (length < 0x100) {
				target[position++] = 0xc7
				target[position++] = length
			} else if (length < 0x10000) {
				target[position++] = 0xc8
				target[position++] = length >> 8
				target[position++] = length & 0xff
			} else {
				target[position++] = 0xc9
				target[position++] = length >> 24
				target[position++] = (length >> 16) & 0xff
				target[position++] = (length >> 8) & 0xff
				target[position++] = length & 0xff
			}
	}
	target[position++] = type
	target.set(result, position)
	position += length
	return position
}

function insertIds(serialized, idsToInsert) {
	// insert the ids that need to be referenced for structured clones
	let nextId
	let distanceToMove = idsToInsert.length * 6
	let lastEnd = serialized.length - distanceToMove
	while (nextId = idsToInsert.pop()) {
		let offset = nextId.offset
		let id = nextId.id
		serialized.copyWithin(offset + distanceToMove, offset, lastEnd)
		distanceToMove -= 6
		let position = offset + distanceToMove
		serialized[position++] = 0xd6
		serialized[position++] = 0x69 // 'i'
		serialized[position++] = id >> 24
		serialized[position++] = (id >> 16) & 0xff
		serialized[position++] = (id >> 8) & 0xff
		serialized[position++] = id & 0xff
		lastEnd = offset
	}
	return serialized
}

function writeBundles(start, pack, incrementPosition) {
	if (bundledStrings.length > 0) {
		targetView.setUint32(bundledStrings.position + start, position + incrementPosition - bundledStrings.position - start)
		bundledStrings.stringsPosition = position - start;
		let writeStrings = bundledStrings
		bundledStrings = null
		pack(writeStrings[0])
		pack(writeStrings[1])
	}
}

function addExtension(extension) {
	if (extension.Class) {
		if (!extension.pack && !extension.write)
			throw new Error('Extension has no pack or write function')
		if (extension.pack && !extension.type)
			throw new Error('Extension has no type (numeric code to identify the extension)')
		extensionClasses.unshift(extension.Class)
		extensions.unshift(extension)
	}
	(0,_unpack_js__WEBPACK_IMPORTED_MODULE_0__.addExtension)(extension)
}
function prepareStructures(structures, packr) {
	structures.isCompatible = (existingStructures) => {
		let compatible = !existingStructures || ((packr.lastNamedStructuresLength || 0) === existingStructures.length)
		if (!compatible) // we want to merge these existing structures immediately since we already have it and we are in the right transaction
			packr._mergeStructures(existingStructures);
		return compatible;
	}
	return structures
}
function setWriteStructSlots(writeSlots, makeStructures) {
	writeStructSlots = writeSlots;
	prepareStructures = makeStructures;
}

let defaultPackr = new Packr({ useRecords: false })
const pack = defaultPackr.pack
const encode = defaultPackr.pack
const Encoder = Packr

;
const { NEVER, ALWAYS, DECIMAL_ROUND, DECIMAL_FIT } = _unpack_js__WEBPACK_IMPORTED_MODULE_0__.FLOAT32_OPTIONS
const REUSE_BUFFER_MODE = 512
const RESET_BUFFER_MODE = 1024
const RESERVE_START_SPACE = 2048


/***/ }),

/***/ "./node_modules/@colyseus/msgpackr/unpack.js":
/*!***************************************************!*\
  !*** ./node_modules/@colyseus/msgpackr/unpack.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C1: () => (/* binding */ C1),
/* harmony export */   C1Type: () => (/* binding */ C1Type),
/* harmony export */   Decoder: () => (/* binding */ Decoder),
/* harmony export */   FLOAT32_OPTIONS: () => (/* binding */ FLOAT32_OPTIONS),
/* harmony export */   Unpackr: () => (/* binding */ Unpackr),
/* harmony export */   addExtension: () => (/* binding */ addExtension),
/* harmony export */   checkedRead: () => (/* binding */ checkedRead),
/* harmony export */   clearSource: () => (/* binding */ clearSource),
/* harmony export */   decode: () => (/* binding */ decode),
/* harmony export */   getPosition: () => (/* binding */ getPosition),
/* harmony export */   isNativeAccelerationEnabled: () => (/* binding */ isNativeAccelerationEnabled),
/* harmony export */   loadStructures: () => (/* binding */ loadStructures),
/* harmony export */   mult10: () => (/* binding */ mult10),
/* harmony export */   read: () => (/* binding */ read),
/* harmony export */   readString: () => (/* binding */ readString),
/* harmony export */   roundFloat32: () => (/* binding */ roundFloat32),
/* harmony export */   setExtractor: () => (/* binding */ setExtractor),
/* harmony export */   setReadStruct: () => (/* binding */ setReadStruct),
/* harmony export */   typedArrays: () => (/* binding */ typedArrays),
/* harmony export */   unpack: () => (/* binding */ unpack),
/* harmony export */   unpackMultiple: () => (/* binding */ unpackMultiple)
/* harmony export */ });
var decoder
try {
	decoder = new TextDecoder()
} catch(error) {}
var src
var srcEnd
var position = 0
var alreadySet
const EMPTY_ARRAY = []
var strings = EMPTY_ARRAY
var stringPosition = 0
var currentUnpackr = {}
var currentStructures
var srcString
var srcStringStart = 0
var srcStringEnd = 0
var bundledStrings
var referenceMap
var currentExtensions = []
var dataView
var defaultOptions = {
	useRecords: false,
	mapsAsObjects: true
}
class C1Type {}
const C1 = new C1Type()
C1.name = 'MessagePack 0xC1'
var sequentialMode = false
var inlineObjectReadThreshold = 2
var readStruct, onLoadedStructures, onSaveState
var BlockedFunction // we use search and replace to change the next call to BlockedFunction to avoid CSP issues for
// no-eval build
try {
	new Function('')
} catch(error) {
	// if eval variants are not supported, do not create inline object readers ever
	inlineObjectReadThreshold = Infinity
}

class Unpackr {
	constructor(options) {
		if (options) {
			if (options.useRecords === false && options.mapsAsObjects === undefined)
				options.mapsAsObjects = true
			if (options.sequential && options.trusted !== false) {
				options.trusted = true;
				if (!options.structures && options.useRecords != false) {
					options.structures = []
					if (!options.maxSharedStructures)
						options.maxSharedStructures = 0
				}
			}
			if (options.structures)
				options.structures.sharedLength = options.structures.length
			else if (options.getStructures) {
				(options.structures = []).uninitialized = true // this is what we use to denote an uninitialized structures
				options.structures.sharedLength = 0
			}
			if (options.int64AsNumber) {
				options.int64AsType = 'number'
			}
		}
		Object.assign(this, options)
	}
	unpack(source, options) {
		if (src) {
			// re-entrant execution, save the state and restore it after we do this unpack
			return saveState(() => {
				clearSource()
				return this ? this.unpack(source, options) : Unpackr.prototype.unpack.call(defaultOptions, source, options)
			})
		}
		if (!source.buffer && source.constructor === ArrayBuffer)
			source = typeof Buffer !== 'undefined' ? Buffer.from(source) : new Uint8Array(source);
		if (typeof options === 'object') {
			srcEnd = options.end || source.length
			position = options.start || 0
		} else {
			position = 0
			srcEnd = options > -1 ? options : source.length
		}
		stringPosition = 0
		srcStringEnd = 0
		srcString = null
		strings = EMPTY_ARRAY
		bundledStrings = null
		src = source
		// this provides cached access to the data view for a buffer if it is getting reused, which is a recommend
		// technique for getting data from a database where it can be copied into an existing buffer instead of creating
		// new ones
		try {
			dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength))
		} catch(error) {
			// if it doesn't have a buffer, maybe it is the wrong type of object
			src = null
			if (source instanceof Uint8Array)
				throw error
			throw new Error('Source must be a Uint8Array or Buffer but was a ' + ((source && typeof source == 'object') ? source.constructor.name : typeof source))
		}
		if (this instanceof Unpackr) {
			currentUnpackr = this
			if (this.structures) {
				currentStructures = this.structures
				return checkedRead(options)
			} else if (!currentStructures || currentStructures.length > 0) {
				currentStructures = []
			}
		} else {
			currentUnpackr = defaultOptions
			if (!currentStructures || currentStructures.length > 0)
				currentStructures = []
		}
		return checkedRead(options)
	}
	unpackMultiple(source, forEach) {
		let values, lastPosition = 0
		try {
			sequentialMode = true
			let size = source.length
			let value = this ? this.unpack(source, size) : defaultUnpackr.unpack(source, size)
			if (forEach) {
				if (forEach(value, lastPosition, position) === false) return;
				while(position < size) {
					lastPosition = position
					if (forEach(checkedRead(), lastPosition, position) === false) {
						return
					}
				}
			}
			else {
				values = [ value ]
				while(position < size) {
					lastPosition = position
					values.push(checkedRead())
				}
				return values
			}
		} catch(error) {
			error.lastPosition = lastPosition
			error.values = values
			throw error
		} finally {
			sequentialMode = false
			clearSource()
		}
	}
	_mergeStructures(loadedStructures, existingStructures) {
		if (onLoadedStructures)
			loadedStructures = onLoadedStructures.call(this, loadedStructures);
		loadedStructures = loadedStructures || []
		if (Object.isFrozen(loadedStructures))
			loadedStructures = loadedStructures.map(structure => structure.slice(0))
		for (let i = 0, l = loadedStructures.length; i < l; i++) {
			let structure = loadedStructures[i]
			if (structure) {
				structure.isShared = true
				if (i >= 32)
					structure.highByte = (i - 32) >> 5
			}
		}
		loadedStructures.sharedLength = loadedStructures.length
		for (let id in existingStructures || []) {
			if (id >= 0) {
				let structure = loadedStructures[id]
				let existing = existingStructures[id]
				if (existing) {
					if (structure)
						(loadedStructures.restoreStructures || (loadedStructures.restoreStructures = []))[id] = structure
					loadedStructures[id] = existing
				}
			}
		}
		return this.structures = loadedStructures
	}
	decode(source, options) {
		return this.unpack(source, options)
	}
}
function getPosition() {
	return position
}
function checkedRead(options) {
	try {
		if (!currentUnpackr.trusted && !sequentialMode) {
			let sharedLength = currentStructures.sharedLength || 0
			if (sharedLength < currentStructures.length)
				currentStructures.length = sharedLength
		}
		let result
		if (currentUnpackr.randomAccessStructure && src[position] < 0x40 && src[position] >= 0x20 && readStruct) {
			result = readStruct(src, position, srcEnd, currentUnpackr)
			src = null // dispose of this so that recursive unpack calls don't save state
			if (!(options && options.lazy) && result)
				result = result.toJSON()
			position = srcEnd
		} else
			result = read()
		if (bundledStrings) { // bundled strings to skip past
			position = bundledStrings.postBundlePosition
			bundledStrings = null
		}
		if (sequentialMode)
			// we only need to restore the structures if there was an error, but if we completed a read,
			// we can clear this out and keep the structures we read
			currentStructures.restoreStructures = null

		if (position == srcEnd) {
			// finished reading this source, cleanup references
			if (currentStructures && currentStructures.restoreStructures)
				restoreStructures()
			currentStructures = null
			src = null
			if (referenceMap)
				referenceMap = null
		} else if (position > srcEnd) {
			// over read
			throw new Error('Unexpected end of MessagePack data')
		} else if (!sequentialMode) {
			let jsonView;
			try {
				jsonView = JSON.stringify(result, (_, value) => typeof value === "bigint" ? `${value}n` : value).slice(0, 100)
			} catch(error) {
				jsonView = '(JSON view not available ' + error + ')'
			}
			throw new Error('Data read, but end of buffer not reached ' + jsonView)
		}
		// else more to read, but we are reading sequentially, so don't clear source yet
		return result
	} catch(error) {
		if (currentStructures && currentStructures.restoreStructures)
			restoreStructures()
		clearSource()
		if (error instanceof RangeError || error.message.startsWith('Unexpected end of buffer') || position > srcEnd) {
			error.incomplete = true
		}
		throw error
	}
}

function restoreStructures() {
	for (let id in currentStructures.restoreStructures) {
		currentStructures[id] = currentStructures.restoreStructures[id]
	}
	currentStructures.restoreStructures = null
}

function read() {
	let token = src[position++]
	if (token < 0xa0) {
		if (token < 0x80) {
			if (token < 0x40)
				return token
			else {
				let structure = currentStructures[token & 0x3f] ||
					currentUnpackr.getStructures && loadStructures()[token & 0x3f]
				if (structure) {
					if (!structure.read) {
						structure.read = createStructureReader(structure, token & 0x3f)
					}
					return structure.read()
				} else
					return token
			}
		} else if (token < 0x90) {
			// map
			token -= 0x80
			if (currentUnpackr.mapsAsObjects) {
				let object = {}
				for (let i = 0; i < token; i++) {
					let key = readKey()
					if (key === '__proto__')
						key = '__proto_'
					object[key] = read()
				}
				return object
			} else {
				let map = new Map()
				for (let i = 0; i < token; i++) {
					map.set(read(), read())
				}
				return map
			}
		} else {
			token -= 0x90
			let array = new Array(token)
			for (let i = 0; i < token; i++) {
				array[i] = read()
			}
			if (currentUnpackr.freezeData)
				return Object.freeze(array)
			return array
		}
	} else if (token < 0xc0) {
		// fixstr
		let length = token - 0xa0
		if (srcStringEnd >= position) {
			return srcString.slice(position - srcStringStart, (position += length) - srcStringStart)
		}
		if (srcStringEnd == 0 && srcEnd < 140) {
			// for small blocks, avoiding the overhead of the extract call is helpful
			let string = length < 16 ? shortStringInJS(length) : longStringInJS(length)
			if (string != null)
				return string
		}
		return readFixedString(length)
	} else {
		let value
		switch (token) {
			case 0xc0: return null
			case 0xc1:
				if (bundledStrings) {
					value = read() // followed by the length of the string in characters (not bytes!)
					if (value > 0)
						return bundledStrings[1].slice(bundledStrings.position1, bundledStrings.position1 += value)
					else
						return bundledStrings[0].slice(bundledStrings.position0, bundledStrings.position0 -= value)
				}
				return C1; // "never-used", return special object to denote that
			case 0xc2: return false
			case 0xc3: return true
			case 0xc4:
				// bin 8
				value = src[position++]
				if (value === undefined)
					throw new Error('Unexpected end of buffer')
				return readBin(value)
			case 0xc5:
				// bin 16
				value = dataView.getUint16(position)
				position += 2
				return readBin(value)
			case 0xc6:
				// bin 32
				value = dataView.getUint32(position)
				position += 4
				return readBin(value)
			case 0xc7:
				// ext 8
				return readExt(src[position++])
			case 0xc8:
				// ext 16
				value = dataView.getUint16(position)
				position += 2
				return readExt(value)
			case 0xc9:
				// ext 32
				value = dataView.getUint32(position)
				position += 4
				return readExt(value)
			case 0xca:
				value = dataView.getFloat32(position)
				if (currentUnpackr.useFloat32 > 2) {
					// this does rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
					let multiplier = mult10[((src[position] & 0x7f) << 1) | (src[position + 1] >> 7)]
					position += 4
					return ((multiplier * value + (value > 0 ? 0.5 : -0.5)) >> 0) / multiplier
				}
				position += 4
				return value
			case 0xcb:
				value = dataView.getFloat64(position)
				position += 8
				return value
			// uint handlers
			case 0xcc:
				return src[position++]
			case 0xcd:
				value = dataView.getUint16(position)
				position += 2
				return value
			case 0xce:
				value = dataView.getUint32(position)
				position += 4
				return value
			case 0xcf:
				if (currentUnpackr.int64AsType === 'number') {
					value = dataView.getUint32(position) * 0x100000000
					value += dataView.getUint32(position + 4)
				} else if (currentUnpackr.int64AsType === 'string') {
					value = dataView.getBigUint64(position).toString()
				} else if (currentUnpackr.int64AsType === 'auto') {
					value = dataView.getBigUint64(position)
					if (value<=BigInt(2)<<BigInt(52)) value=Number(value)
				} else
					value = dataView.getBigUint64(position)
				position += 8
				return value

			// int handlers
			case 0xd0:
				return dataView.getInt8(position++)
			case 0xd1:
				value = dataView.getInt16(position)
				position += 2
				return value
			case 0xd2:
				value = dataView.getInt32(position)
				position += 4
				return value
			case 0xd3:
				if (currentUnpackr.int64AsType === 'number') {
					value = dataView.getInt32(position) * 0x100000000
					value += dataView.getUint32(position + 4)
				} else if (currentUnpackr.int64AsType === 'string') {
					value = dataView.getBigInt64(position).toString()
				} else if (currentUnpackr.int64AsType === 'auto') {
					value = dataView.getBigInt64(position)
					if (value>=BigInt(-2)<<BigInt(52)&&value<=BigInt(2)<<BigInt(52)) value=Number(value)
				} else
					value = dataView.getBigInt64(position)
				position += 8
				return value

			case 0xd4:
				// fixext 1
				value = src[position++]
				if (value == 0x72) {
					return recordDefinition(src[position++] & 0x3f)
				} else {
					let extension = currentExtensions[value]
					if (extension) {
						if (extension.read) {
							position++ // skip filler byte
							return extension.read(read())
						} else if (extension.noBuffer) {
							position++ // skip filler byte
							return extension()
						} else
							return extension(src.subarray(position, ++position))
					} else
						throw new Error('Unknown extension ' + value)
				}
			case 0xd5:
				// fixext 2
				value = src[position]
				if (value == 0x72) {
					position++
					return recordDefinition(src[position++] & 0x3f, src[position++])
				} else
					return readExt(2)
			case 0xd6:
				// fixext 4
				return readExt(4)
			case 0xd7:
				// fixext 8
				return readExt(8)
			case 0xd8:
				// fixext 16
				return readExt(16)
			case 0xd9:
			// str 8
				value = src[position++]
				if (srcStringEnd >= position) {
					return srcString.slice(position - srcStringStart, (position += value) - srcStringStart)
				}
				return readString8(value)
			case 0xda:
			// str 16
				value = dataView.getUint16(position)
				position += 2
				if (srcStringEnd >= position) {
					return srcString.slice(position - srcStringStart, (position += value) - srcStringStart)
				}
				return readString16(value)
			case 0xdb:
			// str 32
				value = dataView.getUint32(position)
				position += 4
				if (srcStringEnd >= position) {
					return srcString.slice(position - srcStringStart, (position += value) - srcStringStart)
				}
				return readString32(value)
			case 0xdc:
			// array 16
				value = dataView.getUint16(position)
				position += 2
				return readArray(value)
			case 0xdd:
			// array 32
				value = dataView.getUint32(position)
				position += 4
				return readArray(value)
			case 0xde:
			// map 16
				value = dataView.getUint16(position)
				position += 2
				return readMap(value)
			case 0xdf:
			// map 32
				value = dataView.getUint32(position)
				position += 4
				return readMap(value)
			default: // negative int
				if (token >= 0xe0)
					return token - 0x100
				if (token === undefined) {
					let error = new Error('Unexpected end of MessagePack data')
					error.incomplete = true
					throw error
				}
				throw new Error('Unknown MessagePack token ' + token)

		}
	}
}
const validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/
function createStructureReader(structure, firstId) {
	function readObject() {
		// This initial function is quick to instantiate, but runs slower. After several iterations pay the cost to build the faster function
		if (readObject.count++ > inlineObjectReadThreshold) {
			let readObject = structure.read = (new Function('r', 'return function(){return ' + (currentUnpackr.freezeData ? 'Object.freeze' : '') +
				'({' + structure.map(key => key === '__proto__' ? '__proto_:r()' : validName.test(key) ? key + ':r()' : ('[' + JSON.stringify(key) + ']:r()')).join(',') + '})}'))(read)
			if (structure.highByte === 0)
				structure.read = createSecondByteReader(firstId, structure.read)
			return readObject() // second byte is already read, if there is one so immediately read object
		}
		let object = {}
		for (let i = 0, l = structure.length; i < l; i++) {
			let key = structure[i]
			if (key === '__proto__')
				key = '__proto_'
			object[key] = read()
		}
		if (currentUnpackr.freezeData)
			return Object.freeze(object);
		return object
	}
	readObject.count = 0
	if (structure.highByte === 0) {
		return createSecondByteReader(firstId, readObject)
	}
	return readObject
}

const createSecondByteReader = (firstId, read0) => {
	return function() {
		let highByte = src[position++]
		if (highByte === 0)
			return read0()
		let id = firstId < 32 ? -(firstId + (highByte << 5)) : firstId + (highByte << 5)
		let structure = currentStructures[id] || loadStructures()[id]
		if (!structure) {
			throw new Error('Record id is not defined for ' + id)
		}
		if (!structure.read)
			structure.read = createStructureReader(structure, firstId)
		return structure.read()
	}
}

function loadStructures() {
	let loadedStructures = saveState(() => {
		// save the state in case getStructures modifies our buffer
		src = null
		return currentUnpackr.getStructures()
	})
	return currentStructures = currentUnpackr._mergeStructures(loadedStructures, currentStructures)
}

var readFixedString = readStringJS
var readString8 = readStringJS
var readString16 = readStringJS
var readString32 = readStringJS
let isNativeAccelerationEnabled = false

function setExtractor(extractStrings) {
	isNativeAccelerationEnabled = true
	readFixedString = readString(1)
	readString8 = readString(2)
	readString16 = readString(3)
	readString32 = readString(5)
	function readString(headerLength) {
		return function readString(length) {
			let string = strings[stringPosition++]
			if (string == null) {
				if (bundledStrings)
					return readStringJS(length)
				let byteOffset = src.byteOffset
				let extraction = extractStrings(position - headerLength + byteOffset, srcEnd + byteOffset, src.buffer)
				if (typeof extraction == 'string') {
					string = extraction
					strings = EMPTY_ARRAY
				} else {
					strings = extraction
					stringPosition = 1
					srcStringEnd = 1 // even if a utf-8 string was decoded, must indicate we are in the midst of extracted strings and can't skip strings
					string = strings[0]
					if (string === undefined)
						throw new Error('Unexpected end of buffer')
				}
			}
			let srcStringLength = string.length
			if (srcStringLength <= length) {
				position += length
				return string
			}
			srcString = string
			srcStringStart = position
			srcStringEnd = position + srcStringLength
			position += length
			return string.slice(0, length) // we know we just want the beginning
		}
	}
}
function readStringJS(length) {
	let result
	if (length < 16) {
		if (result = shortStringInJS(length))
			return result
	}
	if (length > 64 && decoder)
		return decoder.decode(src.subarray(position, position += length))
	const end = position + length
	const units = []
	result = ''
	while (position < end) {
		const byte1 = src[position++]
		if ((byte1 & 0x80) === 0) {
			// 1 byte
			units.push(byte1)
		} else if ((byte1 & 0xe0) === 0xc0) {
			// 2 bytes
			const byte2 = src[position++] & 0x3f
			units.push(((byte1 & 0x1f) << 6) | byte2)
		} else if ((byte1 & 0xf0) === 0xe0) {
			// 3 bytes
			const byte2 = src[position++] & 0x3f
			const byte3 = src[position++] & 0x3f
			units.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3)
		} else if ((byte1 & 0xf8) === 0xf0) {
			// 4 bytes
			const byte2 = src[position++] & 0x3f
			const byte3 = src[position++] & 0x3f
			const byte4 = src[position++] & 0x3f
			let unit = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4
			if (unit > 0xffff) {
				unit -= 0x10000
				units.push(((unit >>> 10) & 0x3ff) | 0xd800)
				unit = 0xdc00 | (unit & 0x3ff)
			}
			units.push(unit)
		} else {
			units.push(byte1)
		}

		if (units.length >= 0x1000) {
			result += fromCharCode.apply(String, units)
			units.length = 0
		}
	}

	if (units.length > 0) {
		result += fromCharCode.apply(String, units)
	}

	return result
}
function readString(source, start, length) {
	let existingSrc = src;
	src = source;
	position = start;
	try {
		return readStringJS(length);
	} finally {
		src = existingSrc;
	}
}

function readArray(length) {
	let array = new Array(length)
	for (let i = 0; i < length; i++) {
		array[i] = read()
	}
	if (currentUnpackr.freezeData)
		return Object.freeze(array)
	return array
}

function readMap(length) {
	if (currentUnpackr.mapsAsObjects) {
		let object = {}
		for (let i = 0; i < length; i++) {
			let key = readKey()
			if (key === '__proto__')
				key = '__proto_';
			object[key] = read()
		}
		return object
	} else {
		let map = new Map()
		for (let i = 0; i < length; i++) {
			map.set(read(), read())
		}
		return map
	}
}

var fromCharCode = String.fromCharCode
function longStringInJS(length) {
	let start = position
	let bytes = new Array(length)
	for (let i = 0; i < length; i++) {
		const byte = src[position++];
		if ((byte & 0x80) > 0) {
				position = start
				return
			}
			bytes[i] = byte
		}
		return fromCharCode.apply(String, bytes)
}
function shortStringInJS(length) {
	if (length < 4) {
		if (length < 2) {
			if (length === 0)
				return ''
			else {
				let a = src[position++]
				if ((a & 0x80) > 1) {
					position -= 1
					return
				}
				return fromCharCode(a)
			}
		} else {
			let a = src[position++]
			let b = src[position++]
			if ((a & 0x80) > 0 || (b & 0x80) > 0) {
				position -= 2
				return
			}
			if (length < 3)
				return fromCharCode(a, b)
			let c = src[position++]
			if ((c & 0x80) > 0) {
				position -= 3
				return
			}
			return fromCharCode(a, b, c)
		}
	} else {
		let a = src[position++]
		let b = src[position++]
		let c = src[position++]
		let d = src[position++]
		if ((a & 0x80) > 0 || (b & 0x80) > 0 || (c & 0x80) > 0 || (d & 0x80) > 0) {
			position -= 4
			return
		}
		if (length < 6) {
			if (length === 4)
				return fromCharCode(a, b, c, d)
			else {
				let e = src[position++]
				if ((e & 0x80) > 0) {
					position -= 5
					return
				}
				return fromCharCode(a, b, c, d, e)
			}
		} else if (length < 8) {
			let e = src[position++]
			let f = src[position++]
			if ((e & 0x80) > 0 || (f & 0x80) > 0) {
				position -= 6
				return
			}
			if (length < 7)
				return fromCharCode(a, b, c, d, e, f)
			let g = src[position++]
			if ((g & 0x80) > 0) {
				position -= 7
				return
			}
			return fromCharCode(a, b, c, d, e, f, g)
		} else {
			let e = src[position++]
			let f = src[position++]
			let g = src[position++]
			let h = src[position++]
			if ((e & 0x80) > 0 || (f & 0x80) > 0 || (g & 0x80) > 0 || (h & 0x80) > 0) {
				position -= 8
				return
			}
			if (length < 10) {
				if (length === 8)
					return fromCharCode(a, b, c, d, e, f, g, h)
				else {
					let i = src[position++]
					if ((i & 0x80) > 0) {
						position -= 9
						return
					}
					return fromCharCode(a, b, c, d, e, f, g, h, i)
				}
			} else if (length < 12) {
				let i = src[position++]
				let j = src[position++]
				if ((i & 0x80) > 0 || (j & 0x80) > 0) {
					position -= 10
					return
				}
				if (length < 11)
					return fromCharCode(a, b, c, d, e, f, g, h, i, j)
				let k = src[position++]
				if ((k & 0x80) > 0) {
					position -= 11
					return
				}
				return fromCharCode(a, b, c, d, e, f, g, h, i, j, k)
			} else {
				let i = src[position++]
				let j = src[position++]
				let k = src[position++]
				let l = src[position++]
				if ((i & 0x80) > 0 || (j & 0x80) > 0 || (k & 0x80) > 0 || (l & 0x80) > 0) {
					position -= 12
					return
				}
				if (length < 14) {
					if (length === 12)
						return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l)
					else {
						let m = src[position++]
						if ((m & 0x80) > 0) {
							position -= 13
							return
						}
						return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m)
					}
				} else {
					let m = src[position++]
					let n = src[position++]
					if ((m & 0x80) > 0 || (n & 0x80) > 0) {
						position -= 14
						return
					}
					if (length < 15)
						return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
					let o = src[position++]
					if ((o & 0x80) > 0) {
						position -= 15
						return
					}
					return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
				}
			}
		}
	}
}

function readOnlyJSString() {
	let token = src[position++]
	let length
	if (token < 0xc0) {
		// fixstr
		length = token - 0xa0
	} else {
		switch(token) {
			case 0xd9:
			// str 8
				length = src[position++]
				break
			case 0xda:
			// str 16
				length = dataView.getUint16(position)
				position += 2
				break
			case 0xdb:
			// str 32
				length = dataView.getUint32(position)
				position += 4
				break
			default:
				throw new Error('Expected string')
		}
	}
	return readStringJS(length)
}


function readBin(length) {
	return currentUnpackr.copyBuffers ?
		// specifically use the copying slice (not the node one)
		Uint8Array.prototype.slice.call(src, position, position += length) :
		src.subarray(position, position += length)
}
function readExt(length) {
	let type = src[position++]
	if (currentExtensions[type]) {
		let end
		return currentExtensions[type](src.subarray(position, end = (position += length)), (readPosition) => {
			position = readPosition;
			try {
				return read();
			} finally {
				position = end;
			}
		})
	}
	else
		throw new Error('Unknown extension type ' + type)
}

var keyCache = new Array(4096)
function readKey() {
	let length = src[position++]
	if (length >= 0xa0 && length < 0xc0) {
		// fixstr, potentially use key cache
		length = length - 0xa0
		if (srcStringEnd >= position) // if it has been extracted, must use it (and faster anyway)
			return srcString.slice(position - srcStringStart, (position += length) - srcStringStart)
		else if (!(srcStringEnd == 0 && srcEnd < 180))
			return readFixedString(length)
	} else { // not cacheable, go back and do a standard read
		position--
		return asSafeString(read())
	}
	let key = ((length << 5) ^ (length > 1 ? dataView.getUint16(position) : length > 0 ? src[position] : 0)) & 0xfff
	let entry = keyCache[key]
	let checkPosition = position
	let end = position + length - 3
	let chunk
	let i = 0
	if (entry && entry.bytes == length) {
		while (checkPosition < end) {
			chunk = dataView.getUint32(checkPosition)
			if (chunk != entry[i++]) {
				checkPosition = 0x70000000
				break
			}
			checkPosition += 4
		}
		end += 3
		while (checkPosition < end) {
			chunk = src[checkPosition++]
			if (chunk != entry[i++]) {
				checkPosition = 0x70000000
				break
			}
		}
		if (checkPosition === end) {
			position = checkPosition
			return entry.string
		}
		end -= 3
		checkPosition = position
	}
	entry = []
	keyCache[key] = entry
	entry.bytes = length
	while (checkPosition < end) {
		chunk = dataView.getUint32(checkPosition)
		entry.push(chunk)
		checkPosition += 4
	}
	end += 3
	while (checkPosition < end) {
		chunk = src[checkPosition++]
		entry.push(chunk)
	}
	// for small blocks, avoiding the overhead of the extract call is helpful
	let string = length < 16 ? shortStringInJS(length) : longStringInJS(length)
	if (string != null)
		return entry.string = string
	return entry.string = readFixedString(length)
}

function asSafeString(property) {
	// protect against expensive (DoS) string conversions
	if (typeof property === 'string') return property;
	if (typeof property === 'number' || typeof property === 'boolean' || typeof property === 'bigint') return property.toString();
	if (property == null) return property + '';
	throw new Error('Invalid property type for record', typeof property);
}
// the registration of the record definition extension (as "r")
const recordDefinition = (id, highByte) => {
	let structure = read().map(asSafeString) // ensure that all keys are strings and
	// that the array is mutable
	let firstByte = id
	if (highByte !== undefined) {
		id = id < 32 ? -((highByte << 5) + id) : ((highByte << 5) + id)
		structure.highByte = highByte
	}
	let existingStructure = currentStructures[id]
	// If it is a shared structure, we need to restore any changes after reading.
	// Also in sequential mode, we may get incomplete reads and thus errors, and we need to restore
	// to the state prior to an incomplete read in order to properly resume.
	if (existingStructure && (existingStructure.isShared || sequentialMode)) {
		(currentStructures.restoreStructures || (currentStructures.restoreStructures = []))[id] = existingStructure
	}
	currentStructures[id] = structure
	structure.read = createStructureReader(structure, firstByte)
	return structure.read()
}
currentExtensions[0] = () => {} // notepack defines extension 0 to mean undefined, so use that as the default here
currentExtensions[0].noBuffer = true

currentExtensions[0x42] = (data) => {
	// decode bigint
	let length = data.length;
	let value = BigInt(data[0] & 0x80 ? data[0] - 0x100 : data[0]);
	for (let i = 1; i < length; i++) {
		value <<= 8n;
		value += BigInt(data[i]);
	}
	return value;
}

let errors = { Error, TypeError, ReferenceError };
currentExtensions[0x65] = () => {
	let data = read()
	return (errors[data[0]] || Error)(data[1], { cause: data[2] })
}

currentExtensions[0x69] = (data) => {
	// id extension (for structured clones)
	if (currentUnpackr.structuredClone === false) throw new Error('Structured clone extension is disabled')
	let id = dataView.getUint32(position - 4)
	if (!referenceMap)
		referenceMap = new Map()
	let token = src[position]
	let target
	// TODO: handle Maps, Sets, and other types that can cycle; this is complicated, because you potentially need to read
	// ahead past references to record structure definitions
	if (token >= 0x90 && token < 0xa0 || token == 0xdc || token == 0xdd)
		target = []
	else
		target = {}

	let refEntry = { target } // a placeholder object
	referenceMap.set(id, refEntry)
	let targetProperties = read() // read the next value as the target object to id
	if (refEntry.used) // there is a cycle, so we have to assign properties to original target
		return Object.assign(target, targetProperties)
	refEntry.target = targetProperties // the placeholder wasn't used, replace with the deserialized one
	return targetProperties // no cycle, can just use the returned read object
}

currentExtensions[0x70] = (data) => {
	// pointer extension (for structured clones)
	if (currentUnpackr.structuredClone === false) throw new Error('Structured clone extension is disabled')
	let id = dataView.getUint32(position - 4)
	let refEntry = referenceMap.get(id)
	refEntry.used = true
	return refEntry.target
}

currentExtensions[0x73] = () => new Set(read())

const typedArrays = ['Int8','Uint8','Uint8Clamped','Int16','Uint16','Int32','Uint32','Float32','Float64','BigInt64','BigUint64'].map(type => type + 'Array')

let glbl = typeof globalThis === 'object' ? globalThis : window;
currentExtensions[0x74] = (data) => {
	let typeCode = data[0]
	let typedArrayName = typedArrays[typeCode]
	if (!typedArrayName) {
		if (typeCode === 16) {
			let ab = new ArrayBuffer(data.length - 1)
			let u8 = new Uint8Array(ab)
			u8.set(data.subarray(1))
			return ab;
		}
		throw new Error('Could not find typed array for code ' + typeCode)
	}
	// we have to always slice/copy here to get a new ArrayBuffer that is word/byte aligned
	return new glbl[typedArrayName](Uint8Array.prototype.slice.call(data, 1).buffer)
}
currentExtensions[0x78] = () => {
	let data = read()
	return new RegExp(data[0], data[1])
}
const TEMP_BUNDLE = []
currentExtensions[0x62] = (data) => {
	let dataSize = (data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3]
	let dataPosition = position
	position += dataSize - data.length
	bundledStrings = TEMP_BUNDLE
	bundledStrings = [readOnlyJSString(), readOnlyJSString()]
	bundledStrings.position0 = 0
	bundledStrings.position1 = 0
	bundledStrings.postBundlePosition = position
	position = dataPosition
	return read()
}

currentExtensions[0xff] = (data) => {
	// 32-bit date extension
	if (data.length == 4)
		return new Date((data[0] * 0x1000000 + (data[1] << 16) + (data[2] << 8) + data[3]) * 1000)
	else if (data.length == 8)
		return new Date(
			((data[0] << 22) + (data[1] << 14) + (data[2] << 6) + (data[3] >> 2)) / 1000000 +
			((data[3] & 0x3) * 0x100000000 + data[4] * 0x1000000 + (data[5] << 16) + (data[6] << 8) + data[7]) * 1000)
	else if (data.length == 12)// TODO: Implement support for negative
		return new Date(
			((data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3]) / 1000000 +
			(((data[4] & 0x80) ? -0x1000000000000 : 0) + data[6] * 0x10000000000 + data[7] * 0x100000000 + data[8] * 0x1000000 + (data[9] << 16) + (data[10] << 8) + data[11]) * 1000)
	else
		return new Date('invalid')
} // notepack defines extension 0 to mean undefined, so use that as the default here
// registration of bulk record definition?
// currentExtensions[0x52] = () =>

function saveState(callback) {
	if (onSaveState)
		onSaveState();
	let savedSrcEnd = srcEnd
	let savedPosition = position
	let savedStringPosition = stringPosition
	let savedSrcStringStart = srcStringStart
	let savedSrcStringEnd = srcStringEnd
	let savedSrcString = srcString
	let savedStrings = strings
	let savedReferenceMap = referenceMap
	let savedBundledStrings = bundledStrings

	// TODO: We may need to revisit this if we do more external calls to user code (since it could be slow)
	let savedSrc = new Uint8Array(src.slice(0, srcEnd)) // we copy the data in case it changes while external data is processed
	let savedStructures = currentStructures
	let savedStructuresContents = currentStructures.slice(0, currentStructures.length)
	let savedPackr = currentUnpackr
	let savedSequentialMode = sequentialMode
	let value = callback()
	srcEnd = savedSrcEnd
	position = savedPosition
	stringPosition = savedStringPosition
	srcStringStart = savedSrcStringStart
	srcStringEnd = savedSrcStringEnd
	srcString = savedSrcString
	strings = savedStrings
	referenceMap = savedReferenceMap
	bundledStrings = savedBundledStrings
	src = savedSrc
	sequentialMode = savedSequentialMode
	currentStructures = savedStructures
	currentStructures.splice(0, currentStructures.length, ...savedStructuresContents)
	currentUnpackr = savedPackr
	dataView = new DataView(src.buffer, src.byteOffset, src.byteLength)
	return value
}
function clearSource() {
	src = null
	referenceMap = null
	currentStructures = null
}

function addExtension(extension) {
	if (extension.unpack)
		currentExtensions[extension.type] = extension.unpack
	else
		currentExtensions[extension.type] = extension
}

const mult10 = new Array(147) // this is a table matching binary exponents to the multiplier to determine significant digit rounding
for (let i = 0; i < 256; i++) {
	mult10[i] = +('1e' + Math.floor(45.15 - i * 0.30103))
}
const Decoder = Unpackr
var defaultUnpackr = new Unpackr({ useRecords: false })
const unpack = defaultUnpackr.unpack
const unpackMultiple = defaultUnpackr.unpackMultiple
const decode = defaultUnpackr.unpack
const FLOAT32_OPTIONS = {
	NEVER: 0,
	ALWAYS: 1,
	DECIMAL_ROUND: 3,
	DECIMAL_FIT: 4
}
let f32Array = new Float32Array(1)
let u8Array = new Uint8Array(f32Array.buffer, 0, 4)
function roundFloat32(float32Number) {
	f32Array[0] = float32Number
	let multiplier = mult10[((u8Array[3] & 0x7f) << 1) | (u8Array[2] >> 7)]
	return ((multiplier * float32Number + (float32Number > 0 ? 0.5 : -0.5)) >> 0) / multiplier
}
function setReadStruct(updatedReadStruct, loadedStructs, saveState) {
	readStruct = updatedReadStruct;
	onLoadedStructures = loadedStructs;
	onSaveState = saveState;
}


/***/ }),

/***/ "./node_modules/@colyseus/schema/build/umd/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@colyseus/schema/build/umd/index.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
     true ? factory(exports) :
    0;
})(this, (function (exports) { 'use strict';

    const SWITCH_TO_STRUCTURE = 255; // (decoding collides with DELETE_AND_ADD + fieldIndex = 63)
    const TYPE_ID = 213;
    /**
     * Encoding Schema field operations.
     */
    exports.OPERATION = void 0;
    (function (OPERATION) {
        OPERATION[OPERATION["ADD"] = 128] = "ADD";
        OPERATION[OPERATION["REPLACE"] = 0] = "REPLACE";
        OPERATION[OPERATION["DELETE"] = 64] = "DELETE";
        OPERATION[OPERATION["DELETE_AND_MOVE"] = 96] = "DELETE_AND_MOVE";
        OPERATION[OPERATION["MOVE_AND_ADD"] = 160] = "MOVE_AND_ADD";
        OPERATION[OPERATION["DELETE_AND_ADD"] = 192] = "DELETE_AND_ADD";
        /**
         * Collection operations
         */
        OPERATION[OPERATION["CLEAR"] = 10] = "CLEAR";
        /**
         * ArraySchema operations
         */
        OPERATION[OPERATION["REVERSE"] = 15] = "REVERSE";
        OPERATION[OPERATION["MOVE"] = 32] = "MOVE";
        OPERATION[OPERATION["DELETE_BY_REFID"] = 33] = "DELETE_BY_REFID";
        OPERATION[OPERATION["ADD_BY_REFID"] = 129] = "ADD_BY_REFID";
    })(exports.OPERATION || (exports.OPERATION = {}));

    Symbol.metadata ??= Symbol.for("Symbol.metadata");

    const $track = Symbol("$track");
    const $encoder = Symbol("$encoder");
    const $decoder = Symbol("$decoder");
    const $filter = Symbol("$filter");
    const $getByIndex = Symbol("$getByIndex");
    const $deleteByIndex = Symbol("$deleteByIndex");
    /**
     * Used to hold ChangeTree instances whitin the structures
     */
    const $changes = Symbol('$changes');
    /**
     * Used to keep track of the type of the child elements of a collection
     * (MapSchema, ArraySchema, etc.)
     */
    const $childType = Symbol('$childType');
    /**
     * Optional "discard" method for custom types (ArraySchema)
     * (Discards changes for next serialization)
     */
    const $onEncodeEnd = Symbol('$onEncodeEnd');
    /**
     * When decoding, this method is called after the instance is fully decoded
     */
    const $onDecodeEnd = Symbol("$onDecodeEnd");
    /**
     * Metadata
     */
    const $descriptors = Symbol("$descriptors");
    const $numFields = "$__numFields";
    const $refTypeFieldIndexes = "$__refTypeFieldIndexes";
    const $viewFieldIndexes = "$__viewFieldIndexes";
    const $fieldIndexesByViewTag = "$__fieldIndexesByViewTag";

    /**
     * Copyright (c) 2018 Endel Dreyer
     * Copyright (c) 2014 Ion Drive Software Ltd.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE
     */
    /**
     * msgpack implementation highly based on notepack.io
     * https://github.com/darrachequesne/notepack
     */
    let textEncoder;
    // @ts-ignore
    try {
        textEncoder = new TextEncoder();
    }
    catch (e) { }
    const _convoBuffer$1 = new ArrayBuffer(8);
    const _int32$1 = new Int32Array(_convoBuffer$1);
    const _float32$1 = new Float32Array(_convoBuffer$1);
    const _float64$1 = new Float64Array(_convoBuffer$1);
    const _int64$1 = new BigInt64Array(_convoBuffer$1);
    const hasBufferByteLength = (typeof Buffer !== 'undefined' && Buffer.byteLength);
    const utf8Length = (hasBufferByteLength)
        ? Buffer.byteLength // node
        : function (str, _) {
            var c = 0, length = 0;
            for (var i = 0, l = str.length; i < l; i++) {
                c = str.charCodeAt(i);
                if (c < 0x80) {
                    length += 1;
                }
                else if (c < 0x800) {
                    length += 2;
                }
                else if (c < 0xd800 || c >= 0xe000) {
                    length += 3;
                }
                else {
                    i++;
                    length += 4;
                }
            }
            return length;
        };
    function utf8Write(view, str, it) {
        var c = 0;
        for (var i = 0, l = str.length; i < l; i++) {
            c = str.charCodeAt(i);
            if (c < 0x80) {
                view[it.offset++] = c;
            }
            else if (c < 0x800) {
                view[it.offset] = 0xc0 | (c >> 6);
                view[it.offset + 1] = 0x80 | (c & 0x3f);
                it.offset += 2;
            }
            else if (c < 0xd800 || c >= 0xe000) {
                view[it.offset] = 0xe0 | (c >> 12);
                view[it.offset + 1] = 0x80 | (c >> 6 & 0x3f);
                view[it.offset + 2] = 0x80 | (c & 0x3f);
                it.offset += 3;
            }
            else {
                i++;
                c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                view[it.offset] = 0xf0 | (c >> 18);
                view[it.offset + 1] = 0x80 | (c >> 12 & 0x3f);
                view[it.offset + 2] = 0x80 | (c >> 6 & 0x3f);
                view[it.offset + 3] = 0x80 | (c & 0x3f);
                it.offset += 4;
            }
        }
    }
    function int8$1(bytes, value, it) {
        bytes[it.offset++] = value & 255;
    }
    function uint8$1(bytes, value, it) {
        bytes[it.offset++] = value & 255;
    }
    function int16$1(bytes, value, it) {
        bytes[it.offset++] = value & 255;
        bytes[it.offset++] = (value >> 8) & 255;
    }
    function uint16$1(bytes, value, it) {
        bytes[it.offset++] = value & 255;
        bytes[it.offset++] = (value >> 8) & 255;
    }
    function int32$1(bytes, value, it) {
        bytes[it.offset++] = value & 255;
        bytes[it.offset++] = (value >> 8) & 255;
        bytes[it.offset++] = (value >> 16) & 255;
        bytes[it.offset++] = (value >> 24) & 255;
    }
    function uint32$1(bytes, value, it) {
        const b4 = value >> 24;
        const b3 = value >> 16;
        const b2 = value >> 8;
        const b1 = value;
        bytes[it.offset++] = b1 & 255;
        bytes[it.offset++] = b2 & 255;
        bytes[it.offset++] = b3 & 255;
        bytes[it.offset++] = b4 & 255;
    }
    function int64$1(bytes, value, it) {
        const high = Math.floor(value / Math.pow(2, 32));
        const low = value >>> 0;
        uint32$1(bytes, low, it);
        uint32$1(bytes, high, it);
    }
    function uint64$1(bytes, value, it) {
        const high = (value / Math.pow(2, 32)) >> 0;
        const low = value >>> 0;
        uint32$1(bytes, low, it);
        uint32$1(bytes, high, it);
    }
    function bigint64$1(bytes, value, it) {
        _int64$1[0] = BigInt.asIntN(64, value);
        int32$1(bytes, _int32$1[0], it);
        int32$1(bytes, _int32$1[1], it);
    }
    function biguint64$1(bytes, value, it) {
        _int64$1[0] = BigInt.asIntN(64, value);
        int32$1(bytes, _int32$1[0], it);
        int32$1(bytes, _int32$1[1], it);
    }
    function float32$1(bytes, value, it) {
        _float32$1[0] = value;
        int32$1(bytes, _int32$1[0], it);
    }
    function float64$1(bytes, value, it) {
        _float64$1[0] = value;
        int32$1(bytes, _int32$1[0 ], it);
        int32$1(bytes, _int32$1[1 ], it);
    }
    function boolean$1(bytes, value, it) {
        bytes[it.offset++] = value ? 1 : 0; // uint8
    }
    function string$1(bytes, value, it) {
        // encode `null` strings as empty.
        if (!value) {
            value = "";
        }
        let length = utf8Length(value, "utf8");
        let size = 0;
        // fixstr
        if (length < 0x20) {
            bytes[it.offset++] = length | 0xa0;
            size = 1;
        }
        // str 8
        else if (length < 0x100) {
            bytes[it.offset++] = 0xd9;
            bytes[it.offset++] = length % 255;
            size = 2;
        }
        // str 16
        else if (length < 0x10000) {
            bytes[it.offset++] = 0xda;
            uint16$1(bytes, length, it);
            size = 3;
        }
        // str 32
        else if (length < 0x100000000) {
            bytes[it.offset++] = 0xdb;
            uint32$1(bytes, length, it);
            size = 5;
        }
        else {
            throw new Error('String too long');
        }
        utf8Write(bytes, value, it);
        return size + length;
    }
    function number$1(bytes, value, it) {
        if (isNaN(value)) {
            return number$1(bytes, 0, it);
        }
        else if (!isFinite(value)) {
            return number$1(bytes, (value > 0) ? Number.MAX_SAFE_INTEGER : -Number.MAX_SAFE_INTEGER, it);
        }
        else if (value !== (value | 0)) {
            if (Math.abs(value) <= 3.4028235e+38) { // range check
                _float32$1[0] = value;
                if (Math.abs(Math.abs(_float32$1[0]) - Math.abs(value)) < 1e-4) { // precision check; adjust 1e-n (n = precision) to in-/decrease acceptable precision loss
                    // now we know value is in range for f32 and has acceptable precision for f32
                    bytes[it.offset++] = 0xca;
                    float32$1(bytes, value, it);
                    return 5;
                }
            }
            bytes[it.offset++] = 0xcb;
            float64$1(bytes, value, it);
            return 9;
        }
        if (value >= 0) {
            // positive fixnum
            if (value < 0x80) {
                bytes[it.offset++] = value & 255; // uint8
                return 1;
            }
            // uint 8
            if (value < 0x100) {
                bytes[it.offset++] = 0xcc;
                bytes[it.offset++] = value & 255; // uint8
                return 2;
            }
            // uint 16
            if (value < 0x10000) {
                bytes[it.offset++] = 0xcd;
                uint16$1(bytes, value, it);
                return 3;
            }
            // uint 32
            if (value < 0x100000000) {
                bytes[it.offset++] = 0xce;
                uint32$1(bytes, value, it);
                return 5;
            }
            // uint 64
            bytes[it.offset++] = 0xcf;
            uint64$1(bytes, value, it);
            return 9;
        }
        else {
            // negative fixnum
            if (value >= -32) {
                bytes[it.offset++] = 0xe0 | (value + 0x20);
                return 1;
            }
            // int 8
            if (value >= -128) {
                bytes[it.offset++] = 0xd0;
                int8$1(bytes, value, it);
                return 2;
            }
            // int 16
            if (value >= -32768) {
                bytes[it.offset++] = 0xd1;
                int16$1(bytes, value, it);
                return 3;
            }
            // int 32
            if (value >= -2147483648) {
                bytes[it.offset++] = 0xd2;
                int32$1(bytes, value, it);
                return 5;
            }
            // int 64
            bytes[it.offset++] = 0xd3;
            int64$1(bytes, value, it);
            return 9;
        }
    }
    const encode = {
        int8: int8$1,
        uint8: uint8$1,
        int16: int16$1,
        uint16: uint16$1,
        int32: int32$1,
        uint32: uint32$1,
        int64: int64$1,
        uint64: uint64$1,
        bigint64: bigint64$1,
        biguint64: biguint64$1,
        float32: float32$1,
        float64: float64$1,
        boolean: boolean$1,
        string: string$1,
        number: number$1,
        utf8Write,
        utf8Length,
    };

    /**
     * Copyright (c) 2018 Endel Dreyer
     * Copyright (c) 2014 Ion Drive Software Ltd.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE
     */
    // force little endian to facilitate decoding on multiple implementations
    const _convoBuffer = new ArrayBuffer(8);
    const _int32 = new Int32Array(_convoBuffer);
    const _float32 = new Float32Array(_convoBuffer);
    const _float64 = new Float64Array(_convoBuffer);
    const _uint64 = new BigUint64Array(_convoBuffer);
    const _int64 = new BigInt64Array(_convoBuffer);
    function utf8Read(bytes, it, length) {
        var string = '', chr = 0;
        for (var i = it.offset, end = it.offset + length; i < end; i++) {
            var byte = bytes[i];
            if ((byte & 0x80) === 0x00) {
                string += String.fromCharCode(byte);
                continue;
            }
            if ((byte & 0xe0) === 0xc0) {
                string += String.fromCharCode(((byte & 0x1f) << 6) |
                    (bytes[++i] & 0x3f));
                continue;
            }
            if ((byte & 0xf0) === 0xe0) {
                string += String.fromCharCode(((byte & 0x0f) << 12) |
                    ((bytes[++i] & 0x3f) << 6) |
                    ((bytes[++i] & 0x3f) << 0));
                continue;
            }
            if ((byte & 0xf8) === 0xf0) {
                chr = ((byte & 0x07) << 18) |
                    ((bytes[++i] & 0x3f) << 12) |
                    ((bytes[++i] & 0x3f) << 6) |
                    ((bytes[++i] & 0x3f) << 0);
                if (chr >= 0x010000) { // surrogate pair
                    chr -= 0x010000;
                    string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
                }
                else {
                    string += String.fromCharCode(chr);
                }
                continue;
            }
            console.error('Invalid byte ' + byte.toString(16));
            // (do not throw error to avoid server/client from crashing due to hack attemps)
            // throw new Error('Invalid byte ' + byte.toString(16));
        }
        it.offset += length;
        return string;
    }
    function int8(bytes, it) {
        return uint8(bytes, it) << 24 >> 24;
    }
    function uint8(bytes, it) {
        return bytes[it.offset++];
    }
    function int16(bytes, it) {
        return uint16(bytes, it) << 16 >> 16;
    }
    function uint16(bytes, it) {
        return bytes[it.offset++] | bytes[it.offset++] << 8;
    }
    function int32(bytes, it) {
        return bytes[it.offset++] | bytes[it.offset++] << 8 | bytes[it.offset++] << 16 | bytes[it.offset++] << 24;
    }
    function uint32(bytes, it) {
        return int32(bytes, it) >>> 0;
    }
    function float32(bytes, it) {
        _int32[0] = int32(bytes, it);
        return _float32[0];
    }
    function float64(bytes, it) {
        _int32[0 ] = int32(bytes, it);
        _int32[1 ] = int32(bytes, it);
        return _float64[0];
    }
    function int64(bytes, it) {
        const low = uint32(bytes, it);
        const high = int32(bytes, it) * Math.pow(2, 32);
        return high + low;
    }
    function uint64(bytes, it) {
        const low = uint32(bytes, it);
        const high = uint32(bytes, it) * Math.pow(2, 32);
        return high + low;
    }
    function bigint64(bytes, it) {
        _int32[0] = int32(bytes, it);
        _int32[1] = int32(bytes, it);
        return _int64[0];
    }
    function biguint64(bytes, it) {
        _int32[0] = int32(bytes, it);
        _int32[1] = int32(bytes, it);
        return _uint64[0];
    }
    function boolean(bytes, it) {
        return uint8(bytes, it) > 0;
    }
    function string(bytes, it) {
        const prefix = bytes[it.offset++];
        let length;
        if (prefix < 0xc0) {
            // fixstr
            length = prefix & 0x1f;
        }
        else if (prefix === 0xd9) {
            length = uint8(bytes, it);
        }
        else if (prefix === 0xda) {
            length = uint16(bytes, it);
        }
        else if (prefix === 0xdb) {
            length = uint32(bytes, it);
        }
        return utf8Read(bytes, it, length);
    }
    function number(bytes, it) {
        const prefix = bytes[it.offset++];
        if (prefix < 0x80) {
            // positive fixint
            return prefix;
        }
        else if (prefix === 0xca) {
            // float 32
            return float32(bytes, it);
        }
        else if (prefix === 0xcb) {
            // float 64
            return float64(bytes, it);
        }
        else if (prefix === 0xcc) {
            // uint 8
            return uint8(bytes, it);
        }
        else if (prefix === 0xcd) {
            // uint 16
            return uint16(bytes, it);
        }
        else if (prefix === 0xce) {
            // uint 32
            return uint32(bytes, it);
        }
        else if (prefix === 0xcf) {
            // uint 64
            return uint64(bytes, it);
        }
        else if (prefix === 0xd0) {
            // int 8
            return int8(bytes, it);
        }
        else if (prefix === 0xd1) {
            // int 16
            return int16(bytes, it);
        }
        else if (prefix === 0xd2) {
            // int 32
            return int32(bytes, it);
        }
        else if (prefix === 0xd3) {
            // int 64
            return int64(bytes, it);
        }
        else if (prefix > 0xdf) {
            // negative fixint
            return (0xff - prefix + 1) * -1;
        }
    }
    function stringCheck(bytes, it) {
        const prefix = bytes[it.offset];
        return (
        // fixstr
        (prefix < 0xc0 && prefix > 0xa0) ||
            // str 8
            prefix === 0xd9 ||
            // str 16
            prefix === 0xda ||
            // str 32
            prefix === 0xdb);
    }
    const decode = {
        utf8Read,
        int8,
        uint8,
        int16,
        uint16,
        int32,
        uint32,
        float32,
        float64,
        int64,
        uint64,
        bigint64,
        biguint64,
        boolean,
        string,
        number,
        stringCheck,
    };

    const registeredTypes = {};
    const identifiers = new Map();
    function registerType(identifier, definition) {
        if (definition.constructor) {
            identifiers.set(definition.constructor, identifier);
            registeredTypes[identifier] = definition;
        }
        if (definition.encode) {
            encode[identifier] = definition.encode;
        }
        if (definition.decode) {
            decode[identifier] = definition.decode;
        }
    }
    function getType(identifier) {
        return registeredTypes[identifier];
    }
    function defineCustomTypes(types) {
        for (const identifier in types) {
            registerType(identifier, types[identifier]);
        }
        return (t) => type(t);
    }

    class TypeContext {
        /**
         * For inheritance support
         * Keeps track of which classes extends which. (parent -> children)
         */
        static { this.inheritedTypes = new Map(); }
        static register(target) {
            const parent = Object.getPrototypeOf(target);
            if (parent !== Schema) {
                let inherits = TypeContext.inheritedTypes.get(parent);
                if (!inherits) {
                    inherits = new Set();
                    TypeContext.inheritedTypes.set(parent, inherits);
                }
                inherits.add(target);
            }
        }
        constructor(rootClass) {
            this.types = {};
            this.schemas = new Map();
            this.hasFilters = false;
            this.parentFiltered = {};
            if (rootClass) {
                //
                // TODO:
                //      cache "discoverTypes" results for each rootClass
                //      to avoid re-discovering types for each new context/room
                //
                this.discoverTypes(rootClass);
            }
        }
        has(schema) {
            return this.schemas.has(schema);
        }
        get(typeid) {
            return this.types[typeid];
        }
        add(schema, typeid = this.schemas.size) {
            // skip if already registered
            if (this.schemas.has(schema)) {
                return false;
            }
            this.types[typeid] = schema;
            //
            // Workaround to allow using an empty Schema (with no `@type()` fields)
            //
            if (schema[Symbol.metadata] === undefined) {
                Metadata.initialize(schema);
            }
            this.schemas.set(schema, typeid);
            return true;
        }
        getTypeId(klass) {
            return this.schemas.get(klass);
        }
        discoverTypes(klass, parentType, parentIndex, parentHasViewTag) {
            if (parentHasViewTag) {
                this.registerFilteredByParent(klass, parentType, parentIndex);
            }
            // skip if already registered
            if (!this.add(klass)) {
                return;
            }
            // add classes inherited from this base class
            TypeContext.inheritedTypes.get(klass)?.forEach((child) => {
                this.discoverTypes(child, parentType, parentIndex, parentHasViewTag);
            });
            // add parent classes
            let parent = klass;
            while ((parent = Object.getPrototypeOf(parent)) &&
                parent !== Schema && // stop at root (Schema)
                parent !== Function.prototype // stop at root (non-Schema)
            ) {
                this.discoverTypes(parent);
            }
            const metadata = (klass[Symbol.metadata] ??= {});
            // if any schema/field has filters, mark "context" as having filters.
            if (metadata[$viewFieldIndexes]) {
                this.hasFilters = true;
            }
            for (const fieldIndex in metadata) {
                const index = fieldIndex;
                const fieldType = metadata[index].type;
                const fieldHasViewTag = (metadata[index].tag !== undefined);
                if (typeof (fieldType) === "string") {
                    continue;
                }
                if (Array.isArray(fieldType)) {
                    const type = fieldType[0];
                    // skip primitive types
                    if (type === "string") {
                        continue;
                    }
                    this.discoverTypes(type, klass, index, parentHasViewTag || fieldHasViewTag);
                }
                else if (typeof (fieldType) === "function") {
                    this.discoverTypes(fieldType, klass, index, parentHasViewTag || fieldHasViewTag);
                }
                else {
                    const type = Object.values(fieldType)[0];
                    // skip primitive types
                    if (typeof (type) === "string") {
                        continue;
                    }
                    this.discoverTypes(type, klass, index, parentHasViewTag || fieldHasViewTag);
                }
            }
        }
        /**
         * Keep track of which classes have filters applied.
         * Format: `${typeid}-${parentTypeid}-${parentIndex}`
         */
        registerFilteredByParent(schema, parentType, parentIndex) {
            const typeid = this.schemas.get(schema) ?? this.schemas.size;
            let key = `${typeid}`;
            if (parentType) {
                key += `-${this.schemas.get(parentType)}`;
            }
            key += `-${parentIndex}`;
            this.parentFiltered[key] = true;
        }
        debug() {
            let parentFiltered = "";
            for (const key in this.parentFiltered) {
                const keys = key.split("-").map(Number);
                const fieldIndex = keys.pop();
                parentFiltered += `\n\t\t`;
                parentFiltered += `${key}: ${keys.reverse().map((id, i) => {
                const klass = this.types[id];
                const metadata = klass[Symbol.metadata];
                let txt = klass.name;
                if (i === 0) {
                    txt += `[${metadata[fieldIndex].name}]`;
                }
                return `${txt}`;
            }).join(" -> ")}`;
            }
            return `TypeContext ->\n` +
                `\tSchema types: ${this.schemas.size}\n` +
                `\thasFilters: ${this.hasFilters}\n` +
                `\tparentFiltered:${parentFiltered}`;
        }
    }

    function getNormalizedType(type) {
        return (Array.isArray(type))
            ? { array: type[0] }
            : (typeof (type['type']) !== "undefined")
                ? type['type']
                : type;
    }
    const Metadata = {
        addField(metadata, index, name, type, descriptor) {
            if (index > 64) {
                throw new Error(`Can't define field '${name}'.\nSchema instances may only have up to 64 fields.`);
            }
            metadata[index] = Object.assign(metadata[index] || {}, // avoid overwriting previous field metadata (@owned / @deprecated)
            {
                type: getNormalizedType(type),
                index,
                name,
            });
            // create "descriptors" map
            Object.defineProperty(metadata, $descriptors, {
                value: metadata[$descriptors] || {},
                enumerable: false,
                configurable: true,
            });
            if (descriptor) {
                // for encoder
                metadata[$descriptors][name] = descriptor;
                metadata[$descriptors][`_${name}`] = {
                    value: undefined,
                    writable: true,
                    enumerable: false,
                    configurable: true,
                };
            }
            else {
                // for decoder
                metadata[$descriptors][name] = {
                    value: undefined,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                };
            }
            // map -1 as last field index
            Object.defineProperty(metadata, $numFields, {
                value: index,
                enumerable: false,
                configurable: true
            });
            // map field name => index (non enumerable)
            Object.defineProperty(metadata, name, {
                value: index,
                enumerable: false,
                configurable: true,
            });
            // if child Ref/complex type, add to -4
            if (typeof (metadata[index].type) !== "string") {
                if (metadata[$refTypeFieldIndexes] === undefined) {
                    Object.defineProperty(metadata, $refTypeFieldIndexes, {
                        value: [],
                        enumerable: false,
                        configurable: true,
                    });
                }
                metadata[$refTypeFieldIndexes].push(index);
            }
        },
        setTag(metadata, fieldName, tag) {
            const index = metadata[fieldName];
            const field = metadata[index];
            // add 'tag' to the field
            field.tag = tag;
            if (!metadata[$viewFieldIndexes]) {
                // -2: all field indexes with "view" tag
                Object.defineProperty(metadata, $viewFieldIndexes, {
                    value: [],
                    enumerable: false,
                    configurable: true
                });
                // -3: field indexes by "view" tag
                Object.defineProperty(metadata, $fieldIndexesByViewTag, {
                    value: {},
                    enumerable: false,
                    configurable: true
                });
            }
            metadata[$viewFieldIndexes].push(index);
            if (!metadata[$fieldIndexesByViewTag][tag]) {
                metadata[$fieldIndexesByViewTag][tag] = [];
            }
            metadata[$fieldIndexesByViewTag][tag].push(index);
        },
        setFields(target, fields) {
            // for inheritance support
            const constructor = target.prototype.constructor;
            TypeContext.register(constructor);
            const parentClass = Object.getPrototypeOf(constructor);
            const parentMetadata = parentClass && parentClass[Symbol.metadata];
            const metadata = Metadata.initialize(constructor);
            // Use Schema's methods if not defined in the class
            if (!constructor[$track]) {
                constructor[$track] = Schema[$track];
            }
            if (!constructor[$encoder]) {
                constructor[$encoder] = Schema[$encoder];
            }
            if (!constructor[$decoder]) {
                constructor[$decoder] = Schema[$decoder];
            }
            if (!constructor.prototype.toJSON) {
                constructor.prototype.toJSON = Schema.prototype.toJSON;
            }
            //
            // detect index for this field, considering inheritance
            //
            let fieldIndex = metadata[$numFields] // current structure already has fields defined
                ?? (parentMetadata && parentMetadata[$numFields]) // parent structure has fields defined
                ?? -1; // no fields defined
            fieldIndex++;
            for (const field in fields) {
                const type = fields[field];
                // FIXME: this code is duplicated from @type() annotation
                const complexTypeKlass = (Array.isArray(type))
                    ? getType("array")
                    : (typeof (Object.keys(type)[0]) === "string") && getType(Object.keys(type)[0]);
                const childType = (complexTypeKlass)
                    ? Object.values(type)[0]
                    : getNormalizedType(type);
                Metadata.addField(metadata, fieldIndex, field, type, getPropertyDescriptor(`_${field}`, fieldIndex, childType, complexTypeKlass));
                fieldIndex++;
            }
            return target;
        },
        isDeprecated(metadata, field) {
            return metadata[field].deprecated === true;
        },
        init(klass) {
            //
            // Used only to initialize an empty Schema (Encoder#constructor)
            // TODO: remove/refactor this...
            //
            const metadata = {};
            klass[Symbol.metadata] = metadata;
            Object.defineProperty(metadata, $numFields, {
                value: 0,
                enumerable: false,
                configurable: true,
            });
        },
        initialize(constructor) {
            const parentClass = Object.getPrototypeOf(constructor);
            const parentMetadata = parentClass[Symbol.metadata];
            let metadata = constructor[Symbol.metadata] ?? Object.create(null);
            // make sure inherited classes have their own metadata object.
            if (parentClass !== Schema && metadata === parentMetadata) {
                metadata = Object.create(null);
                if (parentMetadata) {
                    //
                    // assign parent metadata to current
                    //
                    Object.setPrototypeOf(metadata, parentMetadata);
                    // $numFields
                    Object.defineProperty(metadata, $numFields, {
                        value: parentMetadata[$numFields],
                        enumerable: false,
                        configurable: true,
                        writable: true,
                    });
                    // $viewFieldIndexes / $fieldIndexesByViewTag
                    if (parentMetadata[$viewFieldIndexes] !== undefined) {
                        Object.defineProperty(metadata, $viewFieldIndexes, {
                            value: [...parentMetadata[$viewFieldIndexes]],
                            enumerable: false,
                            configurable: true,
                            writable: true,
                        });
                        Object.defineProperty(metadata, $fieldIndexesByViewTag, {
                            value: { ...parentMetadata[$fieldIndexesByViewTag] },
                            enumerable: false,
                            configurable: true,
                            writable: true,
                        });
                    }
                    // $refTypeFieldIndexes
                    if (parentMetadata[$refTypeFieldIndexes] !== undefined) {
                        Object.defineProperty(metadata, $refTypeFieldIndexes, {
                            value: [...parentMetadata[$refTypeFieldIndexes]],
                            enumerable: false,
                            configurable: true,
                            writable: true,
                        });
                    }
                    // $descriptors
                    Object.defineProperty(metadata, $descriptors, {
                        value: { ...parentMetadata[$descriptors] },
                        enumerable: false,
                        configurable: true,
                        writable: true,
                    });
                }
            }
            constructor[Symbol.metadata] = metadata;
            return metadata;
        },
        isValidInstance(klass) {
            return (klass.constructor[Symbol.metadata] &&
                Object.prototype.hasOwnProperty.call(klass.constructor[Symbol.metadata], $numFields));
        },
        getFields(klass) {
            const metadata = klass[Symbol.metadata];
            const fields = {};
            for (let i = 0; i <= metadata[$numFields]; i++) {
                fields[metadata[i].name] = metadata[i].type;
            }
            return fields;
        }
    };

    function setOperationAtIndex(changeSet, index) {
        const operationsIndex = changeSet.indexes[index];
        if (operationsIndex === undefined) {
            changeSet.indexes[index] = changeSet.operations.push(index) - 1;
        }
        else {
            changeSet.operations[operationsIndex] = index;
        }
    }
    function deleteOperationAtIndex(changeSet, index) {
        const operationsIndex = changeSet.indexes[index];
        if (operationsIndex !== undefined) {
            changeSet.operations[operationsIndex] = undefined;
        }
        delete changeSet.indexes[index];
    }
    function enqueueChangeTree(root, changeTree, changeSet, queueRootIndex = changeTree[changeSet].queueRootIndex) {
        if (root && root[changeSet][queueRootIndex] !== changeTree) {
            changeTree[changeSet].queueRootIndex = root[changeSet].push(changeTree) - 1;
        }
    }
    class ChangeTree {
        constructor(ref) {
            /**
             * Whether this structure is parent of a filtered structure.
             */
            this.isFiltered = false;
            this.indexedOperations = {};
            //
            // TODO:
            //   try storing the index + operation per item.
            //   example: 1024 & 1025 => ADD, 1026 => DELETE
            //
            // => https://chatgpt.com/share/67107d0c-bc20-8004-8583-83b17dd7c196
            //
            this.changes = { indexes: {}, operations: [] };
            this.allChanges = { indexes: {}, operations: [] };
            /**
             * Is this a new instance? Used on ArraySchema to determine OPERATION.MOVE_AND_ADD operation.
             */
            this.isNew = true;
            this.ref = ref;
            //
            // Does this structure have "filters" declared?
            //
            const metadata = ref.constructor[Symbol.metadata];
            if (metadata?.[$viewFieldIndexes]) {
                this.allFilteredChanges = { indexes: {}, operations: [] };
                this.filteredChanges = { indexes: {}, operations: [] };
            }
        }
        setRoot(root) {
            this.root = root;
            this.checkIsFiltered(this.parent, this.parentIndex);
            // Recursively set root on child structures
            const metadata = this.ref.constructor[Symbol.metadata];
            if (metadata) {
                metadata[$refTypeFieldIndexes]?.forEach((index) => {
                    const field = metadata[index];
                    const value = this.ref[field.name];
                    value?.[$changes].setRoot(root);
                });
            }
            else if (this.ref[$childType] && typeof (this.ref[$childType]) !== "string") {
                // MapSchema / ArraySchema, etc.
                this.ref.forEach((value, key) => {
                    value[$changes].setRoot(root);
                });
            }
        }
        setParent(parent, root, parentIndex) {
            this.parent = parent;
            this.parentIndex = parentIndex;
            // avoid setting parents with empty `root`
            if (!root) {
                return;
            }
            // skip if parent is already set
            if (root !== this.root) {
                this.root = root;
                this.checkIsFiltered(parent, parentIndex);
            }
            else {
                root.add(this);
            }
            // assign same parent on child structures
            const metadata = this.ref.constructor[Symbol.metadata];
            if (metadata) {
                metadata[$refTypeFieldIndexes]?.forEach((index) => {
                    const field = metadata[index];
                    const value = this.ref[field.name];
                    value?.[$changes].setParent(this.ref, root, index);
                });
            }
            else if (this.ref[$childType] && typeof (this.ref[$childType]) !== "string") {
                // MapSchema / ArraySchema, etc.
                this.ref.forEach((value, key) => {
                    value[$changes].setParent(this.ref, root, this.indexes[key] ?? key);
                });
            }
        }
        forEachChild(callback) {
            //
            // assign same parent on child structures
            //
            const metadata = this.ref.constructor[Symbol.metadata];
            if (metadata) {
                metadata[$refTypeFieldIndexes]?.forEach((index) => {
                    const field = metadata[index];
                    const value = this.ref[field.name];
                    if (value) {
                        callback(value[$changes], index);
                    }
                });
            }
            else if (this.ref[$childType] && typeof (this.ref[$childType]) !== "string") {
                // MapSchema / ArraySchema, etc.
                this.ref.forEach((value, key) => {
                    callback(value[$changes], this.indexes[key] ?? key);
                });
            }
        }
        operation(op) {
            // operations without index use negative values to represent them
            // this is checked during .encode() time.
            this.changes.operations.push(-op);
            enqueueChangeTree(this.root, this, 'changes');
        }
        change(index, operation = exports.OPERATION.ADD) {
            const metadata = this.ref.constructor[Symbol.metadata];
            const isFiltered = this.isFiltered || (metadata?.[index]?.tag !== undefined);
            const changeSet = (isFiltered)
                ? this.filteredChanges
                : this.changes;
            const previousOperation = this.indexedOperations[index];
            if (!previousOperation || previousOperation === exports.OPERATION.DELETE) {
                const op = (!previousOperation)
                    ? operation
                    : (previousOperation === exports.OPERATION.DELETE)
                        ? exports.OPERATION.DELETE_AND_ADD
                        : operation;
                //
                // TODO: are DELETE operations being encoded as ADD here ??
                //
                this.indexedOperations[index] = op;
            }
            setOperationAtIndex(changeSet, index);
            if (isFiltered) {
                setOperationAtIndex(this.allFilteredChanges, index);
                if (this.root) {
                    enqueueChangeTree(this.root, this, 'filteredChanges');
                    enqueueChangeTree(this.root, this, 'allFilteredChanges');
                }
            }
            else {
                setOperationAtIndex(this.allChanges, index);
                enqueueChangeTree(this.root, this, 'changes');
            }
        }
        shiftChangeIndexes(shiftIndex) {
            //
            // Used only during:
            //
            // - ArraySchema#unshift()
            //
            const changeSet = (this.isFiltered)
                ? this.filteredChanges
                : this.changes;
            const newIndexedOperations = {};
            const newIndexes = {};
            for (const index in this.indexedOperations) {
                newIndexedOperations[Number(index) + shiftIndex] = this.indexedOperations[index];
                newIndexes[Number(index) + shiftIndex] = changeSet[index];
            }
            this.indexedOperations = newIndexedOperations;
            changeSet.indexes = newIndexes;
            changeSet.operations = changeSet.operations.map((index) => index + shiftIndex);
        }
        shiftAllChangeIndexes(shiftIndex, startIndex = 0) {
            //
            // Used only during:
            //
            // - ArraySchema#splice()
            //
            if (this.filteredChanges !== undefined) {
                this._shiftAllChangeIndexes(shiftIndex, startIndex, this.allFilteredChanges);
                this._shiftAllChangeIndexes(shiftIndex, startIndex, this.allChanges);
            }
            else {
                this._shiftAllChangeIndexes(shiftIndex, startIndex, this.allChanges);
            }
        }
        _shiftAllChangeIndexes(shiftIndex, startIndex = 0, changeSet) {
            const newIndexes = {};
            for (const key in changeSet.indexes) {
                const index = changeSet.indexes[key];
                if (index > startIndex) {
                    newIndexes[Number(key) + shiftIndex] = index;
                }
                else {
                    newIndexes[key] = index;
                }
            }
            changeSet.indexes = newIndexes;
            for (let i = 0; i < changeSet.operations.length; i++) {
                const index = changeSet.operations[i];
                if (index > startIndex) {
                    changeSet.operations[i] = index + shiftIndex;
                }
            }
        }
        indexedOperation(index, operation, allChangesIndex = index) {
            this.indexedOperations[index] = operation;
            if (this.filteredChanges !== undefined) {
                setOperationAtIndex(this.allFilteredChanges, allChangesIndex);
                setOperationAtIndex(this.filteredChanges, index);
                enqueueChangeTree(this.root, this, 'filteredChanges');
            }
            else {
                setOperationAtIndex(this.allChanges, allChangesIndex);
                setOperationAtIndex(this.changes, index);
                enqueueChangeTree(this.root, this, 'changes');
            }
        }
        getType(index) {
            if (Metadata.isValidInstance(this.ref)) {
                const metadata = this.ref.constructor[Symbol.metadata];
                return metadata[index].type;
            }
            else {
                //
                // Get the child type from parent structure.
                // - ["string"] => "string"
                // - { map: "string" } => "string"
                // - { set: "string" } => "string"
                //
                return this.ref[$childType];
            }
        }
        getChange(index) {
            return this.indexedOperations[index];
        }
        //
        // used during `.encode()`
        //
        getValue(index, isEncodeAll = false) {
            //
            // `isEncodeAll` param is only used by ArraySchema
            //
            return this.ref[$getByIndex](index, isEncodeAll);
        }
        delete(index, operation, allChangesIndex = index) {
            if (index === undefined) {
                try {
                    throw new Error(`@colyseus/schema ${this.ref.constructor.name}: trying to delete non-existing index '${index}'`);
                }
                catch (e) {
                    console.warn(e);
                }
                return;
            }
            const changeSet = (this.filteredChanges !== undefined)
                ? this.filteredChanges
                : this.changes;
            this.indexedOperations[index] = operation ?? exports.OPERATION.DELETE;
            setOperationAtIndex(changeSet, index);
            const previousValue = this.getValue(index);
            // remove `root` reference
            if (previousValue && previousValue[$changes]) {
                //
                // FIXME: this.root is "undefined"
                //
                // This method is being called at decoding time when a DELETE operation is found.
                //
                // - This is due to using the concrete Schema class at decoding time.
                // - "Reflected" structures do not have this problem.
                //
                // (The property descriptors should NOT be used at decoding time. only at encoding time.)
                //
                this.root?.remove(previousValue[$changes]);
            }
            deleteOperationAtIndex(this.allChanges, allChangesIndex);
            //
            // FIXME: this is looking a ugly and repeated
            //
            if (this.filteredChanges !== undefined) {
                deleteOperationAtIndex(this.allFilteredChanges, allChangesIndex);
                enqueueChangeTree(this.root, this, 'filteredChanges');
            }
            else {
                enqueueChangeTree(this.root, this, 'changes');
            }
            return previousValue;
        }
        endEncode() {
            this.indexedOperations = {};
            // // clear changes
            // this.changes.indexes = {};
            // this.changes.operations.length = 0;
            // ArraySchema and MapSchema have a custom "encode end" method
            this.ref[$onEncodeEnd]?.();
            // Not a new instance anymore
            this.isNew = false;
        }
        discard(discardAll = false) {
            //
            // > MapSchema:
            //      Remove cached key to ensure ADD operations is unsed instead of
            //      REPLACE in case same key is used on next patches.
            //
            this.ref[$onEncodeEnd]?.();
            this.indexedOperations = {};
            this.changes.indexes = {};
            this.changes.operations.length = 0;
            this.changes.queueRootIndex = undefined;
            if (this.filteredChanges !== undefined) {
                this.filteredChanges.indexes = {};
                this.filteredChanges.operations.length = 0;
                this.filteredChanges.queueRootIndex = undefined;
            }
            if (discardAll) {
                this.allChanges.indexes = {};
                this.allChanges.operations.length = 0;
                if (this.allFilteredChanges !== undefined) {
                    this.allFilteredChanges.indexes = {};
                    this.allFilteredChanges.operations.length = 0;
                }
                // remove children references
                this.forEachChild((changeTree, _) => this.root?.remove(changeTree));
            }
        }
        /**
         * Recursively discard all changes from this, and child structures.
         */
        discardAll() {
            const keys = Object.keys(this.indexedOperations);
            for (let i = 0, len = keys.length; i < len; i++) {
                const value = this.getValue(Number(keys[i]));
                if (value && value[$changes]) {
                    value[$changes].discardAll();
                }
            }
            this.discard();
        }
        ensureRefId() {
            // skip if refId is already set.
            if (this.refId !== undefined) {
                return;
            }
            this.refId = this.root.getNextUniqueId();
        }
        get changed() {
            return (Object.entries(this.indexedOperations).length > 0);
        }
        checkIsFiltered(parent, parentIndex) {
            const isNewChangeTree = this.root.add(this);
            if (this.root.types.hasFilters) {
                //
                // At Schema initialization, the "root" structure might not be available
                // yet, as it only does once the "Encoder" has been set up.
                //
                // So the "parent" may be already set without a "root".
                //
                this._checkFilteredByParent(parent, parentIndex);
                if (this.filteredChanges !== undefined) {
                    enqueueChangeTree(this.root, this, 'filteredChanges');
                    if (isNewChangeTree) {
                        this.root.allFilteredChanges.push(this);
                    }
                }
            }
            if (!this.isFiltered) {
                enqueueChangeTree(this.root, this, 'changes');
                if (isNewChangeTree) {
                    this.root.allChanges.push(this);
                }
            }
        }
        _checkFilteredByParent(parent, parentIndex) {
            // skip if parent is not set
            if (!parent) {
                return;
            }
            //
            // ArraySchema | MapSchema - get the child type
            // (if refType is typeof string, the parentFiltered[key] below will always be invalid)
            //
            const refType = Metadata.isValidInstance(this.ref)
                ? this.ref.constructor
                : this.ref[$childType];
            if (!Metadata.isValidInstance(parent)) {
                const parentChangeTree = parent[$changes];
                parent = parentChangeTree.parent;
                parentIndex = parentChangeTree.parentIndex;
            }
            const parentConstructor = parent.constructor;
            let key = `${this.root.types.getTypeId(refType)}`;
            if (parentConstructor) {
                key += `-${this.root.types.schemas.get(parentConstructor)}`;
            }
            key += `-${parentIndex}`;
            this.isFiltered = parent[$changes].isFiltered // in case parent is already filtered
                || this.root.types.parentFiltered[key];
            // const parentMetadata = parentConstructor?.[Symbol.metadata];
            // this.isFiltered = parentMetadata?.[$viewFieldIndexes]?.includes(parentIndex) || this.root.types.parentFiltered[key];
            //
            // TODO: refactor this!
            //
            //      swapping `changes` and `filteredChanges` is required here
            //      because "isFiltered" may not be imedialely available on `change()`
            //      (this happens when instance is detached from root or parent)
            //
            if (this.isFiltered) {
                this.filteredChanges = { indexes: {}, operations: [] };
                this.allFilteredChanges = { indexes: {}, operations: [] };
                if (this.changes.operations.length > 0) {
                    // swap changes reference
                    const changes = this.changes;
                    this.changes = this.filteredChanges;
                    this.filteredChanges = changes;
                    // swap "all changes" reference
                    const allFilteredChanges = this.allFilteredChanges;
                    this.allFilteredChanges = this.allChanges;
                    this.allChanges = allFilteredChanges;
                }
            }
        }
    }

    function encodeValue(encoder, bytes, type, value, operation, it) {
        if (typeof (type) === "string") {
            encode[type]?.(bytes, value, it);
        }
        else if (type[Symbol.metadata] !== undefined) {
            //
            // Encode refId for this instance.
            // The actual instance is going to be encoded on next `changeTree` iteration.
            //
            encode.number(bytes, value[$changes].refId, it);
            // Try to encode inherited TYPE_ID if it's an ADD operation.
            if ((operation & exports.OPERATION.ADD) === exports.OPERATION.ADD) {
                encoder.tryEncodeTypeId(bytes, type, value.constructor, it);
            }
        }
        else {
            //
            // Encode refId for this instance.
            // The actual instance is going to be encoded on next `changeTree` iteration.
            //
            encode.number(bytes, value[$changes].refId, it);
        }
    }
    /**
     * Used for Schema instances.
     * @private
     */
    const encodeSchemaOperation = function (encoder, bytes, changeTree, index, operation, it, _, __, metadata) {
        // "compress" field index + operation
        bytes[it.offset++] = (index | operation) & 255;
        // Do not encode value for DELETE operations
        if (operation === exports.OPERATION.DELETE) {
            return;
        }
        const ref = changeTree.ref;
        const field = metadata[index];
        // TODO: inline this function call small performance gain
        encodeValue(encoder, bytes, metadata[index].type, ref[field.name], operation, it);
    };
    /**
     * Used for collections (MapSchema, CollectionSchema, SetSchema)
     * @private
     */
    const encodeKeyValueOperation = function (encoder, bytes, changeTree, index, operation, it) {
        // encode operation
        bytes[it.offset++] = operation & 255;
        // custom operations
        if (operation === exports.OPERATION.CLEAR) {
            return;
        }
        // encode index
        encode.number(bytes, index, it);
        // Do not encode value for DELETE operations
        if (operation === exports.OPERATION.DELETE) {
            return;
        }
        const ref = changeTree.ref;
        //
        // encode "alias" for dynamic fields (maps)
        //
        if ((operation & exports.OPERATION.ADD) === exports.OPERATION.ADD) { // ADD or DELETE_AND_ADD
            if (typeof (ref['set']) === "function") {
                //
                // MapSchema dynamic key
                //
                const dynamicIndex = changeTree.ref['$indexes'].get(index);
                encode.string(bytes, dynamicIndex, it);
            }
        }
        const type = ref[$childType];
        const value = ref[$getByIndex](index);
        // try { throw new Error(); } catch (e) {
        //     // only print if not coming from Reflection.ts
        //     if (!e.stack.includes("src/Reflection.ts")) {
        //         console.log("encodeKeyValueOperation -> ", {
        //             ref: changeTree.ref.constructor.name,
        //             field,
        //             operation: OPERATION[operation],
        //             value: value?.toJSON(),
        //             items: ref.toJSON(),
        //         });
        //     }
        // }
        // TODO: inline this function call small performance gain
        encodeValue(encoder, bytes, type, value, operation, it);
    };
    /**
     * Used for collections (MapSchema, ArraySchema, etc.)
     * @private
     */
    const encodeArray = function (encoder, bytes, changeTree, field, operation, it, isEncodeAll, hasView) {
        const ref = changeTree.ref;
        const useOperationByRefId = hasView && changeTree.isFiltered && (typeof (changeTree.getType(field)) !== "string");
        let refOrIndex;
        if (useOperationByRefId) {
            refOrIndex = ref['tmpItems'][field][$changes].refId;
            if (operation === exports.OPERATION.DELETE) {
                operation = exports.OPERATION.DELETE_BY_REFID;
            }
            else if (operation === exports.OPERATION.ADD) {
                operation = exports.OPERATION.ADD_BY_REFID;
            }
        }
        else {
            refOrIndex = field;
        }
        // encode operation
        bytes[it.offset++] = operation & 255;
        // custom operations
        if (operation === exports.OPERATION.CLEAR ||
            operation === exports.OPERATION.REVERSE) {
            return;
        }
        // encode index
        encode.number(bytes, refOrIndex, it);
        // Do not encode value for DELETE operations
        if (operation === exports.OPERATION.DELETE) {
            return;
        }
        const type = changeTree.getType(field);
        const value = changeTree.getValue(field, isEncodeAll);
        // console.log("encodeArray -> ", {
        //     ref: changeTree.ref.constructor.name,
        //     field,
        //     operation: OPERATION[operation],
        //     value: value?.toJSON(),
        //     items: ref.toJSON(),
        // });
        // TODO: inline this function call small performance gain
        encodeValue(encoder, bytes, type, value, operation, it);
    };

    const DEFINITION_MISMATCH = -1;
    function decodeValue(decoder, operation, ref, index, type, bytes, it, allChanges) {
        const $root = decoder.root;
        const previousValue = ref[$getByIndex](index);
        let value;
        if ((operation & exports.OPERATION.DELETE) === exports.OPERATION.DELETE) {
            // Flag `refId` for garbage collection.
            const previousRefId = $root.refIds.get(previousValue);
            if (previousRefId !== undefined) {
                $root.removeRef(previousRefId);
            }
            //
            // Delete operations
            //
            if (operation !== exports.OPERATION.DELETE_AND_ADD) {
                ref[$deleteByIndex](index);
            }
            value = undefined;
        }
        if (operation === exports.OPERATION.DELETE) ;
        else if (Schema.is(type)) {
            const refId = decode.number(bytes, it);
            value = $root.refs.get(refId);
            if ((operation & exports.OPERATION.ADD) === exports.OPERATION.ADD) {
                const childType = decoder.getInstanceType(bytes, it, type);
                if (!value) {
                    value = decoder.createInstanceOfType(childType);
                }
                $root.addRef(refId, value, (value !== previousValue || // increment ref count if value has changed
                    (operation === exports.OPERATION.DELETE_AND_ADD && value === previousValue) // increment ref count if the same instance is being added again
                ));
            }
        }
        else if (typeof (type) === "string") {
            //
            // primitive value (number, string, boolean, etc)
            //
            value = decode[type](bytes, it);
        }
        else {
            const typeDef = getType(Object.keys(type)[0]);
            const refId = decode.number(bytes, it);
            const valueRef = ($root.refs.has(refId))
                ? previousValue || $root.refs.get(refId)
                : new typeDef.constructor();
            value = valueRef.clone(true);
            value[$childType] = Object.values(type)[0]; // cache childType for ArraySchema and MapSchema
            if (previousValue) {
                let previousRefId = $root.refIds.get(previousValue);
                if (previousRefId !== undefined && refId !== previousRefId) {
                    //
                    // enqueue onRemove if structure has been replaced.
                    //
                    const entries = previousValue.entries();
                    let iter;
                    while ((iter = entries.next()) && !iter.done) {
                        const [key, value] = iter.value;
                        // if value is a schema, remove its reference
                        // FIXME: not sure if this is necessary, add more tests to confirm
                        if (typeof (value) === "object") {
                            previousRefId = $root.refIds.get(value);
                            $root.removeRef(previousRefId);
                        }
                        allChanges.push({
                            ref: previousValue,
                            refId: previousRefId,
                            op: exports.OPERATION.DELETE,
                            field: key,
                            value: undefined,
                            previousValue: value,
                        });
                    }
                }
            }
            $root.addRef(refId, value, (valueRef !== previousValue ||
                (operation === exports.OPERATION.DELETE_AND_ADD && valueRef === previousValue)));
        }
        return { value, previousValue };
    }
    const decodeSchemaOperation = function (decoder, bytes, it, ref, allChanges) {
        const first_byte = bytes[it.offset++];
        const metadata = ref.constructor[Symbol.metadata];
        // "compressed" index + operation
        const operation = (first_byte >> 6) << 6;
        const index = first_byte % (operation || 255);
        // skip early if field is not defined
        const field = metadata[index];
        if (field === undefined) {
            console.warn("@colyseus/schema: field not defined at", { index, ref: ref.constructor.name, metadata });
            return DEFINITION_MISMATCH;
        }
        const { value, previousValue } = decodeValue(decoder, operation, ref, index, field.type, bytes, it, allChanges);
        if (value !== null && value !== undefined) {
            ref[field.name] = value;
        }
        // add change
        if (previousValue !== value) {
            allChanges.push({
                ref,
                refId: decoder.currentRefId,
                op: operation,
                field: field.name,
                value,
                previousValue,
            });
        }
    };
    const decodeKeyValueOperation = function (decoder, bytes, it, ref, allChanges) {
        // "uncompressed" index + operation (array/map items)
        const operation = bytes[it.offset++];
        if (operation === exports.OPERATION.CLEAR) {
            //
            // When decoding:
            // - enqueue items for DELETE callback.
            // - flag child items for garbage collection.
            //
            decoder.removeChildRefs(ref, allChanges);
            ref.clear();
            return;
        }
        const index = decode.number(bytes, it);
        const type = ref[$childType];
        let dynamicIndex;
        if ((operation & exports.OPERATION.ADD) === exports.OPERATION.ADD) { // ADD or DELETE_AND_ADD
            if (typeof (ref['set']) === "function") {
                dynamicIndex = decode.string(bytes, it); // MapSchema
                ref['setIndex'](index, dynamicIndex);
            }
            else {
                dynamicIndex = index; // ArraySchema
            }
        }
        else {
            // get dynamic index from "ref"
            dynamicIndex = ref['getIndex'](index);
        }
        const { value, previousValue } = decodeValue(decoder, operation, ref, index, type, bytes, it, allChanges);
        if (value !== null && value !== undefined) {
            if (typeof (ref['set']) === "function") {
                // MapSchema
                ref['$items'].set(dynamicIndex, value);
            }
            else if (typeof (ref['$setAt']) === "function") {
                // ArraySchema
                ref['$setAt'](index, value, operation);
            }
            else if (typeof (ref['add']) === "function") {
                // CollectionSchema && SetSchema
                const index = ref.add(value);
                if (typeof (index) === "number") {
                    ref['setIndex'](index, index);
                }
            }
        }
        // add change
        if (previousValue !== value) {
            allChanges.push({
                ref,
                refId: decoder.currentRefId,
                op: operation,
                field: "", // FIXME: remove this
                dynamicIndex,
                value,
                previousValue,
            });
        }
    };
    const decodeArray = function (decoder, bytes, it, ref, allChanges) {
        // "uncompressed" index + operation (array/map items)
        let operation = bytes[it.offset++];
        let index;
        if (operation === exports.OPERATION.CLEAR) {
            //
            // When decoding:
            // - enqueue items for DELETE callback.
            // - flag child items for garbage collection.
            //
            decoder.removeChildRefs(ref, allChanges);
            ref.clear();
            return;
        }
        else if (operation === exports.OPERATION.REVERSE) {
            ref.reverse();
            return;
        }
        else if (operation === exports.OPERATION.DELETE_BY_REFID) {
            // TODO: refactor here, try to follow same flow as below
            const refId = decode.number(bytes, it);
            const previousValue = decoder.root.refs.get(refId);
            index = ref.findIndex((value) => value === previousValue);
            ref[$deleteByIndex](index);
            allChanges.push({
                ref,
                refId: decoder.currentRefId,
                op: exports.OPERATION.DELETE,
                field: "", // FIXME: remove this
                dynamicIndex: index,
                value: undefined,
                previousValue,
            });
            return;
        }
        else if (operation === exports.OPERATION.ADD_BY_REFID) {
            const refId = decode.number(bytes, it);
            const itemByRefId = decoder.root.refs.get(refId);
            // use existing index, or push new value
            index = (itemByRefId)
                ? ref.findIndex((value) => value === itemByRefId)
                : ref.length;
        }
        else {
            index = decode.number(bytes, it);
        }
        const type = ref[$childType];
        let dynamicIndex = index;
        const { value, previousValue } = decodeValue(decoder, operation, ref, index, type, bytes, it, allChanges);
        if (value !== null && value !== undefined &&
            value !== previousValue // avoid setting same value twice (if index === 0 it will result in a "unshift" for ArraySchema)
        ) {
            // ArraySchema
            ref['$setAt'](index, value, operation);
        }
        // add change
        if (previousValue !== value) {
            allChanges.push({
                ref,
                refId: decoder.currentRefId,
                op: operation,
                field: "", // FIXME: remove this
                dynamicIndex,
                value,
                previousValue,
            });
        }
    };

    class EncodeSchemaError extends Error {
    }
    function assertType(value, type, klass, field) {
        let typeofTarget;
        let allowNull = false;
        switch (type) {
            case "number":
            case "int8":
            case "uint8":
            case "int16":
            case "uint16":
            case "int32":
            case "uint32":
            case "int64":
            case "uint64":
            case "float32":
            case "float64":
                typeofTarget = "number";
                if (isNaN(value)) {
                    console.log(`trying to encode "NaN" in ${klass.constructor.name}#${field}`);
                }
                break;
            case "bigint64":
            case "biguint64":
                typeofTarget = "bigint";
                break;
            case "string":
                typeofTarget = "string";
                allowNull = true;
                break;
            case "boolean":
                // boolean is always encoded as true/false based on truthiness
                return;
            default:
                // skip assertion for custom types
                // TODO: allow custom types to define their own assertions
                return;
        }
        if (typeof (value) !== typeofTarget && (!allowNull || (allowNull && value !== null))) {
            let foundValue = `'${JSON.stringify(value)}'${(value && value.constructor && ` (${value.constructor.name})`) || ''}`;
            throw new EncodeSchemaError(`a '${typeofTarget}' was expected, but ${foundValue} was provided in ${klass.constructor.name}#${field}`);
        }
    }
    function assertInstanceType(value, type, instance, field) {
        if (!(value instanceof type)) {
            throw new EncodeSchemaError(`a '${type.name}' was expected, but '${value && value.constructor.name}' was provided in ${instance.constructor.name}#${field}`);
        }
    }

    var _a$4, _b$4;
    const DEFAULT_SORT = (a, b) => {
        const A = a.toString();
        const B = b.toString();
        if (A < B)
            return -1;
        else if (A > B)
            return 1;
        else
            return 0;
    };
    class ArraySchema {
        static { this[_a$4] = encodeArray; }
        static { this[_b$4] = decodeArray; }
        /**
         * Determine if a property must be filtered.
         * - If returns false, the property is NOT going to be encoded.
         * - If returns true, the property is going to be encoded.
         *
         * Encoding with "filters" happens in two steps:
         * - First, the encoder iterates over all "not owned" properties and encodes them.
         * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
         */
        static [(_a$4 = $encoder, _b$4 = $decoder, $filter)](ref, index, view) {
            return (!view ||
                typeof (ref[$childType]) === "string" ||
                // view.items.has(ref[$getByIndex](index)[$changes])
                view.items.has(ref['tmpItems'][index]?.[$changes]));
        }
        static is(type) {
            return (
            // type format: ["string"]
            Array.isArray(type) ||
                // type format: { array: "string" }
                (type['array'] !== undefined));
        }
        static from(iterable) {
            return new ArraySchema(...Array.from(iterable));
        }
        constructor(...items) {
            this.items = [];
            this.tmpItems = [];
            this.deletedIndexes = {};
            Object.defineProperty(this, $childType, {
                value: undefined,
                enumerable: false,
                writable: true,
                configurable: true,
            });
            const proxy = new Proxy(this, {
                get: (obj, prop) => {
                    if (typeof (prop) !== "symbol" &&
                        // FIXME: d8 accuses this as low performance
                        !isNaN(prop) // https://stackoverflow.com/a/175787/892698
                    ) {
                        return this.items[prop];
                    }
                    else {
                        return Reflect.get(obj, prop);
                    }
                },
                set: (obj, key, setValue) => {
                    if (typeof (key) !== "symbol" && !isNaN(key)) {
                        if (setValue === undefined || setValue === null) {
                            obj.$deleteAt(key);
                        }
                        else {
                            if (setValue[$changes]) {
                                assertInstanceType(setValue, obj[$childType], obj, key);
                                const previousValue = obj.items[key];
                                if (previousValue !== undefined) {
                                    if (setValue[$changes].isNew) {
                                        this[$changes].indexedOperation(Number(key), exports.OPERATION.MOVE_AND_ADD);
                                    }
                                    else {
                                        if ((obj[$changes].getChange(Number(key)) & exports.OPERATION.DELETE) === exports.OPERATION.DELETE) {
                                            this[$changes].indexedOperation(Number(key), exports.OPERATION.DELETE_AND_MOVE);
                                        }
                                        else {
                                            this[$changes].indexedOperation(Number(key), exports.OPERATION.MOVE);
                                        }
                                    }
                                    // remove root reference from previous value
                                    previousValue[$changes].root?.remove(previousValue[$changes]);
                                }
                                else if (setValue[$changes].isNew) {
                                    this[$changes].indexedOperation(Number(key), exports.OPERATION.ADD);
                                }
                                setValue[$changes].setParent(this, obj[$changes].root, key);
                            }
                            else {
                                obj.$changeAt(Number(key), setValue);
                            }
                            this.items[key] = setValue;
                            this.tmpItems[key] = setValue;
                        }
                        return true;
                    }
                    else {
                        return Reflect.set(obj, key, setValue);
                    }
                },
                deleteProperty: (obj, prop) => {
                    if (typeof (prop) === "number") {
                        obj.$deleteAt(prop);
                    }
                    else {
                        delete obj[prop];
                    }
                    return true;
                },
                has: (obj, key) => {
                    if (typeof (key) !== "symbol" && !isNaN(Number(key))) {
                        return Reflect.has(this.items, key);
                    }
                    return Reflect.has(obj, key);
                }
            });
            this[$changes] = new ChangeTree(proxy);
            this[$changes].indexes = {};
            if (items.length > 0) {
                this.push(...items);
            }
            return proxy;
        }
        set length(newLength) {
            if (newLength === 0) {
                this.clear();
            }
            else if (newLength < this.items.length) {
                this.splice(newLength, this.length - newLength);
            }
            else {
                console.warn("ArraySchema: can't set .length to a higher value than its length.");
            }
        }
        get length() {
            return this.items.length;
        }
        push(...values) {
            let length = this.tmpItems.length;
            const changeTree = this[$changes];
            // values.forEach((value, i) => {
            for (let i = 0, l = values.length; i < values.length; i++, length++) {
                const value = values[i];
                if (value === undefined || value === null) {
                    // skip null values
                    return;
                }
                else if (typeof (value) === "object" && this[$childType]) {
                    assertInstanceType(value, this[$childType], this, i);
                    // TODO: move value[$changes]?.setParent() to this block.
                }
                changeTree.indexedOperation(length, exports.OPERATION.ADD, this.items.length);
                this.items.push(value);
                this.tmpItems.push(value);
                //
                // set value's parent after the value is set
                // (to avoid encoding "refId" operations before parent's "ADD" operation)
                //
                value[$changes]?.setParent(this, changeTree.root, length);
            }
            //     length++;
            // });
            return length;
        }
        /**
         * Removes the last element from an array and returns it.
         */
        pop() {
            let index = -1;
            // find last non-undefined index
            for (let i = this.tmpItems.length - 1; i >= 0; i--) {
                // if (this.tmpItems[i] !== undefined) {
                if (this.deletedIndexes[i] !== true) {
                    index = i;
                    break;
                }
            }
            if (index < 0) {
                return undefined;
            }
            this[$changes].delete(index, undefined, this.items.length - 1);
            // this.tmpItems[index] = undefined;
            // this.tmpItems.pop();
            this.deletedIndexes[index] = true;
            return this.items.pop();
        }
        at(index) {
            // Allow negative indexing from the end
            if (index < 0)
                index += this.length;
            return this.items[index];
        }
        // encoding only
        $changeAt(index, value) {
            if (value === undefined || value === null) {
                console.error("ArraySchema items cannot be null nor undefined; Use `deleteAt(index)` instead.");
                return;
            }
            // skip if the value is the same as cached.
            if (this.items[index] === value) {
                return;
            }
            const changeTree = this[$changes];
            const operation = changeTree.indexes?.[index]?.op ?? exports.OPERATION.ADD;
            changeTree.change(index, operation);
            //
            // set value's parent after the value is set
            // (to avoid encoding "refId" operations before parent's "ADD" operation)
            //
            value[$changes]?.setParent(this, changeTree.root, index);
        }
        // encoding only
        $deleteAt(index, operation) {
            this[$changes].delete(index, operation);
        }
        // decoding only
        $setAt(index, value, operation) {
            if (index === 0 &&
                operation === exports.OPERATION.ADD &&
                this.items[index] !== undefined) {
                // handle decoding unshift
                this.items.unshift(value);
            }
            else if (operation === exports.OPERATION.DELETE_AND_MOVE) {
                this.items.splice(index, 1);
                this.items[index] = value;
            }
            else {
                this.items[index] = value;
            }
        }
        clear() {
            // skip if already clear
            if (this.items.length === 0) {
                return;
            }
            // discard previous operations.
            const changeTree = this[$changes];
            // discard children
            changeTree.forEachChild((changeTree, _) => {
                changeTree.discard(true);
                //
                // TODO: add tests with instance sharing + .clear()
                // FIXME: this.root? is required because it is being called at decoding time.
                //
                // TODO: do not use [$changes] at decoding time.
                //
                const root = changeTree.root;
                if (root !== undefined) {
                    root.removeChangeFromChangeSet("changes", changeTree);
                    root.removeChangeFromChangeSet("allChanges", changeTree);
                    root.removeChangeFromChangeSet("allFilteredChanges", changeTree);
                }
            });
            changeTree.discard(true);
            changeTree.operation(exports.OPERATION.CLEAR);
            this.items.length = 0;
            this.tmpItems.length = 0;
        }
        /**
         * Combines two or more arrays.
         * @param items Additional items to add to the end of array1.
         */
        // @ts-ignore
        concat(...items) {
            return new ArraySchema(...this.items.concat(...items));
        }
        /**
         * Adds all the elements of an array separated by the specified separator string.
         * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
         */
        join(separator) {
            return this.items.join(separator);
        }
        /**
         * Reverses the elements in an Array.
         */
        // @ts-ignore
        reverse() {
            this[$changes].operation(exports.OPERATION.REVERSE);
            this.items.reverse();
            this.tmpItems.reverse();
            return this;
        }
        /**
         * Removes the first element from an array and returns it.
         */
        shift() {
            if (this.items.length === 0) {
                return undefined;
            }
            // const index = Number(Object.keys(changeTree.indexes)[0]);
            const index = this.tmpItems.findIndex((item, i) => item === this.items[0]);
            const changeTree = this[$changes];
            changeTree.delete(index);
            changeTree.shiftAllChangeIndexes(-1, index);
            // this.deletedIndexes[index] = true;
            return this.items.shift();
        }
        /**
         * Returns a section of an array.
         * @param start The beginning of the specified portion of the array.
         * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
         */
        slice(start, end) {
            const sliced = new ArraySchema();
            sliced.push(...this.items.slice(start, end));
            return sliced;
        }
        /**
         * Sorts an array.
         * @param compareFn Function used to determine the order of the elements. It is expected to return
         * a negative value if first argument is less than second argument, zero if they're equal and a positive
         * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
         * ```ts
         * [11,2,22,1].sort((a, b) => a - b)
         * ```
         */
        sort(compareFn = DEFAULT_SORT) {
            const changeTree = this[$changes];
            const sortedItems = this.items.sort(compareFn);
            // wouldn't OPERATION.MOVE make more sense here?
            sortedItems.forEach((_, i) => changeTree.change(i, exports.OPERATION.REPLACE));
            this.tmpItems.sort(compareFn);
            return this;
        }
        /**
         * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
         * @param start The zero-based location in the array from which to start removing elements.
         * @param deleteCount The number of elements to remove.
         * @param insertItems Elements to insert into the array in place of the deleted elements.
         */
        splice(start, deleteCount = this.items.length - start, ...insertItems) {
            const changeTree = this[$changes];
            const tmpItemsLength = this.tmpItems.length;
            const insertCount = insertItems.length;
            // build up-to-date list of indexes, excluding removed values.
            const indexes = [];
            for (let i = 0; i < tmpItemsLength; i++) {
                // if (this.tmpItems[i] !== undefined) {
                if (this.deletedIndexes[i] !== true) {
                    indexes.push(i);
                }
            }
            // delete operations at correct index
            for (let i = start; i < start + deleteCount; i++) {
                const index = indexes[i];
                changeTree.delete(index);
                // this.tmpItems[index] = undefined;
                this.deletedIndexes[index] = true;
            }
            // force insert operations
            for (let i = 0; i < insertCount; i++) {
                const addIndex = indexes[start] + i;
                changeTree.indexedOperation(addIndex, exports.OPERATION.ADD);
                // set value's parent/root
                insertItems[i][$changes]?.setParent(this, changeTree.root, addIndex);
            }
            //
            // delete exceeding indexes from "allChanges"
            // (prevent .encodeAll() from encoding non-existing items)
            //
            if (deleteCount > insertCount) {
                changeTree.shiftAllChangeIndexes(-(deleteCount - insertCount), indexes[start + insertCount]);
            }
            return this.items.splice(start, deleteCount, ...insertItems);
        }
        /**
         * Inserts new elements at the start of an array.
         * @param items  Elements to insert at the start of the Array.
         */
        unshift(...items) {
            const changeTree = this[$changes];
            // shift indexes
            changeTree.shiftChangeIndexes(items.length);
            // new index
            if (changeTree.isFiltered) {
                setOperationAtIndex(changeTree.filteredChanges, this.items.length);
                // changeTree.filteredChanges[this.items.length] = OPERATION.ADD;
            }
            else {
                setOperationAtIndex(changeTree.allChanges, this.items.length);
                // changeTree.allChanges[this.items.length] = OPERATION.ADD;
            }
            // FIXME: should we use OPERATION.MOVE here instead?
            items.forEach((_, index) => {
                changeTree.change(index, exports.OPERATION.ADD);
            });
            this.tmpItems.unshift(...items);
            return this.items.unshift(...items);
        }
        /**
         * Returns the index of the first occurrence of a value in an array.
         * @param searchElement The value to locate in the array.
         * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
         */
        indexOf(searchElement, fromIndex) {
            return this.items.indexOf(searchElement, fromIndex);
        }
        /**
         * Returns the index of the last occurrence of a specified value in an array.
         * @param searchElement The value to locate in the array.
         * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
         */
        lastIndexOf(searchElement, fromIndex = this.length - 1) {
            return this.items.lastIndexOf(searchElement, fromIndex);
        }
        every(callbackfn, thisArg) {
            return this.items.every(callbackfn, thisArg);
        }
        /**
         * Determines whether the specified callback function returns true for any element of an array.
         * @param callbackfn A function that accepts up to three arguments. The some method calls
         * the callbackfn function for each element in the array until the callbackfn returns a value
         * which is coercible to the Boolean value true, or until the end of the array.
         * @param thisArg An object to which the this keyword can refer in the callbackfn function.
         * If thisArg is omitted, undefined is used as the this value.
         */
        some(callbackfn, thisArg) {
            return this.items.some(callbackfn, thisArg);
        }
        /**
         * Performs the specified action for each element in an array.
         * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
         * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
         */
        forEach(callbackfn, thisArg) {
            return this.items.forEach(callbackfn, thisArg);
        }
        /**
         * Calls a defined callback function on each element of an array, and returns an array that contains the results.
         * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
         * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
         */
        map(callbackfn, thisArg) {
            return this.items.map(callbackfn, thisArg);
        }
        filter(callbackfn, thisArg) {
            return this.items.filter(callbackfn, thisArg);
        }
        /**
         * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
         * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
         * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
         */
        reduce(callbackfn, initialValue) {
            return this.items.reduce(callbackfn, initialValue);
        }
        /**
         * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
         * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
         * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
         */
        reduceRight(callbackfn, initialValue) {
            return this.items.reduceRight(callbackfn, initialValue);
        }
        /**
         * Returns the value of the first element in the array where predicate is true, and undefined
         * otherwise.
         * @param predicate find calls predicate once for each element of the array, in ascending
         * order, until it finds one where predicate returns true. If such an element is found, find
         * immediately returns that element value. Otherwise, find returns undefined.
         * @param thisArg If provided, it will be used as the this value for each invocation of
         * predicate. If it is not provided, undefined is used instead.
         */
        find(predicate, thisArg) {
            return this.items.find(predicate, thisArg);
        }
        /**
         * Returns the index of the first element in the array where predicate is true, and -1
         * otherwise.
         * @param predicate find calls predicate once for each element of the array, in ascending
         * order, until it finds one where predicate returns true. If such an element is found,
         * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
         * @param thisArg If provided, it will be used as the this value for each invocation of
         * predicate. If it is not provided, undefined is used instead.
         */
        findIndex(predicate, thisArg) {
            return this.items.findIndex(predicate, thisArg);
        }
        /**
         * Returns the this object after filling the section identified by start and end with value
         * @param value value to fill array section with
         * @param start index to start filling the array at. If start is negative, it is treated as
         * length+start where length is the length of the array.
         * @param end index to stop filling the array at. If end is negative, it is treated as
         * length+end.
         */
        fill(value, start, end) {
            //
            // TODO
            //
            throw new Error("ArraySchema#fill() not implemented");
        }
        /**
         * Returns the this object after copying a section of the array identified by start and end
         * to the same array starting at position target
         * @param target If target is negative, it is treated as length+target where length is the
         * length of the array.
         * @param start If start is negative, it is treated as length+start. If end is negative, it
         * is treated as length+end.
         * @param end If not specified, length of the this object is used as its default value.
         */
        copyWithin(target, start, end) {
            //
            // TODO
            //
            throw new Error("ArraySchema#copyWithin() not implemented");
        }
        /**
         * Returns a string representation of an array.
         */
        toString() {
            return this.items.toString();
        }
        /**
         * Returns a string representation of an array. The elements are converted to string using their toLocalString methods.
         */
        toLocaleString() {
            return this.items.toLocaleString();
        }
        ;
        /** Iterator */
        [Symbol.iterator]() {
            return this.items[Symbol.iterator]();
        }
        static get [Symbol.species]() {
            return ArraySchema;
        }
        /**
         * Returns an iterable of key, value pairs for every entry in the array
         */
        entries() { return this.items.entries(); }
        /**
         * Returns an iterable of keys in the array
         */
        keys() { return this.items.keys(); }
        /**
         * Returns an iterable of values in the array
         */
        values() { return this.items.values(); }
        /**
         * Determines whether an array includes a certain element, returning true or false as appropriate.
         * @param searchElement The element to search for.
         * @param fromIndex The position in this array at which to begin searching for searchElement.
         */
        includes(searchElement, fromIndex) {
            return this.items.includes(searchElement, fromIndex);
        }
        //
        // ES2022
        //
        /**
         * Calls a defined callback function on each element of an array. Then, flattens the result into
         * a new array.
         * This is identical to a map followed by flat with depth 1.
         *
         * @param callback A function that accepts up to three arguments. The flatMap method calls the
         * callback function one time for each element in the array.
         * @param thisArg An object to which the this keyword can refer in the callback function. If
         * thisArg is omitted, undefined is used as the this value.
         */
        // @ts-ignore
        flatMap(callback, thisArg) {
            // @ts-ignore
            throw new Error("ArraySchema#flatMap() is not supported.");
        }
        /**
         * Returns a new array with all sub-array elements concatenated into it recursively up to the
         * specified depth.
         *
         * @param depth The maximum recursion depth
         */
        // @ts-ignore
        flat(depth) {
            throw new Error("ArraySchema#flat() is not supported.");
        }
        findLast() {
            // @ts-ignore
            return this.items.findLast.apply(this.items, arguments);
        }
        findLastIndex(...args) {
            // @ts-ignore
            return this.items.findLastIndex.apply(this.items, arguments);
        }
        //
        // ES2023
        //
        with(index, value) {
            const copy = this.items.slice();
            // Allow negative indexing from the end
            if (index < 0)
                index += this.length;
            copy[index] = value;
            return new ArraySchema(...copy);
        }
        toReversed() {
            return this.items.slice().reverse();
        }
        toSorted(compareFn) {
            return this.items.slice().sort(compareFn);
        }
        // @ts-ignore
        toSpliced(start, deleteCount, ...items) {
            // @ts-ignore
            return this.items.toSpliced.apply(copy, arguments);
        }
        [($getByIndex)](index, isEncodeAll = false) {
            //
            // TODO: avoid unecessary `this.tmpItems` check during decoding.
            //
            //    ENCODING uses `this.tmpItems` (or `this.items` if `isEncodeAll` is true)
            //    DECODING uses `this.items`
            //
            return (isEncodeAll)
                ? this.items[index]
                : this.deletedIndexes[index]
                    ? this.items[index]
                    : this.tmpItems[index] || this.items[index];
            // return (isEncodeAll)
            //     ? this.items[index]
            //     : this.tmpItems[index] ?? this.items[index];
        }
        [$deleteByIndex](index) {
            this.items[index] = undefined;
            this.tmpItems[index] = undefined; // TODO: do not try to get "tmpItems" at decoding time.
        }
        [$onEncodeEnd]() {
            this.tmpItems = this.items.slice();
            this.deletedIndexes = {};
        }
        [$onDecodeEnd]() {
            this.items = this.items.filter((item) => item !== undefined);
            this.tmpItems = this.items.slice(); // TODO: do no use "tmpItems" at decoding time.
        }
        toArray() {
            return this.items.slice(0);
        }
        toJSON() {
            return this.toArray().map((value) => {
                return (typeof (value['toJSON']) === "function")
                    ? value['toJSON']()
                    : value;
            });
        }
        //
        // Decoding utilities
        //
        clone(isDecoding) {
            let cloned;
            if (isDecoding) {
                cloned = new ArraySchema();
                cloned.push(...this.items);
            }
            else {
                cloned = new ArraySchema(...this.map(item => ((item[$changes])
                    ? item.clone()
                    : item)));
            }
            return cloned;
        }
        ;
    }
    registerType("array", { constructor: ArraySchema });

    var _a$3, _b$3;
    class MapSchema {
        static { this[_a$3] = encodeKeyValueOperation; }
        static { this[_b$3] = decodeKeyValueOperation; }
        /**
         * Determine if a property must be filtered.
         * - If returns false, the property is NOT going to be encoded.
         * - If returns true, the property is going to be encoded.
         *
         * Encoding with "filters" happens in two steps:
         * - First, the encoder iterates over all "not owned" properties and encodes them.
         * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
         */
        static [(_a$3 = $encoder, _b$3 = $decoder, $filter)](ref, index, view) {
            return (!view ||
                typeof (ref[$childType]) === "string" ||
                view.items.has((ref[$getByIndex](index) ?? ref.deletedItems[index])[$changes]));
        }
        static is(type) {
            return type['map'] !== undefined;
        }
        constructor(initialValues) {
            this.$items = new Map();
            this.$indexes = new Map();
            this.deletedItems = {};
            this[$changes] = new ChangeTree(this);
            this[$changes].indexes = {};
            if (initialValues) {
                if (initialValues instanceof Map ||
                    initialValues instanceof MapSchema) {
                    initialValues.forEach((v, k) => this.set(k, v));
                }
                else {
                    for (const k in initialValues) {
                        this.set(k, initialValues[k]);
                    }
                }
            }
            Object.defineProperty(this, $childType, {
                value: undefined,
                enumerable: false,
                writable: true,
                configurable: true,
            });
        }
        /** Iterator */
        [Symbol.iterator]() { return this.$items[Symbol.iterator](); }
        get [Symbol.toStringTag]() { return this.$items[Symbol.toStringTag]; }
        static get [Symbol.species]() { return MapSchema; }
        set(key, value) {
            if (value === undefined || value === null) {
                throw new Error(`MapSchema#set('${key}', ${value}): trying to set ${value} value on '${key}'.`);
            }
            else if (typeof (value) === "object" && this[$childType]) {
                assertInstanceType(value, this[$childType], this, key);
            }
            // Force "key" as string
            // See: https://github.com/colyseus/colyseus/issues/561#issuecomment-1646733468
            key = key.toString();
            const changeTree = this[$changes];
            const isRef = (value[$changes]) !== undefined;
            let index;
            let operation;
            // IS REPLACE?
            if (typeof (changeTree.indexes[key]) !== "undefined") {
                index = changeTree.indexes[key];
                operation = exports.OPERATION.REPLACE;
                const previousValue = this.$items.get(key);
                if (previousValue === value) {
                    // if value is the same, avoid re-encoding it.
                    return;
                }
                else if (isRef) {
                    // if is schema, force ADD operation if value differ from previous one.
                    operation = exports.OPERATION.DELETE_AND_ADD;
                    // remove reference from previous value
                    if (previousValue !== undefined) {
                        previousValue[$changes].root?.remove(previousValue[$changes]);
                    }
                }
            }
            else {
                index = changeTree.indexes[$numFields] ?? 0;
                operation = exports.OPERATION.ADD;
                this.$indexes.set(index, key);
                changeTree.indexes[key] = index;
                changeTree.indexes[$numFields] = index + 1;
            }
            this.$items.set(key, value);
            changeTree.change(index, operation);
            //
            // set value's parent after the value is set
            // (to avoid encoding "refId" operations before parent's "ADD" operation)
            //
            if (isRef) {
                value[$changes].setParent(this, changeTree.root, index);
            }
            return this;
        }
        get(key) {
            return this.$items.get(key);
        }
        delete(key) {
            const index = this[$changes].indexes[key];
            this.deletedItems[index] = this[$changes].delete(index);
            return this.$items.delete(key);
        }
        clear() {
            const changeTree = this[$changes];
            // discard previous operations.
            changeTree.discard(true);
            changeTree.indexes = {};
            // clear previous indexes
            this.$indexes.clear();
            // clear items
            this.$items.clear();
            changeTree.operation(exports.OPERATION.CLEAR);
        }
        has(key) {
            return this.$items.has(key);
        }
        forEach(callbackfn) {
            this.$items.forEach(callbackfn);
        }
        entries() {
            return this.$items.entries();
        }
        keys() {
            return this.$items.keys();
        }
        values() {
            return this.$items.values();
        }
        get size() {
            return this.$items.size;
        }
        setIndex(index, key) {
            this.$indexes.set(index, key);
        }
        getIndex(index) {
            return this.$indexes.get(index);
        }
        [$getByIndex](index) {
            return this.$items.get(this.$indexes.get(index));
        }
        [$deleteByIndex](index) {
            const key = this.$indexes.get(index);
            this.$items.delete(key);
            this.$indexes.delete(index);
        }
        [$onEncodeEnd]() {
            this.deletedItems = {};
        }
        toJSON() {
            const map = {};
            this.forEach((value, key) => {
                map[key] = (typeof (value['toJSON']) === "function")
                    ? value['toJSON']()
                    : value;
            });
            return map;
        }
        //
        // Decoding utilities
        //
        // @ts-ignore
        clone(isDecoding) {
            let cloned;
            if (isDecoding) {
                // client-side
                cloned = Object.assign(new MapSchema(), this);
            }
            else {
                // server-side
                cloned = new MapSchema();
                this.forEach((value, key) => {
                    if (value[$changes]) {
                        cloned.set(key, value['clone']());
                    }
                    else {
                        cloned.set(key, value);
                    }
                });
            }
            return cloned;
        }
    }
    registerType("map", { constructor: MapSchema });

    const DEFAULT_VIEW_TAG = -1;
    function entity(constructor) {
        TypeContext.register(constructor);
        return constructor;
    }
    /**
     * [See documentation](https://docs.colyseus.io/state/schema/)
     *
     * Annotate a Schema property to be serializeable.
     * \@type()'d fields are automatically flagged as "dirty" for the next patch.
     *
     * @example Standard usage, with automatic change tracking.
     * ```
     * \@type("string") propertyName: string;
     * ```
     *
     * @example You can provide the "manual" option if you'd like to manually control your patches via .setDirty().
     * ```
     * \@type("string", { manual: true })
     * ```
     */
    // export function type(type: DefinitionType, options?: TypeOptions) {
    //     return function ({ get, set }, context: ClassAccessorDecoratorContext): ClassAccessorDecoratorResult<Schema, any> {
    //         if (context.kind !== "accessor") {
    //             throw new Error("@type() is only supported for class accessor properties");
    //         }
    //         const field = context.name.toString();
    //         //
    //         // detect index for this field, considering inheritance
    //         //
    //         const parent = Object.getPrototypeOf(context.metadata);
    //         let fieldIndex: number = context.metadata[$numFields] // current structure already has fields defined
    //             ?? (parent && parent[$numFields]) // parent structure has fields defined
    //             ?? -1; // no fields defined
    //         fieldIndex++;
    //         if (
    //             !parent && // the parent already initializes the `$changes` property
    //             !Metadata.hasFields(context.metadata)
    //         ) {
    //             context.addInitializer(function (this: Ref) {
    //                 Object.defineProperty(this, $changes, {
    //                     value: new ChangeTree(this),
    //                     enumerable: false,
    //                     writable: true
    //                 });
    //             });
    //         }
    //         Metadata.addField(context.metadata, fieldIndex, field, type);
    //         const isArray = ArraySchema.is(type);
    //         const isMap = !isArray && MapSchema.is(type);
    //         // if (options && options.manual) {
    //         //     // do not declare getter/setter descriptor
    //         //     definition.descriptors[field] = {
    //         //         enumerable: true,
    //         //         configurable: true,
    //         //         writable: true,
    //         //     };
    //         //     return;
    //         // }
    //         return {
    //             init(value) {
    //                 // TODO: may need to convert ArraySchema/MapSchema here
    //                 // do not flag change if value is undefined.
    //                 if (value !== undefined) {
    //                     this[$changes].change(fieldIndex);
    //                     // automaticallty transform Array into ArraySchema
    //                     if (isArray) {
    //                         if (!(value instanceof ArraySchema)) {
    //                             value = new ArraySchema(...value);
    //                         }
    //                         value[$childType] = Object.values(type)[0];
    //                     }
    //                     // automaticallty transform Map into MapSchema
    //                     if (isMap) {
    //                         if (!(value instanceof MapSchema)) {
    //                             value = new MapSchema(value);
    //                         }
    //                         value[$childType] = Object.values(type)[0];
    //                     }
    //                     // try to turn provided structure into a Proxy
    //                     if (value['$proxy'] === undefined) {
    //                         if (isMap) {
    //                             value = getMapProxy(value);
    //                         }
    //                     }
    //                 }
    //                 return value;
    //             },
    //             get() {
    //                 return get.call(this);
    //             },
    //             set(value: any) {
    //                 /**
    //                  * Create Proxy for array or map items
    //                  */
    //                 // skip if value is the same as cached.
    //                 if (value === get.call(this)) {
    //                     return;
    //                 }
    //                 if (
    //                     value !== undefined &&
    //                     value !== null
    //                 ) {
    //                     // automaticallty transform Array into ArraySchema
    //                     if (isArray) {
    //                         if (!(value instanceof ArraySchema)) {
    //                             value = new ArraySchema(...value);
    //                         }
    //                         value[$childType] = Object.values(type)[0];
    //                     }
    //                     // automaticallty transform Map into MapSchema
    //                     if (isMap) {
    //                         if (!(value instanceof MapSchema)) {
    //                             value = new MapSchema(value);
    //                         }
    //                         value[$childType] = Object.values(type)[0];
    //                     }
    //                     // try to turn provided structure into a Proxy
    //                     if (value['$proxy'] === undefined) {
    //                         if (isMap) {
    //                             value = getMapProxy(value);
    //                         }
    //                     }
    //                     // flag the change for encoding.
    //                     this[$changes].change(fieldIndex);
    //                     //
    //                     // call setParent() recursively for this and its child
    //                     // structures.
    //                     //
    //                     if (value[$changes]) {
    //                         value[$changes].setParent(
    //                             this,
    //                             this[$changes].root,
    //                             Metadata.getIndex(context.metadata, field),
    //                         );
    //                     }
    //                 } else if (get.call(this)) {
    //                     //
    //                     // Setting a field to `null` or `undefined` will delete it.
    //                     //
    //                     this[$changes].delete(field);
    //                 }
    //                 set.call(this, value);
    //             },
    //         };
    //     }
    // }
    function view(tag = DEFAULT_VIEW_TAG) {
        return function (target, fieldName) {
            const constructor = target.constructor;
            const parentClass = Object.getPrototypeOf(constructor);
            const parentMetadata = parentClass[Symbol.metadata];
            // TODO: use Metadata.initialize()
            const metadata = (constructor[Symbol.metadata] ??= Object.assign({}, constructor[Symbol.metadata], parentMetadata ?? Object.create(null)));
            // const fieldIndex = metadata[fieldName];
            // if (!metadata[fieldIndex]) {
            //     //
            //     // detect index for this field, considering inheritance
            //     //
            //     metadata[fieldIndex] = {
            //         type: undefined,
            //         index: (metadata[$numFields] // current structure already has fields defined
            //             ?? (parentMetadata && parentMetadata[$numFields]) // parent structure has fields defined
            //             ?? -1) + 1 // no fields defined
            //     }
            // }
            Metadata.setTag(metadata, fieldName, tag);
        };
    }
    function type(type, options) {
        return function (target, field) {
            const constructor = target.constructor;
            if (!type) {
                throw new Error(`${constructor.name}: @type() reference provided for "${field}" is undefined. Make sure you don't have any circular dependencies.`);
            }
            // for inheritance support
            TypeContext.register(constructor);
            const parentClass = Object.getPrototypeOf(constructor);
            const parentMetadata = parentClass[Symbol.metadata];
            const metadata = Metadata.initialize(constructor);
            let fieldIndex = metadata[field];
            /**
             * skip if descriptor already exists for this field (`@deprecated()`)
             */
            if (metadata[fieldIndex] !== undefined) {
                if (metadata[fieldIndex].deprecated) {
                    // do not create accessors for deprecated properties.
                    return;
                }
                else if (metadata[fieldIndex].type !== undefined) {
                    // trying to define same property multiple times across inheritance.
                    // https://github.com/colyseus/colyseus-unity3d/issues/131#issuecomment-814308572
                    try {
                        throw new Error(`@colyseus/schema: Duplicate '${field}' definition on '${constructor.name}'.\nCheck @type() annotation`);
                    }
                    catch (e) {
                        const definitionAtLine = e.stack.split("\n")[4].trim();
                        throw new Error(`${e.message} ${definitionAtLine}`);
                    }
                }
            }
            else {
                //
                // detect index for this field, considering inheritance
                //
                fieldIndex = metadata[$numFields] // current structure already has fields defined
                    ?? (parentMetadata && parentMetadata[$numFields]) // parent structure has fields defined
                    ?? -1; // no fields defined
                fieldIndex++;
            }
            if (options && options.manual) {
                Metadata.addField(metadata, fieldIndex, field, type, {
                    // do not declare getter/setter descriptor
                    enumerable: true,
                    configurable: true,
                    writable: true,
                });
            }
            else {
                const complexTypeKlass = (Array.isArray(type))
                    ? getType("array")
                    : (typeof (Object.keys(type)[0]) === "string") && getType(Object.keys(type)[0]);
                const childType = (complexTypeKlass)
                    ? Object.values(type)[0]
                    : type;
                Metadata.addField(metadata, fieldIndex, field, type, getPropertyDescriptor(`_${field}`, fieldIndex, childType, complexTypeKlass));
            }
        };
    }
    function getPropertyDescriptor(fieldCached, fieldIndex, type, complexTypeKlass) {
        return {
            get: function () { return this[fieldCached]; },
            set: function (value) {
                const previousValue = this[fieldCached] ?? undefined;
                // skip if value is the same as cached.
                if (value === previousValue) {
                    return;
                }
                if (value !== undefined &&
                    value !== null) {
                    if (complexTypeKlass) {
                        // automaticallty transform Array into ArraySchema
                        if (complexTypeKlass.constructor === ArraySchema && !(value instanceof ArraySchema)) {
                            value = new ArraySchema(...value);
                        }
                        // automaticallty transform Map into MapSchema
                        if (complexTypeKlass.constructor === MapSchema && !(value instanceof MapSchema)) {
                            value = new MapSchema(value);
                        }
                        value[$childType] = type;
                    }
                    else if (typeof (type) !== "string") {
                        assertInstanceType(value, type, this, fieldCached.substring(1));
                    }
                    else {
                        assertType(value, type, this, fieldCached.substring(1));
                    }
                    const changeTree = this[$changes];
                    //
                    // Replacing existing "ref", remove it from root.
                    //
                    if (previousValue !== undefined && previousValue[$changes]) {
                        changeTree.root?.remove(previousValue[$changes]);
                        this.constructor[$track](changeTree, fieldIndex, exports.OPERATION.DELETE_AND_ADD);
                    }
                    else {
                        this.constructor[$track](changeTree, fieldIndex, exports.OPERATION.ADD);
                    }
                    //
                    // call setParent() recursively for this and its child
                    // structures.
                    //
                    value[$changes]?.setParent(this, changeTree.root, fieldIndex);
                }
                else if (previousValue !== undefined) {
                    //
                    // Setting a field to `null` or `undefined` will delete it.
                    //
                    this[$changes].delete(fieldIndex);
                }
                this[fieldCached] = value;
            },
            enumerable: true,
            configurable: true
        };
    }
    /**
     * `@deprecated()` flag a field as deprecated.
     * The previous `@type()` annotation should remain along with this one.
     */
    function deprecated(throws = true) {
        return function (klass, field) {
            //
            // FIXME: the following block of code is repeated across `@type()`, `@deprecated()` and `@unreliable()` decorators.
            //
            const constructor = klass.constructor;
            const parentClass = Object.getPrototypeOf(constructor);
            const parentMetadata = parentClass[Symbol.metadata];
            const metadata = (constructor[Symbol.metadata] ??= Object.assign({}, constructor[Symbol.metadata], parentMetadata ?? Object.create(null)));
            const fieldIndex = metadata[field];
            // if (!metadata[field]) {
            //     //
            //     // detect index for this field, considering inheritance
            //     //
            //     metadata[field] = {
            //         type: undefined,
            //         index: (metadata[$numFields] // current structure already has fields defined
            //             ?? (parentMetadata && parentMetadata[$numFields]) // parent structure has fields defined
            //             ?? -1) + 1 // no fields defined
            //     }
            // }
            metadata[fieldIndex].deprecated = true;
            if (throws) {
                metadata[$descriptors] ??= {};
                metadata[$descriptors][field] = {
                    get: function () { throw new Error(`${field} is deprecated.`); },
                    set: function (value) { },
                    enumerable: false,
                    configurable: true
                };
            }
            // flag metadata[field] as non-enumerable
            Object.defineProperty(metadata, fieldIndex, {
                value: metadata[fieldIndex],
                enumerable: false,
                configurable: true
            });
        };
    }
    function defineTypes(target, fields, options) {
        for (let field in fields) {
            type(fields[field], options)(target.prototype, field);
        }
        return target;
    }
    function schema(fields, name, inherits = Schema) {
        const defaultValues = {};
        const viewTagFields = {};
        for (let fieldName in fields) {
            const field = fields[fieldName];
            if (typeof (field) === "object") {
                if (field['default'] !== undefined) {
                    defaultValues[fieldName] = field['default'];
                }
                if (field['view'] !== undefined) {
                    viewTagFields[fieldName] = (typeof (field['view']) === "boolean")
                        ? DEFAULT_VIEW_TAG
                        : field['view'];
                }
            }
        }
        const klass = Metadata.setFields(class extends inherits {
            constructor(...args) {
                args[0] = Object.assign({}, defaultValues, args[0]);
                super(...args);
            }
        }, fields);
        for (let fieldName in viewTagFields) {
            view(viewTagFields[fieldName])(klass.prototype, fieldName);
        }
        if (name) {
            Object.defineProperty(klass, "name", { value: name });
        }
        klass.extends = (fields, name) => schema(fields, name, klass);
        return klass;
    }

    function getIndent(level) {
        return (new Array(level).fill(0)).map((_, i) => (i === level - 1) ? `└─ ` : `   `).join("");
    }
    function dumpChanges(schema) {
        const $root = schema[$changes].root;
        const dump = {
            ops: {},
            refs: []
        };
        // for (const refId in $root.changes) {
        $root.changes.forEach(changeTree => {
            const changes = changeTree.indexedOperations;
            dump.refs.push(`refId#${changeTree.refId}`);
            for (const index in changes) {
                const op = changes[index];
                const opName = exports.OPERATION[op];
                if (!dump.ops[opName]) {
                    dump.ops[opName] = 0;
                }
                dump.ops[exports.OPERATION[op]]++;
            }
        });
        return dump;
    }

    var _a$2, _b$2;
    /**
     * Schema encoder / decoder
     */
    class Schema {
        static { this[_a$2] = encodeSchemaOperation; }
        static { this[_b$2] = decodeSchemaOperation; }
        /**
         * Assign the property descriptors required to track changes on this instance.
         * @param instance
         */
        static initialize(instance) {
            Object.defineProperty(instance, $changes, {
                value: new ChangeTree(instance),
                enumerable: false,
                writable: true
            });
            Object.defineProperties(instance, instance.constructor[Symbol.metadata]?.[$descriptors] || {});
        }
        static is(type) {
            return typeof (type[Symbol.metadata]) === "object";
            // const metadata = type[Symbol.metadata];
            // return metadata && Object.prototype.hasOwnProperty.call(metadata, -1);
        }
        /**
         * Track property changes
         */
        static [(_a$2 = $encoder, _b$2 = $decoder, $track)](changeTree, index, operation = exports.OPERATION.ADD) {
            changeTree.change(index, operation);
        }
        /**
         * Determine if a property must be filtered.
         * - If returns false, the property is NOT going to be encoded.
         * - If returns true, the property is going to be encoded.
         *
         * Encoding with "filters" happens in two steps:
         * - First, the encoder iterates over all "not owned" properties and encodes them.
         * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
         */
        static [$filter](ref, index, view) {
            const metadata = ref.constructor[Symbol.metadata];
            const tag = metadata[index]?.tag;
            if (view === undefined) {
                // shared pass/encode: encode if doesn't have a tag
                return tag === undefined;
            }
            else if (tag === undefined) {
                // view pass: no tag
                return true;
            }
            else if (tag === DEFAULT_VIEW_TAG) {
                // view pass: default tag
                return view.items.has(ref[$changes]);
            }
            else {
                // view pass: custom tag
                const tags = view.tags?.get(ref[$changes]);
                return tags && tags.has(tag);
            }
        }
        // allow inherited classes to have a constructor
        constructor(...args) {
            //
            // inline
            // Schema.initialize(this);
            //
            Schema.initialize(this);
            //
            // Assign initial values
            //
            if (args[0]) {
                Object.assign(this, args[0]);
            }
        }
        assign(props) {
            Object.assign(this, props);
            return this;
        }
        /**
         * (Server-side): Flag a property to be encoded for the next patch.
         * @param instance Schema instance
         * @param property string representing the property name, or number representing the index of the property.
         * @param operation OPERATION to perform (detected automatically)
         */
        setDirty(property, operation) {
            const metadata = this.constructor[Symbol.metadata];
            this[$changes].change(metadata[metadata[property]].index, operation);
        }
        clone() {
            const cloned = new (this.constructor);
            const metadata = this.constructor[Symbol.metadata];
            //
            // TODO: clone all properties, not only annotated ones
            //
            // for (const field in this) {
            for (const fieldIndex in metadata) {
                // const field = metadata[metadata[fieldIndex]].name;
                const field = metadata[fieldIndex].name;
                if (typeof (this[field]) === "object" &&
                    typeof (this[field]?.clone) === "function") {
                    // deep clone
                    cloned[field] = this[field].clone();
                }
                else {
                    // primitive values
                    cloned[field] = this[field];
                }
            }
            return cloned;
        }
        toJSON() {
            const obj = {};
            const metadata = this.constructor[Symbol.metadata];
            for (const index in metadata) {
                const field = metadata[index];
                const fieldName = field.name;
                if (!field.deprecated && this[fieldName] !== null && typeof (this[fieldName]) !== "undefined") {
                    obj[fieldName] = (typeof (this[fieldName]['toJSON']) === "function")
                        ? this[fieldName]['toJSON']()
                        : this[fieldName];
                }
            }
            return obj;
        }
        discardAllChanges() {
            this[$changes].discardAll();
        }
        [$getByIndex](index) {
            const metadata = this.constructor[Symbol.metadata];
            return this[metadata[index].name];
        }
        [$deleteByIndex](index) {
            const metadata = this.constructor[Symbol.metadata];
            this[metadata[index].name] = undefined;
        }
        /**
         * Inspect the `refId` of all Schema instances in the tree. Optionally display the contents of the instance.
         *
         * @param ref Schema instance
         * @param showContents display JSON contents of the instance
         * @returns
         */
        static debugRefIds(ref, showContents = false, level = 0) {
            const contents = (showContents) ? ` - ${JSON.stringify(ref.toJSON())}` : "";
            const changeTree = ref[$changes];
            const refId = changeTree.refId;
            let output = "";
            output += `${getIndent(level)}${ref.constructor.name} (refId: ${refId})${contents}\n`;
            changeTree.forEachChild((childChangeTree) => output += this.debugRefIds(childChangeTree.ref, showContents, level + 1));
            return output;
        }
        /**
         * Return a string representation of the changes on a Schema instance.
         * The list of changes is cleared after each encode.
         *
         * @param instance Schema instance
         * @param isEncodeAll Return "full encode" instead of current change set.
         * @returns
         */
        static debugChanges(instance, isEncodeAll = false) {
            const changeTree = instance[$changes];
            const changeSet = (isEncodeAll) ? changeTree.allChanges : changeTree.changes;
            const changeSetName = (isEncodeAll) ? "allChanges" : "changes";
            let output = `${instance.constructor.name} (${changeTree.refId}) -> .${changeSetName}:\n`;
            function dumpChangeSet(changeSet) {
                changeSet.operations
                    .filter(op => op)
                    .forEach((index) => {
                    const operation = changeTree.indexedOperations[index];
                    console.log({ index, operation });
                    output += `- [${index}]: ${exports.OPERATION[operation]} (${JSON.stringify(changeTree.getValue(Number(index), isEncodeAll))})\n`;
                });
            }
            dumpChangeSet(changeSet);
            // display filtered changes
            if (!isEncodeAll &&
                changeTree.filteredChanges &&
                (changeTree.filteredChanges.operations).filter(op => op).length > 0) {
                output += `${instance.constructor.name} (${changeTree.refId}) -> .filteredChanges:\n`;
                dumpChangeSet(changeTree.filteredChanges);
            }
            // display filtered changes
            if (isEncodeAll &&
                changeTree.allFilteredChanges &&
                (changeTree.allFilteredChanges.operations).filter(op => op).length > 0) {
                output += `${instance.constructor.name} (${changeTree.refId}) -> .allFilteredChanges:\n`;
                dumpChangeSet(changeTree.allFilteredChanges);
            }
            return output;
        }
        static debugChangesDeep(ref, changeSetName = "changes") {
            let output = "";
            const rootChangeTree = ref[$changes];
            const root = rootChangeTree.root;
            const changeTrees = new Map();
            const instanceRefIds = [];
            let totalOperations = 0;
            for (const [refId, changes] of Object.entries(root[changeSetName])) {
                const changeTree = root.changeTrees[refId];
                let includeChangeTree = false;
                let parentChangeTrees = [];
                let parentChangeTree = changeTree.parent?.[$changes];
                if (changeTree === rootChangeTree) {
                    includeChangeTree = true;
                }
                else {
                    while (parentChangeTree !== undefined) {
                        parentChangeTrees.push(parentChangeTree);
                        if (parentChangeTree.ref === ref) {
                            includeChangeTree = true;
                            break;
                        }
                        parentChangeTree = parentChangeTree.parent?.[$changes];
                    }
                }
                if (includeChangeTree) {
                    instanceRefIds.push(changeTree.refId);
                    totalOperations += Object.keys(changes).length;
                    changeTrees.set(changeTree, parentChangeTrees.reverse());
                }
            }
            output += "---\n";
            output += `root refId: ${rootChangeTree.refId}\n`;
            output += `Total instances: ${instanceRefIds.length} (refIds: ${instanceRefIds.join(", ")})\n`;
            output += `Total changes: ${totalOperations}\n`;
            output += "---\n";
            // based on root.changes, display a tree of changes that has the "ref" instance as parent
            const visitedParents = new WeakSet();
            for (const [changeTree, parentChangeTrees] of changeTrees.entries()) {
                parentChangeTrees.forEach((parentChangeTree, level) => {
                    if (!visitedParents.has(parentChangeTree)) {
                        output += `${getIndent(level)}${parentChangeTree.ref.constructor.name} (refId: ${parentChangeTree.refId})\n`;
                        visitedParents.add(parentChangeTree);
                    }
                });
                const changes = changeTree.indexedOperations;
                const level = parentChangeTrees.length;
                const indent = getIndent(level);
                const parentIndex = (level > 0) ? `(${changeTree.parentIndex}) ` : "";
                output += `${indent}${parentIndex}${changeTree.ref.constructor.name} (refId: ${changeTree.refId}) - changes: ${Object.keys(changes).length}\n`;
                for (const index in changes) {
                    const operation = changes[index];
                    output += `${getIndent(level + 1)}${exports.OPERATION[operation]}: ${index}\n`;
                }
            }
            return `${output}`;
        }
    }

    var _a$1, _b$1;
    class CollectionSchema {
        static { this[_a$1] = encodeKeyValueOperation; }
        static { this[_b$1] = decodeKeyValueOperation; }
        /**
         * Determine if a property must be filtered.
         * - If returns false, the property is NOT going to be encoded.
         * - If returns true, the property is going to be encoded.
         *
         * Encoding with "filters" happens in two steps:
         * - First, the encoder iterates over all "not owned" properties and encodes them.
         * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
         */
        static [(_a$1 = $encoder, _b$1 = $decoder, $filter)](ref, index, view) {
            return (!view ||
                typeof (ref[$childType]) === "string" ||
                view.items.has(ref[$getByIndex](index)[$changes]));
        }
        static is(type) {
            return type['collection'] !== undefined;
        }
        constructor(initialValues) {
            this.$items = new Map();
            this.$indexes = new Map();
            this.$refId = 0;
            this[$changes] = new ChangeTree(this);
            this[$changes].indexes = {};
            if (initialValues) {
                initialValues.forEach((v) => this.add(v));
            }
            Object.defineProperty(this, $childType, {
                value: undefined,
                enumerable: false,
                writable: true,
                configurable: true,
            });
        }
        add(value) {
            // set "index" for reference.
            const index = this.$refId++;
            const isRef = (value[$changes]) !== undefined;
            if (isRef) {
                value[$changes].setParent(this, this[$changes].root, index);
            }
            this[$changes].indexes[index] = index;
            this.$indexes.set(index, index);
            this.$items.set(index, value);
            this[$changes].change(index);
            return index;
        }
        at(index) {
            const key = Array.from(this.$items.keys())[index];
            return this.$items.get(key);
        }
        entries() {
            return this.$items.entries();
        }
        delete(item) {
            const entries = this.$items.entries();
            let index;
            let entry;
            while (entry = entries.next()) {
                if (entry.done) {
                    break;
                }
                if (item === entry.value[1]) {
                    index = entry.value[0];
                    break;
                }
            }
            if (index === undefined) {
                return false;
            }
            this[$changes].delete(index);
            this.$indexes.delete(index);
            return this.$items.delete(index);
        }
        clear() {
            const changeTree = this[$changes];
            // discard previous operations.
            changeTree.discard(true);
            changeTree.indexes = {};
            // clear previous indexes
            this.$indexes.clear();
            // clear items
            this.$items.clear();
            changeTree.operation(exports.OPERATION.CLEAR);
        }
        has(value) {
            return Array.from(this.$items.values()).some((v) => v === value);
        }
        forEach(callbackfn) {
            this.$items.forEach((value, key, _) => callbackfn(value, key, this));
        }
        values() {
            return this.$items.values();
        }
        get size() {
            return this.$items.size;
        }
        /** Iterator */
        [Symbol.iterator]() {
            return this.$items.values();
        }
        setIndex(index, key) {
            this.$indexes.set(index, key);
        }
        getIndex(index) {
            return this.$indexes.get(index);
        }
        [$getByIndex](index) {
            return this.$items.get(this.$indexes.get(index));
        }
        [$deleteByIndex](index) {
            const key = this.$indexes.get(index);
            this.$items.delete(key);
            this.$indexes.delete(index);
        }
        toArray() {
            return Array.from(this.$items.values());
        }
        toJSON() {
            const values = [];
            this.forEach((value, key) => {
                values.push((typeof (value['toJSON']) === "function")
                    ? value['toJSON']()
                    : value);
            });
            return values;
        }
        //
        // Decoding utilities
        //
        clone(isDecoding) {
            let cloned;
            if (isDecoding) {
                // client-side
                cloned = Object.assign(new CollectionSchema(), this);
            }
            else {
                // server-side
                cloned = new CollectionSchema();
                this.forEach((value) => {
                    if (value[$changes]) {
                        cloned.add(value['clone']());
                    }
                    else {
                        cloned.add(value);
                    }
                });
            }
            return cloned;
        }
    }
    registerType("collection", { constructor: CollectionSchema, });

    var _a, _b;
    class SetSchema {
        static { this[_a] = encodeKeyValueOperation; }
        static { this[_b] = decodeKeyValueOperation; }
        /**
         * Determine if a property must be filtered.
         * - If returns false, the property is NOT going to be encoded.
         * - If returns true, the property is going to be encoded.
         *
         * Encoding with "filters" happens in two steps:
         * - First, the encoder iterates over all "not owned" properties and encodes them.
         * - Then, the encoder iterates over all "owned" properties per instance and encodes them.
         */
        static [(_a = $encoder, _b = $decoder, $filter)](ref, index, view) {
            return (!view ||
                typeof (ref[$childType]) === "string" ||
                view.items.has(ref[$getByIndex](index)[$changes]));
        }
        static is(type) {
            return type['set'] !== undefined;
        }
        constructor(initialValues) {
            this.$items = new Map();
            this.$indexes = new Map();
            this.$refId = 0;
            this[$changes] = new ChangeTree(this);
            this[$changes].indexes = {};
            if (initialValues) {
                initialValues.forEach((v) => this.add(v));
            }
            Object.defineProperty(this, $childType, {
                value: undefined,
                enumerable: false,
                writable: true,
                configurable: true,
            });
        }
        add(value) {
            // immediatelly return false if value already added.
            if (this.has(value)) {
                return false;
            }
            // set "index" for reference.
            const index = this.$refId++;
            if ((value[$changes]) !== undefined) {
                value[$changes].setParent(this, this[$changes].root, index);
            }
            const operation = this[$changes].indexes[index]?.op ?? exports.OPERATION.ADD;
            this[$changes].indexes[index] = index;
            this.$indexes.set(index, index);
            this.$items.set(index, value);
            this[$changes].change(index, operation);
            return index;
        }
        entries() {
            return this.$items.entries();
        }
        delete(item) {
            const entries = this.$items.entries();
            let index;
            let entry;
            while (entry = entries.next()) {
                if (entry.done) {
                    break;
                }
                if (item === entry.value[1]) {
                    index = entry.value[0];
                    break;
                }
            }
            if (index === undefined) {
                return false;
            }
            this[$changes].delete(index);
            this.$indexes.delete(index);
            return this.$items.delete(index);
        }
        clear() {
            const changeTree = this[$changes];
            // discard previous operations.
            changeTree.discard(true);
            changeTree.indexes = {};
            // clear previous indexes
            this.$indexes.clear();
            // clear items
            this.$items.clear();
            changeTree.operation(exports.OPERATION.CLEAR);
        }
        has(value) {
            const values = this.$items.values();
            let has = false;
            let entry;
            while (entry = values.next()) {
                if (entry.done) {
                    break;
                }
                if (value === entry.value) {
                    has = true;
                    break;
                }
            }
            return has;
        }
        forEach(callbackfn) {
            this.$items.forEach((value, key, _) => callbackfn(value, key, this));
        }
        values() {
            return this.$items.values();
        }
        get size() {
            return this.$items.size;
        }
        /** Iterator */
        [Symbol.iterator]() {
            return this.$items.values();
        }
        setIndex(index, key) {
            this.$indexes.set(index, key);
        }
        getIndex(index) {
            return this.$indexes.get(index);
        }
        [$getByIndex](index) {
            return this.$items.get(this.$indexes.get(index));
        }
        [$deleteByIndex](index) {
            const key = this.$indexes.get(index);
            this.$items.delete(key);
            this.$indexes.delete(index);
        }
        toArray() {
            return Array.from(this.$items.values());
        }
        toJSON() {
            const values = [];
            this.forEach((value, key) => {
                values.push((typeof (value['toJSON']) === "function")
                    ? value['toJSON']()
                    : value);
            });
            return values;
        }
        //
        // Decoding utilities
        //
        clone(isDecoding) {
            let cloned;
            if (isDecoding) {
                // client-side
                cloned = Object.assign(new SetSchema(), this);
            }
            else {
                // server-side
                cloned = new SetSchema();
                this.forEach((value) => {
                    if (value[$changes]) {
                        cloned.add(value['clone']());
                    }
                    else {
                        cloned.add(value);
                    }
                });
            }
            return cloned;
        }
    }
    registerType("set", { constructor: SetSchema });

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function spliceOne(arr, index) {
        // manually splice an array
        if (index === -1 || index >= arr.length) {
            return false;
        }
        const len = arr.length - 1;
        for (let i = index; i < len; i++) {
            arr[i] = arr[i + 1];
        }
        arr.length = len;
        return true;
    }

    class Root {
        constructor(types) {
            this.types = types;
            this.nextUniqueId = 0;
            this.refCount = {};
            this.changeTrees = {};
            // all changes
            this.allChanges = [];
            this.allFilteredChanges = []; // TODO: do not initialize it if filters are not used
            // pending changes to be encoded
            this.changes = [];
            this.filteredChanges = []; // TODO: do not initialize it if filters are not used
        }
        getNextUniqueId() {
            return this.nextUniqueId++;
        }
        add(changeTree) {
            // FIXME: move implementation of `ensureRefId` to `Root` class
            changeTree.ensureRefId();
            const isNewChangeTree = (this.changeTrees[changeTree.refId] === undefined);
            if (isNewChangeTree) {
                this.changeTrees[changeTree.refId] = changeTree;
            }
            const previousRefCount = this.refCount[changeTree.refId];
            if (previousRefCount === 0) {
                //
                // When a ChangeTree is re-added, it means that it was previously removed.
                // We need to re-add all changes to the `changes` map.
                //
                const ops = changeTree.allChanges.operations;
                let len = ops.length;
                while (len--) {
                    changeTree.indexedOperations[ops[len]] = exports.OPERATION.ADD;
                    setOperationAtIndex(changeTree.changes, len);
                }
            }
            this.refCount[changeTree.refId] = (previousRefCount || 0) + 1;
            return isNewChangeTree;
        }
        remove(changeTree) {
            const refCount = (this.refCount[changeTree.refId]) - 1;
            if (refCount <= 0) {
                //
                // Only remove "root" reference if it's the last reference
                //
                changeTree.root = undefined;
                delete this.changeTrees[changeTree.refId];
                this.removeChangeFromChangeSet("allChanges", changeTree);
                this.removeChangeFromChangeSet("changes", changeTree);
                if (changeTree.filteredChanges) {
                    this.removeChangeFromChangeSet("allFilteredChanges", changeTree);
                    this.removeChangeFromChangeSet("filteredChanges", changeTree);
                }
                this.refCount[changeTree.refId] = 0;
            }
            else {
                this.refCount[changeTree.refId] = refCount;
                //
                // When losing a reference to an instance, it is best to move the
                // ChangeTree to the end of the encoding queue.
                //
                // This way, at decoding time, the instance that contains the
                // ChangeTree will be available before the ChangeTree itself. If the
                // containing instance is not available, the Decoder will throw
                // "refId not found" error.
                //
                if (changeTree.filteredChanges !== undefined) {
                    this.removeChangeFromChangeSet("filteredChanges", changeTree);
                    enqueueChangeTree(this, changeTree, "filteredChanges");
                }
                else {
                    this.removeChangeFromChangeSet("changes", changeTree);
                    enqueueChangeTree(this, changeTree, "changes");
                }
            }
            changeTree.forEachChild((child, _) => this.remove(child));
            return refCount;
        }
        removeChangeFromChangeSet(changeSetName, changeTree) {
            const changeSet = this[changeSetName];
            if (spliceOne(changeSet, changeSet.indexOf(changeTree))) {
                changeTree[changeSetName].queueRootIndex = -1;
                // changeSet[index] = undefined;
                return true;
            }
        }
        clear() {
            this.changes.length = 0;
        }
    }

    class Encoder {
        static { this.BUFFER_SIZE = (typeof (Buffer) !== "undefined") && Buffer.poolSize || 8 * 1024; } // 8KB
        constructor(state) {
            this.sharedBuffer = Buffer.allocUnsafe(Encoder.BUFFER_SIZE);
            //
            // TODO: cache and restore "Context" based on root schema
            // (to avoid creating a new context for every new room)
            //
            this.context = new TypeContext(state.constructor);
            this.root = new Root(this.context);
            this.setState(state);
            // console.log(">>>>>>>>>>>>>>>> Encoder types");
            // this.context.schemas.forEach((id, schema) => {
            //     console.log("type:", id, schema.name, Object.keys(schema[Symbol.metadata]));
            // });
        }
        setState(state) {
            this.state = state;
            this.state[$changes].setRoot(this.root);
        }
        encode(it = { offset: 0 }, view, buffer = this.sharedBuffer, changeSetName = "changes", isEncodeAll = changeSetName === "allChanges", initialOffset = it.offset // cache current offset in case we need to resize the buffer
        ) {
            const hasView = (view !== undefined);
            const rootChangeTree = this.state[$changes];
            const shouldDiscardChanges = !isEncodeAll && !hasView;
            const changeTrees = this.root[changeSetName];
            for (let i = 0, numChangeTrees = changeTrees.length; i < numChangeTrees; i++) {
                const changeTree = changeTrees[i];
                if (hasView) {
                    if (!view.items.has(changeTree)) {
                        view.invisible.add(changeTree);
                        continue; // skip this change tree
                    }
                    else if (view.invisible.has(changeTree)) {
                        view.invisible.delete(changeTree); // remove from invisible list
                    }
                }
                const operations = changeTree[changeSetName];
                const ref = changeTree.ref;
                // TODO: avoid iterating over change tree if no changes were made
                const numChanges = operations.operations.length;
                if (numChanges === 0) {
                    continue;
                }
                const ctor = ref.constructor;
                const encoder = ctor[$encoder];
                const filter = ctor[$filter];
                const metadata = ctor[Symbol.metadata];
                // skip root `refId` if it's the first change tree
                // (unless it "hasView", which will need to revisit the root)
                if (hasView || it.offset > initialOffset || changeTree !== rootChangeTree) {
                    buffer[it.offset++] = SWITCH_TO_STRUCTURE & 255;
                    encode.number(buffer, changeTree.refId, it);
                }
                for (let j = 0; j < numChanges; j++) {
                    const fieldIndex = operations.operations[j];
                    const operation = (fieldIndex < 0)
                        ? Math.abs(fieldIndex) // "pure" operation without fieldIndex (e.g. CLEAR, REVERSE, etc.)
                        : (isEncodeAll)
                            ? exports.OPERATION.ADD
                            : changeTree.indexedOperations[fieldIndex];
                    //
                    // first pass (encodeAll), identify "filtered" operations without encoding them
                    // they will be encoded per client, based on their view.
                    //
                    // TODO: how can we optimize filtering out "encode all" operations?
                    // TODO: avoid checking if no view tags were defined
                    //
                    if (fieldIndex === undefined || operation === undefined || (filter && !filter(ref, fieldIndex, view))) {
                        // console.log("ADD AS INVISIBLE:", fieldIndex, changeTree.ref.constructor.name)
                        // view?.invisible.add(changeTree);
                        continue;
                    }
                    encoder(this, buffer, changeTree, fieldIndex, operation, it, isEncodeAll, hasView, metadata);
                }
                // if (shouldDiscardChanges) {
                //     changeTree.discard();
                //     changeTree.isNew = false; // Not a new instance anymore
                // }
            }
            if (it.offset > buffer.byteLength) {
                // we can assume that n + 1 poolSize will suffice given that we are likely done with encoding at this point
                // multiples of poolSize are faster to allocate than arbitrary sizes
                // if we are on an older platform that doesn't implement pooling use 8kb as poolSize (that's the default for node)
                const newSize = Math.ceil(it.offset / (Buffer.poolSize ?? 8 * 1024)) * (Buffer.poolSize ?? 8 * 1024);
                console.warn(`@colyseus/schema buffer overflow. Encoded state is higher than default BUFFER_SIZE. Use the following to increase default BUFFER_SIZE:

    import { Encoder } from "@colyseus/schema";
    Encoder.BUFFER_SIZE = ${Math.round(newSize / 1024)} * 1024; // ${Math.round(newSize / 1024)} KB
`);
                //
                // resize buffer and re-encode (TODO: can we avoid re-encoding here?)
                // -> No we probably can't unless we catch the need for resize before encoding which is likely more computationally expensive than resizing on demand
                //
                buffer = Buffer.alloc(newSize, buffer); // fill with buffer here to memcpy previous encoding steps beyond the initialOffset
                // assign resized buffer to local sharedBuffer
                if (buffer === this.sharedBuffer) {
                    this.sharedBuffer = buffer;
                }
                return this.encode({ offset: initialOffset }, view, buffer, changeSetName, isEncodeAll);
            }
            else {
                //
                // only clear changes after making sure buffer resize is not required.
                //
                if (shouldDiscardChanges) {
                    //
                    // TODO: avoid iterating over change trees twice.
                    //
                    for (let i = 0, numChangeTrees = changeTrees.length; i < numChangeTrees; i++) {
                        const changeTree = changeTrees[i];
                        changeTree.discard();
                        changeTree.isNew = false; // Not a new instance anymore
                    }
                }
                return buffer.subarray(0, it.offset);
            }
        }
        encodeAll(it = { offset: 0 }, buffer = this.sharedBuffer) {
            return this.encode(it, undefined, buffer, "allChanges", true);
        }
        encodeAllView(view, sharedOffset, it, bytes = this.sharedBuffer) {
            const viewOffset = it.offset;
            // try to encode "filtered" changes
            this.encode(it, view, bytes, "allFilteredChanges", true, viewOffset);
            return Buffer.concat([
                bytes.subarray(0, sharedOffset),
                bytes.subarray(viewOffset, it.offset)
            ]);
        }
        debugChanges(field) {
            const rootChangeSet = (typeof (field) === "string")
                ? this.root[field]
                : field;
            rootChangeSet.forEach((changeTree) => {
                const changeSet = changeTree[field];
                const metadata = changeTree.ref.constructor[Symbol.metadata];
                console.log("->", { ref: changeTree.ref.constructor.name, refId: changeTree.refId, changes: Object.keys(changeSet).length });
                for (const index in changeSet) {
                    const op = changeSet[index];
                    console.log("  ->", {
                        index,
                        field: metadata?.[index],
                        op: exports.OPERATION[op],
                    });
                }
            });
        }
        encodeView(view, sharedOffset, it, bytes = this.sharedBuffer) {
            const viewOffset = it.offset;
            // encode visibility changes (add/remove for this view)
            for (const [refId, changes] of view.changes) {
                const changeTree = this.root.changeTrees[refId];
                if (changeTree === undefined) {
                    // detached instance, remove from view and skip.
                    view.changes.delete(refId);
                    continue;
                }
                const keys = Object.keys(changes);
                if (keys.length === 0) {
                    // FIXME: avoid having empty changes if no changes were made
                    // console.log("changes.size === 0, skip", changeTree.ref.constructor.name);
                    continue;
                }
                const ref = changeTree.ref;
                const ctor = ref.constructor;
                const encoder = ctor[$encoder];
                const metadata = ctor[Symbol.metadata];
                bytes[it.offset++] = SWITCH_TO_STRUCTURE & 255;
                encode.number(bytes, changeTree.refId, it);
                for (let i = 0, numChanges = keys.length; i < numChanges; i++) {
                    const index = Number(keys[i]);
                    // workaround when using view.add() on item that has been deleted from state (see test "adding to view item that has been removed from state")
                    const value = changeTree.ref[$getByIndex](index);
                    const operation = (value !== undefined && changes[index]) || exports.OPERATION.DELETE;
                    // isEncodeAll = false
                    // hasView = true
                    encoder(this, bytes, changeTree, index, operation, it, false, true, metadata);
                }
            }
            //
            // TODO: only clear view changes after all views are encoded
            // (to allow re-using StateView's for multiple clients)
            //
            // clear "view" changes after encoding
            view.changes.clear();
            // try to encode "filtered" changes
            this.encode(it, view, bytes, "filteredChanges", false, viewOffset);
            return Buffer.concat([
                bytes.subarray(0, sharedOffset),
                bytes.subarray(viewOffset, it.offset)
            ]);
        }
        discardChanges() {
            // discard shared changes
            let length = this.root.changes.length;
            if (length > 0) {
                while (length--) {
                    this.root.changes[length]?.endEncode();
                }
                this.root.changes.length = 0;
            }
            // discard filtered changes
            length = this.root.filteredChanges.length;
            if (length > 0) {
                while (length--) {
                    this.root.filteredChanges[length]?.endEncode();
                }
                this.root.filteredChanges.length = 0;
            }
        }
        tryEncodeTypeId(bytes, baseType, targetType, it) {
            const baseTypeId = this.context.getTypeId(baseType);
            const targetTypeId = this.context.getTypeId(targetType);
            if (targetTypeId === undefined) {
                console.warn(`@colyseus/schema WARNING: Class "${targetType.name}" is not registered on TypeRegistry - Please either tag the class with @entity or define a @type() field.`);
                return;
            }
            if (baseTypeId !== targetTypeId) {
                bytes[it.offset++] = TYPE_ID & 255;
                encode.number(bytes, targetTypeId, it);
            }
        }
        get hasChanges() {
            return (this.root.changes.length > 0 ||
                this.root.filteredChanges.length > 0);
        }
    }

    class DecodingWarning extends Error {
        constructor(message) {
            super(message);
            this.name = "DecodingWarning";
        }
    }
    class ReferenceTracker {
        constructor() {
            //
            // Relation of refId => Schema structure
            // For direct access of structures during decoding time.
            //
            this.refs = new Map();
            this.refIds = new WeakMap();
            this.refCounts = {};
            this.deletedRefs = new Set();
            this.callbacks = {};
            this.nextUniqueId = 0;
        }
        getNextUniqueId() {
            return this.nextUniqueId++;
        }
        // for decoding
        addRef(refId, ref, incrementCount = true) {
            this.refs.set(refId, ref);
            this.refIds.set(ref, refId);
            if (incrementCount) {
                this.refCounts[refId] = (this.refCounts[refId] || 0) + 1;
            }
            if (this.deletedRefs.has(refId)) {
                this.deletedRefs.delete(refId);
            }
        }
        // for decoding
        removeRef(refId) {
            const refCount = this.refCounts[refId];
            if (refCount === undefined) {
                try {
                    throw new DecodingWarning("trying to remove refId that doesn't exist: " + refId);
                }
                catch (e) {
                    console.warn(e);
                }
                return;
            }
            if (refCount === 0) {
                try {
                    const ref = this.refs.get(refId);
                    throw new DecodingWarning(`trying to remove refId '${refId}' with 0 refCount (${ref.constructor.name}: ${JSON.stringify(ref)})`);
                }
                catch (e) {
                    console.warn(e);
                }
                return;
            }
            if ((this.refCounts[refId] = refCount - 1) <= 0) {
                this.deletedRefs.add(refId);
            }
        }
        clearRefs() {
            this.refs.clear();
            this.deletedRefs.clear();
            this.callbacks = {};
            this.refCounts = {};
        }
        // for decoding
        garbageCollectDeletedRefs() {
            this.deletedRefs.forEach((refId) => {
                //
                // Skip active references.
                //
                if (this.refCounts[refId] > 0) {
                    return;
                }
                const ref = this.refs.get(refId);
                //
                // Ensure child schema instances have their references removed as well.
                //
                if (Metadata.isValidInstance(ref)) {
                    const metadata = ref.constructor[Symbol.metadata];
                    for (const index in metadata) {
                        const field = metadata[index].name;
                        const childRefId = typeof (ref[field]) === "object" && this.refIds.get(ref[field]);
                        if (childRefId && !this.deletedRefs.has(childRefId)) {
                            this.removeRef(childRefId);
                        }
                    }
                }
                else {
                    if (typeof (Object.values(ref[$childType])[0]) === "function") {
                        Array.from(ref.values())
                            .forEach((child) => {
                            const childRefId = this.refIds.get(child);
                            if (!this.deletedRefs.has(childRefId)) {
                                this.removeRef(childRefId);
                            }
                        });
                    }
                }
                this.refs.delete(refId); // remove ref
                delete this.refCounts[refId]; // remove ref count
                delete this.callbacks[refId]; // remove callbacks
            });
            // clear deleted refs.
            this.deletedRefs.clear();
        }
        addCallback(refId, fieldOrOperation, callback) {
            if (refId === undefined) {
                const name = (typeof (fieldOrOperation) === "number")
                    ? exports.OPERATION[fieldOrOperation]
                    : fieldOrOperation;
                throw new Error(`Can't addCallback on '${name}' (refId is undefined)`);
            }
            if (!this.callbacks[refId]) {
                this.callbacks[refId] = {};
            }
            if (!this.callbacks[refId][fieldOrOperation]) {
                this.callbacks[refId][fieldOrOperation] = [];
            }
            this.callbacks[refId][fieldOrOperation].push(callback);
            return () => this.removeCallback(refId, fieldOrOperation, callback);
        }
        removeCallback(refId, field, callback) {
            const index = this.callbacks?.[refId]?.[field]?.indexOf(callback);
            if (index !== -1) {
                spliceOne(this.callbacks[refId][field], index);
            }
        }
    }

    class Decoder {
        constructor(root, context) {
            this.currentRefId = 0;
            this.setState(root);
            this.context = context || new TypeContext(root.constructor);
            // console.log(">>>>>>>>>>>>>>>> Decoder types");
            // this.context.schemas.forEach((id, schema) => {
            //     console.log("type:", id, schema.name, Object.keys(schema[Symbol.metadata]));
            // });
        }
        setState(root) {
            this.state = root;
            this.root = new ReferenceTracker();
            this.root.addRef(0, root);
        }
        decode(bytes, it = { offset: 0 }, ref = this.state) {
            const allChanges = [];
            const $root = this.root;
            const totalBytes = bytes.byteLength;
            let decoder = ref['constructor'][$decoder];
            this.currentRefId = 0;
            while (it.offset < totalBytes) {
                //
                // Peek ahead, check if it's a switch to a different structure
                //
                if (bytes[it.offset] == SWITCH_TO_STRUCTURE) {
                    it.offset++;
                    this.currentRefId = decode.number(bytes, it);
                    const nextRef = $root.refs.get(this.currentRefId);
                    //
                    // Trying to access a reference that haven't been decoded yet.
                    //
                    if (!nextRef) {
                        throw new Error(`"refId" not found: ${this.currentRefId}`);
                    }
                    ref[$onDecodeEnd]?.();
                    ref = nextRef;
                    decoder = ref.constructor[$decoder];
                    continue;
                }
                const result = decoder(this, bytes, it, ref, allChanges);
                if (result === DEFINITION_MISMATCH) {
                    console.warn("@colyseus/schema: definition mismatch");
                    //
                    // keep skipping next bytes until reaches a known structure
                    // by local decoder.
                    //
                    const nextIterator = { offset: it.offset };
                    while (it.offset < totalBytes) {
                        if (bytes[it.offset] === SWITCH_TO_STRUCTURE) {
                            nextIterator.offset = it.offset + 1;
                            if ($root.refs.has(decode.number(bytes, nextIterator))) {
                                break;
                            }
                        }
                        it.offset++;
                    }
                    continue;
                }
            }
            // FIXME: DRY with SWITCH_TO_STRUCTURE block.
            ref[$onDecodeEnd]?.();
            // trigger changes
            this.triggerChanges?.(allChanges);
            // drop references of unused schemas
            $root.garbageCollectDeletedRefs();
            return allChanges;
        }
        getInstanceType(bytes, it, defaultType) {
            let type;
            if (bytes[it.offset] === TYPE_ID) {
                it.offset++;
                const type_id = decode.number(bytes, it);
                type = this.context.get(type_id);
            }
            return type || defaultType;
        }
        createInstanceOfType(type) {
            // let instance: Schema = new (type as any)();
            // // assign root on $changes
            // instance[$changes].root = this.root[$changes].root;
            // return instance;
            return new type();
        }
        removeChildRefs(ref, allChanges) {
            const needRemoveRef = typeof (ref[$childType]) !== "string";
            const refId = this.root.refIds.get(ref);
            ref.forEach((value, key) => {
                allChanges.push({
                    ref: ref,
                    refId,
                    op: exports.OPERATION.DELETE,
                    field: key,
                    value: undefined,
                    previousValue: value
                });
                if (needRemoveRef) {
                    this.root.removeRef(this.root.refIds.get(value));
                }
            });
        }
    }

    /**
     * Reflection
     */
    class ReflectionField extends Schema {
    }
    __decorate([
        type("string")
    ], ReflectionField.prototype, "name", void 0);
    __decorate([
        type("string")
    ], ReflectionField.prototype, "type", void 0);
    __decorate([
        type("number")
    ], ReflectionField.prototype, "referencedType", void 0);
    class ReflectionType extends Schema {
        constructor() {
            super(...arguments);
            this.fields = new ArraySchema();
        }
    }
    __decorate([
        type("number")
    ], ReflectionType.prototype, "id", void 0);
    __decorate([
        type("number")
    ], ReflectionType.prototype, "extendsId", void 0);
    __decorate([
        type([ReflectionField])
    ], ReflectionType.prototype, "fields", void 0);
    class Reflection extends Schema {
        constructor() {
            super(...arguments);
            this.types = new ArraySchema();
        }
        /**
         * Encodes the TypeContext of an Encoder into a buffer.
         *
         * @param encoder Encoder instance
         * @param it
         * @returns
         */
        static encode(encoder, it = { offset: 0 }) {
            const context = encoder.context;
            const reflection = new Reflection();
            const reflectionEncoder = new Encoder(reflection);
            // rootType is usually the first schema passed to the Encoder
            // (unless it inherits from another schema)
            const rootType = context.schemas.get(encoder.state.constructor);
            if (rootType > 0) {
                reflection.rootType = rootType;
            }
            const buildType = (currentType, metadata) => {
                for (const fieldIndex in metadata) {
                    const index = Number(fieldIndex);
                    const fieldName = metadata[index].name;
                    // skip fields from parent classes
                    if (!Object.prototype.hasOwnProperty.call(metadata, fieldName)) {
                        continue;
                    }
                    const field = new ReflectionField();
                    field.name = fieldName;
                    let fieldType;
                    const type = metadata[index].type;
                    if (typeof (type) === "string") {
                        fieldType = type;
                    }
                    else {
                        let childTypeSchema;
                        //
                        // TODO: refactor below.
                        //
                        if (Schema.is(type)) {
                            fieldType = "ref";
                            childTypeSchema = type;
                        }
                        else {
                            fieldType = Object.keys(type)[0];
                            if (typeof (type[fieldType]) === "string") {
                                fieldType += ":" + type[fieldType]; // array:string
                            }
                            else {
                                childTypeSchema = type[fieldType];
                            }
                        }
                        field.referencedType = (childTypeSchema)
                            ? context.getTypeId(childTypeSchema)
                            : -1;
                    }
                    field.type = fieldType;
                    currentType.fields.push(field);
                }
                reflection.types.push(currentType);
            };
            for (let typeid in context.types) {
                const klass = context.types[typeid];
                const type = new ReflectionType();
                type.id = Number(typeid);
                // support inheritance
                const inheritFrom = Object.getPrototypeOf(klass);
                if (inheritFrom !== Schema) {
                    type.extendsId = context.schemas.get(inheritFrom);
                }
                buildType(type, klass[Symbol.metadata]);
            }
            const buf = reflectionEncoder.encodeAll(it);
            return Buffer.from(buf, 0, it.offset);
        }
        /**
         * Decodes the TypeContext from a buffer into a Decoder instance.
         *
         * @param bytes Reflection.encode() output
         * @param it
         * @returns Decoder instance
         */
        static decode(bytes, it) {
            const reflection = new Reflection();
            const reflectionDecoder = new Decoder(reflection);
            reflectionDecoder.decode(bytes, it);
            const typeContext = new TypeContext();
            // 1st pass, initialize metadata + inheritance
            reflection.types.forEach((reflectionType) => {
                const parentClass = typeContext.get(reflectionType.extendsId) ?? Schema;
                const schema = class _ extends parentClass {
                };
                // register for inheritance support
                TypeContext.register(schema);
                // // for inheritance support
                // Metadata.initialize(schema);
                typeContext.add(schema, reflectionType.id);
            }, {});
            // define fields
            const addFields = (metadata, reflectionType, parentFieldIndex) => {
                reflectionType.fields.forEach((field, i) => {
                    const fieldIndex = parentFieldIndex + i;
                    if (field.referencedType !== undefined) {
                        let fieldType = field.type;
                        let refType = typeContext.get(field.referencedType);
                        // map or array of primitive type (-1)
                        if (!refType) {
                            const typeInfo = field.type.split(":");
                            fieldType = typeInfo[0];
                            refType = typeInfo[1]; // string
                        }
                        if (fieldType === "ref") {
                            Metadata.addField(metadata, fieldIndex, field.name, refType);
                        }
                        else {
                            Metadata.addField(metadata, fieldIndex, field.name, { [fieldType]: refType });
                        }
                    }
                    else {
                        Metadata.addField(metadata, fieldIndex, field.name, field.type);
                    }
                });
            };
            // 2nd pass, set fields
            reflection.types.forEach((reflectionType) => {
                const schema = typeContext.get(reflectionType.id);
                // for inheritance support
                const metadata = Metadata.initialize(schema);
                const inheritedTypes = [];
                let parentType = reflectionType;
                do {
                    inheritedTypes.push(parentType);
                    parentType = reflection.types.find((t) => t.id === parentType.extendsId);
                } while (parentType);
                let parentFieldIndex = 0;
                inheritedTypes.reverse().forEach((reflectionType) => {
                    // add fields from all inherited classes
                    // TODO: refactor this to avoid adding fields from parent classes
                    addFields(metadata, reflectionType, parentFieldIndex);
                    parentFieldIndex += reflectionType.fields.length;
                });
            });
            const state = new (typeContext.get(reflection.rootType || 0))();
            return new Decoder(state, typeContext);
        }
    }
    __decorate([
        type([ReflectionType])
    ], Reflection.prototype, "types", void 0);
    __decorate([
        type("number")
    ], Reflection.prototype, "rootType", void 0);

    function getDecoderStateCallbacks(decoder) {
        const $root = decoder.root;
        const callbacks = $root.callbacks;
        const onAddCalls = new WeakMap();
        let currentOnAddCallback;
        decoder.triggerChanges = function (allChanges) {
            const uniqueRefIds = new Set();
            for (let i = 0, l = allChanges.length; i < l; i++) {
                const change = allChanges[i];
                const refId = change.refId;
                const ref = change.ref;
                const $callbacks = callbacks[refId];
                if (!$callbacks) {
                    continue;
                }
                //
                // trigger onRemove on child structure.
                //
                if ((change.op & exports.OPERATION.DELETE) === exports.OPERATION.DELETE &&
                    change.previousValue instanceof Schema) {
                    const deleteCallbacks = callbacks[$root.refIds.get(change.previousValue)]?.[exports.OPERATION.DELETE];
                    for (let i = deleteCallbacks?.length - 1; i >= 0; i--) {
                        deleteCallbacks[i]();
                    }
                }
                if (ref instanceof Schema) {
                    //
                    // Handle schema instance
                    //
                    if (!uniqueRefIds.has(refId)) {
                        // trigger onChange
                        const replaceCallbacks = $callbacks?.[exports.OPERATION.REPLACE];
                        for (let i = replaceCallbacks?.length - 1; i >= 0; i--) {
                            replaceCallbacks[i]();
                            // try {
                            // } catch (e) {
                            //     console.error(e);
                            // }
                        }
                    }
                    if ($callbacks.hasOwnProperty(change.field)) {
                        const fieldCallbacks = $callbacks[change.field];
                        for (let i = fieldCallbacks?.length - 1; i >= 0; i--) {
                            fieldCallbacks[i](change.value, change.previousValue);
                            // try {
                            // } catch (e) {
                            //     console.error(e);
                            // }
                        }
                    }
                }
                else {
                    //
                    // Handle collection of items
                    //
                    if ((change.op & exports.OPERATION.DELETE) === exports.OPERATION.DELETE) {
                        //
                        // FIXME: `previousValue` should always be available.
                        //
                        if (change.previousValue !== undefined) {
                            // triger onRemove
                            const deleteCallbacks = $callbacks[exports.OPERATION.DELETE];
                            for (let i = deleteCallbacks?.length - 1; i >= 0; i--) {
                                deleteCallbacks[i](change.previousValue, change.dynamicIndex ?? change.field);
                            }
                        }
                        // Handle DELETE_AND_ADD operations
                        if ((change.op & exports.OPERATION.ADD) === exports.OPERATION.ADD) {
                            const addCallbacks = $callbacks[exports.OPERATION.ADD];
                            for (let i = addCallbacks?.length - 1; i >= 0; i--) {
                                addCallbacks[i](change.value, change.dynamicIndex ?? change.field);
                            }
                        }
                    }
                    else if ((change.op & exports.OPERATION.ADD) === exports.OPERATION.ADD && change.previousValue === undefined) {
                        // triger onAdd
                        const addCallbacks = $callbacks[exports.OPERATION.ADD];
                        for (let i = addCallbacks?.length - 1; i >= 0; i--) {
                            addCallbacks[i](change.value, change.dynamicIndex ?? change.field);
                        }
                    }
                    // trigger onChange
                    if (change.value !== change.previousValue &&
                        // FIXME: see "should not encode item if added and removed at the same patch" test case.
                        // some "ADD" + "DELETE" operations on same patch are being encoded as "DELETE"
                        (change.value !== undefined || change.previousValue !== undefined)) {
                        const replaceCallbacks = $callbacks[exports.OPERATION.REPLACE];
                        for (let i = replaceCallbacks?.length - 1; i >= 0; i--) {
                            replaceCallbacks[i](change.value, change.dynamicIndex ?? change.field);
                        }
                    }
                }
                uniqueRefIds.add(refId);
            }
        };
        function getProxy(metadataOrType, context) {
            let metadata = context.instance?.constructor[Symbol.metadata] || metadataOrType;
            let isCollection = ((context.instance && typeof (context.instance['forEach']) === "function") ||
                (metadataOrType && typeof (metadataOrType[Symbol.metadata]) === "undefined"));
            if (metadata && !isCollection) {
                const onAddListen = function (ref, prop, callback, immediate) {
                    // immediate trigger
                    if (immediate &&
                        context.instance[prop] !== undefined &&
                        !onAddCalls.has(currentOnAddCallback) // Workaround for https://github.com/colyseus/schema/issues/147
                    ) {
                        callback(context.instance[prop], undefined);
                    }
                    return $root.addCallback($root.refIds.get(ref), prop, callback);
                };
                /**
                 * Schema instances
                 */
                return new Proxy({
                    listen: function listen(prop, callback, immediate = true) {
                        if (context.instance) {
                            return onAddListen(context.instance, prop, callback, immediate);
                        }
                        else {
                            // collection instance not received yet
                            let detachCallback = () => { };
                            context.onInstanceAvailable((ref, existing) => {
                                detachCallback = onAddListen(ref, prop, callback, immediate && existing && !onAddCalls.has(currentOnAddCallback));
                            });
                            return () => detachCallback();
                        }
                    },
                    onChange: function onChange(callback) {
                        return $root.addCallback($root.refIds.get(context.instance), exports.OPERATION.REPLACE, callback);
                    },
                    //
                    // TODO: refactor `bindTo()` implementation.
                    // There is room for improvement.
                    //
                    bindTo: function bindTo(targetObject, properties) {
                        if (!properties) {
                            properties = Object.keys(metadata).map((index) => metadata[index].name);
                        }
                        return $root.addCallback($root.refIds.get(context.instance), exports.OPERATION.REPLACE, () => {
                            properties.forEach((prop) => targetObject[prop] = context.instance[prop]);
                        });
                    }
                }, {
                    get(target, prop) {
                        const metadataField = metadata[metadata[prop]];
                        if (metadataField) {
                            const instance = context.instance?.[prop];
                            const onInstanceAvailable = ((callback) => {
                                const unbind = $(context.instance).listen(prop, (value, _) => {
                                    callback(value, false);
                                    // FIXME: by "unbinding" the callback here,
                                    // it will not support when the server
                                    // re-instantiates the instance.
                                    //
                                    unbind?.();
                                }, false);
                                // has existing value
                                if ($root.refIds.get(instance) !== undefined) {
                                    callback(instance, true);
                                }
                            });
                            return getProxy(metadataField.type, {
                                // make sure refId is available, otherwise need to wait for the instance to be available.
                                instance: ($root.refIds.get(instance) && instance),
                                parentInstance: context.instance,
                                onInstanceAvailable,
                            });
                        }
                        else {
                            // accessing the function
                            return target[prop];
                        }
                    },
                    has(target, prop) { return metadata[prop] !== undefined; },
                    set(_, _1, _2) { throw new Error("not allowed"); },
                    deleteProperty(_, _1) { throw new Error("not allowed"); },
                });
            }
            else {
                /**
                 * Collection instances
                 */
                const onAdd = function (ref, callback, immediate) {
                    // Trigger callback on existing items
                    if (immediate) {
                        ref.forEach((v, k) => callback(v, k));
                    }
                    return $root.addCallback($root.refIds.get(ref), exports.OPERATION.ADD, (value, key) => {
                        onAddCalls.set(callback, true);
                        currentOnAddCallback = callback;
                        callback(value, key);
                        onAddCalls.delete(callback);
                        currentOnAddCallback = undefined;
                    });
                };
                const onRemove = function (ref, callback) {
                    return $root.addCallback($root.refIds.get(ref), exports.OPERATION.DELETE, callback);
                };
                const onChange = function (ref, callback) {
                    return $root.addCallback($root.refIds.get(ref), exports.OPERATION.REPLACE, callback);
                };
                return new Proxy({
                    onAdd: function (callback, immediate = true) {
                        //
                        // https://github.com/colyseus/schema/issues/147
                        // If parent instance has "onAdd" registered, avoid triggering immediate callback.
                        //
                        if (context.instance) {
                            return onAdd(context.instance, callback, immediate && !onAddCalls.has(currentOnAddCallback));
                        }
                        else if (context.onInstanceAvailable) {
                            // collection instance not received yet
                            let detachCallback = () => { };
                            context.onInstanceAvailable((ref, existing) => {
                                detachCallback = onAdd(ref, callback, immediate && existing && !onAddCalls.has(currentOnAddCallback));
                            });
                            return () => detachCallback();
                        }
                    },
                    onRemove: function (callback) {
                        if (context.instance) {
                            return onRemove(context.instance, callback);
                        }
                        else if (context.onInstanceAvailable) {
                            // collection instance not received yet
                            let detachCallback = () => { };
                            context.onInstanceAvailable((ref) => {
                                detachCallback = onRemove(ref, callback);
                            });
                            return () => detachCallback();
                        }
                    },
                    onChange: function (callback) {
                        if (context.instance) {
                            return onChange(context.instance, callback);
                        }
                        else if (context.onInstanceAvailable) {
                            // collection instance not received yet
                            let detachCallback = () => { };
                            context.onInstanceAvailable((ref) => {
                                detachCallback = onChange(ref, callback);
                            });
                            return () => detachCallback();
                        }
                    },
                }, {
                    get(target, prop) {
                        if (!target[prop]) {
                            throw new Error(`Can't access '${prop}' through callback proxy. access the instance directly.`);
                        }
                        return target[prop];
                    },
                    has(target, prop) { return target[prop] !== undefined; },
                    set(_, _1, _2) { throw new Error("not allowed"); },
                    deleteProperty(_, _1) { throw new Error("not allowed"); },
                });
            }
        }
        function $(instance) {
            return getProxy(undefined, { instance });
        }
        return $;
    }

    function getRawChangesCallback(decoder, callback) {
        decoder.triggerChanges = callback;
    }

    class StateView {
        constructor() {
            /**
             * List of ChangeTree's that are visible to this view
             */
            this.items = new WeakSet();
            /**
             * List of ChangeTree's that are invisible to this view
             */
            this.invisible = new WeakSet();
            /**
             * Manual "ADD" operations for changes per ChangeTree, specific to this view.
             * (This is used to force encoding a property, even if it was not changed)
             */
            this.changes = new Map();
        }
        // TODO: allow to set multiple tags at once
        add(obj, tag = DEFAULT_VIEW_TAG, checkIncludeParent = true) {
            if (!obj[$changes]) {
                console.warn("StateView#add(), invalid object:", obj);
                return this;
            }
            // FIXME: ArraySchema/MapSchema do not have metadata
            const metadata = obj.constructor[Symbol.metadata];
            const changeTree = obj[$changes];
            this.items.add(changeTree);
            // add parent ChangeTree's
            // - if it was invisible to this view
            // - if it were previously filtered out
            if (checkIncludeParent && changeTree.parent) {
                this.addParentOf(changeTree, tag);
            }
            //
            // TODO: when adding an item of a MapSchema, the changes may not
            // be set (only the parent's changes are set)
            //
            let changes = this.changes.get(changeTree.refId);
            if (changes === undefined) {
                changes = {};
                this.changes.set(changeTree.refId, changes);
            }
            // set tag
            if (tag !== DEFAULT_VIEW_TAG) {
                if (!this.tags) {
                    this.tags = new WeakMap();
                }
                let tags;
                if (!this.tags.has(changeTree)) {
                    tags = new Set();
                    this.tags.set(changeTree, tags);
                }
                else {
                    tags = this.tags.get(changeTree);
                }
                tags.add(tag);
                // Ref: add tagged properties
                metadata?.[$fieldIndexesByViewTag]?.[tag]?.forEach((index) => {
                    if (changeTree.getChange(index) !== exports.OPERATION.DELETE) {
                        changes[index] = exports.OPERATION.ADD;
                    }
                });
            }
            else {
                const isInvisible = this.invisible.has(changeTree);
                const changeSet = (changeTree.filteredChanges !== undefined)
                    ? changeTree.allFilteredChanges
                    : changeTree.allChanges;
                for (let i = 0, len = changeSet.operations.length; i < len; i++) {
                    const index = changeSet.operations[i];
                    if (index === undefined) {
                        continue;
                    } // skip "undefined" indexes
                    const op = changeTree.indexedOperations[index] ?? exports.OPERATION.ADD;
                    const tagAtIndex = metadata?.[index].tag;
                    if ((isInvisible || // if "invisible", include all
                        tagAtIndex === undefined || // "all change" with no tag
                        tagAtIndex === tag // tagged property
                    ) &&
                        op !== exports.OPERATION.DELETE) {
                        changes[index] = op;
                    }
                }
            }
            // Add children of this ChangeTree to this view
            changeTree.forEachChild((change, index) => {
                // Do not ADD children that don't have the same tag
                if (metadata &&
                    metadata[index].tag !== undefined &&
                    metadata[index].tag !== tag) {
                    return;
                }
                this.add(change.ref, tag, false);
            });
            return this;
        }
        addParentOf(childChangeTree, tag) {
            const changeTree = childChangeTree.parent[$changes];
            const parentIndex = childChangeTree.parentIndex;
            if (!this.items.has(changeTree)) {
                // view must have all "changeTree" parent tree
                this.items.add(changeTree);
                // add parent's parent
                const parentChangeTree = changeTree.parent?.[$changes];
                if (parentChangeTree && (parentChangeTree.filteredChanges !== undefined)) {
                    this.addParentOf(changeTree, tag);
                }
                // parent is already available, no need to add it!
                if (!this.invisible.has(changeTree)) {
                    return;
                }
            }
            // add parent's tag properties
            if (changeTree.getChange(parentIndex) !== exports.OPERATION.DELETE) {
                let changes = this.changes.get(changeTree.refId);
                if (changes === undefined) {
                    changes = {};
                    this.changes.set(changeTree.refId, changes);
                }
                if (!this.tags) {
                    this.tags = new WeakMap();
                }
                let tags;
                if (!this.tags.has(changeTree)) {
                    tags = new Set();
                    this.tags.set(changeTree, tags);
                }
                else {
                    tags = this.tags.get(changeTree);
                }
                tags.add(tag);
                changes[parentIndex] = exports.OPERATION.ADD;
            }
        }
        remove(obj, tag = DEFAULT_VIEW_TAG) {
            const changeTree = obj[$changes];
            if (!changeTree) {
                console.warn("StateView#remove(), invalid object:", obj);
                return this;
            }
            this.items.delete(changeTree);
            const ref = changeTree.ref;
            const metadata = ref.constructor[Symbol.metadata];
            let changes = this.changes.get(changeTree.refId);
            if (changes === undefined) {
                changes = {};
                this.changes.set(changeTree.refId, changes);
            }
            if (tag === DEFAULT_VIEW_TAG) {
                // parent is collection (Map/Array)
                const parent = changeTree.parent;
                if (!Metadata.isValidInstance(parent)) {
                    const parentChangeTree = parent[$changes];
                    let changes = this.changes.get(parentChangeTree.refId);
                    if (changes === undefined) {
                        changes = {};
                        this.changes.set(parentChangeTree.refId, changes);
                    }
                    // DELETE / DELETE BY REF ID
                    changes[changeTree.parentIndex] = exports.OPERATION.DELETE;
                }
                else {
                    // delete all "tagged" properties.
                    metadata[$viewFieldIndexes].forEach((index) => changes[index] = exports.OPERATION.DELETE);
                }
            }
            else {
                // delete only tagged properties
                metadata[$fieldIndexesByViewTag][tag].forEach((index) => changes[index] = exports.OPERATION.DELETE);
            }
            // remove tag
            if (this.tags && this.tags.has(changeTree)) {
                const tags = this.tags.get(changeTree);
                if (tag === undefined) {
                    // delete all tags
                    this.tags.delete(changeTree);
                }
                else {
                    // delete specific tag
                    tags.delete(tag);
                    // if tag set is empty, delete it entirely
                    if (tags.size === 0) {
                        this.tags.delete(changeTree);
                    }
                }
            }
            return this;
        }
        has(obj) {
            return this.items.has(obj[$changes]);
        }
        hasTag(ob, tag = DEFAULT_VIEW_TAG) {
            const tags = this.tags?.get(ob[$changes]);
            return tags?.has(tag) ?? false;
        }
    }

    registerType("map", { constructor: MapSchema });
    registerType("array", { constructor: ArraySchema });
    registerType("set", { constructor: SetSchema });
    registerType("collection", { constructor: CollectionSchema, });

    exports.$changes = $changes;
    exports.$childType = $childType;
    exports.$decoder = $decoder;
    exports.$deleteByIndex = $deleteByIndex;
    exports.$encoder = $encoder;
    exports.$filter = $filter;
    exports.$getByIndex = $getByIndex;
    exports.$track = $track;
    exports.ArraySchema = ArraySchema;
    exports.ChangeTree = ChangeTree;
    exports.CollectionSchema = CollectionSchema;
    exports.Decoder = Decoder;
    exports.Encoder = Encoder;
    exports.MapSchema = MapSchema;
    exports.Metadata = Metadata;
    exports.Reflection = Reflection;
    exports.ReflectionField = ReflectionField;
    exports.ReflectionType = ReflectionType;
    exports.Schema = Schema;
    exports.SetSchema = SetSchema;
    exports.StateView = StateView;
    exports.TypeContext = TypeContext;
    exports.decode = decode;
    exports.decodeKeyValueOperation = decodeKeyValueOperation;
    exports.decodeSchemaOperation = decodeSchemaOperation;
    exports.defineCustomTypes = defineCustomTypes;
    exports.defineTypes = defineTypes;
    exports.deprecated = deprecated;
    exports.dumpChanges = dumpChanges;
    exports.encode = encode;
    exports.encodeArray = encodeArray;
    exports.encodeKeyValueOperation = encodeKeyValueOperation;
    exports.encodeSchemaOperation = encodeSchemaOperation;
    exports.entity = entity;
    exports.getDecoderStateCallbacks = getDecoderStateCallbacks;
    exports.getRawChangesCallback = getRawChangesCallback;
    exports.registerType = registerType;
    exports.schema = schema;
    exports.type = type;
    exports.view = view;

}));


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/3rd_party/discord.js":
/*!*****************************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/3rd_party/discord.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

/**
 * Discord Embedded App SDK
 * https://github.com/colyseus/colyseus/issues/707
 *
 * All URLs must go through the local proxy from
 * https://<app_id>.discordsays.com/.proxy/<mapped_url>/...
 *
 * URL Mapping Examples:
 *
 * 1. Using Colyseus Cloud:
 *   - /colyseus/{subdomain} -> {subdomain}.colyseus.cloud
 *
 *   Example:
 *     const client = new Client("https://xxxx.colyseus.cloud");
 *
 * -------------------------------------------------------------
 *
 * 2. Using `cloudflared` tunnel:
 *   - /colyseus/ -> <your-cloudflared-url>.trycloudflare.com
 *
 *   Example:
 *     const client = new Client("https://<your-cloudflared-url>.trycloudflare.com");
 *
 * -------------------------------------------------------------
 *
 * 3. Providing a manual /.proxy/your-mapping:
 *   - /your-mapping/ -> your-endpoint.com
 *
 *   Example:
 *     const client = new Client("/.proxy/your-mapping");
 *
 */
function discordURLBuilder(url) {
    var _a;
    var localHostname = ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hostname) || "localhost";
    var remoteHostnameSplitted = url.hostname.split('.');
    var subdomain = (!url.hostname.includes("trycloudflare.com") && // ignore cloudflared subdomains
        !url.hostname.includes("discordsays.com") && // ignore discordsays.com subdomains
        remoteHostnameSplitted.length > 2)
        ? "/".concat(remoteHostnameSplitted[0])
        : '';
    return (url.pathname.startsWith("/.proxy"))
        ? "".concat(url.protocol, "//").concat(localHostname).concat(subdomain).concat(url.pathname).concat(url.search)
        : "".concat(url.protocol, "//").concat(localHostname, "/.proxy/colyseus").concat(subdomain).concat(url.pathname).concat(url.search);
}

exports.discordURLBuilder = discordURLBuilder;
//# sourceMappingURL=discord.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/Auth.js":
/*!****************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/Auth.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var tslib = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
var Storage = __webpack_require__(/*! ./Storage.js */ "./node_modules/colyseus.js/build/cjs/Storage.js");
var nanoevents = __webpack_require__(/*! ./core/nanoevents.js */ "./node_modules/colyseus.js/build/cjs/core/nanoevents.js");

var _Auth__initialized, _Auth__initializationPromise, _Auth__signInWindow, _Auth__events;
var Auth = /** @class */ (function () {
    function Auth(http) {
        var _this = this;
        this.http = http;
        this.settings = {
            path: "/auth",
            key: "colyseus-auth-token",
        };
        _Auth__initialized.set(this, false);
        _Auth__initializationPromise.set(this, void 0);
        _Auth__signInWindow.set(this, undefined);
        _Auth__events.set(this, nanoevents.createNanoEvents());
        Storage.getItem(this.settings.key, function (token) { return _this.token = token; });
    }
    Object.defineProperty(Auth.prototype, "token", {
        get: function () {
            return this.http.authToken;
        },
        set: function (token) {
            this.http.authToken = token;
        },
        enumerable: false,
        configurable: true
    });
    Auth.prototype.onChange = function (callback) {
        var _this = this;
        var unbindChange = tslib.__classPrivateFieldGet(this, _Auth__events, "f").on("change", callback);
        if (!tslib.__classPrivateFieldGet(this, _Auth__initialized, "f")) {
            tslib.__classPrivateFieldSet(this, _Auth__initializationPromise, new Promise(function (resolve, reject) {
                _this.getUserData().then(function (userData) {
                    _this.emitChange(tslib.__assign(tslib.__assign({}, userData), { token: _this.token }));
                }).catch(function (e) {
                    // user is not logged in, or service is down
                    _this.emitChange({ user: null, token: undefined });
                }).finally(function () {
                    resolve();
                });
            }), "f");
        }
        tslib.__classPrivateFieldSet(this, _Auth__initialized, true, "f");
        return unbindChange;
    };
    Auth.prototype.getUserData = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.token) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.http.get("".concat(this.settings.path, "/userdata"))];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                    case 2: throw new Error("missing auth.token");
                }
            });
        });
    };
    Auth.prototype.registerWithEmailAndPassword = function (email, password, options) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var data;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.post("".concat(this.settings.path, "/register"), {
                            body: { email: email, password: password, options: options, },
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        this.emitChange(data);
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Auth.prototype.signInWithEmailAndPassword = function (email, password) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var data;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.post("".concat(this.settings.path, "/login"), {
                            body: { email: email, password: password, },
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        this.emitChange(data);
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Auth.prototype.signInAnonymously = function (options) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var data;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.post("".concat(this.settings.path, "/anonymous"), {
                            body: { options: options, }
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        this.emitChange(data);
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Auth.prototype.sendPasswordResetEmail = function (email) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.post("".concat(this.settings.path, "/forgot-password"), {
                            body: { email: email, }
                        })];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    Auth.prototype.signInWithProvider = function (providerName_1) {
        return tslib.__awaiter(this, arguments, void 0, function (providerName, settings) {
            var _this = this;
            if (settings === void 0) { settings = {}; }
            return tslib.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var w = settings.width || 480;
                        var h = settings.height || 768;
                        // forward existing token for upgrading
                        var upgradingToken = _this.token ? "?token=".concat(_this.token) : "";
                        // Capitalize first letter of providerName
                        var title = "Login with ".concat((providerName[0].toUpperCase() + providerName.substring(1)));
                        var url = _this.http['client']['getHttpEndpoint']("".concat((settings.prefix || "".concat(_this.settings.path, "/provider")), "/").concat(providerName).concat(upgradingToken));
                        var left = (screen.width / 2) - (w / 2);
                        var top = (screen.height / 2) - (h / 2);
                        tslib.__classPrivateFieldSet(_this, _Auth__signInWindow, window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left), "f");
                        var onMessage = function (event) {
                            // TODO: it is a good idea to check if event.origin can be trusted!
                            // if (event.origin.indexOf(window.location.hostname) === -1) { return; }
                            // require 'user' and 'token' inside received data.
                            if (event.data.user === undefined && event.data.token === undefined) {
                                return;
                            }
                            clearInterval(rejectionChecker);
                            tslib.__classPrivateFieldGet(_this, _Auth__signInWindow, "f").close();
                            tslib.__classPrivateFieldSet(_this, _Auth__signInWindow, undefined, "f");
                            window.removeEventListener("message", onMessage);
                            if (event.data.error !== undefined) {
                                reject(event.data.error);
                            }
                            else {
                                resolve(event.data);
                                _this.emitChange(event.data);
                            }
                        };
                        var rejectionChecker = setInterval(function () {
                            if (!tslib.__classPrivateFieldGet(_this, _Auth__signInWindow, "f") || tslib.__classPrivateFieldGet(_this, _Auth__signInWindow, "f").closed) {
                                tslib.__classPrivateFieldSet(_this, _Auth__signInWindow, undefined, "f");
                                reject("cancelled");
                                window.removeEventListener("message", onMessage);
                            }
                        }, 200);
                        window.addEventListener("message", onMessage);
                    })];
            });
        });
    };
    Auth.prototype.signOut = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                this.emitChange({ user: null, token: null });
                return [2 /*return*/];
            });
        });
    };
    Auth.prototype.emitChange = function (authData) {
        if (authData.token !== undefined) {
            this.token = authData.token;
            if (authData.token === null) {
                Storage.removeItem(this.settings.key);
            }
            else {
                // store key in localStorage
                Storage.setItem(this.settings.key, authData.token);
            }
        }
        tslib.__classPrivateFieldGet(this, _Auth__events, "f").emit("change", authData);
    };
    return Auth;
}());
_Auth__initialized = new WeakMap(), _Auth__initializationPromise = new WeakMap(), _Auth__signInWindow = new WeakMap(), _Auth__events = new WeakMap();

exports.Auth = Auth;
//# sourceMappingURL=Auth.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/Client.js":
/*!******************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/Client.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var tslib = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
var ServerError = __webpack_require__(/*! ./errors/ServerError.js */ "./node_modules/colyseus.js/build/cjs/errors/ServerError.js");
var Room = __webpack_require__(/*! ./Room.js */ "./node_modules/colyseus.js/build/cjs/Room.js");
var HTTP = __webpack_require__(/*! ./HTTP.js */ "./node_modules/colyseus.js/build/cjs/HTTP.js");
var Auth = __webpack_require__(/*! ./Auth.js */ "./node_modules/colyseus.js/build/cjs/Auth.js");
var discord = __webpack_require__(/*! ./3rd_party/discord.js */ "./node_modules/colyseus.js/build/cjs/3rd_party/discord.js");

var _a;
var MatchMakeError = /** @class */ (function (_super) {
    tslib.__extends(MatchMakeError, _super);
    function MatchMakeError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        Object.setPrototypeOf(_this, MatchMakeError.prototype);
        return _this;
    }
    return MatchMakeError;
}(Error));
// - React Native does not provide `window.location`
// - Cocos Creator (Native) does not provide `window.location.hostname`
var DEFAULT_ENDPOINT = (typeof (window) !== "undefined" && typeof ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hostname) !== "undefined")
    ? "".concat(window.location.protocol.replace("http", "ws"), "//").concat(window.location.hostname).concat((window.location.port && ":".concat(window.location.port)))
    : "ws://127.0.0.1:2567";
var Client = /** @class */ (function () {
    function Client(settings, customURLBuilder) {
        if (settings === void 0) { settings = DEFAULT_ENDPOINT; }
        var _a, _b;
        if (typeof (settings) === "string") {
            //
            // endpoint by url
            //
            var url = (settings.startsWith("/"))
                ? new URL(settings, DEFAULT_ENDPOINT)
                : new URL(settings);
            var secure = (url.protocol === "https:" || url.protocol === "wss:");
            var port = Number(url.port || (secure ? 443 : 80));
            this.settings = {
                hostname: url.hostname,
                pathname: url.pathname,
                port: port,
                secure: secure
            };
        }
        else {
            //
            // endpoint by settings
            //
            if (settings.port === undefined) {
                settings.port = (settings.secure) ? 443 : 80;
            }
            if (settings.pathname === undefined) {
                settings.pathname = "";
            }
            this.settings = settings;
        }
        // make sure pathname does not end with "/"
        if (this.settings.pathname.endsWith("/")) {
            this.settings.pathname = this.settings.pathname.slice(0, -1);
        }
        this.http = new HTTP.HTTP(this);
        this.auth = new Auth.Auth(this.http);
        this.urlBuilder = customURLBuilder;
        //
        // Discord Embedded SDK requires a custom URL builder
        //
        if (!this.urlBuilder &&
            typeof (window) !== "undefined" &&
            ((_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hostname) === null || _b === void 0 ? void 0 : _b.includes("discordsays.com"))) {
            this.urlBuilder = discord.discordURLBuilder;
            console.log("Colyseus SDK: Discord Embedded SDK detected. Using custom URL builder.");
        }
    }
    Client.prototype.joinOrCreate = function (roomName_1) {
        return tslib.__awaiter(this, arguments, void 0, function (roomName, options, rootSchema) {
            if (options === void 0) { options = {}; }
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest('joinOrCreate', roomName, options, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.create = function (roomName_1) {
        return tslib.__awaiter(this, arguments, void 0, function (roomName, options, rootSchema) {
            if (options === void 0) { options = {}; }
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest('create', roomName, options, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.join = function (roomName_1) {
        return tslib.__awaiter(this, arguments, void 0, function (roomName, options, rootSchema) {
            if (options === void 0) { options = {}; }
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest('join', roomName, options, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.joinById = function (roomId_1) {
        return tslib.__awaiter(this, arguments, void 0, function (roomId, options, rootSchema) {
            if (options === void 0) { options = {}; }
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest('joinById', roomId, options, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Re-establish connection with a room this client was previously connected to.
     *
     * @param reconnectionToken The `room.reconnectionToken` from previously connected room.
     * @param rootSchema (optional) Concrete root schema definition
     * @returns Promise<Room>
     */
    Client.prototype.reconnect = function (reconnectionToken, rootSchema) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, roomId, token;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (typeof (reconnectionToken) === "string" && typeof (rootSchema) === "string") {
                            throw new Error("DEPRECATED: .reconnect() now only accepts 'reconnectionToken' as argument.\nYou can get this token from previously connected `room.reconnectionToken`");
                        }
                        _a = reconnectionToken.split(":"), roomId = _a[0], token = _a[1];
                        if (!roomId || !token) {
                            throw new Error("Invalid reconnection token format.\nThe format should be roomId:reconnectionToken");
                        }
                        return [4 /*yield*/, this.createMatchMakeRequest('reconnect', roomId, { reconnectionToken: token }, rootSchema)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Client.prototype.consumeSeatReservation = function (response, rootSchema, reuseRoomInstance // used in devMode
    ) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var room, options, targetRoom;
            var _this = this;
            return tslib.__generator(this, function (_a) {
                room = this.createRoom(response.room.name, rootSchema);
                room.roomId = response.room.roomId;
                room.sessionId = response.sessionId;
                options = { sessionId: room.sessionId };
                // forward "reconnection token" in case of reconnection.
                if (response.reconnectionToken) {
                    options.reconnectionToken = response.reconnectionToken;
                }
                targetRoom = reuseRoomInstance || room;
                room.connect(this.buildEndpoint(response.room, options, response.protocol), response.devMode && (function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                    var retryCount, retryMaxRetries, retryReconnection;
                    var _this = this;
                    return tslib.__generator(this, function (_a) {
                        console.info("[Colyseus devMode]: ".concat(String.fromCodePoint(0x1F504), " Re-establishing connection with room id '").concat(room.roomId, "'...")); // 🔄
                        retryCount = 0;
                        retryMaxRetries = 8;
                        retryReconnection = function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        retryCount++;
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, this.consumeSeatReservation(response, rootSchema, targetRoom)];
                                    case 2:
                                        _a.sent();
                                        console.info("[Colyseus devMode]: ".concat(String.fromCodePoint(0x2705), " Successfully re-established connection with room '").concat(room.roomId, "'")); // ✅
                                        return [3 /*break*/, 4];
                                    case 3:
                                        _a.sent();
                                        if (retryCount < retryMaxRetries) {
                                            console.info("[Colyseus devMode]: ".concat(String.fromCodePoint(0x1F504), " retrying... (").concat(retryCount, " out of ").concat(retryMaxRetries, ")")); // 🔄
                                            setTimeout(retryReconnection, 2000);
                                        }
                                        else {
                                            console.info("[Colyseus devMode]: ".concat(String.fromCodePoint(0x274C), " Failed to reconnect. Is your server running? Please check server logs.")); // ❌
                                        }
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); };
                        setTimeout(retryReconnection, 2000);
                        return [2 /*return*/];
                    });
                }); }), targetRoom, response);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var onError = function (code, message) { return reject(new ServerError.ServerError(code, message)); };
                        targetRoom.onError.once(onError);
                        targetRoom['onJoin'].once(function () {
                            targetRoom.onError.remove(onError);
                            resolve(targetRoom);
                        });
                    })];
            });
        });
    };
    Client.prototype.createMatchMakeRequest = function (method_1, roomName_1) {
        return tslib.__awaiter(this, arguments, void 0, function (method, roomName, options, rootSchema, reuseRoomInstance) {
            var response;
            if (options === void 0) { options = {}; }
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.post("matchmake/".concat(method, "/").concat(roomName), {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(options)
                        })];
                    case 1:
                        response = (_a.sent()).data;
                        // FIXME: HTTP class is already handling this as ServerError.
                        // @ts-ignore
                        if (response.error) {
                            throw new MatchMakeError(response.error, response.code);
                        }
                        // forward reconnection token during "reconnect" methods.
                        if (method === "reconnect") {
                            response.reconnectionToken = options.reconnectionToken;
                        }
                        return [4 /*yield*/, this.consumeSeatReservation(response, rootSchema, reuseRoomInstance)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.createRoom = function (roomName, rootSchema) {
        return new Room.Room(roomName, rootSchema);
    };
    Client.prototype.buildEndpoint = function (room, options, protocol) {
        if (options === void 0) { options = {}; }
        if (protocol === void 0) { protocol = "ws"; }
        var params = [];
        // append provided options
        for (var name_1 in options) {
            if (!options.hasOwnProperty(name_1)) {
                continue;
            }
            params.push("".concat(name_1, "=").concat(options[name_1]));
        }
        if (protocol === "h3") {
            protocol = "http";
        }
        var endpoint = (this.settings.secure)
            ? "".concat(protocol, "s://")
            : "".concat(protocol, "://");
        if (room.publicAddress) {
            endpoint += "".concat(room.publicAddress);
        }
        else {
            endpoint += "".concat(this.settings.hostname).concat(this.getEndpointPort()).concat(this.settings.pathname);
        }
        var endpointURL = "".concat(endpoint, "/").concat(room.processId, "/").concat(room.roomId, "?").concat(params.join('&'));
        return (this.urlBuilder)
            ? this.urlBuilder(new URL(endpointURL))
            : endpointURL;
    };
    Client.prototype.getHttpEndpoint = function (segments) {
        if (segments === void 0) { segments = ''; }
        var path = segments.startsWith("/") ? segments : "/".concat(segments);
        var endpointURL = "".concat((this.settings.secure) ? "https" : "http", "://").concat(this.settings.hostname).concat(this.getEndpointPort()).concat(this.settings.pathname).concat(path);
        return (this.urlBuilder)
            ? this.urlBuilder(new URL(endpointURL))
            : endpointURL;
    };
    Client.prototype.getEndpointPort = function () {
        return (this.settings.port !== 80 && this.settings.port !== 443)
            ? ":".concat(this.settings.port)
            : "";
    };
    Client.VERSION = "0.16.10";
    return Client;
}());

exports.Client = Client;
exports.MatchMakeError = MatchMakeError;
//# sourceMappingURL=Client.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/Connection.js":
/*!**********************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/Connection.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var H3Transport = __webpack_require__(/*! ./transport/H3Transport.js */ "./node_modules/colyseus.js/build/cjs/transport/H3Transport.js");
var WebSocketTransport = __webpack_require__(/*! ./transport/WebSocketTransport.js */ "./node_modules/colyseus.js/build/cjs/transport/WebSocketTransport.js");

var Connection = /** @class */ (function () {
    function Connection(protocol) {
        this.events = {};
        switch (protocol) {
            case "h3":
                this.transport = new H3Transport.H3TransportTransport(this.events);
                break;
            default:
                this.transport = new WebSocketTransport.WebSocketTransport(this.events);
                break;
        }
    }
    Connection.prototype.connect = function (url, options) {
        this.transport.connect.call(this.transport, url, options);
    };
    Connection.prototype.send = function (data) {
        this.transport.send(data);
    };
    Connection.prototype.sendUnreliable = function (data) {
        this.transport.sendUnreliable(data);
    };
    Connection.prototype.close = function (code, reason) {
        this.transport.close(code, reason);
    };
    Object.defineProperty(Connection.prototype, "isOpen", {
        get: function () {
            return this.transport.isOpen;
        },
        enumerable: false,
        configurable: true
    });
    return Connection;
}());

exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/HTTP.js":
/*!****************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/HTTP.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var ServerError = __webpack_require__(/*! ./errors/ServerError.js */ "./node_modules/colyseus.js/build/cjs/errors/ServerError.js");
var httpie = __webpack_require__(/*! httpie */ "./node_modules/httpie/xhr/index.mjs");

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var httpie__namespace = /*#__PURE__*/_interopNamespace(httpie);

var HTTP = /** @class */ (function () {
    function HTTP(client) {
        this.client = client;
    }
    HTTP.prototype.get = function (path, options) {
        if (options === void 0) { options = {}; }
        return this.request("get", path, options);
    };
    HTTP.prototype.post = function (path, options) {
        if (options === void 0) { options = {}; }
        return this.request("post", path, options);
    };
    HTTP.prototype.del = function (path, options) {
        if (options === void 0) { options = {}; }
        return this.request("del", path, options);
    };
    HTTP.prototype.put = function (path, options) {
        if (options === void 0) { options = {}; }
        return this.request("put", path, options);
    };
    HTTP.prototype.request = function (method, path, options) {
        if (options === void 0) { options = {}; }
        return httpie__namespace[method](this.client['getHttpEndpoint'](path), this.getOptions(options)).catch(function (e) {
            var _a;
            var status = e.statusCode; //  || -1
            var message = ((_a = e.data) === null || _a === void 0 ? void 0 : _a.error) || e.statusMessage || e.message; //  || "offline"
            if (!status && !message) {
                throw e;
            }
            throw new ServerError.ServerError(status, message);
        });
    };
    HTTP.prototype.getOptions = function (options) {
        if (this.authToken) {
            if (!options.headers) {
                options.headers = {};
            }
            options.headers['Authorization'] = "Bearer ".concat(this.authToken);
        }
        if (typeof (cc) !== 'undefined' && cc.sys && cc.sys.isNative) ;
        else {
            // always include credentials
            options.withCredentials = true;
        }
        return options;
    };
    return HTTP;
}());

exports.HTTP = HTTP;
//# sourceMappingURL=HTTP.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/Protocol.js":
/*!********************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/Protocol.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

// Use codes between 0~127 for lesser throughput (1 byte)
exports.Protocol = void 0;
(function (Protocol) {
    // Room-related (10~19)
    Protocol[Protocol["HANDSHAKE"] = 9] = "HANDSHAKE";
    Protocol[Protocol["JOIN_ROOM"] = 10] = "JOIN_ROOM";
    Protocol[Protocol["ERROR"] = 11] = "ERROR";
    Protocol[Protocol["LEAVE_ROOM"] = 12] = "LEAVE_ROOM";
    Protocol[Protocol["ROOM_DATA"] = 13] = "ROOM_DATA";
    Protocol[Protocol["ROOM_STATE"] = 14] = "ROOM_STATE";
    Protocol[Protocol["ROOM_STATE_PATCH"] = 15] = "ROOM_STATE_PATCH";
    Protocol[Protocol["ROOM_DATA_SCHEMA"] = 16] = "ROOM_DATA_SCHEMA";
    Protocol[Protocol["ROOM_DATA_BYTES"] = 17] = "ROOM_DATA_BYTES";
})(exports.Protocol || (exports.Protocol = {}));
exports.ErrorCode = void 0;
(function (ErrorCode) {
    ErrorCode[ErrorCode["MATCHMAKE_NO_HANDLER"] = 4210] = "MATCHMAKE_NO_HANDLER";
    ErrorCode[ErrorCode["MATCHMAKE_INVALID_CRITERIA"] = 4211] = "MATCHMAKE_INVALID_CRITERIA";
    ErrorCode[ErrorCode["MATCHMAKE_INVALID_ROOM_ID"] = 4212] = "MATCHMAKE_INVALID_ROOM_ID";
    ErrorCode[ErrorCode["MATCHMAKE_UNHANDLED"] = 4213] = "MATCHMAKE_UNHANDLED";
    ErrorCode[ErrorCode["MATCHMAKE_EXPIRED"] = 4214] = "MATCHMAKE_EXPIRED";
    ErrorCode[ErrorCode["AUTH_FAILED"] = 4215] = "AUTH_FAILED";
    ErrorCode[ErrorCode["APPLICATION_ERROR"] = 4216] = "APPLICATION_ERROR";
})(exports.ErrorCode || (exports.ErrorCode = {}));
//# sourceMappingURL=Protocol.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/Room.js":
/*!****************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/Room.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var Connection = __webpack_require__(/*! ./Connection.js */ "./node_modules/colyseus.js/build/cjs/Connection.js");
var Protocol = __webpack_require__(/*! ./Protocol.js */ "./node_modules/colyseus.js/build/cjs/Protocol.js");
var Serializer = __webpack_require__(/*! ./serializer/Serializer.js */ "./node_modules/colyseus.js/build/cjs/serializer/Serializer.js");
var nanoevents = __webpack_require__(/*! ./core/nanoevents.js */ "./node_modules/colyseus.js/build/cjs/core/nanoevents.js");
var signal = __webpack_require__(/*! ./core/signal.js */ "./node_modules/colyseus.js/build/cjs/core/signal.js");
var schema = __webpack_require__(/*! @colyseus/schema */ "./node_modules/@colyseus/schema/build/umd/index.js");
var SchemaSerializer = __webpack_require__(/*! ./serializer/SchemaSerializer.js */ "./node_modules/colyseus.js/build/cjs/serializer/SchemaSerializer.js");
var ServerError = __webpack_require__(/*! ./errors/ServerError.js */ "./node_modules/colyseus.js/build/cjs/errors/ServerError.js");
var msgpackr = __webpack_require__(/*! @colyseus/msgpackr */ "./node_modules/@colyseus/msgpackr/index.js");

var Room = /** @class */ (function () {
    function Room(name, rootSchema) {
        var _this = this;
        // Public signals
        this.onStateChange = signal.createSignal();
        this.onError = signal.createSignal();
        this.onLeave = signal.createSignal();
        this.onJoin = signal.createSignal();
        this.hasJoined = false;
        this.onMessageHandlers = nanoevents.createNanoEvents();
        this.roomId = null;
        this.name = name;
        this.packr = new msgpackr.Packr();
        // msgpackr workaround: force buffer to be created.
        this.packr.encode(undefined);
        if (rootSchema) {
            this.serializer = new (Serializer.getSerializer("schema"));
            this.rootSchema = rootSchema;
            this.serializer.state = new rootSchema();
        }
        this.onError(function (code, message) { var _a; return (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, "colyseus.js - onError => (".concat(code, ") ").concat(message)); });
        this.onLeave(function () { return _this.removeAllListeners(); });
    }
    Room.prototype.connect = function (endpoint, devModeCloseCallback, room, // when reconnecting on devMode, re-use previous room intance for handling events.
    options) {
        if (room === void 0) { room = this; }
        var connection = new Connection.Connection(options.protocol);
        room.connection = connection;
        connection.events.onmessage = Room.prototype.onMessageCallback.bind(room);
        connection.events.onclose = function (e) {
            var _a;
            if (!room.hasJoined) {
                (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, "Room connection was closed unexpectedly (".concat(e.code, "): ").concat(e.reason));
                room.onError.invoke(e.code, e.reason);
                return;
            }
            if (e.code === ServerError.CloseCode.DEVMODE_RESTART && devModeCloseCallback) {
                devModeCloseCallback();
            }
            else {
                room.onLeave.invoke(e.code, e.reason);
                room.destroy();
            }
        };
        connection.events.onerror = function (e) {
            var _a;
            (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, "Room, onError (".concat(e.code, "): ").concat(e.reason));
            room.onError.invoke(e.code, e.reason);
        };
        // FIXME: refactor this.
        if (options.protocol === "h3") {
            var url = new URL(endpoint);
            connection.connect(url.origin, options);
        }
        else {
            connection.connect(endpoint);
        }
    };
    Room.prototype.leave = function (consented) {
        var _this = this;
        if (consented === void 0) { consented = true; }
        return new Promise(function (resolve) {
            _this.onLeave(function (code) { return resolve(code); });
            if (_this.connection) {
                if (consented) {
                    _this.packr.buffer[0] = Protocol.Protocol.LEAVE_ROOM;
                    _this.connection.send(_this.packr.buffer.subarray(0, 1));
                }
                else {
                    _this.connection.close();
                }
            }
            else {
                _this.onLeave.invoke(ServerError.CloseCode.CONSENTED);
            }
        });
    };
    Room.prototype.onMessage = function (type, callback) {
        return this.onMessageHandlers.on(this.getMessageHandlerKey(type), callback);
    };
    Room.prototype.send = function (type, message) {
        var it = { offset: 1 };
        this.packr.buffer[0] = Protocol.Protocol.ROOM_DATA;
        if (typeof (type) === "string") {
            schema.encode.string(this.packr.buffer, type, it);
        }
        else {
            schema.encode.number(this.packr.buffer, type, it);
        }
        // force packr to use beginning of the buffer
        this.packr.position = 0;
        var data = (message !== undefined)
            ? this.packr.pack(message, 2048 + it.offset) // 2048 = RESERVE_START_SPACE
            : this.packr.buffer.subarray(0, it.offset);
        this.connection.send(data);
    };
    Room.prototype.sendUnreliable = function (type, message) {
        var it = { offset: 1 };
        this.packr.buffer[0] = Protocol.Protocol.ROOM_DATA;
        if (typeof (type) === "string") {
            schema.encode.string(this.packr.buffer, type, it);
        }
        else {
            schema.encode.number(this.packr.buffer, type, it);
        }
        // force packr to use beginning of the buffer
        this.packr.position = 0;
        var data = (message !== undefined)
            ? this.packr.pack(message, 2048 + it.offset) // 2048 = RESERVE_START_SPACE
            : this.packr.buffer.subarray(0, it.offset);
        this.connection.sendUnreliable(data);
    };
    Room.prototype.sendBytes = function (type, bytes) {
        var it = { offset: 1 };
        this.packr.buffer[0] = Protocol.Protocol.ROOM_DATA_BYTES;
        if (typeof (type) === "string") {
            schema.encode.string(this.packr.buffer, type, it);
        }
        else {
            schema.encode.number(this.packr.buffer, type, it);
        }
        // check if buffer needs to be resized
        // TODO: can we avoid this?
        if (bytes.byteLength + it.offset > this.packr.buffer.byteLength) {
            var newBuffer = new Uint8Array(it.offset + bytes.byteLength);
            newBuffer.set(this.packr.buffer);
            this.packr.useBuffer(newBuffer);
        }
        this.packr.buffer.set(bytes, it.offset);
        this.connection.send(this.packr.buffer.subarray(0, it.offset + bytes.byteLength));
    };
    Object.defineProperty(Room.prototype, "state", {
        get: function () {
            return this.serializer.getState();
        },
        enumerable: false,
        configurable: true
    });
    Room.prototype.removeAllListeners = function () {
        this.onJoin.clear();
        this.onStateChange.clear();
        this.onError.clear();
        this.onLeave.clear();
        this.onMessageHandlers.events = {};
        if (this.serializer instanceof SchemaSerializer.SchemaSerializer) {
            // Remove callback references
            this.serializer.decoder.root.callbacks = {};
        }
    };
    Room.prototype.onMessageCallback = function (event) {
        var buffer = new Uint8Array(event.data);
        var it = { offset: 1 };
        var code = buffer[0];
        if (code === Protocol.Protocol.JOIN_ROOM) {
            var reconnectionToken = schema.decode.utf8Read(buffer, it, buffer[it.offset++]);
            this.serializerId = schema.decode.utf8Read(buffer, it, buffer[it.offset++]);
            // Instantiate serializer if not locally available.
            if (!this.serializer) {
                var serializer = Serializer.getSerializer(this.serializerId);
                this.serializer = new serializer();
            }
            if (buffer.byteLength > it.offset && this.serializer.handshake) {
                this.serializer.handshake(buffer, it);
            }
            this.reconnectionToken = "".concat(this.roomId, ":").concat(reconnectionToken);
            this.hasJoined = true;
            this.onJoin.invoke();
            // acknowledge successfull JOIN_ROOM
            this.packr.buffer[0] = Protocol.Protocol.JOIN_ROOM;
            this.connection.send(this.packr.buffer.subarray(0, 1));
        }
        else if (code === Protocol.Protocol.ERROR) {
            var code_1 = schema.decode.number(buffer, it);
            var message = schema.decode.string(buffer, it);
            this.onError.invoke(code_1, message);
        }
        else if (code === Protocol.Protocol.LEAVE_ROOM) {
            this.leave();
        }
        else if (code === Protocol.Protocol.ROOM_STATE) {
            this.serializer.setState(buffer, it);
            this.onStateChange.invoke(this.serializer.getState());
        }
        else if (code === Protocol.Protocol.ROOM_STATE_PATCH) {
            this.serializer.patch(buffer, it);
            this.onStateChange.invoke(this.serializer.getState());
        }
        else if (code === Protocol.Protocol.ROOM_DATA) {
            var type = (schema.decode.stringCheck(buffer, it))
                ? schema.decode.string(buffer, it)
                : schema.decode.number(buffer, it);
            var message = (buffer.byteLength > it.offset)
                ? msgpackr.unpack(buffer, { start: it.offset })
                : undefined;
            this.dispatchMessage(type, message);
        }
        else if (code === Protocol.Protocol.ROOM_DATA_BYTES) {
            var type = (schema.decode.stringCheck(buffer, it))
                ? schema.decode.string(buffer, it)
                : schema.decode.number(buffer, it);
            this.dispatchMessage(type, buffer.subarray(it.offset));
        }
    };
    Room.prototype.dispatchMessage = function (type, message) {
        var _a;
        var messageType = this.getMessageHandlerKey(type);
        if (this.onMessageHandlers.events[messageType]) {
            this.onMessageHandlers.emit(messageType, message);
        }
        else if (this.onMessageHandlers.events['*']) {
            this.onMessageHandlers.emit('*', type, message);
        }
        else {
            (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, "colyseus.js: onMessage() not registered for type '".concat(type, "'."));
        }
    };
    Room.prototype.destroy = function () {
        if (this.serializer) {
            this.serializer.teardown();
        }
    };
    Room.prototype.getMessageHandlerKey = function (type) {
        switch (typeof (type)) {
            // string
            case "string": return type;
            // number
            case "number": return "i".concat(type);
            default: throw new Error("invalid message type.");
        }
    };
    return Room;
}());

exports.Room = Room;
//# sourceMappingURL=Room.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/Storage.js":
/*!*******************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/Storage.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var tslib = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");

/// <reference path="../typings/cocos-creator.d.ts" />
/**
 * We do not assign 'storage' to window.localStorage immediatelly for React
 * Native compatibility. window.localStorage is not present when this module is
 * loaded.
 */
var storage;
function getStorage() {
    if (!storage) {
        try {
            storage = (typeof (cc) !== 'undefined' && cc.sys && cc.sys.localStorage)
                ? cc.sys.localStorage // compatibility with cocos creator
                : window.localStorage; // RN does have window object at this point, but localStorage is not defined
        }
        catch (e) {
            // ignore error
        }
    }
    if (!storage && typeof (globalThis.indexedDB) !== 'undefined') {
        storage = new IndexedDBStorage();
    }
    if (!storage) {
        // mock localStorage if not available (Node.js or RN environment)
        storage = {
            cache: {},
            setItem: function (key, value) { this.cache[key] = value; },
            getItem: function (key) { this.cache[key]; },
            removeItem: function (key) { delete this.cache[key]; },
        };
    }
    return storage;
}
function setItem(key, value) {
    getStorage().setItem(key, value);
}
function removeItem(key) {
    getStorage().removeItem(key);
}
function getItem(key, callback) {
    var value = getStorage().getItem(key);
    if (typeof (Promise) === 'undefined' || // old browsers
        !(value instanceof Promise)) {
        // browser has synchronous return
        callback(value);
    }
    else {
        // react-native is asynchronous
        value.then(function (id) { return callback(id); });
    }
}
/**
 * When running in a Web Worker, we need to use IndexedDB to store data.
 */
var IndexedDBStorage = /** @class */ (function () {
    function IndexedDBStorage() {
        this.dbPromise = new Promise(function (resolve) {
            var request = indexedDB.open('_colyseus_storage', 1);
            request.onupgradeneeded = function () { return request.result.createObjectStore('store'); };
            request.onsuccess = function () { return resolve(request.result); };
        });
    }
    IndexedDBStorage.prototype.tx = function (mode, fn) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var db, store;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbPromise];
                    case 1:
                        db = _a.sent();
                        store = db.transaction('store', mode).objectStore('store');
                        return [2 /*return*/, fn(store)];
                }
            });
        });
    };
    IndexedDBStorage.prototype.setItem = function (key, value) {
        return this.tx('readwrite', function (store) { return store.put(value, key); }).then();
    };
    IndexedDBStorage.prototype.getItem = function (key) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var request;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tx('readonly', function (store) { return store.get(key); })];
                    case 1:
                        request = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve) {
                                request.onsuccess = function () { return resolve(request.result); };
                            })];
                }
            });
        });
    };
    IndexedDBStorage.prototype.removeItem = function (key) {
        return this.tx('readwrite', function (store) { return store.delete(key); }).then();
    };
    return IndexedDBStorage;
}());

exports.getItem = getItem;
exports.removeItem = removeItem;
exports.setItem = setItem;
//# sourceMappingURL=Storage.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/core/nanoevents.js":
/*!***************************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/core/nanoevents.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

/**
 * The MIT License (MIT)
 *
 * Copyright 2016 Andrey Sitnik <andrey@sitnik.ru>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var createNanoEvents = function () { return ({
    emit: function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var callbacks = this.events[event] || [];
        for (var i = 0, length_1 = callbacks.length; i < length_1; i++) {
            callbacks[i].apply(callbacks, args);
        }
    },
    events: {},
    on: function (event, cb) {
        var _this = this;
        var _a;
        ((_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.push(cb)) || (this.events[event] = [cb]);
        return function () {
            var _a;
            _this.events[event] = (_a = _this.events[event]) === null || _a === void 0 ? void 0 : _a.filter(function (i) { return cb !== i; });
        };
    }
}); };

exports.createNanoEvents = createNanoEvents;
//# sourceMappingURL=nanoevents.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/core/signal.js":
/*!***********************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/core/signal.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.handlers = [];
    }
    EventEmitter.prototype.register = function (cb, once) {
        this.handlers.push(cb);
        return this;
    };
    EventEmitter.prototype.invoke = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.handlers.forEach(function (handler) { return handler.apply(_this, args); });
    };
    EventEmitter.prototype.invokeAsync = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Promise.all(this.handlers.map(function (handler) { return handler.apply(_this, args); }));
    };
    EventEmitter.prototype.remove = function (cb) {
        var index = this.handlers.indexOf(cb);
        this.handlers[index] = this.handlers[this.handlers.length - 1];
        this.handlers.pop();
    };
    EventEmitter.prototype.clear = function () {
        this.handlers = [];
    };
    return EventEmitter;
}());
function createSignal() {
    var emitter = new EventEmitter();
    function register(cb) {
        return emitter.register(cb, this === null);
    }
    register.once = function (cb) {
        var callback = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            cb.apply(this, args);
            emitter.remove(callback);
        };
        emitter.register(callback);
    };
    register.remove = function (cb) { return emitter.remove(cb); };
    register.invoke = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return emitter.invoke.apply(emitter, args);
    };
    register.invokeAsync = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return emitter.invokeAsync.apply(emitter, args);
    };
    register.clear = function () { return emitter.clear(); };
    return register;
}

exports.EventEmitter = EventEmitter;
exports.createSignal = createSignal;
//# sourceMappingURL=signal.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/errors/ServerError.js":
/*!******************************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/errors/ServerError.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var tslib = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");

exports.CloseCode = void 0;
(function (CloseCode) {
    CloseCode[CloseCode["CONSENTED"] = 4000] = "CONSENTED";
    CloseCode[CloseCode["DEVMODE_RESTART"] = 4010] = "DEVMODE_RESTART";
})(exports.CloseCode || (exports.CloseCode = {}));
var ServerError = /** @class */ (function (_super) {
    tslib.__extends(ServerError, _super);
    function ServerError(code, message) {
        var _this = _super.call(this, message) || this;
        _this.name = "ServerError";
        _this.code = code;
        return _this;
    }
    return ServerError;
}(Error));

exports.ServerError = ServerError;
//# sourceMappingURL=ServerError.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

__webpack_require__(/*! ./legacy.js */ "./node_modules/colyseus.js/build/cjs/legacy.js");
var Client = __webpack_require__(/*! ./Client.js */ "./node_modules/colyseus.js/build/cjs/Client.js");
var Protocol = __webpack_require__(/*! ./Protocol.js */ "./node_modules/colyseus.js/build/cjs/Protocol.js");
var Room = __webpack_require__(/*! ./Room.js */ "./node_modules/colyseus.js/build/cjs/Room.js");
var Auth = __webpack_require__(/*! ./Auth.js */ "./node_modules/colyseus.js/build/cjs/Auth.js");
var ServerError = __webpack_require__(/*! ./errors/ServerError.js */ "./node_modules/colyseus.js/build/cjs/errors/ServerError.js");
var SchemaSerializer = __webpack_require__(/*! ./serializer/SchemaSerializer.js */ "./node_modules/colyseus.js/build/cjs/serializer/SchemaSerializer.js");
var NoneSerializer = __webpack_require__(/*! ./serializer/NoneSerializer.js */ "./node_modules/colyseus.js/build/cjs/serializer/NoneSerializer.js");
var Serializer = __webpack_require__(/*! ./serializer/Serializer.js */ "./node_modules/colyseus.js/build/cjs/serializer/Serializer.js");

Serializer.registerSerializer('schema', SchemaSerializer.SchemaSerializer);
Serializer.registerSerializer('none', NoneSerializer.NoneSerializer);

exports.Client = Client.Client;
Object.defineProperty(exports, "ErrorCode", ({
	enumerable: true,
	get: function () { return Protocol.ErrorCode; }
}));
Object.defineProperty(exports, "Protocol", ({
	enumerable: true,
	get: function () { return Protocol.Protocol; }
}));
exports.Room = Room.Room;
exports.Auth = Auth.Auth;
exports.ServerError = ServerError.ServerError;
exports.SchemaSerializer = SchemaSerializer.SchemaSerializer;
exports.getStateCallbacks = SchemaSerializer.getStateCallbacks;
exports.registerSerializer = Serializer.registerSerializer;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/legacy.js":
/*!******************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/legacy.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// colyseus.js@0.16.10


//
// Polyfills for legacy environments
//
/*
 * Support Android 4.4.x
 */
if (!ArrayBuffer.isView) {
    ArrayBuffer.isView = function (a) {
        return a !== null && typeof (a) === 'object' && a.buffer instanceof ArrayBuffer;
    };
}
// Cocos Creator does not provide "FormData"
// Define a dummy implementation so it doesn't crash
if (typeof (FormData) === "undefined") {
    // @ts-ignore
    __webpack_require__.g['FormData'] = /** @class */ (function () {
        function class_1() {
        }
        return class_1;
    }());
}
// Define globalThis if not available.
// https://github.com/colyseus/colyseus.js/issues/86
if (typeof (globalThis) === "undefined" &&
    typeof (window) !== "undefined") {
    // @ts-ignore
    window['globalThis'] = window;
}
//# sourceMappingURL=legacy.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/serializer/NoneSerializer.js":
/*!*************************************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/serializer/NoneSerializer.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var NoneSerializer = /** @class */ (function () {
    function NoneSerializer() {
    }
    NoneSerializer.prototype.setState = function (rawState) { };
    NoneSerializer.prototype.getState = function () { return null; };
    NoneSerializer.prototype.patch = function (patches) { };
    NoneSerializer.prototype.teardown = function () { };
    NoneSerializer.prototype.handshake = function (bytes) { };
    return NoneSerializer;
}());

exports.NoneSerializer = NoneSerializer;
//# sourceMappingURL=NoneSerializer.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/serializer/SchemaSerializer.js":
/*!***************************************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/serializer/SchemaSerializer.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var schema = __webpack_require__(/*! @colyseus/schema */ "./node_modules/@colyseus/schema/build/umd/index.js");

function getStateCallbacks(room) {
    try {
        // SchemaSerializer
        return schema.getDecoderStateCallbacks(room['serializer'].decoder);
    }
    catch (e) {
        // NoneSerializer
        return undefined;
    }
}
var SchemaSerializer = /** @class */ (function () {
    function SchemaSerializer() {
    }
    SchemaSerializer.prototype.setState = function (encodedState, it) {
        this.decoder.decode(encodedState, it);
    };
    SchemaSerializer.prototype.getState = function () {
        return this.state;
    };
    SchemaSerializer.prototype.patch = function (patches, it) {
        return this.decoder.decode(patches, it);
    };
    SchemaSerializer.prototype.teardown = function () {
        this.decoder.root.clearRefs();
    };
    SchemaSerializer.prototype.handshake = function (bytes, it) {
        if (this.state) {
            //
            // TODO: validate definitions against concreate this.state instance
            //
            schema.Reflection.decode(bytes, it); // no-op
            this.decoder = new schema.Decoder(this.state);
        }
        else {
            // initialize reflected state from server
            this.decoder = schema.Reflection.decode(bytes, it);
            this.state = this.decoder.state;
        }
    };
    return SchemaSerializer;
}());

exports.SchemaSerializer = SchemaSerializer;
exports.getStateCallbacks = getStateCallbacks;
//# sourceMappingURL=SchemaSerializer.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/serializer/Serializer.js":
/*!*********************************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/serializer/Serializer.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var serializers = {};
function registerSerializer(id, serializer) {
    serializers[id] = serializer;
}
function getSerializer(id) {
    var serializer = serializers[id];
    if (!serializer) {
        throw new Error("missing serializer: " + id);
    }
    return serializer;
}

exports.getSerializer = getSerializer;
exports.registerSerializer = registerSerializer;
//# sourceMappingURL=Serializer.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/transport/H3Transport.js":
/*!*********************************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/transport/H3Transport.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var tslib = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
var schema = __webpack_require__(/*! @colyseus/schema */ "./node_modules/@colyseus/schema/build/umd/index.js");

var H3TransportTransport = /** @class */ (function () {
    function H3TransportTransport(events) {
        this.events = events;
        this.isOpen = false;
        this.lengthPrefixBuffer = new Uint8Array(9); // 9 bytes is the maximum length of a length prefix
    }
    H3TransportTransport.prototype.connect = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var wtOpts = options.fingerprint && ({
            // requireUnreliable: true,
            // congestionControl: "default", // "low-latency" || "throughput"
            serverCertificateHashes: [{
                    algorithm: 'sha-256',
                    value: new Uint8Array(options.fingerprint).buffer
                }]
        }) || undefined;
        this.wt = new WebTransport(url, wtOpts);
        this.wt.ready.then(function (e) {
            console.log("WebTransport ready!", e);
            _this.isOpen = true;
            _this.unreliableReader = _this.wt.datagrams.readable.getReader();
            _this.unreliableWriter = _this.wt.datagrams.writable.getWriter();
            var incomingBidi = _this.wt.incomingBidirectionalStreams.getReader();
            incomingBidi.read().then(function (stream) {
                _this.reader = stream.value.readable.getReader();
                _this.writer = stream.value.writable.getWriter();
                // immediately write room/sessionId for establishing the room connection
                _this.sendSeatReservation(options.room.roomId, options.sessionId, options.reconnectionToken);
                // start reading incoming data
                _this.readIncomingData();
                _this.readIncomingUnreliableData();
            }).catch(function (e) {
                console.error("failed to read incoming stream", e);
                console.error("TODO: close the connection");
            });
            // this.events.onopen(e);
        }).catch(function (e) {
            // this.events.onerror(e);
            // this.events.onclose({ code: e.closeCode, reason: e.reason });
            console.log("WebTransport not ready!", e);
            _this._close();
        });
        this.wt.closed.then(function (e) {
            console.log("WebTransport closed w/ success", e);
            _this.events.onclose({ code: e.closeCode, reason: e.reason });
        }).catch(function (e) {
            console.log("WebTransport closed w/ error", e);
            _this.events.onerror(e);
            _this.events.onclose({ code: e.closeCode, reason: e.reason });
        }).finally(function () {
            _this._close();
        });
    };
    H3TransportTransport.prototype.send = function (data) {
        var prefixLength = schema.encode.number(this.lengthPrefixBuffer, data.length, { offset: 0 });
        var dataWithPrefixedLength = new Uint8Array(prefixLength + data.length);
        dataWithPrefixedLength.set(this.lengthPrefixBuffer.subarray(0, prefixLength), 0);
        dataWithPrefixedLength.set(data, prefixLength);
        this.writer.write(dataWithPrefixedLength);
    };
    H3TransportTransport.prototype.sendUnreliable = function (data) {
        var prefixLength = schema.encode.number(this.lengthPrefixBuffer, data.length, { offset: 0 });
        var dataWithPrefixedLength = new Uint8Array(prefixLength + data.length);
        dataWithPrefixedLength.set(this.lengthPrefixBuffer.subarray(0, prefixLength), 0);
        dataWithPrefixedLength.set(data, prefixLength);
        this.unreliableWriter.write(dataWithPrefixedLength);
    };
    H3TransportTransport.prototype.close = function (code, reason) {
        try {
            this.wt.close({ closeCode: code, reason: reason });
        }
        catch (e) {
            console.error(e);
        }
    };
    H3TransportTransport.prototype.readIncomingData = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var result, messages, it_1, length_1, e_1;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isOpen) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.reader.read()];
                    case 2:
                        result = _a.sent();
                        messages = result.value;
                        it_1 = { offset: 0 };
                        do {
                            length_1 = schema.decode.number(messages, it_1);
                            this.events.onmessage({ data: messages.subarray(it_1.offset, it_1.offset + length_1) });
                            it_1.offset += length_1;
                        } while (it_1.offset < messages.length);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        if (e_1.message.indexOf("session is closed") === -1) {
                            console.error("H3Transport: failed to read incoming data", e_1);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        if (result.done) {
                            return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 0];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    H3TransportTransport.prototype.readIncomingUnreliableData = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var result, messages, it_2, length_2, e_2;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isOpen) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.unreliableReader.read()];
                    case 2:
                        result = _a.sent();
                        messages = result.value;
                        it_2 = { offset: 0 };
                        do {
                            length_2 = schema.decode.number(messages, it_2);
                            this.events.onmessage({ data: messages.subarray(it_2.offset, it_2.offset + length_2) });
                            it_2.offset += length_2;
                        } while (it_2.offset < messages.length);
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        if (e_2.message.indexOf("session is closed") === -1) {
                            console.error("H3Transport: failed to read incoming data", e_2);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        if (result.done) {
                            return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 0];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    H3TransportTransport.prototype.sendSeatReservation = function (roomId, sessionId, reconnectionToken) {
        var it = { offset: 0 };
        var bytes = [];
        schema.encode.string(bytes, roomId, it);
        schema.encode.string(bytes, sessionId, it);
        if (reconnectionToken) {
            schema.encode.string(bytes, reconnectionToken, it);
        }
        this.writer.write(new Uint8Array(bytes).buffer);
    };
    H3TransportTransport.prototype._close = function () {
        this.isOpen = false;
    };
    return H3TransportTransport;
}());

exports.H3TransportTransport = H3TransportTransport;
//# sourceMappingURL=H3Transport.js.map


/***/ }),

/***/ "./node_modules/colyseus.js/build/cjs/transport/WebSocketTransport.js":
/*!****************************************************************************!*\
  !*** ./node_modules/colyseus.js/build/cjs/transport/WebSocketTransport.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// colyseus.js@0.16.10


Object.defineProperty(exports, "__esModule", ({ value: true }));

var NodeWebSocket = __webpack_require__(/*! ws */ "./node_modules/ws/browser.js");

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var NodeWebSocket__default = /*#__PURE__*/_interopDefaultLegacy(NodeWebSocket);

var WebSocket = globalThis.WebSocket || NodeWebSocket__default["default"];
var WebSocketTransport = /** @class */ (function () {
    function WebSocketTransport(events) {
        this.events = events;
    }
    WebSocketTransport.prototype.send = function (data) {
        this.ws.send(data);
    };
    WebSocketTransport.prototype.sendUnreliable = function (data) {
        console.warn("colyseus.js: The WebSocket transport does not support unreliable messages");
    };
    WebSocketTransport.prototype.connect = function (url) {
        this.ws = new WebSocket(url, this.protocols);
        this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = this.events.onopen;
        this.ws.onmessage = this.events.onmessage;
        this.ws.onclose = this.events.onclose;
        this.ws.onerror = this.events.onerror;
    };
    WebSocketTransport.prototype.close = function (code, reason) {
        this.ws.close(code, reason);
    };
    Object.defineProperty(WebSocketTransport.prototype, "isOpen", {
        get: function () {
            return this.ws.readyState === WebSocket.OPEN;
        },
        enumerable: false,
        configurable: true
    });
    return WebSocketTransport;
}());

exports.WebSocketTransport = WebSocketTransport;
//# sourceMappingURL=WebSocketTransport.js.map


/***/ }),

/***/ "./node_modules/httpie/xhr/index.mjs":
/*!*******************************************!*\
  !*** ./node_modules/httpie/xhr/index.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   del: () => (/* binding */ del),
/* harmony export */   get: () => (/* binding */ get),
/* harmony export */   patch: () => (/* binding */ patch),
/* harmony export */   post: () => (/* binding */ post),
/* harmony export */   put: () => (/* binding */ put),
/* harmony export */   send: () => (/* binding */ send)
/* harmony export */ });
function apply(src, tar) {
	tar.headers = src.headers || {};
	tar.statusMessage = src.statusText;
	tar.statusCode = src.status;
	tar.data = src.response;
}

function send(method, uri, opts) {
	return new Promise(function (res, rej) {
		opts = opts || {};
		var req = new XMLHttpRequest;
		var k, tmp, arr, str=opts.body;
		var headers = opts.headers || {};

		// IE compatible
		if (opts.timeout) req.timeout = opts.timeout;
		req.ontimeout = req.onerror = function (err) {
			err.timeout = err.type == 'timeout';
			rej(err);
		}

		req.open(method, uri.href || uri);

		req.onload = function () {
			arr = req.getAllResponseHeaders().trim().split(/[\r\n]+/);
			apply(req, req); //=> req.headers

			while (tmp = arr.shift()) {
				tmp = tmp.split(': ');
				req.headers[tmp.shift().toLowerCase()] = tmp.join(': ');
			}

			tmp = req.headers['content-type'];
			if (tmp && !!~tmp.indexOf('application/json')) {
				try {
					req.data = JSON.parse(req.data, opts.reviver);
				} catch (err) {
					apply(req, err);
					return rej(err);
				}
			}

			(req.status >= 400 ? rej : res)(req);
		};

		if (typeof FormData < 'u' && str instanceof FormData) {
			// str = opts.body
		} else if (str && typeof str == 'object') {
			headers['content-type'] = 'application/json';
			str = JSON.stringify(str);
		}

		req.withCredentials = !!opts.withCredentials;

		for (k in headers) {
			req.setRequestHeader(k, headers[k]);
		}

		req.send(str);
	});
}

var get = /*#__PURE__*/ send.bind(send, 'GET');
var post = /*#__PURE__*/ send.bind(send, 'POST');
var patch = /*#__PURE__*/ send.bind(send, 'PATCH');
var del = /*#__PURE__*/ send.bind(send, 'DELETE');
var put = /*#__PURE__*/ send.bind(send, 'PUT');


/***/ }),

/***/ "./node_modules/tslib/tslib.es6.mjs":
/*!******************************************!*\
  !*** ./node_modules/tslib/tslib.es6.mjs ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __addDisposableResource: () => (/* binding */ __addDisposableResource),
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldIn: () => (/* binding */ __classPrivateFieldIn),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __disposeResources: () => (/* binding */ __disposeResources),
/* harmony export */   __esDecorate: () => (/* binding */ __esDecorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __propKey: () => (/* binding */ __propKey),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __rewriteRelativeImportExtension: () => (/* binding */ __rewriteRelativeImportExtension),
/* harmony export */   __runInitializers: () => (/* binding */ __runInitializers),
/* harmony export */   __setFunctionName: () => (/* binding */ __setFunctionName),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
  function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

var ownKeys = function(o) {
  ownKeys = Object.getOwnPropertyNames || function (o) {
    var ar = [];
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    return ar;
  };
  return ownKeys(o);
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}

function __rewriteRelativeImportExtension(path, preserveJsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
          return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
      });
  }
  return path;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __esDecorate,
  __runInitializers,
  __propKey,
  __setFunctionName,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
  __rewriteRelativeImportExtension,
});


/***/ }),

/***/ "./node_modules/ws/browser.js":
/*!************************************!*\
  !*** ./node_modules/ws/browser.js ***!
  \************************************/
/***/ ((module) => {

"use strict";


module.exports = function () {
  throw new Error(
    'ws does not work in the browser. Browser clients must use the native ' +
      'WebSocket object'
  );
};


/***/ }),

/***/ "./src/game/InputHandler.js":
/*!**********************************!*\
  !*** ./src/game/InputHandler.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InputHandler: () => (/* binding */ InputHandler)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Handles all user input (mouse, keyboard) for the game
 */
var InputHandler = /*#__PURE__*/function () {
  /**
   * Initialize the input handler
   * @param {Game} game - The main game instance
   */
  function InputHandler(game) {
    _classCallCheck(this, InputHandler);
    this.game = game;

    // Keyboard state
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      shift: false
    };

    // Mouse state
    this.mouse = {
      x: 0,
      y: 0,
      leftDown: false,
      rightDown: false,
      dragStart: null,
      dragging: false
    };

    // Selection box
    this.selectionBox = null;

    // Camera movement speed
    this.cameraSpeed = 10;

    // Input enabled flag
    this.inputEnabled = true;

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Set up event listeners for user input
   */
  return _createClass(InputHandler, [{
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;
      // Keyboard events
      window.addEventListener('keydown', function (e) {
        return _this.handleKeyDown(e);
      });
      window.addEventListener('keyup', function (e) {
        return _this.handleKeyUp(e);
      });

      // Mouse events
      var canvas = this.game.renderer.canvas;
      canvas.addEventListener('mousedown', function (e) {
        return _this.handleMouseDown(e);
      });
      canvas.addEventListener('mouseup', function (e) {
        return _this.handleMouseUp(e);
      });
      canvas.addEventListener('mousemove', function (e) {
        return _this.handleMouseMove(e);
      });
      canvas.addEventListener('wheel', function (e) {
        return _this.handleMouseWheel(e);
      });
      canvas.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        _this.handleRightClick(e);
      });

      // Window resize
      window.addEventListener('resize', function () {
        return _this.handleResize();
      });
    }

    /**
     * Handle keydown events
     * @param {KeyboardEvent} e - Keyboard event
     */
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (!this.inputEnabled) return;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          this.keys.up = true;
          break;
        case 'ArrowDown':
        case 's':
          this.keys.down = true;
          break;
        case 'ArrowLeft':
        case 'a':
          this.keys.left = true;
          break;
        case 'ArrowRight':
        case 'd':
          this.keys.right = true;
          break;
        case 'Shift':
          this.keys.shift = true;
          break;
      }
    }

    /**
     * Handle keyup events
     * @param {KeyboardEvent} e - Keyboard event
     */
  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(e) {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          this.keys.up = false;
          break;
        case 'ArrowDown':
        case 's':
          this.keys.down = false;
          break;
        case 'ArrowLeft':
        case 'a':
          this.keys.left = false;
          break;
        case 'ArrowRight':
        case 'd':
          this.keys.right = false;
          break;
        case 'Shift':
          this.keys.shift = false;
          break;
      }
    }

    /**
     * Handle mousedown events
     * @param {MouseEvent} e - Mouse event
     */
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(e) {
      if (!this.inputEnabled) return;

      // Get mouse position relative to canvas
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      // Store mouse state
      this.mouse.x = x;
      this.mouse.y = y;

      // Handle different mouse buttons
      if (e.button === 0) {
        // Left click
        this.mouse.leftDown = true;
        this.mouse.dragStart = {
          x: x,
          y: y
        };

        // If not holding shift, clear selection for new selection
        if (!this.keys.shift) {
          this.game.selectEntity(null);
        }
      } else if (e.button === 2) {
        // Right click
        this.mouse.rightDown = true;

        // Right click is handled in context menu event to prevent the default menu
      }
    }

    /**
     * Handle mouseup events
     * @param {MouseEvent} e - Mouse event
     */
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(e) {
      // Get mouse position relative to canvas
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      // Handle different mouse buttons
      if (e.button === 0) {
        // Left click
        this.mouse.leftDown = false;

        // If dragging, handle selection box
        if (this.mouse.dragging) {
          this.handleSelectionBox();
        } else {
          // Single click selection
          var gridPos = this.game.renderer.screenToGrid(x, y);
          this.handleSelectionClick(gridPos);
        }

        // Reset dragging state
        this.mouse.dragging = false;
        this.mouse.dragStart = null;
        this.selectionBox = null;
      } else if (e.button === 2) {
        // Right click
        this.mouse.rightDown = false;
      }
    }

    /**
     * Handle selection box selection
     */
  }, {
    key: "handleSelectionBox",
    value: function handleSelectionBox() {
      var _this2 = this;
      if (!this.selectionBox) return;

      // Convert selection box to grid coordinates
      var topLeft = this.game.renderer.screenToGrid(this.selectionBox.x, this.selectionBox.y);
      var bottomRight = this.game.renderer.screenToGrid(this.selectionBox.x + this.selectionBox.width, this.selectionBox.y + this.selectionBox.height);

      // Find entities in selection box
      var selectedEntities = [];

      // Check units
      this.game.units.forEach(function (unit) {
        if (unit.owner === _this2.game.playerId) {
          var pos = unit.position;
          if (pos.x >= topLeft.x && pos.x <= bottomRight.x && pos.y >= topLeft.y && pos.y <= bottomRight.y) {
            selectedEntities.push(unit);
          }
        }
      });

      // If entities are found, select them
      if (selectedEntities.length > 0) {
        this.game.selectMultipleEntities(selectedEntities);
      }
    }

    /**
     * Handle mousemove events
     * @param {MouseEvent} e - Mouse event
     */
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(e) {
      // Get mouse position relative to canvas
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      // Update mouse position
      this.mouse.x = x;
      this.mouse.y = y;

      // Check if dragging with left mouse button
      if (this.mouse.leftDown && this.mouse.dragStart) {
        // Set dragging flag
        this.mouse.dragging = true;

        // Calculate selection box
        this.selectionBox = {
          x: Math.min(this.mouse.dragStart.x, x),
          y: Math.min(this.mouse.dragStart.y, y),
          width: Math.abs(x - this.mouse.dragStart.x),
          height: Math.abs(y - this.mouse.dragStart.y)
        };
      }

      // Screen edge camera panning
      var edgeSize = 50;
      if (x < edgeSize) {
        this.game.renderer.panCamera(-this.cameraSpeed, 0);
      } else if (x > this.game.renderer.canvas.width - edgeSize) {
        this.game.renderer.panCamera(this.cameraSpeed, 0);
      }
      if (y < edgeSize) {
        this.game.renderer.panCamera(0, -this.cameraSpeed);
      } else if (y > this.game.renderer.canvas.height - edgeSize) {
        this.game.renderer.panCamera(0, this.cameraSpeed);
      }
    }

    /**
     * Handle mousewheel events
     * @param {WheelEvent} e - Wheel event
     */
  }, {
    key: "handleMouseWheel",
    value: function handleMouseWheel(e) {
      if (!this.inputEnabled) return;

      // Prevent default scrolling
      e.preventDefault();

      // Adjust zoom level
      var delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.game.renderer.adjustZoom(delta);
    }

    /**
     * Handle right-click events
     * @param {MouseEvent} e - Mouse event
     */
  }, {
    key: "handleRightClick",
    value: function handleRightClick(e) {
      var _this3 = this;
      if (!this.inputEnabled) return;

      // Get mouse position relative to canvas
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      // Convert screen position to grid position
      var gridPos = this.game.renderer.screenToGrid(x, y);

      // Check for selected entities
      if (this.game.selectedEntities.length > 0) {
        // Check if clicking on an enemy entity (for attack)
        var targetEntity = this.findEntityAtPosition(gridPos);
        if (targetEntity && targetEntity.owner !== this.game.playerId) {
          // Attack the target
          this.game.selectedEntities.forEach(function (entity) {
            if (entity.id !== _this3.game.players.get(_this3.game.playerId).hero.id) {
              _this3.game.attack(entity.id, targetEntity.id);
            }
          });
        } else {
          // Move to position
          this.game.selectedEntities.forEach(function (entity) {
            if (entity.id === _this3.game.players.get(_this3.game.playerId).hero.id) {
              // Move hero
              _this3.game.moveHero(gridPos.x, gridPos.y);
            } else {
              // Move unit
              _this3.game.moveUnit(entity.id, gridPos.x, gridPos.y);
            }
          });
        }
      }
    }

    /**
     * Handle window resize
     */
  }, {
    key: "handleResize",
    value: function handleResize() {
      // Update canvas size in renderer
      this.game.renderer.handleResize();
    }

    /**
     * Update camera position based on keyboard input
     */
  }, {
    key: "updateCameraFromKeys",
    value: function updateCameraFromKeys() {
      if (!this.inputEnabled) return;
      var dx = 0;
      var dy = 0;
      if (this.keys.up) dy -= this.cameraSpeed;
      if (this.keys.down) dy += this.cameraSpeed;
      if (this.keys.left) dx -= this.cameraSpeed;
      if (this.keys.right) dx += this.cameraSpeed;
      if (dx !== 0 || dy !== 0) {
        this.game.renderer.panCamera(dx, dy);
      }
    }

    /**
     * Handle selection click
     * @param {Object} gridPos - Grid position {x, y}
     */
  }, {
    key: "handleSelectionClick",
    value: function handleSelectionClick(gridPos) {
      // Find entity at clicked position
      var entity = this.findEntityAtPosition(gridPos);
      if (entity) {
        // If entity belongs to player or is a building that can be selected
        if (entity.owner === this.game.playerId || entity.type === 'building') {
          this.game.selectEntity(entity);
        }
      }
    }

    /**
     * Find entity at a grid position
     * @param {Object} gridPos - Grid position {x, y}
     * @returns {Object|null} Entity found at position or null
     */
  }, {
    key: "findEntityAtPosition",
    value: function findEntityAtPosition(gridPos) {
      // Check for the player's hero
      var playerData = this.game.players.get(this.game.playerId);
      if (playerData && playerData.hero) {
        var heroPos = playerData.hero.position;
        if (Math.abs(heroPos.x - gridPos.x) < 0.5 && Math.abs(heroPos.y - gridPos.y) < 0.5) {
          return playerData.hero;
        }
      }

      // Check for units
      var _iterator = _createForOfIteratorHelper(this.game.units),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            id = _step$value[0],
            unit = _step$value[1];
          var unitPos = unit.position;
          if (Math.abs(unitPos.x - gridPos.x) < 0.5 && Math.abs(unitPos.y - gridPos.y) < 0.5) {
            return unit;
          }
        }

        // Check for buildings
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var _iterator2 = _createForOfIteratorHelper(this.game.buildings),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 2),
            _id = _step2$value[0],
            building = _step2$value[1];
          var buildingPos = building.position;
          // Buildings are larger, so check a wider area
          if (Math.abs(buildingPos.x - gridPos.x) < 1.5 && Math.abs(buildingPos.y - gridPos.y) < 1.5) {
            return building;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return null;
    }

    /**
     * Update input state
     */
  }, {
    key: "update",
    value: function update() {
      // Update camera based on keys
      this.updateCameraFromKeys();
    }

    /**
     * Get current selection box
     * @returns {Object|null} Selection box or null if not dragging
     */
  }, {
    key: "getSelectionBox",
    value: function getSelectionBox() {
      return this.selectionBox;
    }

    /**
     * Disable input handling
     */
  }, {
    key: "disableInput",
    value: function disableInput() {
      this.inputEnabled = false;
    }

    /**
     * Enable input handling
     */
  }, {
    key: "enableInput",
    value: function enableInput() {
      this.inputEnabled = true;
    }
  }]);
}();


/***/ }),

/***/ "./src/game/RendererColyseus.js":
/*!**************************************!*\
  !*** ./src/game/RendererColyseus.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Renderer: () => (/* binding */ Renderer)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Handles all rendering operations for the game with Colyseus integration
 */
var Renderer = /*#__PURE__*/function () {
  /**
   * Initialize the renderer
   * @param {HTMLCanvasElement} canvas - The canvas element to render on
   */
  function Renderer(canvas) {
    var _this = this;
    _classCallCheck(this, Renderer);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Isometric tile dimensions
    this.tileWidth = 64;
    this.tileHeight = 32;

    // Camera position and zoom
    this.cameraX = 0;
    this.cameraY = 0;
    this.zoom = 1;

    // Colors
    this.colors = {
      // Tile colors
      tile: '#8fbc8f',
      tileOutline: '#2e8b57',
      // Entity colors
      humanHero: '#0000ff',
      humanUnit: '#4169e1',
      humanBuilding: '#4682b4',
      aiHero: '#ff0000',
      aiUnit: '#ff4500',
      aiBuilding: '#8b0000',
      // Selection color
      selection: '#ffff00'
    };

    // Set canvas size
    this.handleResize();

    // Listen for window resize
    window.addEventListener('resize', function () {
      return _this.handleResize();
    });
  }

  /**
   * Clear the canvas
   */
  return _createClass(Renderer, [{
    key: "clear",
    value: function clear() {
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Handle window resize
     */
  }, {
    key: "handleResize",
    value: function handleResize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    /**
     * Convert grid coordinates to screen coordinates
     * @param {number} x - Grid x coordinate
     * @param {number} y - Grid y coordinate
     * @returns {Object} Screen coordinates {x, y}
     */
  }, {
    key: "gridToScreen",
    value: function gridToScreen(x, y) {
      // Isometric projection
      var screenX = (x - y) * this.tileWidth / 2;
      var screenY = (x + y) * this.tileHeight / 2;

      // Apply camera position and zoom
      return {
        x: (screenX - this.cameraX) * this.zoom + this.canvas.width / 2,
        y: (screenY - this.cameraY) * this.zoom + this.canvas.height / 2
      };
    }

    /**
     * Convert screen coordinates to grid coordinates
     * @param {number} screenX - Screen x coordinate
     * @param {number} screenY - Screen y coordinate
     * @returns {Object} Grid coordinates {x, y}
     */
  }, {
    key: "screenToGrid",
    value: function screenToGrid(screenX, screenY) {
      // Adjust for camera and zoom
      var adjustedX = (screenX - this.canvas.width / 2) / this.zoom + this.cameraX;
      var adjustedY = (screenY - this.canvas.height / 2) / this.zoom + this.cameraY;

      // Inverse isometric projection
      return {
        x: (adjustedX / (this.tileWidth / 2) + adjustedY / (this.tileHeight / 2)) / 2,
        y: (adjustedY / (this.tileHeight / 2) - adjustedX / (this.tileWidth / 2)) / 2
      };
    }

    /**
     * Render the map
     * @param {Array} map - Array of tile values
     */
  }, {
    key: "renderMap",
    value: function renderMap(map) {
      if (!map || !map.length) return;

      // Calculate map size (assuming square map)
      var mapSize = Math.sqrt(map.length);

      // Render tiles
      for (var y = 0; y < mapSize; y++) {
        for (var x = 0; x < mapSize; x++) {
          var index = y * mapSize + x;
          var tileType = map[index];
          this.renderTile(x, y, tileType);
        }
      }
    }

    /**
     * Render a single tile
     * @param {number} x - Grid x coordinate
     * @param {number} y - Grid y coordinate
     * @param {number} tileType - Type of tile
     */
  }, {
    key: "renderTile",
    value: function renderTile(x, y, tileType) {
      var screenPos = this.gridToScreen(x, y);

      // Draw tile
      this.drawIsometricTile(screenPos.x, screenPos.y, this.tileWidth * this.zoom, this.tileHeight * this.zoom, this.colors.tile);

      // Draw tile outline
      this.drawIsometricTileOutline(screenPos.x, screenPos.y, this.tileWidth * this.zoom, this.tileHeight * this.zoom, this.colors.tileOutline);
    }

    /**
     * Draw an isometric tile
     * @param {number} x - Screen x coordinate of tile center
     * @param {number} y - Screen y coordinate of tile center
     * @param {number} width - Tile width
     * @param {number} height - Tile height
     * @param {string} color - Tile color
     */
  }, {
    key: "drawIsometricTile",
    value: function drawIsometricTile(x, y, width, height, color) {
      var halfWidth = width / 2;
      var halfHeight = height / 2;
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y - halfHeight); // Top
      this.ctx.lineTo(x + halfWidth, y); // Right
      this.ctx.lineTo(x, y + halfHeight); // Bottom
      this.ctx.lineTo(x - halfWidth, y); // Left
      this.ctx.closePath();
      this.ctx.fill();
    }

    /**
     * Draw an isometric tile outline
     * @param {number} x - Screen x coordinate of tile center
     * @param {number} y - Screen y coordinate of tile center
     * @param {number} width - Tile width
     * @param {number} height - Tile height
     * @param {string} color - Outline color
     */
  }, {
    key: "drawIsometricTileOutline",
    value: function drawIsometricTileOutline(x, y, width, height, color) {
      var halfWidth = width / 2;
      var halfHeight = height / 2;
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y - halfHeight); // Top
      this.ctx.lineTo(x + halfWidth, y); // Right
      this.ctx.lineTo(x, y + halfHeight); // Bottom
      this.ctx.lineTo(x - halfWidth, y); // Left
      this.ctx.closePath();
      this.ctx.stroke();
    }

    /**
     * Render a hero
     * @param {Object} hero - Hero object
     * @param {boolean} isCurrentPlayer - Whether this hero belongs to the current player
     */
  }, {
    key: "renderHero",
    value: function renderHero(hero, isCurrentPlayer) {
      if (!hero || !hero.position) return;
      var screenPos = this.gridToScreen(hero.position.x, hero.position.y);
      var color = hero.owner === 'ai' ? this.colors.aiHero : this.colors.humanHero;

      // Draw hero as a circle
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(screenPos.x, screenPos.y, this.tileWidth * 0.3 * this.zoom, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw outline for current player's hero
      if (isCurrentPlayer) {
        this.ctx.strokeStyle = this.colors.selection;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(screenPos.x, screenPos.y, this.tileWidth * 0.35 * this.zoom, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      // Draw health bar
      this.renderHealthBar(screenPos.x, screenPos.y - this.tileHeight * 0.5 * this.zoom, this.tileWidth * 0.6 * this.zoom, this.tileHeight * 0.1 * this.zoom, hero.health / 100);
    }

    /**
     * Render a unit
     * @param {Object} unit - Unit object
     */
  }, {
    key: "renderUnit",
    value: function renderUnit(unit) {
      if (!unit || !unit.position) return;
      var screenPos = this.gridToScreen(unit.position.x, unit.position.y);
      var color = unit.owner === 'ai' ? this.colors.aiUnit : this.colors.humanUnit;

      // Draw unit as a small square
      this.ctx.fillStyle = color;
      this.ctx.fillRect(screenPos.x - this.tileWidth * 0.2 * this.zoom, screenPos.y - this.tileHeight * 0.2 * this.zoom, this.tileWidth * 0.4 * this.zoom, this.tileHeight * 0.4 * this.zoom);

      // Draw health bar
      this.renderHealthBar(screenPos.x, screenPos.y - this.tileHeight * 0.3 * this.zoom, this.tileWidth * 0.4 * this.zoom, this.tileHeight * 0.1 * this.zoom, unit.health / 50);
    }

    /**
     * Render a building
     * @param {Object} building - Building object
     */
  }, {
    key: "renderBuilding",
    value: function renderBuilding(building) {
      if (!building || !building.position) return;
      var screenPos = this.gridToScreen(building.position.x, building.position.y);
      var color = building.owner === 'ai' ? this.colors.aiBuilding : this.colors.humanBuilding;

      // Draw building as a larger diamond
      this.drawIsometricTile(screenPos.x, screenPos.y, this.tileWidth * 1.5 * this.zoom, this.tileHeight * 1.5 * this.zoom, color);

      // Draw building outline
      this.drawIsometricTileOutline(screenPos.x, screenPos.y, this.tileWidth * 1.5 * this.zoom, this.tileHeight * 1.5 * this.zoom, this.darkenColor(color, 0.5));

      // Draw health bar
      this.renderHealthBar(screenPos.x, screenPos.y - this.tileHeight * 0.8 * this.zoom, this.tileWidth * 0.8 * this.zoom, this.tileHeight * 0.1 * this.zoom, building.health / 200);

      // Draw build progress if not complete
      if (!building.isComplete) {
        this.renderBuildProgress(screenPos.x, screenPos.y - this.tileHeight * 0.6 * this.zoom, this.tileWidth * 0.8 * this.zoom, this.tileHeight * 0.1 * this.zoom, building.buildProgress / 100);
      }
    }

    /**
     * Render a health bar
     * @param {number} x - Screen x coordinate
     * @param {number} y - Screen y coordinate
     * @param {number} width - Bar width
     * @param {number} height - Bar height
     * @param {number} percentage - Health percentage (0-1)
     */
  }, {
    key: "renderHealthBar",
    value: function renderHealthBar(x, y, width, height, percentage) {
      // Clamp percentage to 0-1
      percentage = Math.max(0, Math.min(1, percentage));

      // Bar background
      this.ctx.fillStyle = '#333333';
      this.ctx.fillRect(x - width / 2, y - height / 2, width, height);

      // Health bar color based on percentage
      var color;
      if (percentage > 0.6) {
        color = '#00ff00'; // Green
      } else if (percentage > 0.3) {
        color = '#ffff00'; // Yellow
      } else {
        color = '#ff0000'; // Red
      }

      // Health bar
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x - width / 2, y - height / 2, width * percentage, height);

      // Outline
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x - width / 2, y - height / 2, width, height);
    }

    /**
     * Render a build progress bar
     * @param {number} x - Screen x coordinate
     * @param {number} y - Screen y coordinate
     * @param {number} width - Bar width
     * @param {number} height - Bar height
     * @param {number} percentage - Progress percentage (0-1)
     */
  }, {
    key: "renderBuildProgress",
    value: function renderBuildProgress(x, y, width, height, percentage) {
      // Clamp percentage to 0-1
      percentage = Math.max(0, Math.min(1, percentage));

      // Bar background
      this.ctx.fillStyle = '#333333';
      this.ctx.fillRect(x - width / 2, y - height / 2, width, height);

      // Progress bar
      this.ctx.fillStyle = '#0088ff';
      this.ctx.fillRect(x - width / 2, y - height / 2, width * percentage, height);

      // Outline
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x - width / 2, y - height / 2, width, height);
    }

    /**
     * Render a selection highlight
     * @param {Object} entity - The selected entity
     */
  }, {
    key: "renderSelection",
    value: function renderSelection(entity) {
      if (!entity || !entity.position) return;
      var screenPos = this.gridToScreen(entity.position.x, entity.position.y);
      this.ctx.strokeStyle = this.colors.selection;
      this.ctx.lineWidth = 2;
      if (entity.type === 'hero') {
        // Highlight hero with a circle
        this.ctx.beginPath();
        this.ctx.arc(screenPos.x, screenPos.y, this.tileWidth * 0.35 * this.zoom, 0, Math.PI * 2);
        this.ctx.stroke();
      } else if (entity.type === 'unit') {
        // Highlight unit with a square
        this.ctx.strokeRect(screenPos.x - this.tileWidth * 0.25 * this.zoom, screenPos.y - this.tileHeight * 0.25 * this.zoom, this.tileWidth * 0.5 * this.zoom, this.tileHeight * 0.5 * this.zoom);
      } else {
        // Highlight building with a diamond
        var halfWidth = this.tileWidth * 0.75 * this.zoom;
        var halfHeight = this.tileHeight * 0.75 * this.zoom;
        this.ctx.beginPath();
        this.ctx.moveTo(screenPos.x, screenPos.y - halfHeight);
        this.ctx.lineTo(screenPos.x + halfWidth, screenPos.y);
        this.ctx.lineTo(screenPos.x, screenPos.y + halfHeight);
        this.ctx.lineTo(screenPos.x - halfWidth, screenPos.y);
        this.ctx.closePath();
        this.ctx.stroke();
      }
    }

    /**
     * Darken a color by a factor
     * @param {string} color - CSS color string
     * @param {number} factor - Darken factor (0-1)
     * @returns {string} Darkened color
     */
  }, {
    key: "darkenColor",
    value: function darkenColor(color, factor) {
      // Simple darkening for hex colors
      if (color.startsWith('#')) {
        var r = parseInt(color.substr(1, 2), 16);
        var g = parseInt(color.substr(3, 2), 16);
        var b = parseInt(color.substr(5, 2), 16);
        r = Math.floor(r * (1 - factor));
        g = Math.floor(g * (1 - factor));
        b = Math.floor(b * (1 - factor));
        return "#".concat(r.toString(16).padStart(2, '0')).concat(g.toString(16).padStart(2, '0')).concat(b.toString(16).padStart(2, '0'));
      }
      return color;
    }

    /**
     * Move the camera
     * @param {number} x - New x position
     * @param {number} y - New y position
     */
  }, {
    key: "moveCamera",
    value: function moveCamera(x, y) {
      this.cameraX = x;
      this.cameraY = y;
    }

    /**
     * Pan the camera
     * @param {number} dx - Change in x
     * @param {number} dy - Change in y
     */
  }, {
    key: "panCamera",
    value: function panCamera(dx, dy) {
      this.cameraX += dx / this.zoom;
      this.cameraY += dy / this.zoom;
    }

    /**
     * Set camera zoom
     * @param {number} zoom - New zoom level
     */
  }, {
    key: "setZoom",
    value: function setZoom(zoom) {
      this.zoom = Math.max(0.5, Math.min(2, zoom));
    }

    /**
     * Adjust camera zoom
     * @param {number} delta - Change in zoom
     */
  }, {
    key: "adjustZoom",
    value: function adjustZoom(delta) {
      this.zoom = Math.max(0.5, Math.min(2, this.zoom + delta));
    }
  }]);
}();


/***/ }),

/***/ "./src/game/UIManager.js":
/*!*******************************!*\
  !*** ./src/game/UIManager.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UIManager: () => (/* binding */ UIManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Manages all UI elements and interactions
 */
var UIManager = /*#__PURE__*/function () {
  /**
   * Initialize the UI manager
   * @param {Game} game - The main game instance
   */
  function UIManager(game) {
    _classCallCheck(this, UIManager);
    this.game = game;

    // UI elements
    this.notification = null;
    this.notificationTimeout = null;

    // UI containers
    this.resourcesElement = document.getElementById('resources-container');
    this.selectionInfoElement = document.getElementById('selection-info');
    this.notificationElement = document.getElementById('notification');
    this.gameOverElement = document.getElementById('game-over');

    // Create UI containers if they don't exist
    this.createUIContainers();

    // Hide game over screen initially
    if (this.gameOverElement) {
      this.gameOverElement.style.display = 'none';
    }
  }

  /**
   * Create UI containers if they don't exist
   */
  return _createClass(UIManager, [{
    key: "createUIContainers",
    value: function createUIContainers() {
      // Create resources container
      if (!this.resourcesElement) {
        this.resourcesElement = document.createElement('div');
        this.resourcesElement.id = 'resources-container';
        this.resourcesElement.className = 'ui-container';
        document.body.appendChild(this.resourcesElement);
      }

      // Create selection info container
      if (!this.selectionInfoElement) {
        this.selectionInfoElement = document.createElement('div');
        this.selectionInfoElement.id = 'selection-info';
        this.selectionInfoElement.className = 'ui-container';
        document.body.appendChild(this.selectionInfoElement);
      }

      // Create notification container
      if (!this.notificationElement) {
        this.notificationElement = document.createElement('div');
        this.notificationElement.id = 'notification';
        this.notificationElement.className = 'ui-notification';
        document.body.appendChild(this.notificationElement);
      }

      // Create game over container
      if (!this.gameOverElement) {
        this.gameOverElement = document.createElement('div');
        this.gameOverElement.id = 'game-over';
        this.gameOverElement.className = 'ui-game-over';
        document.body.appendChild(this.gameOverElement);
      }
    }

    /**
     * Update UI elements based on game state
     */
  }, {
    key: "update",
    value: function update() {
      // Update resources display
      this.updateResourcesDisplay();

      // Update selection info
      this.updateSelectionInfo(this.game.selectedEntities);

      // Update game time
      this.updateGameTime();
    }

    /**
     * Update resources display
     */
  }, {
    key: "updateResourcesDisplay",
    value: function updateResourcesDisplay() {
      if (!this.resourcesElement) return;

      // Get current player's resources
      var playerData = this.game.players.get(this.game.playerId);
      if (!playerData || !playerData.resources) return;

      // Update resources display
      this.resourcesElement.innerHTML = "\n      <div class=\"resource-item\">Wood: ".concat(playerData.resources.wood, "</div>\n      <div class=\"resource-item\">Stone: ").concat(playerData.resources.stone, "</div>\n      <div class=\"resource-item\">Food: ").concat(playerData.resources.food, "</div>\n    ");
    }

    /**
     * Update selection info display
     * @param {Array} selectedEntities - Array of selected entities
     */
  }, {
    key: "updateSelectionInfo",
    value: function updateSelectionInfo(selectedEntities) {
      var _this = this;
      if (!this.selectionInfoElement) return;

      // Clear selection info
      this.selectionInfoElement.innerHTML = '';

      // If no entities selected, show message
      if (!selectedEntities || selectedEntities.length === 0) {
        this.selectionInfoElement.innerHTML = '<div class="selection-empty">No selection</div>';
        return;
      }

      // Show info for each selected entity
      selectedEntities.forEach(function (entity) {
        var infoHTML = '';
        if (entity.type === 'hero') {
          infoHTML = "\n          <div class=\"selection-header\">Hero</div>\n          <div class=\"selection-stats\">Health: ".concat(entity.health, "/100</div>\n        ");
        } else if (entity.type === 'unit') {
          infoHTML = "\n          <div class=\"selection-header\">Unit: ".concat(entity.type, "</div>\n          <div class=\"selection-stats\">Health: ").concat(entity.health, "/50</div>\n        ");
        } else if (entity.type) {
          infoHTML = "\n          <div class=\"selection-header\">Building: ".concat(entity.type, "</div>\n          <div class=\"selection-stats\">Health: ").concat(entity.health, "/200</div>\n          <div class=\"selection-stats\">Build Progress: ").concat(entity.isComplete ? 'Complete' : Math.floor(entity.buildProgress) + '%', "</div>\n        ");
        }

        // Add actions based on entity type
        if (entity.type === 'barracks' && entity.isComplete) {
          infoHTML += "\n          <div class=\"selection-actions\">\n            <button onclick=\"window.gameInstance.hireUnit('grunt', '".concat(entity.id, "')\">Hire Grunt</button>\n            <button onclick=\"window.gameInstance.hireUnit('scout', '").concat(entity.id, "')\">Hire Scout</button>\n          </div>\n        ");
        } else if (entity.type === 'factory' && entity.isComplete) {
          infoHTML += "\n          <div class=\"selection-actions\">\n            <button onclick=\"window.gameInstance.hireUnit('tank', '".concat(entity.id, "')\">Hire Tank</button>\n          </div>\n        ");
        }

        // Create and append selection info element
        var selectionElement = document.createElement('div');
        selectionElement.className = 'selection-entity';
        selectionElement.innerHTML = infoHTML;
        _this.selectionInfoElement.appendChild(selectionElement);
      });
    }

    /**
     * Update game time display
     */
  }, {
    key: "updateGameTime",
    value: function updateGameTime() {
      // Get time element or create it
      var timeElement = document.getElementById('game-time');
      if (!timeElement) {
        timeElement = document.createElement('div');
        timeElement.id = 'game-time';
        timeElement.className = 'ui-game-time';
        document.body.appendChild(timeElement);
      }

      // Convert seconds to minutes and seconds
      var minutes = Math.floor(this.game.gameTime / 60);
      var seconds = this.game.gameTime % 60;

      // Format time as MM:SS
      var formattedTime = "".concat(minutes.toString().padStart(2, '0'), ":").concat(seconds.toString().padStart(2, '0'));

      // Update time display
      timeElement.textContent = formattedTime;
    }

    /**
     * Show a notification message
     * @param {string} message - The message to show
     * @param {number} duration - Duration in milliseconds to show the notification
     */
  }, {
    key: "showNotification",
    value: function showNotification(message) {
      var _this2 = this;
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
      if (!this.notificationElement) return;

      // Clear any existing timeout
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
      }

      // Show notification
      this.notificationElement.textContent = message;
      this.notificationElement.style.display = 'block';

      // Hide notification after duration
      this.notificationTimeout = setTimeout(function () {
        _this2.notificationElement.style.display = 'none';
      }, duration);
    }

    /**
     * Show game over screen
     * @param {Object} data - Game over data including winner and stats
     */
  }, {
    key: "showGameOver",
    value: function showGameOver(data) {
      if (!this.gameOverElement) return;

      // Create game over content
      var content = '';
      if (data.winner === 'human') {
        content = "\n        <h2>Victory!</h2>\n        <p>Humans have defeated the AI!</p>\n      ";
      } else if (data.winner === 'ai') {
        content = "\n        <h2>Defeat!</h2>\n        <p>The AI has overwhelmed the humans!</p>\n      ";
      } else {
        content = "\n        <h2>Draw!</h2>\n        <p>Time has run out with no clear winner.</p>\n      ";
      }

      // Add stats
      content += "\n      <div class=\"game-stats\">\n        <div>Game Time: ".concat(Math.floor(data.gameTime / 60), ":").concat((data.gameTime % 60).toString().padStart(2, '0'), "</div>\n        <div>Human Base Health: ").concat(data.humanBaseHealth, "/1000</div>\n        <div>AI Base Health: ").concat(data.aiBaseHealth, "/1000</div>\n      </div>\n      <button id=\"play-again\">Play Again</button>\n    ");

      // Set content and show game over screen
      this.gameOverElement.innerHTML = content;
      this.gameOverElement.style.display = 'flex';

      // Add play again button listener
      var playAgainButton = document.getElementById('play-again');
      if (playAgainButton) {
        playAgainButton.addEventListener('click', function () {
          // Reload the page to start a new game
          window.location.reload();
        });
      }
    }
  }]);
}();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var colyseus_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! colyseus.js */ "./node_modules/colyseus.js/build/cjs/index.js");
/* harmony import */ var _game_RendererColyseus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game/RendererColyseus */ "./src/game/RendererColyseus.js");
/* harmony import */ var _game_InputHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game/InputHandler */ "./src/game/InputHandler.js");
/* harmony import */ var _game_UIManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./game/UIManager */ "./src/game/UIManager.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





// Create a global game instance
window.gameInstance = null;

// Initialize the game when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Create game instance
  window.gameInstance = new Game();

  // Start the game
  window.gameInstance.start();
});

// Game class
var Game = /*#__PURE__*/function () {
  function Game() {
    _classCallCheck(this, Game);
    console.log("Initializing game...");

    // Colyseus client
    this.client = new colyseus_js__WEBPACK_IMPORTED_MODULE_0__.Client("ws://localhost:2567");
    this.room = null;

    // Game components
    this.renderer = null;
    this.inputHandler = null;
    this.uiManager = null;

    // Game state
    this.playerId = null;
    this.players = new Map();
    this.buildings = new Map();
    this.units = new Map();
    this.map = [];
    this.humanBaseHealth = 1000;
    this.aiBaseHealth = 1000;
    this.gameTime = 0;

    // Selected entities
    this.selectedEntities = [];
  }
  return _createClass(Game, [{
    key: "start",
    value: function () {
      var _start = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              console.log("Starting game...");
              _context.prev = 1;
              // Initialize game components
              this.renderer = new _game_RendererColyseus__WEBPACK_IMPORTED_MODULE_1__.Renderer(document.getElementById("game-canvas"));
              this.inputHandler = new _game_InputHandler__WEBPACK_IMPORTED_MODULE_2__.InputHandler(this);
              this.uiManager = new _game_UIManager__WEBPACK_IMPORTED_MODULE_3__.UIManager(this);

              // Connect to Colyseus server
              _context.next = 7;
              return this.connectToServer();
            case 7:
              // Start game loop
              this.gameLoop();
              _context.next = 13;
              break;
            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](1);
              console.error("Error starting game:", _context.t0);
            case 13:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[1, 10]]);
      }));
      function start() {
        return _start.apply(this, arguments);
      }
      return start;
    }()
  }, {
    key: "connectToServer",
    value: function () {
      var _connectToServer = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              console.log("Connecting to server...");

              // Join or create a game room
              _context2.next = 4;
              return this.client.joinOrCreate("game_room");
            case 4:
              this.room = _context2.sent;
              // Store player ID
              this.playerId = this.room.sessionId;
              console.log("Connected to server with ID:", this.playerId);

              // Set up state change listeners
              this.setupStateListeners();

              // Set up other room listeners
              this.setupRoomListeners();
              return _context2.abrupt("return", true);
            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](0);
              console.error("Failed to connect to server:", _context2.t0);
              return _context2.abrupt("return", false);
            case 16:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[0, 12]]);
      }));
      function connectToServer() {
        return _connectToServer.apply(this, arguments);
      }
      return connectToServer;
    }()
  }, {
    key: "setupStateListeners",
    value: function setupStateListeners() {
      var _this = this;
      // Listen for game state changes
      this.room.onStateChange(function (state) {
        // Update local game state from server state
        _this.updateGameState(state);
      });
    }
  }, {
    key: "setupRoomListeners",
    value: function setupRoomListeners() {
      var _this2 = this;
      // Player joined
      this.room.onMessage("player_joined", function (message) {
        console.log("Player joined:", message.id);
        // Update UI accordingly
        _this2.uiManager.showNotification("Player ".concat(message.id, " joined the game."));
      });

      // Player left
      this.room.onMessage("player_left", function (message) {
        console.log("Player left:", message.id);
        // Update UI accordingly
        _this2.uiManager.showNotification("Player ".concat(message.id, " left the game."));
      });

      // Game over
      this.room.onMessage("game_over", function (message) {
        console.log("Game over!", message);
        // Show game over screen
        _this2.uiManager.showGameOver(message);
      });
    }
  }, {
    key: "updateGameState",
    value: function updateGameState(state) {
      var _this3 = this;
      // Update players
      this.players.clear();
      state.players.forEach(function (playerData, id) {
        _this3.players.set(id, playerData);
      });

      // Update buildings
      this.buildings.clear();
      state.buildings.forEach(function (building, id) {
        _this3.buildings.set(id, building);
      });

      // Update units
      this.units.clear();
      state.units.forEach(function (unit, id) {
        _this3.units.set(id, unit);
      });

      // Update map if it has changed
      if (state.map.length !== this.map.length) {
        this.map = Array.from(state.map);
      }

      // Update base health
      this.humanBaseHealth = state.humanBaseHealth;
      this.aiBaseHealth = state.aiBaseHealth;

      // Update game time
      this.gameTime = state.gameTime;
    }
  }, {
    key: "gameLoop",
    value: function gameLoop() {
      var _this4 = this;
      // Render the game
      this.render();

      // Update UI
      this.uiManager.update();

      // Request next frame
      requestAnimationFrame(function () {
        return _this4.gameLoop();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;
      // Clear canvas
      this.renderer.clear();

      // Render map
      this.renderer.renderMap(this.map);

      // Render buildings
      this.buildings.forEach(function (building) {
        _this5.renderer.renderBuilding(building);
      });

      // Render units
      this.units.forEach(function (unit) {
        _this5.renderer.renderUnit(unit);
      });

      // Render heroes
      this.players.forEach(function (playerData) {
        if (playerData.hero) {
          _this5.renderer.renderHero(playerData.hero, playerData.id === _this5.playerId);
        }
      });

      // Render selection highlight
      this.selectedEntities.forEach(function (entity) {
        _this5.renderer.renderSelection(entity);
      });
    }

    // Game actions
  }, {
    key: "moveHero",
    value: function moveHero(x, y) {
      // Send move hero message to server
      this.room.send("move_hero", {
        x: x,
        y: y
      });
    }
  }, {
    key: "moveUnit",
    value: function moveUnit(unitId, x, y) {
      // Send move unit message to server
      this.room.send("move_unit", {
        unitId: unitId,
        x: x,
        y: y
      });
    }
  }, {
    key: "attack",
    value: function attack(unitId, targetId) {
      // Send attack message to server
      this.room.send("attack", {
        unitId: unitId,
        targetId: targetId
      });
    }
  }, {
    key: "buildStructure",
    value: function buildStructure(buildingType, x, y) {
      // Send build message to server
      this.room.send("build", {
        buildingType: buildingType,
        x: x,
        y: y
      });
    }
  }, {
    key: "hireUnit",
    value: function hireUnit(unitType, buildingId) {
      // Send hire unit message to server
      this.room.send("hire_unit", {
        unitType: unitType,
        buildingId: buildingId
      });
    }
  }, {
    key: "selectEntity",
    value: function selectEntity(entity) {
      // Clear previous selection
      this.selectedEntities = [];

      // Add new selection
      if (entity) {
        this.selectedEntities.push(entity);
      }

      // Update UI with selected entity info
      this.uiManager.updateSelectionInfo(this.selectedEntities);
    }
  }, {
    key: "selectMultipleEntities",
    value: function selectMultipleEntities(entities) {
      // Clear previous selection
      this.selectedEntities = [];

      // Add new selections
      this.selectedEntities = _toConsumableArray(entities);

      // Update UI with selected entities info
      this.uiManager.updateSelectionInfo(this.selectedEntities);
    }
  }]);
}();

})();

/******/ })()
;
//# sourceMappingURL=client.bundle.js.map