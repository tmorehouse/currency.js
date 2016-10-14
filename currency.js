/*!
 * currency.js - v0.4.4
 * http://scurker.github.io/currency.js
 *
 * Copyright (c) 2016 Jason Wilson
 * Released under MIT license
 */
(function(global) {
  "use strict";

  var SCALE = 100;
  /**
   * Create a new instance of currency.js
   * {number|string|currency}
   */
  var currency = function(value) {
    var that = this;

    if (!(that instanceof currency)) {
      return new currency(value);
    }

    // Set int/real values
    that.intValue = parse(value);
    that.value = that.intValue / SCALE;
  };

  // Default options
  var settings = currency.settings = {
    symbol: '$'
    , separator: ','
    , decimal: '.'
    , precision: 2
    , formatWithSymbol: false
    , errorOnInvalid: false
  };

  
  
  // Convert a number to a normalized value
  function parse(value, round) {
    var v = 0;

    // Set default rounding
    typeof(round) === 'undefined' && (round = true);

    if (typeof value === 'number') {
      v = value * SCALE;
    } else if (value instanceof currency) {
      v = value.intValue;
    } else if (typeof(value) === 'string') {
      var regex = new RegExp('[^-\\d' + settings.decimal + ']', 'g');
      var decimal = new RegExp('\\' + settings.decimal, 'g');
      v = parseFloat(
            value
              .replace(/\((.*)\)/, '-$1') // allow negative e.g. (1.99)
              .replace(regex, '')         // replace any non numeric values
              .replace(decimal, '.')      // convert any decimal values
              * SCALE                     // scale number to integer value
          );
      v = isNaN(v) ? 0 : v;
    } else {
      if(settings.errorOnInvalid) {
        throw Error("Invalid Input");
      }
      v = 0;
    }

    return round ? Math.round(v) : v;
  }

  function toFixed(value,precision) {
		var power = Math.pow(10,precision);
		// Multiply up by precision, round accurately, then divide and use native toFixed():
		return (Math.round(value * power) / power).toFixed(precision);
  };
  
  currency.prototype = {

    add: function(number) {
      var v = this.intValue;
      return currency((v += parse(number)) / SCALE);
    },

    subtract: function(number) {
      var v = this.intValue;
      return currency((v -= parse(number)) / SCALE);
    },

    multiply: function(number) {
      var v = this.intValue;
      return currency((v/SCALE)*(parse(number, false)) / (SCALE * SCALE));
    },

    divide: function(number) {
      var v = this.intValue;
      return currency(v /= parse(number, false));
    },

    distribute: function(count) {
      var value = this.intValue
        , distribution = []
        , split = Math[value >= 0 ? 'floor' : 'ceil'](value / count)
        , pennies = Math.abs(value - (split * count));

      for (; count !== 0; count--) {
        var item = currency(split / SCALE);

        // Add any left over pennies
        pennies-- > 0 && (item = parseFloat(item) >= 0 ? item.add(.01) : item.subtract(.01));

        distribution.push(item);
      }

      return distribution;
    },

    dollars: function() {
      return Math.round(this.intValue / SCALE);
    },

    cents: function() {
      return Math.round(this.intValue % SCALE);
    },

    format: function(symbol) {
      // set symbol formatting
      typeof(symbol) === 'undefined' && (symbol = settings.formatWithSymbol);

      return ((symbol ? settings.symbol : '') + this)
        .replace(/(\d)(?=(\d{3})+\b)/g, '$1' + settings.separator)
        // replace only the last decimal
        .replace(/\.(\d{2})$/, settings.decimal + '$1');
    },

    toFixed: function() {
      return toFixed(this.intValue / SCALE), settings.precision);
    },
    
    toString: function() {
      return this.toFixed);
    },
    
    valueOf: function() {
      return parseFloat(this.toFixed());
    },

    toJSON: function() {
      return this.value;
    }

  };

  /* istanbul ignore next */
  if(typeof define === 'function' && define.amd) {
    define([], function() { return currency; });
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = currency;
  } else {
    global.currency = currency;
  }

})(this);
