/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@colyseus/schema/build/umd/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@colyseus/schema/build/umd/index.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
     true ? factory(exports) :
    0;
})(this, (function (exports) { 'use strict';

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
    /* global Reflect, Promise, SuppressedError, Symbol */

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

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
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

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    // export const SWITCH_TO_STRUCTURE = 193; (easily collides with DELETE_AND_ADD + fieldIndex = 2)
    var SWITCH_TO_STRUCTURE = 255; // (decoding collides with DELETE_AND_ADD + fieldIndex = 63)
    var TYPE_ID = 213;
    /**
     * Encoding Schema field operations.
     */
    exports.OPERATION = void 0;
    (function (OPERATION) {
        // add new structure/primitive
        OPERATION[OPERATION["ADD"] = 128] = "ADD";
        // replace structure/primitive
        OPERATION[OPERATION["REPLACE"] = 0] = "REPLACE";
        // delete field
        OPERATION[OPERATION["DELETE"] = 64] = "DELETE";
        // DELETE field, followed by an ADD
        OPERATION[OPERATION["DELETE_AND_ADD"] = 192] = "DELETE_AND_ADD";
        // TOUCH is used to determine hierarchy of nested Schema structures during serialization.
        // touches are NOT encoded.
        OPERATION[OPERATION["TOUCH"] = 1] = "TOUCH";
        // MapSchema Operations
        OPERATION[OPERATION["CLEAR"] = 10] = "CLEAR";
    })(exports.OPERATION || (exports.OPERATION = {}));
    // export enum OPERATION {
    //     // add new structure/primitive
    //     // (128)
    //     ADD = 128, // 10000000,
    //     // replace structure/primitive
    //     REPLACE = 1,// 00000001
    //     // delete field
    //     DELETE = 192, // 11000000
    //     // DELETE field, followed by an ADD
    //     DELETE_AND_ADD = 224, // 11100000
    //     // TOUCH is used to determine hierarchy of nested Schema structures during serialization.
    //     // touches are NOT encoded.
    //     TOUCH = 0, // 00000000
    //     // MapSchema Operations
    //     CLEAR = 10,
    // }

    var ChangeTree = /** @class */ (function () {
        function ChangeTree(ref, parent, root) {
            this.changed = false;
            this.changes = new Map();
            this.allChanges = new Set();
            // cached indexes for filtering
            this.caches = {};
            this.currentCustomOperation = 0;
            this.ref = ref;
            this.setParent(parent, root);
        }
        ChangeTree.prototype.setParent = function (parent, root, parentIndex) {
            var _this = this;
            if (!this.indexes) {
                this.indexes = (this.ref instanceof Schema)
                    ? this.ref['_definition'].indexes
                    : {};
            }
            this.parent = parent;
            this.parentIndex = parentIndex;
            // avoid setting parents with empty `root`
            if (!root) {
                return;
            }
            this.root = root;
            //
            // assign same parent on child structures
            //
            if (this.ref instanceof Schema) {
                var definition = this.ref['_definition'];
                for (var field in definition.schema) {
                    var value = this.ref[field];
                    if (value && value['$changes']) {
                        var parentIndex_1 = definition.indexes[field];
                        value['$changes'].setParent(this.ref, root, parentIndex_1);
                    }
                }
            }
            else if (typeof (this.ref) === "object") {
                this.ref.forEach(function (value, key) {
                    if (value instanceof Schema) {
                        var changeTreee = value['$changes'];
                        var parentIndex_2 = _this.ref['$changes'].indexes[key];
                        changeTreee.setParent(_this.ref, _this.root, parentIndex_2);
                    }
                });
            }
        };
        ChangeTree.prototype.operation = function (op) {
            this.changes.set(--this.currentCustomOperation, op);
        };
        ChangeTree.prototype.change = function (fieldName, operation) {
            if (operation === void 0) { operation = exports.OPERATION.ADD; }
            var index = (typeof (fieldName) === "number")
                ? fieldName
                : this.indexes[fieldName];
            this.assertValidIndex(index, fieldName);
            var previousChange = this.changes.get(index);
            if (!previousChange ||
                previousChange.op === exports.OPERATION.DELETE ||
                previousChange.op === exports.OPERATION.TOUCH // (mazmorra.io's BattleAction issue)
            ) {
                this.changes.set(index, {
                    op: (!previousChange)
                        ? operation
                        : (previousChange.op === exports.OPERATION.DELETE)
                            ? exports.OPERATION.DELETE_AND_ADD
                            : operation,
                    // : OPERATION.REPLACE,
                    index: index
                });
            }
            this.allChanges.add(index);
            this.changed = true;
            this.touchParents();
        };
        ChangeTree.prototype.touch = function (fieldName) {
            var index = (typeof (fieldName) === "number")
                ? fieldName
                : this.indexes[fieldName];
            this.assertValidIndex(index, fieldName);
            if (!this.changes.has(index)) {
                this.changes.set(index, { op: exports.OPERATION.TOUCH, index: index });
            }
            this.allChanges.add(index);
            // ensure touch is placed until the $root is found.
            this.touchParents();
        };
        ChangeTree.prototype.touchParents = function () {
            if (this.parent) {
                this.parent['$changes'].touch(this.parentIndex);
            }
        };
        ChangeTree.prototype.getType = function (index) {
            if (this.ref['_definition']) {
                var definition = this.ref['_definition'];
                return definition.schema[definition.fieldsByIndex[index]];
            }
            else {
                var definition = this.parent['_definition'];
                var parentType = definition.schema[definition.fieldsByIndex[this.parentIndex]];
                //
                // Get the child type from parent structure.
                // - ["string"] => "string"
                // - { map: "string" } => "string"
                // - { set: "string" } => "string"
                //
                return Object.values(parentType)[0];
            }
        };
        ChangeTree.prototype.getChildrenFilter = function () {
            var childFilters = this.parent['_definition'].childFilters;
            return childFilters && childFilters[this.parentIndex];
        };
        //
        // used during `.encode()`
        //
        ChangeTree.prototype.getValue = function (index) {
            return this.ref['getByIndex'](index);
        };
        ChangeTree.prototype.delete = function (fieldName) {
            var index = (typeof (fieldName) === "number")
                ? fieldName
                : this.indexes[fieldName];
            if (index === undefined) {
                console.warn("@colyseus/schema ".concat(this.ref.constructor.name, ": trying to delete non-existing index: ").concat(fieldName, " (").concat(index, ")"));
                return;
            }
            var previousValue = this.getValue(index);
            // console.log("$changes.delete =>", { fieldName, index, previousValue });
            this.changes.set(index, { op: exports.OPERATION.DELETE, index: index });
            this.allChanges.delete(index);
            // delete cache
            delete this.caches[index];
            // remove `root` reference
            if (previousValue && previousValue['$changes']) {
                previousValue['$changes'].parent = undefined;
            }
            this.changed = true;
            this.touchParents();
        };
        ChangeTree.prototype.discard = function (changed, discardAll) {
            var _this = this;
            if (changed === void 0) { changed = false; }
            if (discardAll === void 0) { discardAll = false; }
            //
            // Map, Array, etc:
            // Remove cached key to ensure ADD operations is unsed instead of
            // REPLACE in case same key is used on next patches.
            //
            // TODO: refactor this. this is not relevant for Collection and Set.
            //
            if (!(this.ref instanceof Schema)) {
                this.changes.forEach(function (change) {
                    if (change.op === exports.OPERATION.DELETE) {
                        var index = _this.ref['getIndex'](change.index);
                        delete _this.indexes[index];
                    }
                });
            }
            this.changes.clear();
            this.changed = changed;
            if (discardAll) {
                this.allChanges.clear();
            }
            // re-set `currentCustomOperation`
            this.currentCustomOperation = 0;
        };
        /**
         * Recursively discard all changes from this, and child structures.
         */
        ChangeTree.prototype.discardAll = function () {
            var _this = this;
            this.changes.forEach(function (change) {
                var value = _this.getValue(change.index);
                if (value && value['$changes']) {
                    value['$changes'].discardAll();
                }
            });
            this.discard();
        };
        // cache(field: number, beginIndex: number, endIndex: number) {
        ChangeTree.prototype.cache = function (field, cachedBytes) {
            this.caches[field] = cachedBytes;
        };
        ChangeTree.prototype.clone = function () {
            return new ChangeTree(this.ref, this.parent, this.root);
        };
        ChangeTree.prototype.ensureRefId = function () {
            // skip if refId is already set.
            if (this.refId !== undefined) {
                return;
            }
            this.refId = this.root.getNextUniqueId();
        };
        ChangeTree.prototype.assertValidIndex = function (index, fieldName) {
            if (index === undefined) {
                throw new Error("ChangeTree: missing index for field \"".concat(fieldName, "\""));
            }
        };
        return ChangeTree;
    }());

    function addCallback($callbacks, op, callback, existing) {
        // initialize list of callbacks
        if (!$callbacks[op]) {
            $callbacks[op] = [];
        }
        $callbacks[op].push(callback);
        //
        // Trigger callback for existing elements
        // - OPERATION.ADD
        // - OPERATION.REPLACE
        //
        existing === null || existing === void 0 ? void 0 : existing.forEach(function (item, key) { return callback(item, key); });
        return function () { return spliceOne($callbacks[op], $callbacks[op].indexOf(callback)); };
    }
    function removeChildRefs(changes) {
        var _this = this;
        var needRemoveRef = (typeof (this.$changes.getType()) !== "string");
        this.$items.forEach(function (item, key) {
            changes.push({
                refId: _this.$changes.refId,
                op: exports.OPERATION.DELETE,
                field: key,
                value: undefined,
                previousValue: item
            });
            if (needRemoveRef) {
                _this.$changes.root.removeRef(item['$changes'].refId);
            }
        });
    }
    function spliceOne(arr, index) {
        // manually splice an array
        if (index === -1 || index >= arr.length) {
            return false;
        }
        var len = arr.length - 1;
        for (var i = index; i < len; i++) {
            arr[i] = arr[i + 1];
        }
        arr.length = len;
        return true;
    }

    var DEFAULT_SORT = function (a, b) {
        var A = a.toString();
        var B = b.toString();
        if (A < B)
            return -1;
        else if (A > B)
            return 1;
        else
            return 0;
    };
    function getArrayProxy(value) {
        value['$proxy'] = true;
        //
        // compatibility with @colyseus/schema 0.5.x
        // - allow `map["key"]`
        // - allow `map["key"] = "xxx"`
        // - allow `delete map["key"]`
        //
        value = new Proxy(value, {
            get: function (obj, prop) {
                if (typeof (prop) !== "symbol" &&
                    !isNaN(prop) // https://stackoverflow.com/a/175787/892698
                ) {
                    return obj.at(prop);
                }
                else {
                    return obj[prop];
                }
            },
            set: function (obj, prop, setValue) {
                if (typeof (prop) !== "symbol" &&
                    !isNaN(prop)) {
                    var indexes = Array.from(obj['$items'].keys());
                    var key = parseInt(indexes[prop] || prop);
                    if (setValue === undefined || setValue === null) {
                        obj.deleteAt(key);
                    }
                    else {
                        obj.setAt(key, setValue);
                    }
                }
                else {
                    obj[prop] = setValue;
                }
                return true;
            },
            deleteProperty: function (obj, prop) {
                if (typeof (prop) === "number") {
                    obj.deleteAt(prop);
                }
                else {
                    delete obj[prop];
                }
                return true;
            },
            has: function (obj, key) {
                if (typeof (key) !== "symbol" &&
                    !isNaN(Number(key))) {
                    return obj['$items'].has(Number(key));
                }
                return Reflect.has(obj, key);
            }
        });
        return value;
    }
    var ArraySchema = /** @class */ (function () {
        function ArraySchema() {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            this.$changes = new ChangeTree(this);
            this.$items = new Map();
            this.$indexes = new Map();
            this.$refId = 0;
            this.push.apply(this, items);
        }
        ArraySchema.prototype.onAdd = function (callback, triggerAll) {
            if (triggerAll === void 0) { triggerAll = true; }
            return addCallback((this.$callbacks || (this.$callbacks = {})), exports.OPERATION.ADD, callback, (triggerAll)
                ? this.$items
                : undefined);
        };
        ArraySchema.prototype.onRemove = function (callback) { return addCallback(this.$callbacks || (this.$callbacks = {}), exports.OPERATION.DELETE, callback); };
        ArraySchema.prototype.onChange = function (callback) { return addCallback(this.$callbacks || (this.$callbacks = {}), exports.OPERATION.REPLACE, callback); };
        ArraySchema.is = function (type) {
            return (
            // type format: ["string"]
            Array.isArray(type) ||
                // type format: { array: "string" }
                (type['array'] !== undefined));
        };
        Object.defineProperty(ArraySchema.prototype, "length", {
            get: function () {
                return this.$items.size;
            },
            set: function (value) {
                if (value === 0) {
                    this.clear();
                }
                else {
                    this.splice(value, this.length - value);
                }
            },
            enumerable: false,
            configurable: true
        });
        ArraySchema.prototype.push = function () {
            var _this = this;
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            var lastIndex;
            values.forEach(function (value) {
                // set "index" for reference.
                lastIndex = _this.$refId++;
                _this.setAt(lastIndex, value);
            });
            return lastIndex;
        };
        /**
         * Removes the last element from an array and returns it.
         */
        ArraySchema.prototype.pop = function () {
            var key = Array.from(this.$indexes.values()).pop();
            if (key === undefined) {
                return undefined;
            }
            this.$changes.delete(key);
            this.$indexes.delete(key);
            var value = this.$items.get(key);
            this.$items.delete(key);
            return value;
        };
        ArraySchema.prototype.at = function (index) {
            //
            // FIXME: this should be O(1)
            //
            index = Math.trunc(index) || 0;
            // Allow negative indexing from the end
            if (index < 0)
                index += this.length;
            // OOB access is guaranteed to return undefined
            if (index < 0 || index >= this.length)
                return undefined;
            var key = Array.from(this.$items.keys())[index];
            return this.$items.get(key);
        };
        ArraySchema.prototype.setAt = function (index, value) {
            var _a, _b;
            if (value === undefined || value === null) {
                console.error("ArraySchema items cannot be null nor undefined; Use `deleteAt(index)` instead.");
                return;
            }
            // skip if the value is the same as cached.
            if (this.$items.get(index) === value) {
                return;
            }
            if (value['$changes'] !== undefined) {
                value['$changes'].setParent(this, this.$changes.root, index);
            }
            var operation = (_b = (_a = this.$changes.indexes[index]) === null || _a === void 0 ? void 0 : _a.op) !== null && _b !== void 0 ? _b : exports.OPERATION.ADD;
            this.$changes.indexes[index] = index;
            this.$indexes.set(index, index);
            this.$items.set(index, value);
            this.$changes.change(index, operation);
        };
        ArraySchema.prototype.deleteAt = function (index) {
            var key = Array.from(this.$items.keys())[index];
            if (key === undefined) {
                return false;
            }
            return this.$deleteAt(key);
        };
        ArraySchema.prototype.$deleteAt = function (index) {
            // delete at internal index
            this.$changes.delete(index);
            this.$indexes.delete(index);
            return this.$items.delete(index);
        };
        ArraySchema.prototype.clear = function (changes) {
            // discard previous operations.
            this.$changes.discard(true, true);
            this.$changes.indexes = {};
            // clear previous indexes
            this.$indexes.clear();
            //
            // When decoding:
            // - enqueue items for DELETE callback.
            // - flag child items for garbage collection.
            //
            if (changes) {
                removeChildRefs.call(this, changes);
            }
            // clear items
            this.$items.clear();
            this.$changes.operation({ index: 0, op: exports.OPERATION.CLEAR });
            // touch all structures until reach root
            this.$changes.touchParents();
        };
        /**
         * Combines two or more arrays.
         * @param items Additional items to add to the end of array1.
         */
        // @ts-ignore
        ArraySchema.prototype.concat = function () {
            var _a;
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            return new (ArraySchema.bind.apply(ArraySchema, __spreadArray([void 0], (_a = Array.from(this.$items.values())).concat.apply(_a, items), false)))();
        };
        /**
         * Adds all the elements of an array separated by the specified separator string.
         * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
         */
        ArraySchema.prototype.join = function (separator) {
            return Array.from(this.$items.values()).join(separator);
        };
        /**
         * Reverses the elements in an Array.
         */
        // @ts-ignore
        ArraySchema.prototype.reverse = function () {
            var _this = this;
            var indexes = Array.from(this.$items.keys());
            var reversedItems = Array.from(this.$items.values()).reverse();
            reversedItems.forEach(function (item, i) {
                _this.setAt(indexes[i], item);
            });
            return this;
        };
        /**
         * Removes the first element from an array and returns it.
         */
        ArraySchema.prototype.shift = function () {
            var indexes = Array.from(this.$items.keys());
            var shiftAt = indexes.shift();
            if (shiftAt === undefined) {
                return undefined;
            }
            var value = this.$items.get(shiftAt);
            this.$deleteAt(shiftAt);
            return value;
        };
        /**
         * Returns a section of an array.
         * @param start The beginning of the specified portion of the array.
         * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
         */
        ArraySchema.prototype.slice = function (start, end) {
            var sliced = new ArraySchema();
            sliced.push.apply(sliced, Array.from(this.$items.values()).slice(start, end));
            return sliced;
        };
        /**
         * Sorts an array.
         * @param compareFn Function used to determine the order of the elements. It is expected to return
         * a negative value if first argument is less than second argument, zero if they're equal and a positive
         * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
         * ```ts
         * [11,2,22,1].sort((a, b) => a - b)
         * ```
         */
        ArraySchema.prototype.sort = function (compareFn) {
            var _this = this;
            if (compareFn === void 0) { compareFn = DEFAULT_SORT; }
            var indexes = Array.from(this.$items.keys());
            var sortedItems = Array.from(this.$items.values()).sort(compareFn);
            sortedItems.forEach(function (item, i) {
                _this.setAt(indexes[i], item);
            });
            return this;
        };
        /**
         * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
         * @param start The zero-based location in the array from which to start removing elements.
         * @param deleteCount The number of elements to remove.
         * @param items Elements to insert into the array in place of the deleted elements.
         */
        ArraySchema.prototype.splice = function (start, deleteCount) {
            if (deleteCount === void 0) { deleteCount = this.length - start; }
            var items = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                items[_i - 2] = arguments[_i];
            }
            var indexes = Array.from(this.$items.keys());
            var removedItems = [];
            for (var i = start; i < start + deleteCount; i++) {
                removedItems.push(this.$items.get(indexes[i]));
                this.$deleteAt(indexes[i]);
            }
            for (var i = 0; i < items.length; i++) {
                this.setAt(start + i, items[i]);
            }
            return removedItems;
        };
        /**
         * Inserts new elements at the start of an array.
         * @param items  Elements to insert at the start of the Array.
         */
        ArraySchema.prototype.unshift = function () {
            var _this = this;
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            var length = this.length;
            var addedLength = items.length;
            // const indexes = Array.from(this.$items.keys());
            var previousValues = Array.from(this.$items.values());
            items.forEach(function (item, i) {
                _this.setAt(i, item);
            });
            previousValues.forEach(function (previousValue, i) {
                _this.setAt(addedLength + i, previousValue);
            });
            return length + addedLength;
        };
        /**
         * Returns the index of the first occurrence of a value in an array.
         * @param searchElement The value to locate in the array.
         * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
         */
        ArraySchema.prototype.indexOf = function (searchElement, fromIndex) {
            return Array.from(this.$items.values()).indexOf(searchElement, fromIndex);
        };
        /**
         * Returns the index of the last occurrence of a specified value in an array.
         * @param searchElement The value to locate in the array.
         * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
         */
        ArraySchema.prototype.lastIndexOf = function (searchElement, fromIndex) {
            if (fromIndex === void 0) { fromIndex = this.length - 1; }
            return Array.from(this.$items.values()).lastIndexOf(searchElement, fromIndex);
        };
        /**
         * Determines whether all the members of an array satisfy the specified test.
         * @param callbackfn A function that accepts up to three arguments. The every method calls
         * the callbackfn function for each element in the array until the callbackfn returns a value
         * which is coercible to the Boolean value false, or until the end of the array.
         * @param thisArg An object to which the this keyword can refer in the callbackfn function.
         * If thisArg is omitted, undefined is used as the this value.
         */
        ArraySchema.prototype.every = function (callbackfn, thisArg) {
            return Array.from(this.$items.values()).every(callbackfn, thisArg);
        };
        /**
         * Determines whether the specified callback function returns true for any element of an array.
         * @param callbackfn A function that accepts up to three arguments. The some method calls
         * the callbackfn function for each element in the array until the callbackfn returns a value
         * which is coercible to the Boolean value true, or until the end of the array.
         * @param thisArg An object to which the this keyword can refer in the callbackfn function.
         * If thisArg is omitted, undefined is used as the this value.
         */
        ArraySchema.prototype.some = function (callbackfn, thisArg) {
            return Array.from(this.$items.values()).some(callbackfn, thisArg);
        };
        /**
         * Performs the specified action for each element in an array.
         * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
         * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
         */
        ArraySchema.prototype.forEach = function (callbackfn, thisArg) {
            Array.from(this.$items.values()).forEach(callbackfn, thisArg);
        };
        /**
         * Calls a defined callback function on each element of an array, and returns an array that contains the results.
         * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
         * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
         */
        ArraySchema.prototype.map = function (callbackfn, thisArg) {
            return Array.from(this.$items.values()).map(callbackfn, thisArg);
        };
        ArraySchema.prototype.filter = function (callbackfn, thisArg) {
            return Array.from(this.$items.values()).filter(callbackfn, thisArg);
        };
        /**
         * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
         * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
         * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
         */
        ArraySchema.prototype.reduce = function (callbackfn, initialValue) {
            return Array.prototype.reduce.apply(Array.from(this.$items.values()), arguments);
        };
        /**
         * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
         * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
         * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
         */
        ArraySchema.prototype.reduceRight = function (callbackfn, initialValue) {
            return Array.prototype.reduceRight.apply(Array.from(this.$items.values()), arguments);
        };
        /**
         * Returns the value of the first element in the array where predicate is true, and undefined
         * otherwise.
         * @param predicate find calls predicate once for each element of the array, in ascending
         * order, until it finds one where predicate returns true. If such an element is found, find
         * immediately returns that element value. Otherwise, find returns undefined.
         * @param thisArg If provided, it will be used as the this value for each invocation of
         * predicate. If it is not provided, undefined is used instead.
         */
        ArraySchema.prototype.find = function (predicate, thisArg) {
            return Array.from(this.$items.values()).find(predicate, thisArg);
        };
        /**
         * Returns the index of the first element in the array where predicate is true, and -1
         * otherwise.
         * @param predicate find calls predicate once for each element of the array, in ascending
         * order, until it finds one where predicate returns true. If such an element is found,
         * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
         * @param thisArg If provided, it will be used as the this value for each invocation of
         * predicate. If it is not provided, undefined is used instead.
         */
        ArraySchema.prototype.findIndex = function (predicate, thisArg) {
            return Array.from(this.$items.values()).findIndex(predicate, thisArg);
        };
        /**
         * Returns the this object after filling the section identified by start and end with value
         * @param value value to fill array section with
         * @param start index to start filling the array at. If start is negative, it is treated as
         * length+start where length is the length of the array.
         * @param end index to stop filling the array at. If end is negative, it is treated as
         * length+end.
         */
        ArraySchema.prototype.fill = function (value, start, end) {
            //
            // TODO
            //
            throw new Error("ArraySchema#fill() not implemented");
        };
        /**
         * Returns the this object after copying a section of the array identified by start and end
         * to the same array starting at position target
         * @param target If target is negative, it is treated as length+target where length is the
         * length of the array.
         * @param start If start is negative, it is treated as length+start. If end is negative, it
         * is treated as length+end.
         * @param end If not specified, length of the this object is used as its default value.
         */
        ArraySchema.prototype.copyWithin = function (target, start, end) {
            //
            // TODO
            //
            throw new Error("ArraySchema#copyWithin() not implemented");
        };
        /**
         * Returns a string representation of an array.
         */
        ArraySchema.prototype.toString = function () { return this.$items.toString(); };
        /**
         * Returns a string representation of an array. The elements are converted to string using their toLocalString methods.
         */
        ArraySchema.prototype.toLocaleString = function () { return this.$items.toLocaleString(); };
        /** Iterator */
        ArraySchema.prototype[Symbol.iterator] = function () {
            return Array.from(this.$items.values())[Symbol.iterator]();
        };
        Object.defineProperty(ArraySchema, Symbol.species, {
            get: function () {
                return ArraySchema;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns an iterable of key, value pairs for every entry in the array
         */
        ArraySchema.prototype.entries = function () { return this.$items.entries(); };
        /**
         * Returns an iterable of keys in the array
         */
        ArraySchema.prototype.keys = function () { return this.$items.keys(); };
        /**
         * Returns an iterable of values in the array
         */
        ArraySchema.prototype.values = function () { return this.$items.values(); };
        /**
         * Determines whether an array includes a certain element, returning true or false as appropriate.
         * @param searchElement The element to search for.
         * @param fromIndex The position in this array at which to begin searching for searchElement.
         */
        ArraySchema.prototype.includes = function (searchElement, fromIndex) {
            return Array.from(this.$items.values()).includes(searchElement, fromIndex);
        };
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
        ArraySchema.prototype.flatMap = function (callback, thisArg) {
            // @ts-ignore
            throw new Error("ArraySchema#flatMap() is not supported.");
        };
        /**
         * Returns a new array with all sub-array elements concatenated into it recursively up to the
         * specified depth.
         *
         * @param depth The maximum recursion depth
         */
        // @ts-ignore
        ArraySchema.prototype.flat = function (depth) {
            throw new Error("ArraySchema#flat() is not supported.");
        };
        ArraySchema.prototype.findLast = function () {
            var arr = Array.from(this.$items.values());
            // @ts-ignore
            return arr.findLast.apply(arr, arguments);
        };
        ArraySchema.prototype.findLastIndex = function () {
            var arr = Array.from(this.$items.values());
            // @ts-ignore
            return arr.findLastIndex.apply(arr, arguments);
        };
        //
        // ES2023
        //
        ArraySchema.prototype.with = function (index, value) {
            var copy = Array.from(this.$items.values());
            copy[index] = value;
            return new (ArraySchema.bind.apply(ArraySchema, __spreadArray([void 0], copy, false)))();
        };
        ArraySchema.prototype.toReversed = function () {
            return Array.from(this.$items.values()).reverse();
        };
        ArraySchema.prototype.toSorted = function (compareFn) {
            return Array.from(this.$items.values()).sort(compareFn);
        };
        // @ts-ignore
        ArraySchema.prototype.toSpliced = function (start, deleteCount) {
            var copy = Array.from(this.$items.values());
            // @ts-ignore
            return copy.toSpliced.apply(copy, arguments);
        };
        ArraySchema.prototype.setIndex = function (index, key) {
            this.$indexes.set(index, key);
        };
        ArraySchema.prototype.getIndex = function (index) {
            return this.$indexes.get(index);
        };
        ArraySchema.prototype.getByIndex = function (index) {
            return this.$items.get(this.$indexes.get(index));
        };
        ArraySchema.prototype.deleteByIndex = function (index) {
            var key = this.$indexes.get(index);
            this.$items.delete(key);
            this.$indexes.delete(index);
        };
        ArraySchema.prototype.toArray = function () {
            return Array.from(this.$items.values());
        };
        ArraySchema.prototype.toJSON = function () {
            return this.toArray().map(function (value) {
                return (typeof (value['toJSON']) === "function")
                    ? value['toJSON']()
                    : value;
            });
        };
        //
        // Decoding utilities
        //
        ArraySchema.prototype.clone = function (isDecoding) {
            var cloned;
            if (isDecoding) {
                cloned = new (ArraySchema.bind.apply(ArraySchema, __spreadArray([void 0], Array.from(this.$items.values()), false)))();
            }
            else {
                cloned = new (ArraySchema.bind.apply(ArraySchema, __spreadArray([void 0], this.map(function (item) { return ((item['$changes'])
                    ? item.clone()
                    : item); }), false)))();
            }
            return cloned;
        };
        return ArraySchema;
    }());

    function getMapProxy(value) {
        value['$proxy'] = true;
        value = new Proxy(value, {
            get: function (obj, prop) {
                if (typeof (prop) !== "symbol" && // accessing properties
                    typeof (obj[prop]) === "undefined") {
                    return obj.get(prop);
                }
                else {
                    return obj[prop];
                }
            },
            set: function (obj, prop, setValue) {
                if (typeof (prop) !== "symbol" &&
                    (prop.indexOf("$") === -1 &&
                        prop !== "onAdd" &&
                        prop !== "onRemove" &&
                        prop !== "onChange")) {
                    obj.set(prop, setValue);
                }
                else {
                    obj[prop] = setValue;
                }
                return true;
            },
            deleteProperty: function (obj, prop) {
                obj.delete(prop);
                return true;
            },
        });
        return value;
    }
    var MapSchema = /** @class */ (function () {
        function MapSchema(initialValues) {
            var _this = this;
            this.$changes = new ChangeTree(this);
            this.$items = new Map();
            this.$indexes = new Map();
            this.$refId = 0;
            if (initialValues) {
                if (initialValues instanceof Map ||
                    initialValues instanceof MapSchema) {
                    initialValues.forEach(function (v, k) { return _this.set(k, v); });
                }
                else {
                    for (var k in initialValues) {
                        this.set(k, initialValues[k]);
                    }
                }
            }
        }
        MapSchema.prototype.onAdd = function (callback, triggerAll) {
            if (triggerAll === void 0) { triggerAll = true; }
            return addCallback((this.$callbacks || (this.$callbacks = {})), exports.OPERATION.ADD, callback, (triggerAll)
                ? this.$items
                : undefined);
        };
        MapSchema.prototype.onRemove = function (callback) { return addCallback(this.$callbacks || (this.$callbacks = {}), exports.OPERATION.DELETE, callback); };
        MapSchema.prototype.onChange = function (callback) { return addCallback(this.$callbacks || (this.$callbacks = {}), exports.OPERATION.REPLACE, callback); };
        MapSchema.is = function (type) {
            return type['map'] !== undefined;
        };
        /** Iterator */
        MapSchema.prototype[Symbol.iterator] = function () { return this.$items[Symbol.iterator](); };
        Object.defineProperty(MapSchema.prototype, Symbol.toStringTag, {
            get: function () { return this.$items[Symbol.toStringTag]; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapSchema, Symbol.species, {
            get: function () {
                return MapSchema;
            },
            enumerable: false,
            configurable: true
        });
        MapSchema.prototype.set = function (key, value) {
            if (value === undefined || value === null) {
                throw new Error("MapSchema#set('".concat(key, "', ").concat(value, "): trying to set ").concat(value, " value on '").concat(key, "'."));
            }
            // Force "key" as string
            // See: https://github.com/colyseus/colyseus/issues/561#issuecomment-1646733468
            key = key.toString();
            // get "index" for this value.
            var hasIndex = typeof (this.$changes.indexes[key]) !== "undefined";
            var index = (hasIndex)
                ? this.$changes.indexes[key]
                : this.$refId++;
            var operation = (hasIndex)
                ? exports.OPERATION.REPLACE
                : exports.OPERATION.ADD;
            var isRef = (value['$changes']) !== undefined;
            if (isRef) {
                value['$changes'].setParent(this, this.$changes.root, index);
            }
            //
            // (encoding)
            // set a unique id to relate directly with this key/value.
            //
            if (!hasIndex) {
                this.$changes.indexes[key] = index;
                this.$indexes.set(index, key);
            }
            else if (!isRef &&
                this.$items.get(key) === value) {
                // if value is the same, avoid re-encoding it.
                return;
            }
            else if (isRef && // if is schema, force ADD operation if value differ from previous one.
                this.$items.get(key) !== value) {
                operation = exports.OPERATION.ADD;
            }
            this.$items.set(key, value);
            this.$changes.change(key, operation);
            return this;
        };
        MapSchema.prototype.get = function (key) {
            return this.$items.get(key);
        };
        MapSchema.prototype.delete = function (key) {
            //
            // TODO: add a "purge" method after .encode() runs, to cleanup removed `$indexes`
            //
            // We don't remove $indexes to allow setting the same key in the same patch
            // (See "should allow to remove and set an item in the same place" test)
            //
            // // const index = this.$changes.indexes[key];
            // // this.$indexes.delete(index);
            this.$changes.delete(key.toString());
            return this.$items.delete(key);
        };
        MapSchema.prototype.clear = function (changes) {
            // discard previous operations.
            this.$changes.discard(true, true);
            this.$changes.indexes = {};
            // clear previous indexes
            this.$indexes.clear();
            //
            // When decoding:
            // - enqueue items for DELETE callback.
            // - flag child items for garbage collection.
            //
            if (changes) {
                removeChildRefs.call(this, changes);
            }
            // clear items
            this.$items.clear();
            this.$changes.operation({ index: 0, op: exports.OPERATION.CLEAR });
            // touch all structures until reach root
            this.$changes.touchParents();
        };
        MapSchema.prototype.has = function (key) {
            return this.$items.has(key);
        };
        MapSchema.prototype.forEach = function (callbackfn) {
            this.$items.forEach(callbackfn);
        };
        MapSchema.prototype.entries = function () {
            return this.$items.entries();
        };
        MapSchema.prototype.keys = function () {
            return this.$items.keys();
        };
        MapSchema.prototype.values = function () {
            return this.$items.values();
        };
        Object.defineProperty(MapSchema.prototype, "size", {
            get: function () {
                return this.$items.size;
            },
            enumerable: false,
            configurable: true
        });
        MapSchema.prototype.setIndex = function (index, key) {
            this.$indexes.set(index, key);
        };
        MapSchema.prototype.getIndex = function (index) {
            return this.$indexes.get(index);
        };
        MapSchema.prototype.getByIndex = function (index) {
            return this.$items.get(this.$indexes.get(index));
        };
        MapSchema.prototype.deleteByIndex = function (index) {
            var key = this.$indexes.get(index);
            this.$items.delete(key);
            this.$indexes.delete(index);
        };
        MapSchema.prototype.toJSON = function () {
            var map = {};
            this.forEach(function (value, key) {
                map[key] = (typeof (value['toJSON']) === "function")
                    ? value['toJSON']()
                    : value;
            });
            return map;
        };
        //
        // Decoding utilities
        //
        MapSchema.prototype.clone = function (isDecoding) {
            var cloned;
            if (isDecoding) {
                // client-side
                cloned = Object.assign(new MapSchema(), this);
            }
            else {
                // server-side
                cloned = new MapSchema();
                this.forEach(function (value, key) {
                    if (value['$changes']) {
                        cloned.set(key, value['clone']());
                    }
                    else {
                        cloned.set(key, value);
                    }
                });
            }
            return cloned;
        };
        return MapSchema;
    }());

    var registeredTypes = {};
    function registerType(identifier, definition) {
        registeredTypes[identifier] = definition;
    }
    function getType(identifier) {
        return registeredTypes[identifier];
    }

    var SchemaDefinition = /** @class */ (function () {
        function SchemaDefinition() {
            //
            // TODO: use a "field" structure combining all these properties per-field.
            //
            this.indexes = {};
            this.fieldsByIndex = {};
            this.deprecated = {};
            this.descriptors = {};
        }
        SchemaDefinition.create = function (parent) {
            var definition = new SchemaDefinition();
            // support inheritance
            definition.schema = Object.assign({}, parent && parent.schema || {});
            definition.indexes = Object.assign({}, parent && parent.indexes || {});
            definition.fieldsByIndex = Object.assign({}, parent && parent.fieldsByIndex || {});
            definition.descriptors = Object.assign({}, parent && parent.descriptors || {});
            definition.deprecated = Object.assign({}, parent && parent.deprecated || {});
            return definition;
        };
        SchemaDefinition.prototype.addField = function (field, type) {
            var index = this.getNextFieldIndex();
            this.fieldsByIndex[index] = field;
            this.indexes[field] = index;
            this.schema[field] = (Array.isArray(type))
                ? { array: type[0] }
                : type;
        };
        SchemaDefinition.prototype.hasField = function (field) {
            return this.indexes[field] !== undefined;
        };
        SchemaDefinition.prototype.addFilter = function (field, cb) {
            if (!this.filters) {
                this.filters = {};
                this.indexesWithFilters = [];
            }
            this.filters[this.indexes[field]] = cb;
            this.indexesWithFilters.push(this.indexes[field]);
            return true;
        };
        SchemaDefinition.prototype.addChildrenFilter = function (field, cb) {
            var index = this.indexes[field];
            var type = this.schema[field];
            if (getType(Object.keys(type)[0])) {
                if (!this.childFilters) {
                    this.childFilters = {};
                }
                this.childFilters[index] = cb;
                return true;
            }
            else {
                console.warn("@filterChildren: field '".concat(field, "' can't have children. Ignoring filter."));
            }
        };
        SchemaDefinition.prototype.getChildrenFilter = function (field) {
            return this.childFilters && this.childFilters[this.indexes[field]];
        };
        SchemaDefinition.prototype.getNextFieldIndex = function () {
            return Object.keys(this.schema || {}).length;
        };
        return SchemaDefinition;
    }());
    function hasFilter(klass) {
        return klass._context && klass._context.useFilters;
    }
    var Context = /** @class */ (function () {
        function Context() {
            this.types = {};
            this.schemas = new Map();
            this.useFilters = false;
        }
        Context.prototype.has = function (schema) {
            return this.schemas.has(schema);
        };
        Context.prototype.get = function (typeid) {
            return this.types[typeid];
        };
        Context.prototype.add = function (schema, typeid) {
            if (typeid === void 0) { typeid = this.schemas.size; }
            // FIXME: move this to somewhere else?
            // support inheritance
            schema._definition = SchemaDefinition.create(schema._definition);
            schema._typeid = typeid;
            this.types[typeid] = schema;
            this.schemas.set(schema, typeid);
        };
        Context.create = function (options) {
            if (options === void 0) { options = {}; }
            return function (definition) {
                if (!options.context) {
                    options.context = new Context();
                }
                return type(definition, options);
            };
        };
        return Context;
    }());
    var globalContext = new Context();
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
    function type(type, options) {
        if (options === void 0) { options = {}; }
        return function (target, field) {
            var context = options.context || globalContext;
            var constructor = target.constructor;
            constructor._context = context;
            if (!type) {
                throw new Error("".concat(constructor.name, ": @type() reference provided for \"").concat(field, "\" is undefined. Make sure you don't have any circular dependencies."));
            }
            /*
             * static schema
             */
            if (!context.has(constructor)) {
                context.add(constructor);
            }
            var definition = constructor._definition;
            definition.addField(field, type);
            /**
             * skip if descriptor already exists for this field (`@deprecated()`)
             */
            if (definition.descriptors[field]) {
                if (definition.deprecated[field]) {
                    // do not create accessors for deprecated properties.
                    return;
                }
                else {
                    // trying to define same property multiple times across inheritance.
                    // https://github.com/colyseus/colyseus-unity3d/issues/131#issuecomment-814308572
                    try {
                        throw new Error("@colyseus/schema: Duplicate '".concat(field, "' definition on '").concat(constructor.name, "'.\nCheck @type() annotation"));
                    }
                    catch (e) {
                        var definitionAtLine = e.stack.split("\n")[4].trim();
                        throw new Error("".concat(e.message, " ").concat(definitionAtLine));
                    }
                }
            }
            var isArray = ArraySchema.is(type);
            var isMap = !isArray && MapSchema.is(type);
            // TODO: refactor me.
            // Allow abstract intermediary classes with no fields to be serialized
            // (See "should support an inheritance with a Schema type without fields" test)
            if (typeof (type) !== "string" && !Schema.is(type)) {
                var childType = Object.values(type)[0];
                if (typeof (childType) !== "string" && !context.has(childType)) {
                    context.add(childType);
                }
            }
            if (options.manual) {
                // do not declare getter/setter descriptor
                definition.descriptors[field] = {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                };
                return;
            }
            var fieldCached = "_".concat(field);
            definition.descriptors[fieldCached] = {
                enumerable: false,
                configurable: false,
                writable: true,
            };
            definition.descriptors[field] = {
                get: function () {
                    return this[fieldCached];
                },
                set: function (value) {
                    /**
                     * Create Proxy for array or map items
                     */
                    // skip if value is the same as cached.
                    if (value === this[fieldCached]) {
                        return;
                    }
                    if (value !== undefined &&
                        value !== null) {
                        // automaticallty transform Array into ArraySchema
                        if (isArray && !(value instanceof ArraySchema)) {
                            value = new (ArraySchema.bind.apply(ArraySchema, __spreadArray([void 0], value, false)))();
                        }
                        // automaticallty transform Map into MapSchema
                        if (isMap && !(value instanceof MapSchema)) {
                            value = new MapSchema(value);
                        }
                        // try to turn provided structure into a Proxy
                        if (value['$proxy'] === undefined) {
                            if (isMap) {
                                value = getMapProxy(value);
                            }
                            else if (isArray) {
                                value = getArrayProxy(value);
                            }
                        }
                        // flag the change for encoding.
                        this.$changes.change(field);
                        //
                        // call setParent() recursively for this and its child
                        // structures.
                        //
                        if (value['$changes']) {
                            value['$changes'].setParent(this, this.$changes.root, this._definition.indexes[field]);
                        }
                    }
                    else if (this[fieldCached]) {
                        //
                        // Setting a field to `null` or `undefined` will delete it.
                        //
                        this.$changes.delete(field);
                    }
                    this[fieldCached] = value;
                },
                enumerable: true,
                configurable: true
            };
        };
    }
    /**
     * `@filter()` decorator for defining data filters per client
     */
    function filter(cb) {
        return function (target, field) {
            var constructor = target.constructor;
            var definition = constructor._definition;
            if (definition.addFilter(field, cb)) {
                constructor._context.useFilters = true;
            }
        };
    }
    function filterChildren(cb) {
        return function (target, field) {
            var constructor = target.constructor;
            var definition = constructor._definition;
            if (definition.addChildrenFilter(field, cb)) {
                constructor._context.useFilters = true;
            }
        };
    }
    /**
     * `@deprecated()` flag a field as deprecated.
     * The previous `@type()` annotation should remain along with this one.
     */
    function deprecated(throws) {
        if (throws === void 0) { throws = true; }
        return function (target, field) {
            var constructor = target.constructor;
            var definition = constructor._definition;
            definition.deprecated[field] = true;
            if (throws) {
                definition.descriptors[field] = {
                    get: function () { throw new Error("".concat(field, " is deprecated.")); },
                    set: function (value) { },
                    enumerable: false,
                    configurable: true
                };
            }
        };
    }
    function defineTypes(target, fields, options) {
        if (options === void 0) { options = {}; }
        if (!options.context) {
            options.context = target._context || options.context || globalContext;
        }
        for (var field in fields) {
            type(fields[field], options)(target.prototype, field);
        }
        return target;
    }

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
    function utf8Length(str) {
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
    }
    function utf8Write(view, offset, str) {
        var c = 0;
        for (var i = 0, l = str.length; i < l; i++) {
            c = str.charCodeAt(i);
            if (c < 0x80) {
                view[offset++] = c;
            }
            else if (c < 0x800) {
                view[offset++] = 0xc0 | (c >> 6);
                view[offset++] = 0x80 | (c & 0x3f);
            }
            else if (c < 0xd800 || c >= 0xe000) {
                view[offset++] = 0xe0 | (c >> 12);
                view[offset++] = 0x80 | (c >> 6 & 0x3f);
                view[offset++] = 0x80 | (c & 0x3f);
            }
            else {
                i++;
                c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                view[offset++] = 0xf0 | (c >> 18);
                view[offset++] = 0x80 | (c >> 12 & 0x3f);
                view[offset++] = 0x80 | (c >> 6 & 0x3f);
                view[offset++] = 0x80 | (c & 0x3f);
            }
        }
    }
    function int8$1(bytes, value) {
        bytes.push(value & 255);
    }
    function uint8$1(bytes, value) {
        bytes.push(value & 255);
    }
    function int16$1(bytes, value) {
        bytes.push(value & 255);
        bytes.push((value >> 8) & 255);
    }
    function uint16$1(bytes, value) {
        bytes.push(value & 255);
        bytes.push((value >> 8) & 255);
    }
    function int32$1(bytes, value) {
        bytes.push(value & 255);
        bytes.push((value >> 8) & 255);
        bytes.push((value >> 16) & 255);
        bytes.push((value >> 24) & 255);
    }
    function uint32$1(bytes, value) {
        var b4 = value >> 24;
        var b3 = value >> 16;
        var b2 = value >> 8;
        var b1 = value;
        bytes.push(b1 & 255);
        bytes.push(b2 & 255);
        bytes.push(b3 & 255);
        bytes.push(b4 & 255);
    }
    function int64$1(bytes, value) {
        var high = Math.floor(value / Math.pow(2, 32));
        var low = value >>> 0;
        uint32$1(bytes, low);
        uint32$1(bytes, high);
    }
    function uint64$1(bytes, value) {
        var high = (value / Math.pow(2, 32)) >> 0;
        var low = value >>> 0;
        uint32$1(bytes, low);
        uint32$1(bytes, high);
    }
    function float32$1(bytes, value) {
        writeFloat32(bytes, value);
    }
    function float64$1(bytes, value) {
        writeFloat64(bytes, value);
    }
    var _int32$1 = new Int32Array(2);
    var _float32$1 = new Float32Array(_int32$1.buffer);
    var _float64$1 = new Float64Array(_int32$1.buffer);
    function writeFloat32(bytes, value) {
        _float32$1[0] = value;
        int32$1(bytes, _int32$1[0]);
    }
    function writeFloat64(bytes, value) {
        _float64$1[0] = value;
        int32$1(bytes, _int32$1[0 ]);
        int32$1(bytes, _int32$1[1 ]);
    }
    function boolean$1(bytes, value) {
        return uint8$1(bytes, value ? 1 : 0);
    }
    function string$1(bytes, value) {
        // encode `null` strings as empty.
        if (!value) {
            value = "";
        }
        var length = utf8Length(value);
        var size = 0;
        // fixstr
        if (length < 0x20) {
            bytes.push(length | 0xa0);
            size = 1;
        }
        // str 8
        else if (length < 0x100) {
            bytes.push(0xd9);
            uint8$1(bytes, length);
            size = 2;
        }
        // str 16
        else if (length < 0x10000) {
            bytes.push(0xda);
            uint16$1(bytes, length);
            size = 3;
        }
        // str 32
        else if (length < 0x100000000) {
            bytes.push(0xdb);
            uint32$1(bytes, length);
            size = 5;
        }
        else {
            throw new Error('String too long');
        }
        utf8Write(bytes, bytes.length, value);
        return size + length;
    }
    function number$1(bytes, value) {
        if (isNaN(value)) {
            return number$1(bytes, 0);
        }
        else if (!isFinite(value)) {
            return number$1(bytes, (value > 0) ? Number.MAX_SAFE_INTEGER : -Number.MAX_SAFE_INTEGER);
        }
        else if (value !== (value | 0)) {
            bytes.push(0xcb);
            writeFloat64(bytes, value);
            return 9;
            // TODO: encode float 32?
            // is it possible to differentiate between float32 / float64 here?
            // // float 32
            // bytes.push(0xca);
            // writeFloat32(bytes, value);
            // return 5;
        }
        if (value >= 0) {
            // positive fixnum
            if (value < 0x80) {
                uint8$1(bytes, value);
                return 1;
            }
            // uint 8
            if (value < 0x100) {
                bytes.push(0xcc);
                uint8$1(bytes, value);
                return 2;
            }
            // uint 16
            if (value < 0x10000) {
                bytes.push(0xcd);
                uint16$1(bytes, value);
                return 3;
            }
            // uint 32
            if (value < 0x100000000) {
                bytes.push(0xce);
                uint32$1(bytes, value);
                return 5;
            }
            // uint 64
            bytes.push(0xcf);
            uint64$1(bytes, value);
            return 9;
        }
        else {
            // negative fixnum
            if (value >= -0x20) {
                bytes.push(0xe0 | (value + 0x20));
                return 1;
            }
            // int 8
            if (value >= -0x80) {
                bytes.push(0xd0);
                int8$1(bytes, value);
                return 2;
            }
            // int 16
            if (value >= -0x8000) {
                bytes.push(0xd1);
                int16$1(bytes, value);
                return 3;
            }
            // int 32
            if (value >= -0x80000000) {
                bytes.push(0xd2);
                int32$1(bytes, value);
                return 5;
            }
            // int 64
            bytes.push(0xd3);
            int64$1(bytes, value);
            return 9;
        }
    }

    var encode = /*#__PURE__*/Object.freeze({
        __proto__: null,
        boolean: boolean$1,
        float32: float32$1,
        float64: float64$1,
        int16: int16$1,
        int32: int32$1,
        int64: int64$1,
        int8: int8$1,
        number: number$1,
        string: string$1,
        uint16: uint16$1,
        uint32: uint32$1,
        uint64: uint64$1,
        uint8: uint8$1,
        utf8Write: utf8Write,
        writeFloat32: writeFloat32,
        writeFloat64: writeFloat64
    });

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
    function utf8Read(bytes, offset, length) {
        var string = '', chr = 0;
        for (var i = offset, end = offset + length; i < end; i++) {
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
        return readFloat32(bytes, it);
    }
    function float64(bytes, it) {
        return readFloat64(bytes, it);
    }
    function int64(bytes, it) {
        var low = uint32(bytes, it);
        var high = int32(bytes, it) * Math.pow(2, 32);
        return high + low;
    }
    function uint64(bytes, it) {
        var low = uint32(bytes, it);
        var high = uint32(bytes, it) * Math.pow(2, 32);
        return high + low;
    }
    var _int32 = new Int32Array(2);
    var _float32 = new Float32Array(_int32.buffer);
    var _float64 = new Float64Array(_int32.buffer);
    function readFloat32(bytes, it) {
        _int32[0] = int32(bytes, it);
        return _float32[0];
    }
    function readFloat64(bytes, it) {
        _int32[0 ] = int32(bytes, it);
        _int32[1 ] = int32(bytes, it);
        return _float64[0];
    }
    function boolean(bytes, it) {
        return uint8(bytes, it) > 0;
    }
    function string(bytes, it) {
        var prefix = bytes[it.offset++];
        var length;
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
        var value = utf8Read(bytes, it.offset, length);
        it.offset += length;
        return value;
    }
    function stringCheck(bytes, it) {
        var prefix = bytes[it.offset];
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
    function number(bytes, it) {
        var prefix = bytes[it.offset++];
        if (prefix < 0x80) {
            // positive fixint
            return prefix;
        }
        else if (prefix === 0xca) {
            // float 32
            return readFloat32(bytes, it);
        }
        else if (prefix === 0xcb) {
            // float 64
            return readFloat64(bytes, it);
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
    function numberCheck(bytes, it) {
        var prefix = bytes[it.offset];
        // positive fixint - 0x00 - 0x7f
        // float 32        - 0xca
        // float 64        - 0xcb
        // uint 8          - 0xcc
        // uint 16         - 0xcd
        // uint 32         - 0xce
        // uint 64         - 0xcf
        // int 8           - 0xd0
        // int 16          - 0xd1
        // int 32          - 0xd2
        // int 64          - 0xd3
        return (prefix < 0x80 ||
            (prefix >= 0xca && prefix <= 0xd3));
    }
    function arrayCheck(bytes, it) {
        return bytes[it.offset] < 0xa0;
        // const prefix = bytes[it.offset] ;
        // if (prefix < 0xa0) {
        //   return prefix;
        // // array
        // } else if (prefix === 0xdc) {
        //   it.offset += 2;
        // } else if (0xdd) {
        //   it.offset += 4;
        // }
        // return prefix;
    }
    function switchStructureCheck(bytes, it) {
        return (
        // previous byte should be `SWITCH_TO_STRUCTURE`
        bytes[it.offset - 1] === SWITCH_TO_STRUCTURE &&
            // next byte should be a number
            (bytes[it.offset] < 0x80 || (bytes[it.offset] >= 0xca && bytes[it.offset] <= 0xd3)));
    }

    var decode = /*#__PURE__*/Object.freeze({
        __proto__: null,
        arrayCheck: arrayCheck,
        boolean: boolean,
        float32: float32,
        float64: float64,
        int16: int16,
        int32: int32,
        int64: int64,
        int8: int8,
        number: number,
        numberCheck: numberCheck,
        readFloat32: readFloat32,
        readFloat64: readFloat64,
        string: string,
        stringCheck: stringCheck,
        switchStructureCheck: switchStructureCheck,
        uint16: uint16,
        uint32: uint32,
        uint64: uint64,
        uint8: uint8
    });

    var CollectionSchema = /** @class */ (function () {
        function CollectionSchema(initialValues) {
            var _this = this;
            this.$changes = new ChangeTree(this);
            this.$items = new Map();
            this.$indexes = new Map();
            this.$refId = 0;
            if (initialValues) {
                initialValues.forEach(function (v) { return _this.add(v); });
            }
        }
        CollectionSchema.prototype.onAdd = function (callback, triggerAll) {
            if (triggerAll === void 0) { triggerAll = true; }
            return addCallback((this.$callbacks || (this.$callbacks = [])), exports.OPERATION.ADD, callback, (triggerAll)
                ? this.$items
                : undefined);
        };
        CollectionSchema.prototype.onRemove = function (callback) { return addCallback(this.$callbacks || (this.$callbacks = []), exports.OPERATION.DELETE, callback); };
        CollectionSchema.prototype.onChange = function (callback) { return addCallback(this.$callbacks || (this.$callbacks = []), exports.OPERATION.REPLACE, callback); };
        CollectionSchema.is = function (type) {
            return type['collection'] !== undefined;
        };
        CollectionSchema.prototype.add = function (value) {
            // set "index" for reference.
            var index = this.$refId++;
            var isRef = (value['$changes']) !== undefined;
            if (isRef) {
                value['$changes'].setParent(this, this.$changes.root, index);
            }
            this.$changes.indexes[index] = index;
            this.$indexes.set(index, index);
            this.$items.set(index, value);
            this.$changes.change(index);
            return index;
        };
        CollectionSchema.prototype.at = function (index) {
            var key = Array.from(this.$items.keys())[index];
            return this.$items.get(key);
        };
        CollectionSchema.prototype.entries = function () {
            return this.$items.entries();
        };
        CollectionSchema.prototype.delete = function (item) {
            var entries = this.$items.entries();
            var index;
            var entry;
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
            this.$changes.delete(index);
            this.$indexes.delete(index);
            return this.$items.delete(index);
        };
        CollectionSchema.prototype.clear = function (changes) {
            // discard previous operations.
            this.$changes.discard(true, true);
            this.$changes.indexes = {};
            // clear previous indexes
            this.$indexes.clear();
            //
            // When decoding:
            // - enqueue items for DELETE callback.
            // - flag child items for garbage collection.
            //
            if (changes) {
                removeChildRefs.call(this, changes);
            }
            // clear items
            this.$items.clear();
            this.$changes.operation({ index: 0, op: exports.OPERATION.CLEAR });
            // touch all structures until reach root
            this.$changes.touchParents();
        };
        CollectionSchema.prototype.has = function (value) {
            return Array.from(this.$items.values()).some(function (v) { return v === value; });
        };
        CollectionSchema.prototype.forEach = function (callbackfn) {
            var _this = this;
            this.$items.forEach(function (value, key, _) { return callbackfn(value, key, _this); });
        };
        CollectionSchema.prototype.values = function () {
            return this.$items.values();
        };
        Object.defineProperty(CollectionSchema.prototype, "size", {
            get: function () {
                return this.$items.size;
            },
            enumerable: false,
            configurable: true
        });
        CollectionSchema.prototype.setIndex = function (index, key) {
            this.$indexes.set(index, key);
        };
        CollectionSchema.prototype.getIndex = function (index) {
            return this.$indexes.get(index);
        };
        CollectionSchema.prototype.getByIndex = function (index) {
            return this.$items.get(this.$indexes.get(index));
        };
        CollectionSchema.prototype.deleteByIndex = function (index) {
            var key = this.$indexes.get(index);
            this.$items.delete(key);
            this.$indexes.delete(index);
        };
        CollectionSchema.prototype.toArray = function () {
            return Array.from(this.$items.values());
        };
        CollectionSchema.prototype.toJSON = function () {
            var values = [];
            this.forEach(function (value, key) {
                values.push((typeof (value['toJSON']) === "function")
                    ? value['toJSON']()
                    : value);
            });
            return values;
        };
        //
        // Decoding utilities
        //
        CollectionSchema.prototype.clone = function (isDecoding) {
            var cloned;
            if (isDecoding) {
                // client-side
                cloned = Object.assign(new CollectionSchema(), this);
            }
            else {
                // server-side
                cloned = new CollectionSchema();
                this.forEach(function (value) {
                    if (value['$changes']) {
                        cloned.add(value['clone']());
                    }
                    else {
                        cloned.add(value);
                    }
                });
            }
            return cloned;
        };
        return CollectionSchema;
    }());

    var SetSchema = /** @class */ (function () {
        function SetSchema(initialValues) {
            var _this = this;
            this.$changes = new ChangeTree(this);
            this.$items = new Map();
            this.$indexes = new Map();
            this.$refId = 0;
            if (initialValues) {
                initialValues.forEach(function (v) { return _this.add(v); });
            }
        }
        SetSchema.prototype.onAdd = function (callback, triggerAll) {
            if (triggerAll === void 0) { triggerAll = true; }
            return addCallback((this.$callbacks || (this.$callbacks = [])), exports.OPERATION.ADD, callback, (triggerAll)
                ? this.$items
                : undefined);
        };
        SetSchema.prototype.onRemove = function (callback) { return addCallback(this.$callbacks || (this.$callbacks = []), exports.OPERATION.DELETE, callback); };
        SetSchema.prototype.onChange = function (callback) { return addCallback(this.$callbacks || (this.$callbacks = []), exports.OPERATION.REPLACE, callback); };
        SetSchema.is = function (type) {
            return type['set'] !== undefined;
        };
        SetSchema.prototype.add = function (value) {
            var _a, _b;
            // immediatelly return false if value already added.
            if (this.has(value)) {
                return false;
            }
            // set "index" for reference.
            var index = this.$refId++;
            if ((value['$changes']) !== undefined) {
                value['$changes'].setParent(this, this.$changes.root, index);
            }
            var operation = (_b = (_a = this.$changes.indexes[index]) === null || _a === void 0 ? void 0 : _a.op) !== null && _b !== void 0 ? _b : exports.OPERATION.ADD;
            this.$changes.indexes[index] = index;
            this.$indexes.set(index, index);
            this.$items.set(index, value);
            this.$changes.change(index, operation);
            return index;
        };
        SetSchema.prototype.entries = function () {
            return this.$items.entries();
        };
        SetSchema.prototype.delete = function (item) {
            var entries = this.$items.entries();
            var index;
            var entry;
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
            this.$changes.delete(index);
            this.$indexes.delete(index);
            return this.$items.delete(index);
        };
        SetSchema.prototype.clear = function (changes) {
            // discard previous operations.
            this.$changes.discard(true, true);
            this.$changes.indexes = {};
            // clear previous indexes
            this.$indexes.clear();
            //
            // When decoding:
            // - enqueue items for DELETE callback.
            // - flag child items for garbage collection.
            //
            if (changes) {
                removeChildRefs.call(this, changes);
            }
            // clear items
            this.$items.clear();
            this.$changes.operation({ index: 0, op: exports.OPERATION.CLEAR });
            // touch all structures until reach root
            this.$changes.touchParents();
        };
        SetSchema.prototype.has = function (value) {
            var values = this.$items.values();
            var has = false;
            var entry;
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
        };
        SetSchema.prototype.forEach = function (callbackfn) {
            var _this = this;
            this.$items.forEach(function (value, key, _) { return callbackfn(value, key, _this); });
        };
        SetSchema.prototype.values = function () {
            return this.$items.values();
        };
        Object.defineProperty(SetSchema.prototype, "size", {
            get: function () {
                return this.$items.size;
            },
            enumerable: false,
            configurable: true
        });
        SetSchema.prototype.setIndex = function (index, key) {
            this.$indexes.set(index, key);
        };
        SetSchema.prototype.getIndex = function (index) {
            return this.$indexes.get(index);
        };
        SetSchema.prototype.getByIndex = function (index) {
            return this.$items.get(this.$indexes.get(index));
        };
        SetSchema.prototype.deleteByIndex = function (index) {
            var key = this.$indexes.get(index);
            this.$items.delete(key);
            this.$indexes.delete(index);
        };
        SetSchema.prototype.toArray = function () {
            return Array.from(this.$items.values());
        };
        SetSchema.prototype.toJSON = function () {
            var values = [];
            this.forEach(function (value, key) {
                values.push((typeof (value['toJSON']) === "function")
                    ? value['toJSON']()
                    : value);
            });
            return values;
        };
        //
        // Decoding utilities
        //
        SetSchema.prototype.clone = function (isDecoding) {
            var cloned;
            if (isDecoding) {
                // client-side
                cloned = Object.assign(new SetSchema(), this);
            }
            else {
                // server-side
                cloned = new SetSchema();
                this.forEach(function (value) {
                    if (value['$changes']) {
                        cloned.add(value['clone']());
                    }
                    else {
                        cloned.add(value);
                    }
                });
            }
            return cloned;
        };
        return SetSchema;
    }());

    var ClientState = /** @class */ (function () {
        function ClientState() {
            this.refIds = new WeakSet();
            this.containerIndexes = new WeakMap();
        }
        // containerIndexes = new Map<ChangeTree, Set<number>>();
        ClientState.prototype.addRefId = function (changeTree) {
            if (!this.refIds.has(changeTree)) {
                this.refIds.add(changeTree);
                this.containerIndexes.set(changeTree, new Set());
            }
        };
        ClientState.get = function (client) {
            if (client.$filterState === undefined) {
                client.$filterState = new ClientState();
            }
            return client.$filterState;
        };
        return ClientState;
    }());

    var ReferenceTracker = /** @class */ (function () {
        function ReferenceTracker() {
            //
            // Relation of refId => Schema structure
            // For direct access of structures during decoding time.
            //
            this.refs = new Map();
            this.refCounts = {};
            this.deletedRefs = new Set();
            this.nextUniqueId = 0;
        }
        ReferenceTracker.prototype.getNextUniqueId = function () {
            return this.nextUniqueId++;
        };
        // for decoding
        ReferenceTracker.prototype.addRef = function (refId, ref, incrementCount) {
            if (incrementCount === void 0) { incrementCount = true; }
            this.refs.set(refId, ref);
            if (incrementCount) {
                this.refCounts[refId] = (this.refCounts[refId] || 0) + 1;
            }
        };
        // for decoding
        ReferenceTracker.prototype.removeRef = function (refId) {
            var refCount = this.refCounts[refId];
            if (refCount === undefined) {
                console.warn("trying to remove reference ".concat(refId, " that doesn't exist"));
                return;
            }
            if (refCount === 0) {
                console.warn("trying to remove reference ".concat(refId, " with 0 refCount"));
                return;
            }
            this.refCounts[refId] = refCount - 1;
            this.deletedRefs.add(refId);
        };
        ReferenceTracker.prototype.clearRefs = function () {
            this.refs.clear();
            this.deletedRefs.clear();
            this.refCounts = {};
        };
        // for decoding
        ReferenceTracker.prototype.garbageCollectDeletedRefs = function () {
            var _this = this;
            this.deletedRefs.forEach(function (refId) {
                //
                // Skip active references.
                //
                if (_this.refCounts[refId] > 0) {
                    return;
                }
                var ref = _this.refs.get(refId);
                //
                // Ensure child schema instances have their references removed as well.
                //
                if (ref instanceof Schema) {
                    for (var fieldName in ref['_definition'].schema) {
                        if (typeof (ref['_definition'].schema[fieldName]) !== "string" &&
                            ref[fieldName] &&
                            ref[fieldName]['$changes']) {
                            _this.removeRef(ref[fieldName]['$changes'].refId);
                        }
                    }
                }
                else {
                    var definition = ref['$changes'].parent._definition;
                    var type = definition.schema[definition.fieldsByIndex[ref['$changes'].parentIndex]];
                    if (typeof (Object.values(type)[0]) === "function") {
                        Array.from(ref.values())
                            .forEach(function (child) { return _this.removeRef(child['$changes'].refId); });
                    }
                }
                _this.refs.delete(refId);
                delete _this.refCounts[refId];
            });
            // clear deleted refs.
            this.deletedRefs.clear();
        };
        return ReferenceTracker;
    }());

    var EncodeSchemaError = /** @class */ (function (_super) {
        __extends(EncodeSchemaError, _super);
        function EncodeSchemaError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return EncodeSchemaError;
    }(Error));
    function assertType(value, type, klass, field) {
        var typeofTarget;
        var allowNull = false;
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
                    console.log("trying to encode \"NaN\" in ".concat(klass.constructor.name, "#").concat(field));
                }
                break;
            case "string":
                typeofTarget = "string";
                allowNull = true;
                break;
            case "boolean":
                // boolean is always encoded as true/false based on truthiness
                return;
        }
        if (typeof (value) !== typeofTarget && (!allowNull || (allowNull && value !== null))) {
            var foundValue = "'".concat(JSON.stringify(value), "'").concat((value && value.constructor && " (".concat(value.constructor.name, ")")) || '');
            throw new EncodeSchemaError("a '".concat(typeofTarget, "' was expected, but ").concat(foundValue, " was provided in ").concat(klass.constructor.name, "#").concat(field));
        }
    }
    function assertInstanceType(value, type, klass, field) {
        if (!(value instanceof type)) {
            throw new EncodeSchemaError("a '".concat(type.name, "' was expected, but '").concat(value.constructor.name, "' was provided in ").concat(klass.constructor.name, "#").concat(field));
        }
    }
    function encodePrimitiveType(type, bytes, value, klass, field) {
        assertType(value, type, klass, field);
        var encodeFunc = encode[type];
        if (encodeFunc) {
            encodeFunc(bytes, value);
        }
        else {
            throw new EncodeSchemaError("a '".concat(type, "' was expected, but ").concat(value, " was provided in ").concat(klass.constructor.name, "#").concat(field));
        }
    }
    function decodePrimitiveType(type, bytes, it) {
        return decode[type](bytes, it);
    }
    /**
     * Schema encoder / decoder
     */
    var Schema = /** @class */ (function () {
        // allow inherited classes to have a constructor
        function Schema() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // fix enumerability of fields for end-user
            Object.defineProperties(this, {
                $changes: {
                    value: new ChangeTree(this, undefined, new ReferenceTracker()),
                    enumerable: false,
                    writable: true
                },
                // $listeners: {
                //     value: undefined,
                //     enumerable: false,
                //     writable: true
                // },
                $callbacks: {
                    value: undefined,
                    enumerable: false,
                    writable: true
                },
            });
            var descriptors = this._definition.descriptors;
            if (descriptors) {
                Object.defineProperties(this, descriptors);
            }
            //
            // Assign initial values
            //
            if (args[0]) {
                this.assign(args[0]);
            }
        }
        Schema.onError = function (e) {
            console.error(e);
        };
        Schema.is = function (type) {
            return (type['_definition'] &&
                type['_definition'].schema !== undefined);
        };
        Schema.prototype.onChange = function (callback) {
            return addCallback((this.$callbacks || (this.$callbacks = {})), exports.OPERATION.REPLACE, callback);
        };
        Schema.prototype.onRemove = function (callback) {
            return addCallback((this.$callbacks || (this.$callbacks = {})), exports.OPERATION.DELETE, callback);
        };
        Schema.prototype.assign = function (props) {
            Object.assign(this, props);
            return this;
        };
        Object.defineProperty(Schema.prototype, "_definition", {
            get: function () { return this.constructor._definition; },
            enumerable: false,
            configurable: true
        });
        /**
         * (Server-side): Flag a property to be encoded for the next patch.
         * @param instance Schema instance
         * @param property string representing the property name, or number representing the index of the property.
         * @param operation OPERATION to perform (detected automatically)
         */
        Schema.prototype.setDirty = function (property, operation) {
            this.$changes.change(property, operation);
        };
        /**
         * Client-side: listen for changes on property.
         * @param prop the property name
         * @param callback callback to be triggered on property change
         * @param immediate trigger immediatelly if property has been already set.
         */
        Schema.prototype.listen = function (prop, callback, immediate) {
            var _this = this;
            if (immediate === void 0) { immediate = true; }
            if (!this.$callbacks) {
                this.$callbacks = {};
            }
            if (!this.$callbacks[prop]) {
                this.$callbacks[prop] = [];
            }
            this.$callbacks[prop].push(callback);
            if (immediate && this[prop] !== undefined) {
                callback(this[prop], undefined);
            }
            // return un-register callback.
            return function () { return spliceOne(_this.$callbacks[prop], _this.$callbacks[prop].indexOf(callback)); };
        };
        Schema.prototype.decode = function (bytes, it, ref) {
            if (it === void 0) { it = { offset: 0 }; }
            if (ref === void 0) { ref = this; }
            var allChanges = [];
            var $root = this.$changes.root;
            var totalBytes = bytes.length;
            var refId = 0;
            $root.refs.set(refId, this);
            while (it.offset < totalBytes) {
                var byte = bytes[it.offset++];
                if (byte == SWITCH_TO_STRUCTURE) {
                    refId = number(bytes, it);
                    var nextRef = $root.refs.get(refId);
                    //
                    // Trying to access a reference that haven't been decoded yet.
                    //
                    if (!nextRef) {
                        throw new Error("\"refId\" not found: ".concat(refId));
                    }
                    ref = nextRef;
                    continue;
                }
                var changeTree = ref['$changes'];
                var isSchema = (ref['_definition'] !== undefined);
                var operation = (isSchema)
                    ? (byte >> 6) << 6 // "compressed" index + operation
                    : byte; // "uncompressed" index + operation (array/map items)
                if (operation === exports.OPERATION.CLEAR) {
                    //
                    // TODO: refactor me!
                    // The `.clear()` method is calling `$root.removeRef(refId)` for
                    // each item inside this collection
                    //
                    ref.clear(allChanges);
                    continue;
                }
                var fieldIndex = (isSchema)
                    ? byte % (operation || 255) // if "REPLACE" operation (0), use 255
                    : number(bytes, it);
                var fieldName = (isSchema)
                    ? (ref['_definition'].fieldsByIndex[fieldIndex])
                    : "";
                var type = changeTree.getType(fieldIndex);
                var value = void 0;
                var previousValue = void 0;
                var dynamicIndex = void 0;
                if (!isSchema) {
                    previousValue = ref['getByIndex'](fieldIndex);
                    if ((operation & exports.OPERATION.ADD) === exports.OPERATION.ADD) { // ADD or DELETE_AND_ADD
                        dynamicIndex = (ref instanceof MapSchema)
                            ? string(bytes, it)
                            : fieldIndex;
                        ref['setIndex'](fieldIndex, dynamicIndex);
                    }
                    else {
                        // here
                        dynamicIndex = ref['getIndex'](fieldIndex);
                    }
                }
                else {
                    previousValue = ref["_".concat(fieldName)];
                }
                //
                // Delete operations
                //
                if ((operation & exports.OPERATION.DELETE) === exports.OPERATION.DELETE) {
                    if (operation !== exports.OPERATION.DELETE_AND_ADD) {
                        ref['deleteByIndex'](fieldIndex);
                    }
                    // Flag `refId` for garbage collection.
                    if (previousValue && previousValue['$changes']) {
                        $root.removeRef(previousValue['$changes'].refId);
                    }
                    value = null;
                }
                if (fieldName === undefined) {
                    console.warn("@colyseus/schema: definition mismatch");
                    //
                    // keep skipping next bytes until reaches a known structure
                    // by local decoder.
                    //
                    var nextIterator = { offset: it.offset };
                    while (it.offset < totalBytes) {
                        if (switchStructureCheck(bytes, it)) {
                            nextIterator.offset = it.offset + 1;
                            if ($root.refs.has(number(bytes, nextIterator))) {
                                break;
                            }
                        }
                        it.offset++;
                    }
                    continue;
                }
                else if (operation === exports.OPERATION.DELETE) ;
                else if (Schema.is(type)) {
                    var refId_1 = number(bytes, it);
                    value = $root.refs.get(refId_1);
                    if (operation !== exports.OPERATION.REPLACE) {
                        var childType = this.getSchemaType(bytes, it, type);
                        if (!value) {
                            value = this.createTypeInstance(childType);
                            value.$changes.refId = refId_1;
                            if (previousValue) {
                                value.$callbacks = previousValue.$callbacks;
                                // value.$listeners = previousValue.$listeners;
                                if (previousValue['$changes'].refId &&
                                    refId_1 !== previousValue['$changes'].refId) {
                                    $root.removeRef(previousValue['$changes'].refId);
                                }
                            }
                        }
                        $root.addRef(refId_1, value, (value !== previousValue));
                    }
                }
                else if (typeof (type) === "string") {
                    //
                    // primitive value (number, string, boolean, etc)
                    //
                    value = decodePrimitiveType(type, bytes, it);
                }
                else {
                    var typeDef = getType(Object.keys(type)[0]);
                    var refId_2 = number(bytes, it);
                    var valueRef = ($root.refs.has(refId_2))
                        ? previousValue || $root.refs.get(refId_2)
                        : new typeDef.constructor();
                    value = valueRef.clone(true);
                    value.$changes.refId = refId_2;
                    // preserve schema callbacks
                    if (previousValue) {
                        value['$callbacks'] = previousValue['$callbacks'];
                        if (previousValue['$changes'].refId &&
                            refId_2 !== previousValue['$changes'].refId) {
                            $root.removeRef(previousValue['$changes'].refId);
                            //
                            // Trigger onRemove if structure has been replaced.
                            //
                            var entries = previousValue.entries();
                            var iter = void 0;
                            while ((iter = entries.next()) && !iter.done) {
                                var _a = iter.value, key = _a[0], value_1 = _a[1];
                                allChanges.push({
                                    refId: refId_2,
                                    op: exports.OPERATION.DELETE,
                                    field: key,
                                    value: undefined,
                                    previousValue: value_1,
                                });
                            }
                        }
                    }
                    $root.addRef(refId_2, value, (valueRef !== previousValue));
                }
                if (value !== null &&
                    value !== undefined) {
                    if (value['$changes']) {
                        value['$changes'].setParent(changeTree.ref, changeTree.root, fieldIndex);
                    }
                    if (ref instanceof Schema) {
                        ref[fieldName] = value;
                        // ref[`_${fieldName}`] = value;
                    }
                    else if (ref instanceof MapSchema) {
                        // const key = ref['$indexes'].get(field);
                        var key = dynamicIndex;
                        // ref.set(key, value);
                        ref['$items'].set(key, value);
                        ref['$changes'].allChanges.add(fieldIndex);
                    }
                    else if (ref instanceof ArraySchema) {
                        // const key = ref['$indexes'][field];
                        // console.log("SETTING FOR ArraySchema =>", { field, key, value });
                        // ref[key] = value;
                        ref.setAt(fieldIndex, value);
                    }
                    else if (ref instanceof CollectionSchema) {
                        var index = ref.add(value);
                        ref['setIndex'](fieldIndex, index);
                    }
                    else if (ref instanceof SetSchema) {
                        var index = ref.add(value);
                        if (index !== false) {
                            ref['setIndex'](fieldIndex, index);
                        }
                    }
                }
                if (previousValue !== value) {
                    allChanges.push({
                        refId: refId,
                        op: operation,
                        field: fieldName,
                        dynamicIndex: dynamicIndex,
                        value: value,
                        previousValue: previousValue,
                    });
                }
            }
            this._triggerChanges(allChanges);
            // drop references of unused schemas
            $root.garbageCollectDeletedRefs();
            return allChanges;
        };
        Schema.prototype.encode = function (encodeAll, bytes, useFilters) {
            if (encodeAll === void 0) { encodeAll = false; }
            if (bytes === void 0) { bytes = []; }
            if (useFilters === void 0) { useFilters = false; }
            var rootChangeTree = this.$changes;
            var refIdsVisited = new WeakSet();
            var changeTrees = [rootChangeTree];
            var numChangeTrees = 1;
            for (var i = 0; i < numChangeTrees; i++) {
                var changeTree = changeTrees[i];
                var ref = changeTree.ref;
                var isSchema = (ref instanceof Schema);
                // Generate unique refId for the ChangeTree.
                changeTree.ensureRefId();
                // mark this ChangeTree as visited.
                refIdsVisited.add(changeTree);
                // root `refId` is skipped.
                if (changeTree !== rootChangeTree &&
                    (changeTree.changed || encodeAll)) {
                    uint8$1(bytes, SWITCH_TO_STRUCTURE);
                    number$1(bytes, changeTree.refId);
                }
                var changes = (encodeAll)
                    ? Array.from(changeTree.allChanges)
                    : Array.from(changeTree.changes.values());
                for (var j = 0, cl = changes.length; j < cl; j++) {
                    var operation = (encodeAll)
                        ? { op: exports.OPERATION.ADD, index: changes[j] }
                        : changes[j];
                    var fieldIndex = operation.index;
                    var field = (isSchema)
                        ? ref['_definition'].fieldsByIndex && ref['_definition'].fieldsByIndex[fieldIndex]
                        : fieldIndex;
                    // cache begin index if `useFilters`
                    var beginIndex = bytes.length;
                    // encode field index + operation
                    if (operation.op !== exports.OPERATION.TOUCH) {
                        if (isSchema) {
                            //
                            // Compress `fieldIndex` + `operation` into a single byte.
                            // This adds a limitaion of 64 fields per Schema structure
                            //
                            uint8$1(bytes, (fieldIndex | operation.op));
                        }
                        else {
                            uint8$1(bytes, operation.op);
                            // custom operations
                            if (operation.op === exports.OPERATION.CLEAR) {
                                continue;
                            }
                            // indexed operations
                            number$1(bytes, fieldIndex);
                        }
                    }
                    //
                    // encode "alias" for dynamic fields (maps)
                    //
                    if (!isSchema &&
                        (operation.op & exports.OPERATION.ADD) == exports.OPERATION.ADD // ADD or DELETE_AND_ADD
                    ) {
                        if (ref instanceof MapSchema) {
                            //
                            // MapSchema dynamic key
                            //
                            var dynamicIndex = changeTree.ref['$indexes'].get(fieldIndex);
                            string$1(bytes, dynamicIndex);
                        }
                    }
                    if (operation.op === exports.OPERATION.DELETE) {
                        //
                        // TODO: delete from filter cache data.
                        //
                        // if (useFilters) {
                        //     delete changeTree.caches[fieldIndex];
                        // }
                        continue;
                    }
                    // const type = changeTree.childType || ref._schema[field];
                    var type = changeTree.getType(fieldIndex);
                    // const type = changeTree.getType(fieldIndex);
                    var value = changeTree.getValue(fieldIndex);
                    // Enqueue ChangeTree to be visited
                    if (value &&
                        value['$changes'] &&
                        !refIdsVisited.has(value['$changes'])) {
                        changeTrees.push(value['$changes']);
                        value['$changes'].ensureRefId();
                        numChangeTrees++;
                    }
                    if (operation.op === exports.OPERATION.TOUCH) {
                        continue;
                    }
                    if (Schema.is(type)) {
                        assertInstanceType(value, type, ref, field);
                        //
                        // Encode refId for this instance.
                        // The actual instance is going to be encoded on next `changeTree` iteration.
                        //
                        number$1(bytes, value.$changes.refId);
                        // Try to encode inherited TYPE_ID if it's an ADD operation.
                        if ((operation.op & exports.OPERATION.ADD) === exports.OPERATION.ADD) {
                            this.tryEncodeTypeId(bytes, type, value.constructor);
                        }
                    }
                    else if (typeof (type) === "string") {
                        //
                        // Primitive values
                        //
                        encodePrimitiveType(type, bytes, value, ref, field);
                    }
                    else {
                        //
                        // Custom type (MapSchema, ArraySchema, etc)
                        //
                        var definition = getType(Object.keys(type)[0]);
                        //
                        // ensure a ArraySchema has been provided
                        //
                        assertInstanceType(ref["_".concat(field)], definition.constructor, ref, field);
                        //
                        // Encode refId for this instance.
                        // The actual instance is going to be encoded on next `changeTree` iteration.
                        //
                        number$1(bytes, value.$changes.refId);
                    }
                    if (useFilters) {
                        // cache begin / end index
                        changeTree.cache(fieldIndex, bytes.slice(beginIndex));
                    }
                }
                if (!encodeAll && !useFilters) {
                    changeTree.discard();
                }
            }
            return bytes;
        };
        Schema.prototype.encodeAll = function (useFilters) {
            return this.encode(true, [], useFilters);
        };
        Schema.prototype.applyFilters = function (client, encodeAll) {
            var _a, _b;
            if (encodeAll === void 0) { encodeAll = false; }
            var root = this;
            var refIdsDissallowed = new Set();
            var $filterState = ClientState.get(client);
            var changeTrees = [this.$changes];
            var numChangeTrees = 1;
            var filteredBytes = [];
            var _loop_1 = function (i) {
                var changeTree = changeTrees[i];
                if (refIdsDissallowed.has(changeTree.refId)) {
                    return "continue";
                }
                var ref = changeTree.ref;
                var isSchema = ref instanceof Schema;
                uint8$1(filteredBytes, SWITCH_TO_STRUCTURE);
                number$1(filteredBytes, changeTree.refId);
                var clientHasRefId = $filterState.refIds.has(changeTree);
                var isEncodeAll = (encodeAll || !clientHasRefId);
                // console.log("REF:", ref.constructor.name);
                // console.log("Encode all?", isEncodeAll);
                //
                // include `changeTree` on list of known refIds by this client.
                //
                $filterState.addRefId(changeTree);
                var containerIndexes = $filterState.containerIndexes.get(changeTree);
                var changes = (isEncodeAll)
                    ? Array.from(changeTree.allChanges)
                    : Array.from(changeTree.changes.values());
                //
                // WORKAROUND: tries to re-evaluate previously not included @filter() attributes
                // - see "DELETE a field of Schema" test case.
                //
                if (!encodeAll &&
                    isSchema &&
                    ref._definition.indexesWithFilters) {
                    var indexesWithFilters = ref._definition.indexesWithFilters;
                    indexesWithFilters.forEach(function (indexWithFilter) {
                        if (!containerIndexes.has(indexWithFilter) &&
                            changeTree.allChanges.has(indexWithFilter)) {
                            if (isEncodeAll) {
                                changes.push(indexWithFilter);
                            }
                            else {
                                changes.push({ op: exports.OPERATION.ADD, index: indexWithFilter, });
                            }
                        }
                    });
                }
                for (var j = 0, cl = changes.length; j < cl; j++) {
                    var change = (isEncodeAll)
                        ? { op: exports.OPERATION.ADD, index: changes[j] }
                        : changes[j];
                    // custom operations
                    if (change.op === exports.OPERATION.CLEAR) {
                        uint8$1(filteredBytes, change.op);
                        continue;
                    }
                    var fieldIndex = change.index;
                    //
                    // Deleting fields: encode the operation + field index
                    //
                    if (change.op === exports.OPERATION.DELETE) {
                        //
                        // DELETE operations also need to go through filtering.
                        //
                        // TODO: cache the previous value so we can access the value (primitive or `refId`)
                        // (check against `$filterState.refIds`)
                        //
                        if (isSchema) {
                            uint8$1(filteredBytes, change.op | fieldIndex);
                        }
                        else {
                            uint8$1(filteredBytes, change.op);
                            number$1(filteredBytes, fieldIndex);
                        }
                        continue;
                    }
                    // indexed operation
                    var value = changeTree.getValue(fieldIndex);
                    var type = changeTree.getType(fieldIndex);
                    if (isSchema) {
                        // Is a Schema!
                        var filter = (ref._definition.filters &&
                            ref._definition.filters[fieldIndex]);
                        if (filter && !filter.call(ref, client, value, root)) {
                            if (value && value['$changes']) {
                                refIdsDissallowed.add(value['$changes'].refId);
                            }
                            continue;
                        }
                    }
                    else {
                        // Is a collection! (map, array, etc.)
                        var parent = changeTree.parent;
                        var filter = changeTree.getChildrenFilter();
                        if (filter && !filter.call(parent, client, ref['$indexes'].get(fieldIndex), value, root)) {
                            if (value && value['$changes']) {
                                refIdsDissallowed.add(value['$changes'].refId);
                            }
                            continue;
                        }
                    }
                    // visit child ChangeTree on further iteration.
                    if (value['$changes']) {
                        changeTrees.push(value['$changes']);
                        numChangeTrees++;
                    }
                    //
                    // Copy cached bytes
                    //
                    if (change.op !== exports.OPERATION.TOUCH) {
                        //
                        // TODO: refactor me!
                        //
                        if (change.op === exports.OPERATION.ADD || isSchema) {
                            //
                            // use cached bytes directly if is from Schema type.
                            //
                            filteredBytes.push.apply(filteredBytes, (_a = changeTree.caches[fieldIndex]) !== null && _a !== void 0 ? _a : []);
                            containerIndexes.add(fieldIndex);
                        }
                        else {
                            if (containerIndexes.has(fieldIndex)) {
                                //
                                // use cached bytes if already has the field
                                //
                                filteredBytes.push.apply(filteredBytes, (_b = changeTree.caches[fieldIndex]) !== null && _b !== void 0 ? _b : []);
                            }
                            else {
                                //
                                // force ADD operation if field is not known by this client.
                                //
                                containerIndexes.add(fieldIndex);
                                uint8$1(filteredBytes, exports.OPERATION.ADD);
                                number$1(filteredBytes, fieldIndex);
                                if (ref instanceof MapSchema) {
                                    //
                                    // MapSchema dynamic key
                                    //
                                    var dynamicIndex = changeTree.ref['$indexes'].get(fieldIndex);
                                    string$1(filteredBytes, dynamicIndex);
                                }
                                if (value['$changes']) {
                                    number$1(filteredBytes, value['$changes'].refId);
                                }
                                else {
                                    // "encodePrimitiveType" without type checking.
                                    // the type checking has been done on the first .encode() call.
                                    encode[type](filteredBytes, value);
                                }
                            }
                        }
                    }
                    else if (value['$changes'] && !isSchema) {
                        //
                        // TODO:
                        // - track ADD/REPLACE/DELETE instances on `$filterState`
                        // - do NOT always encode dynamicIndex for MapSchema.
                        //   (If client already has that key, only the first index is necessary.)
                        //
                        uint8$1(filteredBytes, exports.OPERATION.ADD);
                        number$1(filteredBytes, fieldIndex);
                        if (ref instanceof MapSchema) {
                            //
                            // MapSchema dynamic key
                            //
                            var dynamicIndex = changeTree.ref['$indexes'].get(fieldIndex);
                            string$1(filteredBytes, dynamicIndex);
                        }
                        number$1(filteredBytes, value['$changes'].refId);
                    }
                }
            };
            for (var i = 0; i < numChangeTrees; i++) {
                _loop_1(i);
            }
            return filteredBytes;
        };
        Schema.prototype.clone = function () {
            var _a;
            var cloned = new (this.constructor);
            var schema = this._definition.schema;
            for (var field in schema) {
                if (typeof (this[field]) === "object" &&
                    typeof ((_a = this[field]) === null || _a === void 0 ? void 0 : _a.clone) === "function") {
                    // deep clone
                    cloned[field] = this[field].clone();
                }
                else {
                    // primitive values
                    cloned[field] = this[field];
                }
            }
            return cloned;
        };
        Schema.prototype.toJSON = function () {
            var schema = this._definition.schema;
            var deprecated = this._definition.deprecated;
            var obj = {};
            for (var field in schema) {
                if (!deprecated[field] && this[field] !== null && typeof (this[field]) !== "undefined") {
                    obj[field] = (typeof (this[field]['toJSON']) === "function")
                        ? this[field]['toJSON']()
                        : this["_".concat(field)];
                }
            }
            return obj;
        };
        Schema.prototype.discardAllChanges = function () {
            this.$changes.discardAll();
        };
        Schema.prototype.getByIndex = function (index) {
            return this[this._definition.fieldsByIndex[index]];
        };
        Schema.prototype.deleteByIndex = function (index) {
            this[this._definition.fieldsByIndex[index]] = undefined;
        };
        Schema.prototype.tryEncodeTypeId = function (bytes, type, targetType) {
            if (type._typeid !== targetType._typeid) {
                uint8$1(bytes, TYPE_ID);
                number$1(bytes, targetType._typeid);
            }
        };
        Schema.prototype.getSchemaType = function (bytes, it, defaultType) {
            var type;
            if (bytes[it.offset] === TYPE_ID) {
                it.offset++;
                type = this.constructor._context.get(number(bytes, it));
            }
            return type || defaultType;
        };
        Schema.prototype.createTypeInstance = function (type) {
            var instance = new type();
            // assign root on $changes
            instance.$changes.root = this.$changes.root;
            return instance;
        };
        Schema.prototype._triggerChanges = function (changes) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            var uniqueRefIds = new Set();
            var $refs = this.$changes.root.refs;
            var _loop_2 = function (i) {
                var change = changes[i];
                var refId = change.refId;
                var ref = $refs.get(refId);
                var $callbacks = ref['$callbacks'];
                //
                // trigger onRemove on child structure.
                //
                if ((change.op & exports.OPERATION.DELETE) === exports.OPERATION.DELETE &&
                    change.previousValue instanceof Schema) {
                    (_b = (_a = change.previousValue['$callbacks']) === null || _a === void 0 ? void 0 : _a[exports.OPERATION.DELETE]) === null || _b === void 0 ? void 0 : _b.forEach(function (callback) { return callback(); });
                }
                // no callbacks defined, skip this structure!
                if (!$callbacks) {
                    return "continue";
                }
                if (ref instanceof Schema) {
                    if (!uniqueRefIds.has(refId)) {
                        try {
                            // trigger onChange
                            (_c = $callbacks === null || $callbacks === void 0 ? void 0 : $callbacks[exports.OPERATION.REPLACE]) === null || _c === void 0 ? void 0 : _c.forEach(function (callback) {
                                return callback();
                            });
                        }
                        catch (e) {
                            Schema.onError(e);
                        }
                    }
                    try {
                        if ($callbacks.hasOwnProperty(change.field)) {
                            (_d = $callbacks[change.field]) === null || _d === void 0 ? void 0 : _d.forEach(function (callback) {
                                return callback(change.value, change.previousValue);
                            });
                        }
                    }
                    catch (e) {
                        Schema.onError(e);
                    }
                }
                else {
                    // is a collection of items
                    if (change.op === exports.OPERATION.ADD && change.previousValue === undefined) {
                        // triger onAdd
                        (_e = $callbacks[exports.OPERATION.ADD]) === null || _e === void 0 ? void 0 : _e.forEach(function (callback) { var _a; return callback(change.value, (_a = change.dynamicIndex) !== null && _a !== void 0 ? _a : change.field); });
                    }
                    else if (change.op === exports.OPERATION.DELETE) {
                        //
                        // FIXME: `previousValue` should always be available.
                        // ADD + DELETE operations are still encoding DELETE operation.
                        //
                        if (change.previousValue !== undefined) {
                            // triger onRemove
                            (_f = $callbacks[exports.OPERATION.DELETE]) === null || _f === void 0 ? void 0 : _f.forEach(function (callback) { var _a; return callback(change.previousValue, (_a = change.dynamicIndex) !== null && _a !== void 0 ? _a : change.field); });
                        }
                    }
                    else if (change.op === exports.OPERATION.DELETE_AND_ADD) {
                        // triger onRemove
                        if (change.previousValue !== undefined) {
                            (_g = $callbacks[exports.OPERATION.DELETE]) === null || _g === void 0 ? void 0 : _g.forEach(function (callback) { var _a; return callback(change.previousValue, (_a = change.dynamicIndex) !== null && _a !== void 0 ? _a : change.field); });
                        }
                        // triger onAdd
                        (_h = $callbacks[exports.OPERATION.ADD]) === null || _h === void 0 ? void 0 : _h.forEach(function (callback) { var _a; return callback(change.value, (_a = change.dynamicIndex) !== null && _a !== void 0 ? _a : change.field); });
                    }
                    // trigger onChange
                    if (change.value !== change.previousValue) {
                        (_j = $callbacks[exports.OPERATION.REPLACE]) === null || _j === void 0 ? void 0 : _j.forEach(function (callback) { var _a; return callback(change.value, (_a = change.dynamicIndex) !== null && _a !== void 0 ? _a : change.field); });
                    }
                }
                uniqueRefIds.add(refId);
            };
            for (var i = 0; i < changes.length; i++) {
                _loop_2(i);
            }
        };
        Schema._definition = SchemaDefinition.create();
        return Schema;
    }());

    function dumpChanges(schema) {
        var changeTrees = [schema['$changes']];
        var numChangeTrees = 1;
        var dump = {};
        var currentStructure = dump;
        var _loop_1 = function (i) {
            var changeTree = changeTrees[i];
            changeTree.changes.forEach(function (change) {
                var ref = changeTree.ref;
                var fieldIndex = change.index;
                var field = (ref['_definition'])
                    ? ref['_definition'].fieldsByIndex[fieldIndex]
                    : ref['$indexes'].get(fieldIndex);
                currentStructure[field] = changeTree.getValue(fieldIndex);
            });
        };
        for (var i = 0; i < numChangeTrees; i++) {
            _loop_1(i);
        }
        return dump;
    }

    var reflectionContext = { context: new Context() };
    /**
     * Reflection
     */
    var ReflectionField = /** @class */ (function (_super) {
        __extends(ReflectionField, _super);
        function ReflectionField() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        __decorate([
            type("string", reflectionContext)
        ], ReflectionField.prototype, "name", void 0);
        __decorate([
            type("string", reflectionContext)
        ], ReflectionField.prototype, "type", void 0);
        __decorate([
            type("number", reflectionContext)
        ], ReflectionField.prototype, "referencedType", void 0);
        return ReflectionField;
    }(Schema));
    var ReflectionType = /** @class */ (function (_super) {
        __extends(ReflectionType, _super);
        function ReflectionType() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.fields = new ArraySchema();
            return _this;
        }
        __decorate([
            type("number", reflectionContext)
        ], ReflectionType.prototype, "id", void 0);
        __decorate([
            type([ReflectionField], reflectionContext)
        ], ReflectionType.prototype, "fields", void 0);
        return ReflectionType;
    }(Schema));
    var Reflection = /** @class */ (function (_super) {
        __extends(Reflection, _super);
        function Reflection() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.types = new ArraySchema();
            return _this;
        }
        Reflection.encode = function (instance) {
            var _a;
            var rootSchemaType = instance.constructor;
            var reflection = new Reflection();
            reflection.rootType = rootSchemaType._typeid;
            var buildType = function (currentType, schema) {
                for (var fieldName in schema) {
                    var field = new ReflectionField();
                    field.name = fieldName;
                    var fieldType = void 0;
                    if (typeof (schema[fieldName]) === "string") {
                        fieldType = schema[fieldName];
                    }
                    else {
                        var type_1 = schema[fieldName];
                        var childTypeSchema = void 0;
                        //
                        // TODO: refactor below.
                        //
                        if (Schema.is(type_1)) {
                            fieldType = "ref";
                            childTypeSchema = schema[fieldName];
                        }
                        else {
                            fieldType = Object.keys(type_1)[0];
                            if (typeof (type_1[fieldType]) === "string") {
                                fieldType += ":" + type_1[fieldType]; // array:string
                            }
                            else {
                                childTypeSchema = type_1[fieldType];
                            }
                        }
                        field.referencedType = (childTypeSchema)
                            ? childTypeSchema._typeid
                            : -1;
                    }
                    field.type = fieldType;
                    currentType.fields.push(field);
                }
                reflection.types.push(currentType);
            };
            var types = (_a = rootSchemaType._context) === null || _a === void 0 ? void 0 : _a.types;
            for (var typeid in types) {
                var type_2 = new ReflectionType();
                type_2.id = Number(typeid);
                buildType(type_2, types[typeid]._definition.schema);
            }
            return reflection.encodeAll();
        };
        Reflection.decode = function (bytes, it) {
            var context = new Context();
            var reflection = new Reflection();
            reflection.decode(bytes, it);
            var schemaTypes = reflection.types.reduce(function (types, reflectionType) {
                var schema = /** @class */ (function (_super) {
                    __extends(_, _super);
                    function _() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return _;
                }(Schema));
                var typeid = reflectionType.id;
                types[typeid] = schema;
                context.add(schema, typeid);
                return types;
            }, {});
            reflection.types.forEach(function (reflectionType) {
                var schemaType = schemaTypes[reflectionType.id];
                reflectionType.fields.forEach(function (field) {
                    var _a;
                    if (field.referencedType !== undefined) {
                        var fieldType = field.type;
                        var refType = schemaTypes[field.referencedType];
                        // map or array of primitive type (-1)
                        if (!refType) {
                            var typeInfo = field.type.split(":");
                            fieldType = typeInfo[0];
                            refType = typeInfo[1];
                        }
                        if (fieldType === "ref") {
                            type(refType, { context: context })(schemaType.prototype, field.name);
                        }
                        else {
                            type((_a = {}, _a[fieldType] = refType, _a), { context: context })(schemaType.prototype, field.name);
                        }
                    }
                    else {
                        type(field.type, { context: context })(schemaType.prototype, field.name);
                    }
                });
            });
            var rootType = schemaTypes[reflection.rootType];
            var rootInstance = new rootType();
            /**
             * auto-initialize referenced types on root type
             * to allow registering listeners immediatelly on client-side
             */
            for (var fieldName in rootType._definition.schema) {
                var fieldType = rootType._definition.schema[fieldName];
                if (typeof (fieldType) !== "string") {
                    rootInstance[fieldName] = (typeof (fieldType) === "function")
                        ? new fieldType() // is a schema reference
                        : new (getType(Object.keys(fieldType)[0])).constructor(); // is a "collection"
                }
            }
            return rootInstance;
        };
        __decorate([
            type([ReflectionType], reflectionContext)
        ], Reflection.prototype, "types", void 0);
        __decorate([
            type("number", reflectionContext)
        ], Reflection.prototype, "rootType", void 0);
        return Reflection;
    }(Schema));

    registerType("map", { constructor: MapSchema });
    registerType("array", { constructor: ArraySchema });
    registerType("set", { constructor: SetSchema });
    registerType("collection", { constructor: CollectionSchema, });

    exports.ArraySchema = ArraySchema;
    exports.CollectionSchema = CollectionSchema;
    exports.Context = Context;
    exports.MapSchema = MapSchema;
    exports.Reflection = Reflection;
    exports.ReflectionField = ReflectionField;
    exports.ReflectionType = ReflectionType;
    exports.Schema = Schema;
    exports.SchemaDefinition = SchemaDefinition;
    exports.SetSchema = SetSchema;
    exports.decode = decode;
    exports.defineTypes = defineTypes;
    exports.deprecated = deprecated;
    exports.dumpChanges = dumpChanges;
    exports.encode = encode;
    exports.filter = filter;
    exports.filterChildren = filterChildren;
    exports.hasFilter = hasFilter;
    exports.registerType = registerType;
    exports.type = type;

}));


/***/ }),

