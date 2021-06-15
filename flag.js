"use strict";

// ============================================================================
// Polyfills
//
// The Javascript version running in server environments like Google Ads is
// often old. Since these are among the places where this snippet may be
// useful we want to make sure it runs well.
//
// Number.isInteger
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
//
// Object.entries
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
// ============================================================================

if (!Number.isInteger) {
  Number.isInteger = function (n) {
    return (typeof n === "number") && isFinite(n) && (Math.floor(n) === n);
  };
}

if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i);

    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }

    return resArray;
  };
}

// ============================================================================
// Basic tools
//
// definePropFor
// Saves us a few characters but also prevents the need for declaring a
// reference to "this" (ex. var self = this;)
// ============================================================================
var type = Function.prototype.call.bind(Object.prototype.toString);

var entries = function (o, callback) {
  Object.entries(o).forEach(callback);
};

var definePropFor = function (target) {
  var dp = Object.defineProperty;

  return function (propName, props) {
    dp(target, propName, props);
  };
};


// ============================================================================
// The Flag function / object
// Parameter: an array of strings (used as keys)
//
// IMPORTANT
// The index of each string inside the array is what gives them their
// respective value. So it is important that their order remains the same at
// each use.
// ============================================================================
const Flag = function (arr) {

  if (arr.length > 31) {
    throw "Too many keys in Flag. Bitwise operators are limited to 32 bits numbers.";
  }

  var keys = {},
      defProp = definePropFor(this),
      max = Math.pow(2, arr.length) - 1,
      value = 0;

  arr.forEach(function (keyname, idx) {
    var keyBitValue = Math.pow(2, idx);
    keys[keyname] = keyBitValue;

    defProp(keyname, {
      "enumerable": true,
      "get": function () {
        return (value & keyBitValue) === keyBitValue;
      },
      "set": function (b) {

        if (typeof b !== "boolean") {
          b = !!b;
        }

        if (b === true) {
          value |= keyBitValue;
        } else if (b === false) {
          value &= (~keyBitValue >>> 0);
        }
      }
    });
  });

  Object.defineProperties(this, {
    "value": {
      "enumerable": false,
      "get": function () {
        return value;
      },
      "set": function (v) {

        if (!Number.isInteger(v) || (v < 0) || (v > max)) {
          throw "Flag value should only be set to an integer";
        }

        value = v;
      }
    },
    "bitValues": {
      "enumerable": false,
      "value": keys
    }
  });
};

Object.defineProperties(Flag.prototype, {
  "valueOf": {
    "value": function () {
      return this.value;
    }
  },
  "toString": {
    "value": function () {
      return this.value.toString();
    }
  },
  "forEach": {
    "value": function (callback) {
      Object.entries(this).forEach(callback);
    }
  },
  "getCheckValues": {
    "value": function (paramsObject) {
      var bitValues = this.bitValues,
          kHas = Object.prototype.hasOwnProperty.bind(bitValues),
          mask = 0,
          compareValue = 0;

      entries(paramsObject, function (keyArr) {

        if (!kHas(keyArr[0])) {
          return;
        }

        var boolVal = keyArr[1],
            keyBitValue = bitValues[keyArr[0]];

        mask |= keyBitValue;

        if (boolVal === true) {
          compareValue |= keyBitValue;
        } else if (boolVal === false) {
          compareValue &= (~keyBitValue >>> 0);
        }
      });

      return function (n) {
        return (n & mask) === compareValue;
      };
    }
  }
});