/***/ "./node_modules/colyseus.js/lib/3rd_party/discord.js":
/*!***********************************************************!*\
  !*** ./node_modules/colyseus.js/lib/3rd_party/discord.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.discordURLBuilder = void 0;
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
    const localHostname = ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hostname) || "localhost";
    const remoteHostnameSplitted = url.hostname.split('.');
    const subdomain = (!url.hostname.includes("trycloudflare.com") && // ignore cloudflared subdomains
        !url.hostname.includes("discordsays.com") && // ignore discordsays.com subdomains
        remoteHostnameSplitted.length > 2)
        ? `/${remoteHostnameSplitted[0]}`
        : '';
    return (url.pathname.startsWith("/.proxy"))
        ? `${url.protocol}//${localHostname}${subdomain}${url.pathname}${url.search}`
        : `${url.protocol}//${localHostname}/.proxy/colyseus${subdomain}${url.pathname}${url.search}`;
}
exports.discordURLBuilder = discordURLBuilder;
//# sourceMappingURL=discord.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/Auth.js":
/*!**********************************************!*\
  !*** ./node_modules/colyseus.js/lib/Auth.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Auth__initialized, _Auth__initializationPromise, _Auth__signInWindow, _Auth__events;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Auth = void 0;
const Storage_1 = __webpack_require__(/*! ./Storage */ "./node_modules/colyseus.js/lib/Storage.js");
const nanoevents_1 = __webpack_require__(/*! ./core/nanoevents */ "./node_modules/colyseus.js/lib/core/nanoevents.js");
class Auth {
    constructor(http) {
        this.http = http;
        this.settings = {
            path: "/auth",
            key: "colyseus-auth-token",
        };
        _Auth__initialized.set(this, false);
        _Auth__initializationPromise.set(this, void 0);
        _Auth__signInWindow.set(this, undefined);
        _Auth__events.set(this, (0, nanoevents_1.createNanoEvents)());
        (0, Storage_1.getItem)(this.settings.key, (token) => this.token = token);
    }
    set token(token) {
        this.http.authToken = token;
    }
    get token() {
        return this.http.authToken;
    }
    onChange(callback) {
        const unbindChange = __classPrivateFieldGet(this, _Auth__events, "f").on("change", callback);
        if (!__classPrivateFieldGet(this, _Auth__initialized, "f")) {
            __classPrivateFieldSet(this, _Auth__initializationPromise, new Promise((resolve, reject) => {
                this.getUserData().then((userData) => {
                    this.emitChange(Object.assign(Object.assign({}, userData), { token: this.token }));
                }).catch((e) => {
                    // user is not logged in, or service is down
                    this.emitChange({ user: null, token: undefined });
                }).finally(() => {
                    resolve();
                });
            }), "f");
        }
        __classPrivateFieldSet(this, _Auth__initialized, true, "f");
        return unbindChange;
    }
    getUserData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.token) {
                return (yield this.http.get(`${this.settings.path}/userdata`)).data;
            }
            else {
                throw new Error("missing auth.token");
            }
        });
    }
    registerWithEmailAndPassword(email, password, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.http.post(`${this.settings.path}/register`, {
                body: { email, password, options, },
            })).data;
            this.emitChange(data);
            return data;
        });
    }
    signInWithEmailAndPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.http.post(`${this.settings.path}/login`, {
                body: { email, password, },
            })).data;
            this.emitChange(data);
            return data;
        });
    }
    signInAnonymously(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.http.post(`${this.settings.path}/anonymous`, {
                body: { options, }
            })).data;
            this.emitChange(data);
            return data;
        });
    }
    sendPasswordResetEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.http.post(`${this.settings.path}/forgot-password`, {
                body: { email, }
            })).data;
        });
    }
    signInWithProvider(providerName, settings = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const w = settings.width || 480;
                const h = settings.height || 768;
                // forward existing token for upgrading
                const upgradingToken = this.token ? `?token=${this.token}` : "";
                // Capitalize first letter of providerName
                const title = `Login with ${(providerName[0].toUpperCase() + providerName.substring(1))}`;
                const url = this.http['client']['getHttpEndpoint'](`${(settings.prefix || `${this.settings.path}/provider`)}/${providerName}${upgradingToken}`);
                const left = (screen.width / 2) - (w / 2);
                const top = (screen.height / 2) - (h / 2);
                __classPrivateFieldSet(this, _Auth__signInWindow, window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left), "f");
                const onMessage = (event) => {
                    // TODO: it is a good idea to check if event.origin can be trusted!
                    // if (event.origin.indexOf(window.location.hostname) === -1) { return; }
                    // require 'user' and 'token' inside received data.
                    if (event.data.user === undefined && event.data.token === undefined) {
                        return;
                    }
                    clearInterval(rejectionChecker);
                    __classPrivateFieldGet(this, _Auth__signInWindow, "f").close();
                    __classPrivateFieldSet(this, _Auth__signInWindow, undefined, "f");
                    window.removeEventListener("message", onMessage);
                    if (event.data.error !== undefined) {
                        reject(event.data.error);
                    }
                    else {
                        resolve(event.data);
                        this.emitChange(event.data);
                    }
                };
                const rejectionChecker = setInterval(() => {
                    if (!__classPrivateFieldGet(this, _Auth__signInWindow, "f") || __classPrivateFieldGet(this, _Auth__signInWindow, "f").closed) {
                        __classPrivateFieldSet(this, _Auth__signInWindow, undefined, "f");
                        reject("cancelled");
                        window.removeEventListener("message", onMessage);
                    }
                }, 200);
                window.addEventListener("message", onMessage);
            });
        });
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emitChange({ user: null, token: null });
        });
    }
    emitChange(authData) {
        if (authData.token !== undefined) {
            this.token = authData.token;
            if (authData.token === null) {
                (0, Storage_1.removeItem)(this.settings.key);
            }
            else {
                // store key in localStorage
                (0, Storage_1.setItem)(this.settings.key, authData.token);
            }
        }
        __classPrivateFieldGet(this, _Auth__events, "f").emit("change", authData);
    }
}
exports.Auth = Auth;
_Auth__initialized = new WeakMap(), _Auth__initializationPromise = new WeakMap(), _Auth__signInWindow = new WeakMap(), _Auth__events = new WeakMap();
//# sourceMappingURL=Auth.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/Client.js":
/*!************************************************!*\
  !*** ./node_modules/colyseus.js/lib/Client.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Client = exports.MatchMakeError = void 0;
const ServerError_1 = __webpack_require__(/*! ./errors/ServerError */ "./node_modules/colyseus.js/lib/errors/ServerError.js");
const Room_1 = __webpack_require__(/*! ./Room */ "./node_modules/colyseus.js/lib/Room.js");
const HTTP_1 = __webpack_require__(/*! ./HTTP */ "./node_modules/colyseus.js/lib/HTTP.js");
const Auth_1 = __webpack_require__(/*! ./Auth */ "./node_modules/colyseus.js/lib/Auth.js");
const discord_1 = __webpack_require__(/*! ./3rd_party/discord */ "./node_modules/colyseus.js/lib/3rd_party/discord.js");
class MatchMakeError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, MatchMakeError.prototype);
    }
}
exports.MatchMakeError = MatchMakeError;
// - React Native does not provide `window.location`
// - Cocos Creator (Native) does not provide `window.location.hostname`
const DEFAULT_ENDPOINT = (typeof (window) !== "undefined" && typeof ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hostname) !== "undefined")
    ? `${window.location.protocol.replace("http", "ws")}//${window.location.hostname}${(window.location.port && `:${window.location.port}`)}`
    : "ws://127.0.0.1:2567";
class Client {
    constructor(settings = DEFAULT_ENDPOINT, customURLBuilder) {
        var _a, _b;
        if (typeof (settings) === "string") {
            //
            // endpoint by url
            //
            const url = (settings.startsWith("/"))
                ? new URL(settings, DEFAULT_ENDPOINT)
                : new URL(settings);
            const secure = (url.protocol === "https:" || url.protocol === "wss:");
            const port = Number(url.port || (secure ? 443 : 80));
            this.settings = {
                hostname: url.hostname,
                pathname: url.pathname,
                port,
                secure
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
        this.http = new HTTP_1.HTTP(this);
        this.auth = new Auth_1.Auth(this.http);
        this.urlBuilder = customURLBuilder;
        //
        // Discord Embedded SDK requires a custom URL builder
        //
        if (!this.urlBuilder &&
            typeof (window) !== "undefined" &&
            ((_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hostname) === null || _b === void 0 ? void 0 : _b.includes("discordsays.com"))) {
            this.urlBuilder = discord_1.discordURLBuilder;
            console.log("Colyseus SDK: Discord Embedded SDK detected. Using custom URL builder.");
        }
    }
    joinOrCreate(roomName, options = {}, rootSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createMatchMakeRequest('joinOrCreate', roomName, options, rootSchema);
        });
    }
    create(roomName, options = {}, rootSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createMatchMakeRequest('create', roomName, options, rootSchema);
        });
    }
    join(roomName, options = {}, rootSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createMatchMakeRequest('join', roomName, options, rootSchema);
        });
    }
    joinById(roomId, options = {}, rootSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createMatchMakeRequest('joinById', roomId, options, rootSchema);
        });
    }
    /**
     * Re-establish connection with a room this client was previously connected to.
     *
     * @param reconnectionToken The `room.reconnectionToken` from previously connected room.
     * @param rootSchema (optional) Concrete root schema definition
     * @returns Promise<Room>
     */
    reconnect(reconnectionToken, rootSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (reconnectionToken) === "string" && typeof (rootSchema) === "string") {
                throw new Error("DEPRECATED: .reconnect() now only accepts 'reconnectionToken' as argument.\nYou can get this token from previously connected `room.reconnectionToken`");
            }
            const [roomId, token] = reconnectionToken.split(":");
            if (!roomId || !token) {
                throw new Error("Invalid reconnection token format.\nThe format should be roomId:reconnectionToken");
            }
            return yield this.createMatchMakeRequest('reconnect', roomId, { reconnectionToken: token }, rootSchema);
        });
    }
    getAvailableRooms(roomName = "") {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.http.get(`matchmake/${roomName}`, {
                headers: {
                    'Accept': 'application/json'
                }
            })).data;
        });
    }
    consumeSeatReservation(response, rootSchema, reuseRoomInstance // used in devMode
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = this.createRoom(response.room.name, rootSchema);
            room.roomId = response.room.roomId;
            room.sessionId = response.sessionId;
            const options = { sessionId: room.sessionId };
            // forward "reconnection token" in case of reconnection.
            if (response.reconnectionToken) {
                options.reconnectionToken = response.reconnectionToken;
            }
            const targetRoom = reuseRoomInstance || room;
            room.connect(this.buildEndpoint(response.room, options), response.devMode && (() => __awaiter(this, void 0, void 0, function* () {
                console.info(`[Colyseus devMode]: ${String.fromCodePoint(0x1F504)} Re-establishing connection with room id '${room.roomId}'...`); // 🔄
                let retryCount = 0;
                let retryMaxRetries = 8;
                const retryReconnection = () => __awaiter(this, void 0, void 0, function* () {
                    retryCount++;
                    try {
                        yield this.consumeSeatReservation(response, rootSchema, targetRoom);
                        console.info(`[Colyseus devMode]: ${String.fromCodePoint(0x2705)} Successfully re-established connection with room '${room.roomId}'`); // ✅
                    }
                    catch (e) {
                        if (retryCount < retryMaxRetries) {
                            console.info(`[Colyseus devMode]: ${String.fromCodePoint(0x1F504)} retrying... (${retryCount} out of ${retryMaxRetries})`); // 🔄
                            setTimeout(retryReconnection, 2000);
                        }
                        else {
                            console.info(`[Colyseus devMode]: ${String.fromCodePoint(0x274C)} Failed to reconnect. Is your server running? Please check server logs.`); // ❌
                        }
                    }
                });
                setTimeout(retryReconnection, 2000);
            })), targetRoom);
            return new Promise((resolve, reject) => {
                const onError = (code, message) => reject(new ServerError_1.ServerError(code, message));
                targetRoom.onError.once(onError);
                targetRoom['onJoin'].once(() => {
                    targetRoom.onError.remove(onError);
                    resolve(targetRoom);
                });
            });
        });
    }
    createMatchMakeRequest(method, roomName, options = {}, rootSchema, reuseRoomInstance) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = (yield this.http.post(`matchmake/${method}/${roomName}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(options)
            })).data;
            // FIXME: HTTP class is already handling this as ServerError.
            if (response.error) {
                throw new MatchMakeError(response.error, response.code);
            }
            // forward reconnection token during "reconnect" methods.
            if (method === "reconnect") {
                response.reconnectionToken = options.reconnectionToken;
            }
            return yield this.consumeSeatReservation(response, rootSchema, reuseRoomInstance);
        });
    }
    createRoom(roomName, rootSchema) {
        return new Room_1.Room(roomName, rootSchema);
    }
    buildEndpoint(room, options = {}) {
        const params = [];
        // append provided options
        for (const name in options) {
            if (!options.hasOwnProperty(name)) {
                continue;
            }
            params.push(`${name}=${options[name]}`);
        }
        let endpoint = (this.settings.secure)
            ? "wss://"
            : "ws://";
        if (room.publicAddress) {
            endpoint += `${room.publicAddress}`;
        }
        else {
            endpoint += `${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}`;
        }
        const endpointURL = `${endpoint}/${room.processId}/${room.roomId}?${params.join('&')}`;
        return (this.urlBuilder)
            ? this.urlBuilder(new URL(endpointURL))
            : endpointURL;
    }
    getHttpEndpoint(segments = '') {
        const path = segments.startsWith("/") ? segments : `/${segments}`;
        const endpointURL = `${(this.settings.secure) ? "https" : "http"}://${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}${path}`;
        return (this.urlBuilder)
            ? this.urlBuilder(new URL(endpointURL))
            : endpointURL;
    }
    getEndpointPort() {
        return (this.settings.port !== 80 && this.settings.port !== 443)
            ? `:${this.settings.port}`
            : "";
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/Connection.js":
/*!****************************************************!*\
  !*** ./node_modules/colyseus.js/lib/Connection.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Connection = void 0;
const WebSocketTransport_1 = __webpack_require__(/*! ./transport/WebSocketTransport */ "./node_modules/colyseus.js/lib/transport/WebSocketTransport.js");
class Connection {
    constructor() {
        this.events = {};
        this.transport = new WebSocketTransport_1.WebSocketTransport(this.events);
    }
    send(data) {
        this.transport.send(data);
    }
    connect(url) {
        this.transport.connect(url);
    }
    close(code, reason) {
        this.transport.close(code, reason);
    }
    get isOpen() {
        return this.transport.isOpen;
    }
}
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/HTTP.js":
/*!**********************************************!*\
  !*** ./node_modules/colyseus.js/lib/HTTP.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HTTP = void 0;
const ServerError_1 = __webpack_require__(/*! ./errors/ServerError */ "./node_modules/colyseus.js/lib/errors/ServerError.js");
const httpie = __importStar(__webpack_require__(/*! httpie */ "./node_modules/httpie/xhr/index.mjs"));
class HTTP {
    constructor(client) {
        this.client = client;
    }
    get(path, options = {}) {
        return this.request("get", path, options);
    }
    post(path, options = {}) {
        return this.request("post", path, options);
    }
    del(path, options = {}) {
        return this.request("del", path, options);
    }
    put(path, options = {}) {
        return this.request("put", path, options);
    }
    request(method, path, options = {}) {
        return httpie[method](this.client['getHttpEndpoint'](path), this.getOptions(options)).catch((e) => {
            var _a;
            const status = e.statusCode; //  || -1
            const message = ((_a = e.data) === null || _a === void 0 ? void 0 : _a.error) || e.statusMessage || e.message; //  || "offline"
            if (!status && !message) {
                throw e;
            }
            throw new ServerError_1.ServerError(status, message);
        });
    }
    getOptions(options) {
        if (this.authToken) {
            if (!options.headers) {
                options.headers = {};
            }
            options.headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        if (typeof (cc) !== 'undefined' && cc.sys && cc.sys.isNative) {
            //
            // Workaround for Cocos Creator on Native platform
            // "Cannot set property withCredentials of #<XMLHttpRequest> which has only a getter"
            //
        }
        else {
            // always include credentials
            options.withCredentials = true;
        }
        return options;
    }
}
exports.HTTP = HTTP;
//# sourceMappingURL=HTTP.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/Protocol.js":
/*!**************************************************!*\
  !*** ./node_modules/colyseus.js/lib/Protocol.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Use codes between 0~127 for lesser throughput (1 byte)
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.utf8Length = exports.utf8Read = exports.ErrorCode = exports.Protocol = void 0;
var Protocol;
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
})(Protocol = exports.Protocol || (exports.Protocol = {}));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["MATCHMAKE_NO_HANDLER"] = 4210] = "MATCHMAKE_NO_HANDLER";
    ErrorCode[ErrorCode["MATCHMAKE_INVALID_CRITERIA"] = 4211] = "MATCHMAKE_INVALID_CRITERIA";
    ErrorCode[ErrorCode["MATCHMAKE_INVALID_ROOM_ID"] = 4212] = "MATCHMAKE_INVALID_ROOM_ID";
    ErrorCode[ErrorCode["MATCHMAKE_UNHANDLED"] = 4213] = "MATCHMAKE_UNHANDLED";
    ErrorCode[ErrorCode["MATCHMAKE_EXPIRED"] = 4214] = "MATCHMAKE_EXPIRED";
    ErrorCode[ErrorCode["AUTH_FAILED"] = 4215] = "AUTH_FAILED";
    ErrorCode[ErrorCode["APPLICATION_ERROR"] = 4216] = "APPLICATION_ERROR";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
function utf8Read(view, offset) {
    const length = view[offset++];
    var string = '', chr = 0;
    for (var i = offset, end = offset + length; i < end; i++) {
        var byte = view[i];
        if ((byte & 0x80) === 0x00) {
            string += String.fromCharCode(byte);
            continue;
        }
        if ((byte & 0xe0) === 0xc0) {
            string += String.fromCharCode(((byte & 0x1f) << 6) |
                (view[++i] & 0x3f));
            continue;
        }
        if ((byte & 0xf0) === 0xe0) {
            string += String.fromCharCode(((byte & 0x0f) << 12) |
                ((view[++i] & 0x3f) << 6) |
                ((view[++i] & 0x3f) << 0));
            continue;
        }
        if ((byte & 0xf8) === 0xf0) {
            chr = ((byte & 0x07) << 18) |
                ((view[++i] & 0x3f) << 12) |
                ((view[++i] & 0x3f) << 6) |
                ((view[++i] & 0x3f) << 0);
            if (chr >= 0x010000) { // surrogate pair
                chr -= 0x010000;
                string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
            }
            else {
                string += String.fromCharCode(chr);
            }
            continue;
        }
        throw new Error('Invalid byte ' + byte.toString(16));
    }
    return string;
}
exports.utf8Read = utf8Read;
// Faster for short strings than Buffer.byteLength
function utf8Length(str = '') {
    let c = 0;
    let length = 0;
    for (let i = 0, l = str.length; i < l; i++) {
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
    return length + 1;
}
exports.utf8Length = utf8Length;
//# sourceMappingURL=Protocol.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/Room.js":
/*!**********************************************!*\
  !*** ./node_modules/colyseus.js/lib/Room.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Room = void 0;
const msgpack = __importStar(__webpack_require__(/*! ./msgpack */ "./node_modules/colyseus.js/lib/msgpack/index.js"));
const Connection_1 = __webpack_require__(/*! ./Connection */ "./node_modules/colyseus.js/lib/Connection.js");
const Protocol_1 = __webpack_require__(/*! ./Protocol */ "./node_modules/colyseus.js/lib/Protocol.js");
const Serializer_1 = __webpack_require__(/*! ./serializer/Serializer */ "./node_modules/colyseus.js/lib/serializer/Serializer.js");
// The unused imports here are important for better `.d.ts` file generation
// (Later merged with `dts-bundle-generator`)
const nanoevents_1 = __webpack_require__(/*! ./core/nanoevents */ "./node_modules/colyseus.js/lib/core/nanoevents.js");
const signal_1 = __webpack_require__(/*! ./core/signal */ "./node_modules/colyseus.js/lib/core/signal.js");
const schema_1 = __webpack_require__(/*! @colyseus/schema */ "./node_modules/@colyseus/schema/build/umd/index.js");
const ServerError_1 = __webpack_require__(/*! ./errors/ServerError */ "./node_modules/colyseus.js/lib/errors/ServerError.js");
class Room {
    constructor(name, rootSchema) {
        // Public signals
        this.onStateChange = (0, signal_1.createSignal)();
        this.onError = (0, signal_1.createSignal)();
        this.onLeave = (0, signal_1.createSignal)();
        this.onJoin = (0, signal_1.createSignal)();
        this.hasJoined = false;
        this.onMessageHandlers = (0, nanoevents_1.createNanoEvents)();
        this.roomId = null;
        this.name = name;
        if (rootSchema) {
            this.serializer = new ((0, Serializer_1.getSerializer)("schema"));
            this.rootSchema = rootSchema;
            this.serializer.state = new rootSchema();
        }
        this.onError((code, message) => { var _a; return (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `colyseus.js - onError => (${code}) ${message}`); });
        this.onLeave(() => this.removeAllListeners());
    }
    // TODO: deprecate me on version 1.0
    get id() { return this.roomId; }
    connect(endpoint, devModeCloseCallback, room = this // when reconnecting on devMode, re-use previous room intance for handling events.
    ) {
        const connection = new Connection_1.Connection();
        room.connection = connection;
        connection.events.onmessage = Room.prototype.onMessageCallback.bind(room);
        connection.events.onclose = function (e) {
            var _a;
            if (!room.hasJoined) {
                (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `Room connection was closed unexpectedly (${e.code}): ${e.reason}`);
                room.onError.invoke(e.code, e.reason);
                return;
            }
            if (e.code === ServerError_1.CloseCode.DEVMODE_RESTART && devModeCloseCallback) {
                devModeCloseCallback();
            }
            else {
                room.onLeave.invoke(e.code, e.reason);
                room.destroy();
            }
        };
        connection.events.onerror = function (e) {
            var _a;
            (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `Room, onError (${e.code}): ${e.reason}`);
            room.onError.invoke(e.code, e.reason);
        };
        connection.connect(endpoint);
    }
    leave(consented = true) {
        return new Promise((resolve) => {
            this.onLeave((code) => resolve(code));
            if (this.connection) {
                if (consented) {
                    this.connection.send([Protocol_1.Protocol.LEAVE_ROOM]);
                }
                else {
                    this.connection.close();
                }
            }
            else {
                this.onLeave.invoke(ServerError_1.CloseCode.CONSENTED);
            }
        });
    }
    onMessage(type, callback) {
        return this.onMessageHandlers.on(this.getMessageHandlerKey(type), callback);
    }
    send(type, message) {
        const initialBytes = [Protocol_1.Protocol.ROOM_DATA];
        if (typeof (type) === "string") {
            schema_1.encode.string(initialBytes, type);
        }
        else {
            schema_1.encode.number(initialBytes, type);
        }
        let arr;
        if (message !== undefined) {
            const encoded = msgpack.encode(message);
            arr = new Uint8Array(initialBytes.length + encoded.byteLength);
            arr.set(new Uint8Array(initialBytes), 0);
            arr.set(new Uint8Array(encoded), initialBytes.length);
        }
        else {
            arr = new Uint8Array(initialBytes);
        }
        this.connection.send(arr.buffer);
    }
    sendBytes(type, bytes) {
        const initialBytes = [Protocol_1.Protocol.ROOM_DATA_BYTES];
        if (typeof (type) === "string") {
            schema_1.encode.string(initialBytes, type);
        }
        else {
            schema_1.encode.number(initialBytes, type);
        }
        let arr;
        arr = new Uint8Array(initialBytes.length + (bytes.byteLength || bytes.length));
        arr.set(new Uint8Array(initialBytes), 0);
        arr.set(new Uint8Array(bytes), initialBytes.length);
        this.connection.send(arr.buffer);
    }
    get state() {
        return this.serializer.getState();
    }
    removeAllListeners() {
        this.onJoin.clear();
        this.onStateChange.clear();
        this.onError.clear();
        this.onLeave.clear();
        this.onMessageHandlers.events = {};
    }
    onMessageCallback(event) {
        const bytes = Array.from(new Uint8Array(event.data));
        const code = bytes[0];
        if (code === Protocol_1.Protocol.JOIN_ROOM) {
            let offset = 1;
            const reconnectionToken = (0, Protocol_1.utf8Read)(bytes, offset);
            offset += (0, Protocol_1.utf8Length)(reconnectionToken);
            this.serializerId = (0, Protocol_1.utf8Read)(bytes, offset);
            offset += (0, Protocol_1.utf8Length)(this.serializerId);
            // Instantiate serializer if not locally available.
            if (!this.serializer) {
                const serializer = (0, Serializer_1.getSerializer)(this.serializerId);
                this.serializer = new serializer();
            }
            if (bytes.length > offset && this.serializer.handshake) {
                this.serializer.handshake(bytes, { offset });
            }
            this.reconnectionToken = `${this.roomId}:${reconnectionToken}`;
            this.hasJoined = true;
            this.onJoin.invoke();
            // acknowledge successfull JOIN_ROOM
            this.connection.send([Protocol_1.Protocol.JOIN_ROOM]);
        }
        else if (code === Protocol_1.Protocol.ERROR) {
            const it = { offset: 1 };
            const code = schema_1.decode.number(bytes, it);
            const message = schema_1.decode.string(bytes, it);
            this.onError.invoke(code, message);
        }
        else if (code === Protocol_1.Protocol.LEAVE_ROOM) {
            this.leave();
        }
        else if (code === Protocol_1.Protocol.ROOM_DATA_SCHEMA) {
            const it = { offset: 1 };
            const context = this.serializer.getState().constructor._context;
            const type = context.get(schema_1.decode.number(bytes, it));
            const message = new type();
            message.decode(bytes, it);
            this.dispatchMessage(type, message);
        }
        else if (code === Protocol_1.Protocol.ROOM_STATE) {
            bytes.shift(); // drop `code` byte
            this.setState(bytes);
        }
        else if (code === Protocol_1.Protocol.ROOM_STATE_PATCH) {
            bytes.shift(); // drop `code` byte
            this.patch(bytes);
        }
        else if (code === Protocol_1.Protocol.ROOM_DATA) {
            const it = { offset: 1 };
            const type = (schema_1.decode.stringCheck(bytes, it))
                ? schema_1.decode.string(bytes, it)
                : schema_1.decode.number(bytes, it);
            const message = (bytes.length > it.offset)
                ? msgpack.decode(event.data, it.offset)
                : undefined;
            this.dispatchMessage(type, message);
        }
        else if (code === Protocol_1.Protocol.ROOM_DATA_BYTES) {
            const it = { offset: 1 };
            const type = (schema_1.decode.stringCheck(bytes, it))
                ? schema_1.decode.string(bytes, it)
                : schema_1.decode.number(bytes, it);
            this.dispatchMessage(type, new Uint8Array(bytes.slice(it.offset)));
        }
    }
    setState(encodedState) {
        this.serializer.setState(encodedState);
        this.onStateChange.invoke(this.serializer.getState());
    }
    patch(binaryPatch) {
        this.serializer.patch(binaryPatch);
        this.onStateChange.invoke(this.serializer.getState());
    }
    dispatchMessage(type, message) {
        var _a;
        const messageType = this.getMessageHandlerKey(type);
        if (this.onMessageHandlers.events[messageType]) {
            this.onMessageHandlers.emit(messageType, message);
        }
        else if (this.onMessageHandlers.events['*']) {
            this.onMessageHandlers.emit('*', type, message);
        }
        else {
            (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `colyseus.js: onMessage() not registered for type '${type}'.`);
        }
    }
    destroy() {
        if (this.serializer) {
            this.serializer.teardown();
        }
    }
    getMessageHandlerKey(type) {
        switch (typeof (type)) {
            // typeof Schema
            case "function": return `$${type._typeid}`;
            // string
            case "string": return type;
            // number
            case "number": return `i${type}`;
            default: throw new Error("invalid message type.");
        }
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/Storage.js":
/*!*************************************************!*\
  !*** ./node_modules/colyseus.js/lib/Storage.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/// <reference path="../typings/cocos-creator.d.ts" />
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getItem = exports.removeItem = exports.setItem = void 0;
/**
 * We do not assign 'storage' to window.localStorage immediatelly for React
 * Native compatibility. window.localStorage is not present when this module is
 * loaded.
 */
let storage;
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
exports.setItem = setItem;
function removeItem(key) {
    getStorage().removeItem(key);
}
exports.removeItem = removeItem;
function getItem(key, callback) {
    const value = getStorage().getItem(key);
    if (typeof (Promise) === 'undefined' || // old browsers
        !(value instanceof Promise)) {
        // browser has synchronous return
        callback(value);
    }
    else {
        // react-native is asynchronous
        value.then((id) => callback(id));
    }
}
exports.getItem = getItem;
//# sourceMappingURL=Storage.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/core/nanoevents.js":
/*!*********************************************************!*\
  !*** ./node_modules/colyseus.js/lib/core/nanoevents.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createNanoEvents = void 0;
const createNanoEvents = () => ({
    emit(event, ...args) {
        let callbacks = this.events[event] || [];
        for (let i = 0, length = callbacks.length; i < length; i++) {
            callbacks[i](...args);
        }
    },
    events: {},
    on(event, cb) {
        var _a;
        ((_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.push(cb)) || (this.events[event] = [cb]);
        return () => {
            var _a;
            this.events[event] = (_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.filter(i => cb !== i);
        };
    }
});
exports.createNanoEvents = createNanoEvents;
//# sourceMappingURL=nanoevents.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/core/signal.js":
/*!*****************************************************!*\
  !*** ./node_modules/colyseus.js/lib/core/signal.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createSignal = exports.EventEmitter = void 0;
class EventEmitter {
    constructor() {
        this.handlers = [];
    }
    register(cb, once = false) {
        this.handlers.push(cb);
        return this;
    }
    invoke(...args) {
        this.handlers.forEach((handler) => handler.apply(this, args));
    }
    invokeAsync(...args) {
        return Promise.all(this.handlers.map((handler) => handler.apply(this, args)));
    }
    remove(cb) {
        const index = this.handlers.indexOf(cb);
        this.handlers[index] = this.handlers[this.handlers.length - 1];
        this.handlers.pop();
    }
    clear() {
        this.handlers = [];
    }
}
exports.EventEmitter = EventEmitter;
function createSignal() {
    const emitter = new EventEmitter();
    function register(cb) {
        return emitter.register(cb, this === null);
    }
    ;
    register.once = (cb) => {
        const callback = function (...args) {
            cb.apply(this, args);
            emitter.remove(callback);
        };
        emitter.register(callback);
    };
    register.remove = (cb) => emitter.remove(cb);
    register.invoke = (...args) => emitter.invoke(...args);
    register.invokeAsync = (...args) => emitter.invokeAsync(...args);
    register.clear = () => emitter.clear();
    return register;
}
exports.createSignal = createSignal;
//# sourceMappingURL=signal.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/errors/ServerError.js":
/*!************************************************************!*\
  !*** ./node_modules/colyseus.js/lib/errors/ServerError.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServerError = exports.CloseCode = void 0;
var CloseCode;
(function (CloseCode) {
    CloseCode[CloseCode["CONSENTED"] = 4000] = "CONSENTED";
    CloseCode[CloseCode["DEVMODE_RESTART"] = 4010] = "DEVMODE_RESTART";
})(CloseCode = exports.CloseCode || (exports.CloseCode = {}));
class ServerError extends Error {
    constructor(code, message) {
        super(message);
        this.name = "ServerError";
        this.code = code;
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=ServerError.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/index.js":
/*!***********************************************!*\
  !*** ./node_modules/colyseus.js/lib/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SchemaSerializer = exports.registerSerializer = exports.Auth = exports.Room = exports.ErrorCode = exports.Protocol = exports.Client = void 0;
__webpack_require__(/*! ./legacy */ "./node_modules/colyseus.js/lib/legacy.js");
var Client_1 = __webpack_require__(/*! ./Client */ "./node_modules/colyseus.js/lib/Client.js");
Object.defineProperty(exports, "Client", ({ enumerable: true, get: function () { return Client_1.Client; } }));
var Protocol_1 = __webpack_require__(/*! ./Protocol */ "./node_modules/colyseus.js/lib/Protocol.js");
Object.defineProperty(exports, "Protocol", ({ enumerable: true, get: function () { return Protocol_1.Protocol; } }));
Object.defineProperty(exports, "ErrorCode", ({ enumerable: true, get: function () { return Protocol_1.ErrorCode; } }));
var Room_1 = __webpack_require__(/*! ./Room */ "./node_modules/colyseus.js/lib/Room.js");
Object.defineProperty(exports, "Room", ({ enumerable: true, get: function () { return Room_1.Room; } }));
var Auth_1 = __webpack_require__(/*! ./Auth */ "./node_modules/colyseus.js/lib/Auth.js");
Object.defineProperty(exports, "Auth", ({ enumerable: true, get: function () { return Auth_1.Auth; } }));
/*
 * Serializers
 */
const SchemaSerializer_1 = __webpack_require__(/*! ./serializer/SchemaSerializer */ "./node_modules/colyseus.js/lib/serializer/SchemaSerializer.js");
Object.defineProperty(exports, "SchemaSerializer", ({ enumerable: true, get: function () { return SchemaSerializer_1.SchemaSerializer; } }));
const NoneSerializer_1 = __webpack_require__(/*! ./serializer/NoneSerializer */ "./node_modules/colyseus.js/lib/serializer/NoneSerializer.js");
const Serializer_1 = __webpack_require__(/*! ./serializer/Serializer */ "./node_modules/colyseus.js/lib/serializer/Serializer.js");
Object.defineProperty(exports, "registerSerializer", ({ enumerable: true, get: function () { return Serializer_1.registerSerializer; } }));
(0, Serializer_1.registerSerializer)('schema', SchemaSerializer_1.SchemaSerializer);
(0, Serializer_1.registerSerializer)('none', NoneSerializer_1.NoneSerializer);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/legacy.js":
/*!************************************************!*\
  !*** ./node_modules/colyseus.js/lib/legacy.js ***!
  \************************************************/
/***/ (() => {

//
// Polyfills for legacy environments
//
/*
 * Support Android 4.4.x
 */
if (!ArrayBuffer.isView) {
    ArrayBuffer.isView = (a) => {
        return a !== null && typeof (a) === 'object' && a.buffer instanceof ArrayBuffer;
    };
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

/***/ "./node_modules/colyseus.js/lib/msgpack/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/colyseus.js/lib/msgpack/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Copyright (c) 2014 Ion Drive Software Ltd.
 * https://github.com/darrachequesne/notepack/
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
 * SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decode = exports.encode = void 0;
/**
 * Patch for Colyseus:
 * -------------------
 * notepack.io@3.0.1
 *
 * added `offset` on Decoder constructor, for messages arriving with a code
 * before actual msgpack data
 */
//
// DECODER
//
function Decoder(buffer, offset) {
    this._offset = offset;
    if (buffer instanceof ArrayBuffer) {
        this._buffer = buffer;
        this._view = new DataView(this._buffer);
    }
    else if (ArrayBuffer.isView(buffer)) {
        this._buffer = buffer.buffer;
        this._view = new DataView(this._buffer, buffer.byteOffset, buffer.byteLength);
    }
    else {
        throw new Error('Invalid argument');
    }
}
function utf8Read(view, offset, length) {
    var string = '', chr = 0;
    for (var i = offset, end = offset + length; i < end; i++) {
        var byte = view.getUint8(i);
        if ((byte & 0x80) === 0x00) {
            string += String.fromCharCode(byte);
            continue;
        }
        if ((byte & 0xe0) === 0xc0) {
            string += String.fromCharCode(((byte & 0x1f) << 6) |
                (view.getUint8(++i) & 0x3f));
            continue;
        }
        if ((byte & 0xf0) === 0xe0) {
            string += String.fromCharCode(((byte & 0x0f) << 12) |
                ((view.getUint8(++i) & 0x3f) << 6) |
                ((view.getUint8(++i) & 0x3f) << 0));
            continue;
        }
        if ((byte & 0xf8) === 0xf0) {
            chr = ((byte & 0x07) << 18) |
                ((view.getUint8(++i) & 0x3f) << 12) |
                ((view.getUint8(++i) & 0x3f) << 6) |
                ((view.getUint8(++i) & 0x3f) << 0);
            if (chr >= 0x010000) { // surrogate pair
                chr -= 0x010000;
                string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
            }
            else {
                string += String.fromCharCode(chr);
            }
            continue;
        }
        throw new Error('Invalid byte ' + byte.toString(16));
    }
    return string;
}
Decoder.prototype._array = function (length) {
    var value = new Array(length);
    for (var i = 0; i < length; i++) {
        value[i] = this._parse();
    }
    return value;
};
Decoder.prototype._map = function (length) {
    var key = '', value = {};
    for (var i = 0; i < length; i++) {
        key = this._parse();
        value[key] = this._parse();
    }
    return value;
};
Decoder.prototype._str = function (length) {
    var value = utf8Read(this._view, this._offset, length);
    this._offset += length;
    return value;
};
Decoder.prototype._bin = function (length) {
    var value = this._buffer.slice(this._offset, this._offset + length);
    this._offset += length;
    return value;
};
Decoder.prototype._parse = function () {
    var prefix = this._view.getUint8(this._offset++);
    var value, length = 0, type = 0, hi = 0, lo = 0;
    if (prefix < 0xc0) {
        // positive fixint
        if (prefix < 0x80) {
            return prefix;
        }
        // fixmap
        if (prefix < 0x90) {
            return this._map(prefix & 0x0f);
        }
        // fixarray
        if (prefix < 0xa0) {
            return this._array(prefix & 0x0f);
        }
        // fixstr
        return this._str(prefix & 0x1f);
    }
    // negative fixint
    if (prefix > 0xdf) {
        return (0xff - prefix + 1) * -1;
    }
    switch (prefix) {
        // nil
        case 0xc0:
            return null;
        // false
        case 0xc2:
            return false;
        // true
        case 0xc3:
            return true;
        // bin
        case 0xc4:
            length = this._view.getUint8(this._offset);
            this._offset += 1;
            return this._bin(length);
        case 0xc5:
            length = this._view.getUint16(this._offset);
            this._offset += 2;
            return this._bin(length);
        case 0xc6:
            length = this._view.getUint32(this._offset);
            this._offset += 4;
            return this._bin(length);
        // ext
        case 0xc7:
            length = this._view.getUint8(this._offset);
            type = this._view.getInt8(this._offset + 1);
            this._offset += 2;
            if (type === -1) {
                // timestamp 96
                var ns = this._view.getUint32(this._offset);
                hi = this._view.getInt32(this._offset + 4);
                lo = this._view.getUint32(this._offset + 8);
                this._offset += 12;
                return new Date((hi * 0x100000000 + lo) * 1e3 + ns / 1e6);
            }
            return [type, this._bin(length)];
        case 0xc8:
            length = this._view.getUint16(this._offset);
            type = this._view.getInt8(this._offset + 2);
            this._offset += 3;
            return [type, this._bin(length)];
        case 0xc9:
            length = this._view.getUint32(this._offset);
            type = this._view.getInt8(this._offset + 4);
            this._offset += 5;
            return [type, this._bin(length)];
        // float
        case 0xca:
            value = this._view.getFloat32(this._offset);
            this._offset += 4;
            return value;
        case 0xcb:
            value = this._view.getFloat64(this._offset);
            this._offset += 8;
            return value;
        // uint
        case 0xcc:
            value = this._view.getUint8(this._offset);
            this._offset += 1;
            return value;
        case 0xcd:
            value = this._view.getUint16(this._offset);
            this._offset += 2;
            return value;
        case 0xce:
            value = this._view.getUint32(this._offset);
            this._offset += 4;
            return value;
        case 0xcf:
            hi = this._view.getUint32(this._offset) * Math.pow(2, 32);
            lo = this._view.getUint32(this._offset + 4);
            this._offset += 8;
            return hi + lo;
        // int
        case 0xd0:
            value = this._view.getInt8(this._offset);
            this._offset += 1;
            return value;
        case 0xd1:
            value = this._view.getInt16(this._offset);
            this._offset += 2;
            return value;
        case 0xd2:
            value = this._view.getInt32(this._offset);
            this._offset += 4;
            return value;
        case 0xd3:
            hi = this._view.getInt32(this._offset) * Math.pow(2, 32);
            lo = this._view.getUint32(this._offset + 4);
            this._offset += 8;
            return hi + lo;
        // fixext
        case 0xd4:
            type = this._view.getInt8(this._offset);
            this._offset += 1;
            if (type === 0x00) {
                // custom encoding for 'undefined' (kept for backward-compatibility)
                this._offset += 1;
                return void 0;
            }
            return [type, this._bin(1)];
        case 0xd5:
            type = this._view.getInt8(this._offset);
            this._offset += 1;
            return [type, this._bin(2)];
        case 0xd6:
            type = this._view.getInt8(this._offset);
            this._offset += 1;
            if (type === -1) {
                // timestamp 32
                value = this._view.getUint32(this._offset);
                this._offset += 4;
                return new Date(value * 1e3);
            }
            return [type, this._bin(4)];
        case 0xd7:
            type = this._view.getInt8(this._offset);
            this._offset += 1;
            if (type === 0x00) {
                // custom date encoding (kept for backward-compatibility)
                hi = this._view.getInt32(this._offset) * Math.pow(2, 32);
                lo = this._view.getUint32(this._offset + 4);
                this._offset += 8;
                return new Date(hi + lo);
            }
            if (type === -1) {
                // timestamp 64
                hi = this._view.getUint32(this._offset);
                lo = this._view.getUint32(this._offset + 4);
                this._offset += 8;
                var s = (hi & 0x3) * 0x100000000 + lo;
                return new Date(s * 1e3 + (hi >>> 2) / 1e6);
            }
            return [type, this._bin(8)];
        case 0xd8:
            type = this._view.getInt8(this._offset);
            this._offset += 1;
            return [type, this._bin(16)];
        // str
        case 0xd9:
            length = this._view.getUint8(this._offset);
            this._offset += 1;
            return this._str(length);
        case 0xda:
            length = this._view.getUint16(this._offset);
            this._offset += 2;
            return this._str(length);
        case 0xdb:
            length = this._view.getUint32(this._offset);
            this._offset += 4;
            return this._str(length);
        // array
        case 0xdc:
            length = this._view.getUint16(this._offset);
            this._offset += 2;
            return this._array(length);
        case 0xdd:
            length = this._view.getUint32(this._offset);
            this._offset += 4;
            return this._array(length);
        // map
        case 0xde:
            length = this._view.getUint16(this._offset);
            this._offset += 2;
            return this._map(length);
        case 0xdf:
            length = this._view.getUint32(this._offset);
            this._offset += 4;
            return this._map(length);
    }
    throw new Error('Could not parse');
};
function decode(buffer, offset = 0) {
    var decoder = new Decoder(buffer, offset);
    var value = decoder._parse();
    if (decoder._offset !== buffer.byteLength) {
        throw new Error((buffer.byteLength - decoder._offset) + ' trailing bytes');
    }
    return value;
}
exports.decode = decode;
//
// ENCODER
//
var TIMESTAMP32_MAX_SEC = 0x100000000 - 1; // 32-bit unsigned int
var TIMESTAMP64_MAX_SEC = 0x400000000 - 1; // 34-bit unsigned int
function utf8Write(view, offset, str) {
    var c = 0;
    for (var i = 0, l = str.length; i < l; i++) {
        c = str.charCodeAt(i);
        if (c < 0x80) {
            view.setUint8(offset++, c);
        }
        else if (c < 0x800) {
            view.setUint8(offset++, 0xc0 | (c >> 6));
            view.setUint8(offset++, 0x80 | (c & 0x3f));
        }
        else if (c < 0xd800 || c >= 0xe000) {
            view.setUint8(offset++, 0xe0 | (c >> 12));
            view.setUint8(offset++, 0x80 | (c >> 6) & 0x3f);
            view.setUint8(offset++, 0x80 | (c & 0x3f));
        }
        else {
            i++;
            c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            view.setUint8(offset++, 0xf0 | (c >> 18));
            view.setUint8(offset++, 0x80 | (c >> 12) & 0x3f);
            view.setUint8(offset++, 0x80 | (c >> 6) & 0x3f);
            view.setUint8(offset++, 0x80 | (c & 0x3f));
        }
    }
}
function utf8Length(str) {
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
}
function _encode(bytes, defers, value) {
    var type = typeof value, i = 0, l = 0, hi = 0, lo = 0, length = 0, size = 0;
    if (type === 'string') {
        length = utf8Length(value);
        // fixstr
        if (length < 0x20) {
            bytes.push(length | 0xa0);
            size = 1;
        }
        // str 8
        else if (length < 0x100) {
            bytes.push(0xd9, length);
            size = 2;
        }
        // str 16
        else if (length < 0x10000) {
            bytes.push(0xda, length >> 8, length);
            size = 3;
        }
        // str 32
        else if (length < 0x100000000) {
            bytes.push(0xdb, length >> 24, length >> 16, length >> 8, length);
            size = 5;
        }
        else {
            throw new Error('String too long');
        }
        defers.push({ _str: value, _length: length, _offset: bytes.length });
        return size + length;
    }
    if (type === 'number') {
        // TODO: encode to float 32?
        // float 64
        if (Math.floor(value) !== value || !isFinite(value)) {
            bytes.push(0xcb);
            defers.push({ _float: value, _length: 8, _offset: bytes.length });
            return 9;
        }
        if (value >= 0) {
            // positive fixnum
            if (value < 0x80) {
                bytes.push(value);
                return 1;
            }
            // uint 8
            if (value < 0x100) {
                bytes.push(0xcc, value);
                return 2;
            }
            // uint 16
            if (value < 0x10000) {
                bytes.push(0xcd, value >> 8, value);
                return 3;
            }
            // uint 32
            if (value < 0x100000000) {
                bytes.push(0xce, value >> 24, value >> 16, value >> 8, value);
                return 5;
            }
            // uint 64
            hi = (value / Math.pow(2, 32)) >> 0;
            lo = value >>> 0;
            bytes.push(0xcf, hi >> 24, hi >> 16, hi >> 8, hi, lo >> 24, lo >> 16, lo >> 8, lo);
            return 9;
        }
        else {
            // negative fixnum
            if (value >= -0x20) {
                bytes.push(value);
                return 1;
            }
            // int 8
            if (value >= -0x80) {
                bytes.push(0xd0, value);
                return 2;
            }
            // int 16
            if (value >= -0x8000) {
                bytes.push(0xd1, value >> 8, value);
                return 3;
            }
            // int 32
            if (value >= -0x80000000) {
                bytes.push(0xd2, value >> 24, value >> 16, value >> 8, value);
                return 5;
            }
            // int 64
            hi = Math.floor(value / Math.pow(2, 32));
            lo = value >>> 0;
            bytes.push(0xd3, hi >> 24, hi >> 16, hi >> 8, hi, lo >> 24, lo >> 16, lo >> 8, lo);
            return 9;
        }
    }
    if (type === 'object') {
        // nil
        if (value === null) {
            bytes.push(0xc0);
            return 1;
        }
        if (Array.isArray(value)) {
            length = value.length;
            // fixarray
            if (length < 0x10) {
                bytes.push(length | 0x90);
                size = 1;
            }
            // array 16
            else if (length < 0x10000) {
                bytes.push(0xdc, length >> 8, length);
                size = 3;
            }
            // array 32
            else if (length < 0x100000000) {
                bytes.push(0xdd, length >> 24, length >> 16, length >> 8, length);
                size = 5;
            }
            else {
                throw new Error('Array too large');
            }
            for (i = 0; i < length; i++) {
                size += _encode(bytes, defers, value[i]);
            }
            return size;
        }
        if (value instanceof Date) {
            var ms = value.getTime();
            var s = Math.floor(ms / 1e3);
            var ns = (ms - s * 1e3) * 1e6;
            if (s >= 0 && ns >= 0 && s <= TIMESTAMP64_MAX_SEC) {
                if (ns === 0 && s <= TIMESTAMP32_MAX_SEC) {
                    // timestamp 32
                    bytes.push(0xd6, 0xff, s >> 24, s >> 16, s >> 8, s);
                    return 6;
                }
                else {
                    // timestamp 64
                    hi = s / 0x100000000;
                    lo = s & 0xffffffff;
                    bytes.push(0xd7, 0xff, ns >> 22, ns >> 14, ns >> 6, hi, lo >> 24, lo >> 16, lo >> 8, lo);
                    return 10;
                }
            }
            else {
                // timestamp 96
                hi = Math.floor(s / 0x100000000);
                lo = s >>> 0;
                bytes.push(0xc7, 0x0c, 0xff, ns >> 24, ns >> 16, ns >> 8, ns, hi >> 24, hi >> 16, hi >> 8, hi, lo >> 24, lo >> 16, lo >> 8, lo);
                return 15;
            }
        }
        if (value instanceof ArrayBuffer) {
            length = value.byteLength;
            // bin 8
            if (length < 0x100) {
                bytes.push(0xc4, length);
                size = 2;
            }
            else 
            // bin 16
            if (length < 0x10000) {
                bytes.push(0xc5, length >> 8, length);
                size = 3;
            }
            else 
            // bin 32
            if (length < 0x100000000) {
                bytes.push(0xc6, length >> 24, length >> 16, length >> 8, length);
                size = 5;
            }
            else {
                throw new Error('Buffer too large');
            }
            defers.push({ _bin: value, _length: length, _offset: bytes.length });
            return size + length;
        }
        if (typeof value.toJSON === 'function') {
            return _encode(bytes, defers, value.toJSON());
        }
        var keys = [], key = '';
        var allKeys = Object.keys(value);
        for (i = 0, l = allKeys.length; i < l; i++) {
            key = allKeys[i];
            if (value[key] !== undefined && typeof value[key] !== 'function') {
                keys.push(key);
            }
        }
        length = keys.length;
        // fixmap
        if (length < 0x10) {
            bytes.push(length | 0x80);
            size = 1;
        }
        // map 16
        else if (length < 0x10000) {
            bytes.push(0xde, length >> 8, length);
            size = 3;
        }
        // map 32
        else if (length < 0x100000000) {
            bytes.push(0xdf, length >> 24, length >> 16, length >> 8, length);
            size = 5;
        }
        else {
            throw new Error('Object too large');
        }
        for (i = 0; i < length; i++) {
            key = keys[i];
            size += _encode(bytes, defers, key);
            size += _encode(bytes, defers, value[key]);
        }
        return size;
    }
    // false/true
    if (type === 'boolean') {
        bytes.push(value ? 0xc3 : 0xc2);
        return 1;
    }
    if (type === 'undefined') {
        bytes.push(0xc0);
        return 1;
    }
    // custom types like BigInt (typeof value === 'bigint')
    if (typeof value.toJSON === 'function') {
        return _encode(bytes, defers, value.toJSON());
    }
    throw new Error('Could not encode');
}
function encode(value) {
    var bytes = [];
    var defers = [];
    var size = _encode(bytes, defers, value);
    var buf = new ArrayBuffer(size);
    var view = new DataView(buf);
    var deferIndex = 0;
    var deferWritten = 0;
    var nextOffset = -1;
    if (defers.length > 0) {
        nextOffset = defers[0]._offset;
    }
    var defer, deferLength = 0, offset = 0;
    for (var i = 0, l = bytes.length; i < l; i++) {
        view.setUint8(deferWritten + i, bytes[i]);
        if (i + 1 !== nextOffset) {
            continue;
        }
        defer = defers[deferIndex];
        deferLength = defer._length;
        offset = deferWritten + nextOffset;
        if (defer._bin) {
            var bin = new Uint8Array(defer._bin);
            for (var j = 0; j < deferLength; j++) {
                view.setUint8(offset + j, bin[j]);
            }
        }
        else if (defer._str) {
            utf8Write(view, offset, defer._str);
        }
        else if (defer._float !== undefined) {
            view.setFloat64(offset, defer._float);
        }
        deferIndex++;
        deferWritten += deferLength;
        if (defers[deferIndex]) {
            nextOffset = defers[deferIndex]._offset;
        }
    }
    return buf;
}
exports.encode = encode;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/serializer/NoneSerializer.js":
/*!*******************************************************************!*\
  !*** ./node_modules/colyseus.js/lib/serializer/NoneSerializer.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoneSerializer = void 0;
class NoneSerializer {
    setState(rawState) { }
    getState() { return null; }
    patch(patches) { }
    teardown() { }
    handshake(bytes) { }
}
exports.NoneSerializer = NoneSerializer;
//# sourceMappingURL=NoneSerializer.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/serializer/SchemaSerializer.js":
/*!*********************************************************************!*\
  !*** ./node_modules/colyseus.js/lib/serializer/SchemaSerializer.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SchemaSerializer = void 0;
const schema_1 = __webpack_require__(/*! @colyseus/schema */ "./node_modules/@colyseus/schema/build/umd/index.js");
class SchemaSerializer {
    setState(rawState) {
        return this.state.decode(rawState);
    }
    getState() {
        return this.state;
    }
    patch(patches) {
        return this.state.decode(patches);
    }
    teardown() {
        var _a, _b;
        (_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a['$changes']) === null || _b === void 0 ? void 0 : _b.root.clearRefs();
    }
    handshake(bytes, it) {
        if (this.state) {
            // TODO: validate client/server definitinos
            const reflection = new schema_1.Reflection();
            reflection.decode(bytes, it);
        }
        else {
            // initialize reflected state from server
            this.state = schema_1.Reflection.decode(bytes, it);
        }
    }
}
exports.SchemaSerializer = SchemaSerializer;
//# sourceMappingURL=SchemaSerializer.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/serializer/Serializer.js":
/*!***************************************************************!*\
  !*** ./node_modules/colyseus.js/lib/serializer/Serializer.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSerializer = exports.registerSerializer = void 0;
const serializers = {};
function registerSerializer(id, serializer) {
    serializers[id] = serializer;
}
exports.registerSerializer = registerSerializer;
function getSerializer(id) {
    const serializer = serializers[id];
    if (!serializer) {
        throw new Error("missing serializer: " + id);
    }
    return serializer;
}
exports.getSerializer = getSerializer;
//# sourceMappingURL=Serializer.js.map

/***/ }),

/***/ "./node_modules/colyseus.js/lib/transport/WebSocketTransport.js":
/*!**********************************************************************!*\
  !*** ./node_modules/colyseus.js/lib/transport/WebSocketTransport.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocketTransport = void 0;
const ws_1 = __importDefault(__webpack_require__(/*! ws */ "./node_modules/ws/browser.js"));
const WebSocket = globalThis.WebSocket || ws_1.default;
class WebSocketTransport {
    constructor(events) {
        this.events = events;
    }
    send(data) {
        if (data instanceof ArrayBuffer) {
            this.ws.send(data);
        }
        else if (Array.isArray(data)) {
            this.ws.send((new Uint8Array(data)).buffer);
        }
    }
    connect(url) {
        this.ws = new WebSocket(url, this.protocols);
        this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = this.events.onopen;
        this.ws.onmessage = this.events.onmessage;
        this.ws.onclose = this.events.onclose;
        this.ws.onerror = this.events.onerror;
    }
    close(code, reason) {
        this.ws.close(code, reason);
    }
    get isOpen() {
        return this.ws.readyState === WebSocket.OPEN;
    }
}
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
/* harmony import */ var colyseus_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! colyseus.js */ "./node_modules/colyseus.js/lib/index.js");
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