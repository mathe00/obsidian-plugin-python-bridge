'use strict';

var obsidian = require('obsidian');
var child_process = require('child_process');
var fs = require('fs');
var net = require('net');
var path = require('path');

function _interopNamespaceDefault(e) {
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
    n.default = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var net__namespace = /*#__PURE__*/_interopNamespaceDefault(net);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

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


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var moment$1 = {exports: {}};

(function (module, exports) {
(function (global, factory) {
	    module.exports = factory() ;
	}(commonjsGlobal, (function () {
	    var hookCallback;

	    function hooks() {
	        return hookCallback.apply(null, arguments);
	    }

	    // This is done to register the method called with moment()
	    // without creating circular dependencies.
	    function setHookCallback(callback) {
	        hookCallback = callback;
	    }

	    function isArray(input) {
	        return (
	            input instanceof Array ||
	            Object.prototype.toString.call(input) === '[object Array]'
	        );
	    }

	    function isObject(input) {
	        // IE8 will treat undefined and null as object if it wasn't for
	        // input != null
	        return (
	            input != null &&
	            Object.prototype.toString.call(input) === '[object Object]'
	        );
	    }

	    function hasOwnProp(a, b) {
	        return Object.prototype.hasOwnProperty.call(a, b);
	    }

	    function isObjectEmpty(obj) {
	        if (Object.getOwnPropertyNames) {
	            return Object.getOwnPropertyNames(obj).length === 0;
	        } else {
	            var k;
	            for (k in obj) {
	                if (hasOwnProp(obj, k)) {
	                    return false;
	                }
	            }
	            return true;
	        }
	    }

	    function isUndefined(input) {
	        return input === void 0;
	    }

	    function isNumber(input) {
	        return (
	            typeof input === 'number' ||
	            Object.prototype.toString.call(input) === '[object Number]'
	        );
	    }

	    function isDate(input) {
	        return (
	            input instanceof Date ||
	            Object.prototype.toString.call(input) === '[object Date]'
	        );
	    }

	    function map(arr, fn) {
	        var res = [],
	            i,
	            arrLen = arr.length;
	        for (i = 0; i < arrLen; ++i) {
	            res.push(fn(arr[i], i));
	        }
	        return res;
	    }

	    function extend(a, b) {
	        for (var i in b) {
	            if (hasOwnProp(b, i)) {
	                a[i] = b[i];
	            }
	        }

	        if (hasOwnProp(b, 'toString')) {
	            a.toString = b.toString;
	        }

	        if (hasOwnProp(b, 'valueOf')) {
	            a.valueOf = b.valueOf;
	        }

	        return a;
	    }

	    function createUTC(input, format, locale, strict) {
	        return createLocalOrUTC(input, format, locale, strict, true).utc();
	    }

	    function defaultParsingFlags() {
	        // We need to deep clone this object.
	        return {
	            empty: false,
	            unusedTokens: [],
	            unusedInput: [],
	            overflow: -2,
	            charsLeftOver: 0,
	            nullInput: false,
	            invalidEra: null,
	            invalidMonth: null,
	            invalidFormat: false,
	            userInvalidated: false,
	            iso: false,
	            parsedDateParts: [],
	            era: null,
	            meridiem: null,
	            rfc2822: false,
	            weekdayMismatch: false,
	        };
	    }

	    function getParsingFlags(m) {
	        if (m._pf == null) {
	            m._pf = defaultParsingFlags();
	        }
	        return m._pf;
	    }

	    var some;
	    if (Array.prototype.some) {
	        some = Array.prototype.some;
	    } else {
	        some = function (fun) {
	            var t = Object(this),
	                len = t.length >>> 0,
	                i;

	            for (i = 0; i < len; i++) {
	                if (i in t && fun.call(this, t[i], i, t)) {
	                    return true;
	                }
	            }

	            return false;
	        };
	    }

	    function isValid(m) {
	        if (m._isValid == null) {
	            var flags = getParsingFlags(m),
	                parsedParts = some.call(flags.parsedDateParts, function (i) {
	                    return i != null;
	                }),
	                isNowValid =
	                    !isNaN(m._d.getTime()) &&
	                    flags.overflow < 0 &&
	                    !flags.empty &&
	                    !flags.invalidEra &&
	                    !flags.invalidMonth &&
	                    !flags.invalidWeekday &&
	                    !flags.weekdayMismatch &&
	                    !flags.nullInput &&
	                    !flags.invalidFormat &&
	                    !flags.userInvalidated &&
	                    (!flags.meridiem || (flags.meridiem && parsedParts));

	            if (m._strict) {
	                isNowValid =
	                    isNowValid &&
	                    flags.charsLeftOver === 0 &&
	                    flags.unusedTokens.length === 0 &&
	                    flags.bigHour === undefined;
	            }

	            if (Object.isFrozen == null || !Object.isFrozen(m)) {
	                m._isValid = isNowValid;
	            } else {
	                return isNowValid;
	            }
	        }
	        return m._isValid;
	    }

	    function createInvalid(flags) {
	        var m = createUTC(NaN);
	        if (flags != null) {
	            extend(getParsingFlags(m), flags);
	        } else {
	            getParsingFlags(m).userInvalidated = true;
	        }

	        return m;
	    }

	    // Plugins that add properties should also add the key here (null value),
	    // so we can properly clone ourselves.
	    var momentProperties = (hooks.momentProperties = []),
	        updateInProgress = false;

	    function copyConfig(to, from) {
	        var i,
	            prop,
	            val,
	            momentPropertiesLen = momentProperties.length;

	        if (!isUndefined(from._isAMomentObject)) {
	            to._isAMomentObject = from._isAMomentObject;
	        }
	        if (!isUndefined(from._i)) {
	            to._i = from._i;
	        }
	        if (!isUndefined(from._f)) {
	            to._f = from._f;
	        }
	        if (!isUndefined(from._l)) {
	            to._l = from._l;
	        }
	        if (!isUndefined(from._strict)) {
	            to._strict = from._strict;
	        }
	        if (!isUndefined(from._tzm)) {
	            to._tzm = from._tzm;
	        }
	        if (!isUndefined(from._isUTC)) {
	            to._isUTC = from._isUTC;
	        }
	        if (!isUndefined(from._offset)) {
	            to._offset = from._offset;
	        }
	        if (!isUndefined(from._pf)) {
	            to._pf = getParsingFlags(from);
	        }
	        if (!isUndefined(from._locale)) {
	            to._locale = from._locale;
	        }

	        if (momentPropertiesLen > 0) {
	            for (i = 0; i < momentPropertiesLen; i++) {
	                prop = momentProperties[i];
	                val = from[prop];
	                if (!isUndefined(val)) {
	                    to[prop] = val;
	                }
	            }
	        }

	        return to;
	    }

	    // Moment prototype object
	    function Moment(config) {
	        copyConfig(this, config);
	        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
	        if (!this.isValid()) {
	            this._d = new Date(NaN);
	        }
	        // Prevent infinite loop in case updateOffset creates new moment
	        // objects.
	        if (updateInProgress === false) {
	            updateInProgress = true;
	            hooks.updateOffset(this);
	            updateInProgress = false;
	        }
	    }

	    function isMoment(obj) {
	        return (
	            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
	        );
	    }

	    function warn(msg) {
	        if (
	            hooks.suppressDeprecationWarnings === false &&
	            typeof console !== 'undefined' &&
	            console.warn
	        ) {
	            console.warn('Deprecation warning: ' + msg);
	        }
	    }

	    function deprecate(msg, fn) {
	        var firstTime = true;

	        return extend(function () {
	            if (hooks.deprecationHandler != null) {
	                hooks.deprecationHandler(null, msg);
	            }
	            if (firstTime) {
	                var args = [],
	                    arg,
	                    i,
	                    key,
	                    argLen = arguments.length;
	                for (i = 0; i < argLen; i++) {
	                    arg = '';
	                    if (typeof arguments[i] === 'object') {
	                        arg += '\n[' + i + '] ';
	                        for (key in arguments[0]) {
	                            if (hasOwnProp(arguments[0], key)) {
	                                arg += key + ': ' + arguments[0][key] + ', ';
	                            }
	                        }
	                        arg = arg.slice(0, -2); // Remove trailing comma and space
	                    } else {
	                        arg = arguments[i];
	                    }
	                    args.push(arg);
	                }
	                warn(
	                    msg +
	                        '\nArguments: ' +
	                        Array.prototype.slice.call(args).join('') +
	                        '\n' +
	                        new Error().stack
	                );
	                firstTime = false;
	            }
	            return fn.apply(this, arguments);
	        }, fn);
	    }

	    var deprecations = {};

	    function deprecateSimple(name, msg) {
	        if (hooks.deprecationHandler != null) {
	            hooks.deprecationHandler(name, msg);
	        }
	        if (!deprecations[name]) {
	            warn(msg);
	            deprecations[name] = true;
	        }
	    }

	    hooks.suppressDeprecationWarnings = false;
	    hooks.deprecationHandler = null;

	    function isFunction(input) {
	        return (
	            (typeof Function !== 'undefined' && input instanceof Function) ||
	            Object.prototype.toString.call(input) === '[object Function]'
	        );
	    }

	    function set(config) {
	        var prop, i;
	        for (i in config) {
	            if (hasOwnProp(config, i)) {
	                prop = config[i];
	                if (isFunction(prop)) {
	                    this[i] = prop;
	                } else {
	                    this['_' + i] = prop;
	                }
	            }
	        }
	        this._config = config;
	        // Lenient ordinal parsing accepts just a number in addition to
	        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
	        // TODO: Remove "ordinalParse" fallback in next major release.
	        this._dayOfMonthOrdinalParseLenient = new RegExp(
	            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
	                '|' +
	                /\d{1,2}/.source
	        );
	    }

	    function mergeConfigs(parentConfig, childConfig) {
	        var res = extend({}, parentConfig),
	            prop;
	        for (prop in childConfig) {
	            if (hasOwnProp(childConfig, prop)) {
	                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
	                    res[prop] = {};
	                    extend(res[prop], parentConfig[prop]);
	                    extend(res[prop], childConfig[prop]);
	                } else if (childConfig[prop] != null) {
	                    res[prop] = childConfig[prop];
	                } else {
	                    delete res[prop];
	                }
	            }
	        }
	        for (prop in parentConfig) {
	            if (
	                hasOwnProp(parentConfig, prop) &&
	                !hasOwnProp(childConfig, prop) &&
	                isObject(parentConfig[prop])
	            ) {
	                // make sure changes to properties don't modify parent config
	                res[prop] = extend({}, res[prop]);
	            }
	        }
	        return res;
	    }

	    function Locale(config) {
	        if (config != null) {
	            this.set(config);
	        }
	    }

	    var keys;

	    if (Object.keys) {
	        keys = Object.keys;
	    } else {
	        keys = function (obj) {
	            var i,
	                res = [];
	            for (i in obj) {
	                if (hasOwnProp(obj, i)) {
	                    res.push(i);
	                }
	            }
	            return res;
	        };
	    }

	    var defaultCalendar = {
	        sameDay: '[Today at] LT',
	        nextDay: '[Tomorrow at] LT',
	        nextWeek: 'dddd [at] LT',
	        lastDay: '[Yesterday at] LT',
	        lastWeek: '[Last] dddd [at] LT',
	        sameElse: 'L',
	    };

	    function calendar(key, mom, now) {
	        var output = this._calendar[key] || this._calendar['sameElse'];
	        return isFunction(output) ? output.call(mom, now) : output;
	    }

	    function zeroFill(number, targetLength, forceSign) {
	        var absNumber = '' + Math.abs(number),
	            zerosToFill = targetLength - absNumber.length,
	            sign = number >= 0;
	        return (
	            (sign ? (forceSign ? '+' : '') : '-') +
	            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
	            absNumber
	        );
	    }

	    var formattingTokens =
	            /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
	        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
	        formatFunctions = {},
	        formatTokenFunctions = {};

	    // token:    'M'
	    // padded:   ['MM', 2]
	    // ordinal:  'Mo'
	    // callback: function () { this.month() + 1 }
	    function addFormatToken(token, padded, ordinal, callback) {
	        var func = callback;
	        if (typeof callback === 'string') {
	            func = function () {
	                return this[callback]();
	            };
	        }
	        if (token) {
	            formatTokenFunctions[token] = func;
	        }
	        if (padded) {
	            formatTokenFunctions[padded[0]] = function () {
	                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
	            };
	        }
	        if (ordinal) {
	            formatTokenFunctions[ordinal] = function () {
	                return this.localeData().ordinal(
	                    func.apply(this, arguments),
	                    token
	                );
	            };
	        }
	    }

	    function removeFormattingTokens(input) {
	        if (input.match(/\[[\s\S]/)) {
	            return input.replace(/^\[|\]$/g, '');
	        }
	        return input.replace(/\\/g, '');
	    }

	    function makeFormatFunction(format) {
	        var array = format.match(formattingTokens),
	            i,
	            length;

	        for (i = 0, length = array.length; i < length; i++) {
	            if (formatTokenFunctions[array[i]]) {
	                array[i] = formatTokenFunctions[array[i]];
	            } else {
	                array[i] = removeFormattingTokens(array[i]);
	            }
	        }

	        return function (mom) {
	            var output = '',
	                i;
	            for (i = 0; i < length; i++) {
	                output += isFunction(array[i])
	                    ? array[i].call(mom, format)
	                    : array[i];
	            }
	            return output;
	        };
	    }

	    // format date using native date object
	    function formatMoment(m, format) {
	        if (!m.isValid()) {
	            return m.localeData().invalidDate();
	        }

	        format = expandFormat(format, m.localeData());
	        formatFunctions[format] =
	            formatFunctions[format] || makeFormatFunction(format);

	        return formatFunctions[format](m);
	    }

	    function expandFormat(format, locale) {
	        var i = 5;

	        function replaceLongDateFormatTokens(input) {
	            return locale.longDateFormat(input) || input;
	        }

	        localFormattingTokens.lastIndex = 0;
	        while (i >= 0 && localFormattingTokens.test(format)) {
	            format = format.replace(
	                localFormattingTokens,
	                replaceLongDateFormatTokens
	            );
	            localFormattingTokens.lastIndex = 0;
	            i -= 1;
	        }

	        return format;
	    }

	    var defaultLongDateFormat = {
	        LTS: 'h:mm:ss A',
	        LT: 'h:mm A',
	        L: 'MM/DD/YYYY',
	        LL: 'MMMM D, YYYY',
	        LLL: 'MMMM D, YYYY h:mm A',
	        LLLL: 'dddd, MMMM D, YYYY h:mm A',
	    };

	    function longDateFormat(key) {
	        var format = this._longDateFormat[key],
	            formatUpper = this._longDateFormat[key.toUpperCase()];

	        if (format || !formatUpper) {
	            return format;
	        }

	        this._longDateFormat[key] = formatUpper
	            .match(formattingTokens)
	            .map(function (tok) {
	                if (
	                    tok === 'MMMM' ||
	                    tok === 'MM' ||
	                    tok === 'DD' ||
	                    tok === 'dddd'
	                ) {
	                    return tok.slice(1);
	                }
	                return tok;
	            })
	            .join('');

	        return this._longDateFormat[key];
	    }

	    var defaultInvalidDate = 'Invalid date';

	    function invalidDate() {
	        return this._invalidDate;
	    }

	    var defaultOrdinal = '%d',
	        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

	    function ordinal(number) {
	        return this._ordinal.replace('%d', number);
	    }

	    var defaultRelativeTime = {
	        future: 'in %s',
	        past: '%s ago',
	        s: 'a few seconds',
	        ss: '%d seconds',
	        m: 'a minute',
	        mm: '%d minutes',
	        h: 'an hour',
	        hh: '%d hours',
	        d: 'a day',
	        dd: '%d days',
	        w: 'a week',
	        ww: '%d weeks',
	        M: 'a month',
	        MM: '%d months',
	        y: 'a year',
	        yy: '%d years',
	    };

	    function relativeTime(number, withoutSuffix, string, isFuture) {
	        var output = this._relativeTime[string];
	        return isFunction(output)
	            ? output(number, withoutSuffix, string, isFuture)
	            : output.replace(/%d/i, number);
	    }

	    function pastFuture(diff, output) {
	        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
	        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
	    }

	    var aliases = {};

	    function addUnitAlias(unit, shorthand) {
	        var lowerCase = unit.toLowerCase();
	        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
	    }

	    function normalizeUnits(units) {
	        return typeof units === 'string'
	            ? aliases[units] || aliases[units.toLowerCase()]
	            : undefined;
	    }

	    function normalizeObjectUnits(inputObject) {
	        var normalizedInput = {},
	            normalizedProp,
	            prop;

	        for (prop in inputObject) {
	            if (hasOwnProp(inputObject, prop)) {
	                normalizedProp = normalizeUnits(prop);
	                if (normalizedProp) {
	                    normalizedInput[normalizedProp] = inputObject[prop];
	                }
	            }
	        }

	        return normalizedInput;
	    }

	    var priorities = {};

	    function addUnitPriority(unit, priority) {
	        priorities[unit] = priority;
	    }

	    function getPrioritizedUnits(unitsObj) {
	        var units = [],
	            u;
	        for (u in unitsObj) {
	            if (hasOwnProp(unitsObj, u)) {
	                units.push({ unit: u, priority: priorities[u] });
	            }
	        }
	        units.sort(function (a, b) {
	            return a.priority - b.priority;
	        });
	        return units;
	    }

	    function isLeapYear(year) {
	        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	    }

	    function absFloor(number) {
	        if (number < 0) {
	            // -0 -> 0
	            return Math.ceil(number) || 0;
	        } else {
	            return Math.floor(number);
	        }
	    }

	    function toInt(argumentForCoercion) {
	        var coercedNumber = +argumentForCoercion,
	            value = 0;

	        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
	            value = absFloor(coercedNumber);
	        }

	        return value;
	    }

	    function makeGetSet(unit, keepTime) {
	        return function (value) {
	            if (value != null) {
	                set$1(this, unit, value);
	                hooks.updateOffset(this, keepTime);
	                return this;
	            } else {
	                return get(this, unit);
	            }
	        };
	    }

	    function get(mom, unit) {
	        return mom.isValid()
	            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
	            : NaN;
	    }

	    function set$1(mom, unit, value) {
	        if (mom.isValid() && !isNaN(value)) {
	            if (
	                unit === 'FullYear' &&
	                isLeapYear(mom.year()) &&
	                mom.month() === 1 &&
	                mom.date() === 29
	            ) {
	                value = toInt(value);
	                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
	                    value,
	                    mom.month(),
	                    daysInMonth(value, mom.month())
	                );
	            } else {
	                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
	            }
	        }
	    }

	    // MOMENTS

	    function stringGet(units) {
	        units = normalizeUnits(units);
	        if (isFunction(this[units])) {
	            return this[units]();
	        }
	        return this;
	    }

	    function stringSet(units, value) {
	        if (typeof units === 'object') {
	            units = normalizeObjectUnits(units);
	            var prioritized = getPrioritizedUnits(units),
	                i,
	                prioritizedLen = prioritized.length;
	            for (i = 0; i < prioritizedLen; i++) {
	                this[prioritized[i].unit](units[prioritized[i].unit]);
	            }
	        } else {
	            units = normalizeUnits(units);
	            if (isFunction(this[units])) {
	                return this[units](value);
	            }
	        }
	        return this;
	    }

	    var match1 = /\d/, //       0 - 9
	        match2 = /\d\d/, //      00 - 99
	        match3 = /\d{3}/, //     000 - 999
	        match4 = /\d{4}/, //    0000 - 9999
	        match6 = /[+-]?\d{6}/, // -999999 - 999999
	        match1to2 = /\d\d?/, //       0 - 99
	        match3to4 = /\d\d\d\d?/, //     999 - 9999
	        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
	        match1to3 = /\d{1,3}/, //       0 - 999
	        match1to4 = /\d{1,4}/, //       0 - 9999
	        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
	        matchUnsigned = /\d+/, //       0 - inf
	        matchSigned = /[+-]?\d+/, //    -inf - inf
	        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
	        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
	        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
	        // any word (or two) characters or numbers including two/three word month in arabic.
	        // includes scottish gaelic two word and hyphenated months
	        matchWord =
	            /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
	        regexes;

	    regexes = {};

	    function addRegexToken(token, regex, strictRegex) {
	        regexes[token] = isFunction(regex)
	            ? regex
	            : function (isStrict, localeData) {
	                  return isStrict && strictRegex ? strictRegex : regex;
	              };
	    }

	    function getParseRegexForToken(token, config) {
	        if (!hasOwnProp(regexes, token)) {
	            return new RegExp(unescapeFormat(token));
	        }

	        return regexes[token](config._strict, config._locale);
	    }

	    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	    function unescapeFormat(s) {
	        return regexEscape(
	            s
	                .replace('\\', '')
	                .replace(
	                    /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
	                    function (matched, p1, p2, p3, p4) {
	                        return p1 || p2 || p3 || p4;
	                    }
	                )
	        );
	    }

	    function regexEscape(s) {
	        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	    }

	    var tokens = {};

	    function addParseToken(token, callback) {
	        var i,
	            func = callback,
	            tokenLen;
	        if (typeof token === 'string') {
	            token = [token];
	        }
	        if (isNumber(callback)) {
	            func = function (input, array) {
	                array[callback] = toInt(input);
	            };
	        }
	        tokenLen = token.length;
	        for (i = 0; i < tokenLen; i++) {
	            tokens[token[i]] = func;
	        }
	    }

	    function addWeekParseToken(token, callback) {
	        addParseToken(token, function (input, array, config, token) {
	            config._w = config._w || {};
	            callback(input, config._w, config, token);
	        });
	    }

	    function addTimeToArrayFromToken(token, input, config) {
	        if (input != null && hasOwnProp(tokens, token)) {
	            tokens[token](input, config._a, config, token);
	        }
	    }

	    var YEAR = 0,
	        MONTH = 1,
	        DATE = 2,
	        HOUR = 3,
	        MINUTE = 4,
	        SECOND = 5,
	        MILLISECOND = 6,
	        WEEK = 7,
	        WEEKDAY = 8;

	    function mod(n, x) {
	        return ((n % x) + x) % x;
	    }

	    var indexOf;

	    if (Array.prototype.indexOf) {
	        indexOf = Array.prototype.indexOf;
	    } else {
	        indexOf = function (o) {
	            // I know
	            var i;
	            for (i = 0; i < this.length; ++i) {
	                if (this[i] === o) {
	                    return i;
	                }
	            }
	            return -1;
	        };
	    }

	    function daysInMonth(year, month) {
	        if (isNaN(year) || isNaN(month)) {
	            return NaN;
	        }
	        var modMonth = mod(month, 12);
	        year += (month - modMonth) / 12;
	        return modMonth === 1
	            ? isLeapYear(year)
	                ? 29
	                : 28
	            : 31 - ((modMonth % 7) % 2);
	    }

	    // FORMATTING

	    addFormatToken('M', ['MM', 2], 'Mo', function () {
	        return this.month() + 1;
	    });

	    addFormatToken('MMM', 0, 0, function (format) {
	        return this.localeData().monthsShort(this, format);
	    });

	    addFormatToken('MMMM', 0, 0, function (format) {
	        return this.localeData().months(this, format);
	    });

	    // ALIASES

	    addUnitAlias('month', 'M');

	    // PRIORITY

	    addUnitPriority('month', 8);

	    // PARSING

	    addRegexToken('M', match1to2);
	    addRegexToken('MM', match1to2, match2);
	    addRegexToken('MMM', function (isStrict, locale) {
	        return locale.monthsShortRegex(isStrict);
	    });
	    addRegexToken('MMMM', function (isStrict, locale) {
	        return locale.monthsRegex(isStrict);
	    });

	    addParseToken(['M', 'MM'], function (input, array) {
	        array[MONTH] = toInt(input) - 1;
	    });

	    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
	        var month = config._locale.monthsParse(input, token, config._strict);
	        // if we didn't find a month name, mark the date as invalid.
	        if (month != null) {
	            array[MONTH] = month;
	        } else {
	            getParsingFlags(config).invalidMonth = input;
	        }
	    });

	    // LOCALES

	    var defaultLocaleMonths =
	            'January_February_March_April_May_June_July_August_September_October_November_December'.split(
	                '_'
	            ),
	        defaultLocaleMonthsShort =
	            'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
	        defaultMonthsShortRegex = matchWord,
	        defaultMonthsRegex = matchWord;

	    function localeMonths(m, format) {
	        if (!m) {
	            return isArray(this._months)
	                ? this._months
	                : this._months['standalone'];
	        }
	        return isArray(this._months)
	            ? this._months[m.month()]
	            : this._months[
	                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
	                      ? 'format'
	                      : 'standalone'
	              ][m.month()];
	    }

	    function localeMonthsShort(m, format) {
	        if (!m) {
	            return isArray(this._monthsShort)
	                ? this._monthsShort
	                : this._monthsShort['standalone'];
	        }
	        return isArray(this._monthsShort)
	            ? this._monthsShort[m.month()]
	            : this._monthsShort[
	                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
	              ][m.month()];
	    }

	    function handleStrictParse(monthName, format, strict) {
	        var i,
	            ii,
	            mom,
	            llc = monthName.toLocaleLowerCase();
	        if (!this._monthsParse) {
	            // this is not used
	            this._monthsParse = [];
	            this._longMonthsParse = [];
	            this._shortMonthsParse = [];
	            for (i = 0; i < 12; ++i) {
	                mom = createUTC([2000, i]);
	                this._shortMonthsParse[i] = this.monthsShort(
	                    mom,
	                    ''
	                ).toLocaleLowerCase();
	                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
	            }
	        }

	        if (strict) {
	            if (format === 'MMM') {
	                ii = indexOf.call(this._shortMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._longMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        } else {
	            if (format === 'MMM') {
	                ii = indexOf.call(this._shortMonthsParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._longMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._longMonthsParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._shortMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        }
	    }

	    function localeMonthsParse(monthName, format, strict) {
	        var i, mom, regex;

	        if (this._monthsParseExact) {
	            return handleStrictParse.call(this, monthName, format, strict);
	        }

	        if (!this._monthsParse) {
	            this._monthsParse = [];
	            this._longMonthsParse = [];
	            this._shortMonthsParse = [];
	        }

	        // TODO: add sorting
	        // Sorting makes sure if one month (or abbr) is a prefix of another
	        // see sorting in computeMonthsParse
	        for (i = 0; i < 12; i++) {
	            // make the regex if we don't have it already
	            mom = createUTC([2000, i]);
	            if (strict && !this._longMonthsParse[i]) {
	                this._longMonthsParse[i] = new RegExp(
	                    '^' + this.months(mom, '').replace('.', '') + '$',
	                    'i'
	                );
	                this._shortMonthsParse[i] = new RegExp(
	                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
	                    'i'
	                );
	            }
	            if (!strict && !this._monthsParse[i]) {
	                regex =
	                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
	                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
	            }
	            // test the regex
	            if (
	                strict &&
	                format === 'MMMM' &&
	                this._longMonthsParse[i].test(monthName)
	            ) {
	                return i;
	            } else if (
	                strict &&
	                format === 'MMM' &&
	                this._shortMonthsParse[i].test(monthName)
	            ) {
	                return i;
	            } else if (!strict && this._monthsParse[i].test(monthName)) {
	                return i;
	            }
	        }
	    }

	    // MOMENTS

	    function setMonth(mom, value) {
	        var dayOfMonth;

	        if (!mom.isValid()) {
	            // No op
	            return mom;
	        }

	        if (typeof value === 'string') {
	            if (/^\d+$/.test(value)) {
	                value = toInt(value);
	            } else {
	                value = mom.localeData().monthsParse(value);
	                // TODO: Another silent failure?
	                if (!isNumber(value)) {
	                    return mom;
	                }
	            }
	        }

	        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
	        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
	        return mom;
	    }

	    function getSetMonth(value) {
	        if (value != null) {
	            setMonth(this, value);
	            hooks.updateOffset(this, true);
	            return this;
	        } else {
	            return get(this, 'Month');
	        }
	    }

	    function getDaysInMonth() {
	        return daysInMonth(this.year(), this.month());
	    }

	    function monthsShortRegex(isStrict) {
	        if (this._monthsParseExact) {
	            if (!hasOwnProp(this, '_monthsRegex')) {
	                computeMonthsParse.call(this);
	            }
	            if (isStrict) {
	                return this._monthsShortStrictRegex;
	            } else {
	                return this._monthsShortRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_monthsShortRegex')) {
	                this._monthsShortRegex = defaultMonthsShortRegex;
	            }
	            return this._monthsShortStrictRegex && isStrict
	                ? this._monthsShortStrictRegex
	                : this._monthsShortRegex;
	        }
	    }

	    function monthsRegex(isStrict) {
	        if (this._monthsParseExact) {
	            if (!hasOwnProp(this, '_monthsRegex')) {
	                computeMonthsParse.call(this);
	            }
	            if (isStrict) {
	                return this._monthsStrictRegex;
	            } else {
	                return this._monthsRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_monthsRegex')) {
	                this._monthsRegex = defaultMonthsRegex;
	            }
	            return this._monthsStrictRegex && isStrict
	                ? this._monthsStrictRegex
	                : this._monthsRegex;
	        }
	    }

	    function computeMonthsParse() {
	        function cmpLenRev(a, b) {
	            return b.length - a.length;
	        }

	        var shortPieces = [],
	            longPieces = [],
	            mixedPieces = [],
	            i,
	            mom;
	        for (i = 0; i < 12; i++) {
	            // make the regex if we don't have it already
	            mom = createUTC([2000, i]);
	            shortPieces.push(this.monthsShort(mom, ''));
	            longPieces.push(this.months(mom, ''));
	            mixedPieces.push(this.months(mom, ''));
	            mixedPieces.push(this.monthsShort(mom, ''));
	        }
	        // Sorting makes sure if one month (or abbr) is a prefix of another it
	        // will match the longer piece.
	        shortPieces.sort(cmpLenRev);
	        longPieces.sort(cmpLenRev);
	        mixedPieces.sort(cmpLenRev);
	        for (i = 0; i < 12; i++) {
	            shortPieces[i] = regexEscape(shortPieces[i]);
	            longPieces[i] = regexEscape(longPieces[i]);
	        }
	        for (i = 0; i < 24; i++) {
	            mixedPieces[i] = regexEscape(mixedPieces[i]);
	        }

	        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	        this._monthsShortRegex = this._monthsRegex;
	        this._monthsStrictRegex = new RegExp(
	            '^(' + longPieces.join('|') + ')',
	            'i'
	        );
	        this._monthsShortStrictRegex = new RegExp(
	            '^(' + shortPieces.join('|') + ')',
	            'i'
	        );
	    }

	    // FORMATTING

	    addFormatToken('Y', 0, 0, function () {
	        var y = this.year();
	        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
	    });

	    addFormatToken(0, ['YY', 2], 0, function () {
	        return this.year() % 100;
	    });

	    addFormatToken(0, ['YYYY', 4], 0, 'year');
	    addFormatToken(0, ['YYYYY', 5], 0, 'year');
	    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

	    // ALIASES

	    addUnitAlias('year', 'y');

	    // PRIORITIES

	    addUnitPriority('year', 1);

	    // PARSING

	    addRegexToken('Y', matchSigned);
	    addRegexToken('YY', match1to2, match2);
	    addRegexToken('YYYY', match1to4, match4);
	    addRegexToken('YYYYY', match1to6, match6);
	    addRegexToken('YYYYYY', match1to6, match6);

	    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
	    addParseToken('YYYY', function (input, array) {
	        array[YEAR] =
	            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
	    });
	    addParseToken('YY', function (input, array) {
	        array[YEAR] = hooks.parseTwoDigitYear(input);
	    });
	    addParseToken('Y', function (input, array) {
	        array[YEAR] = parseInt(input, 10);
	    });

	    // HELPERS

	    function daysInYear(year) {
	        return isLeapYear(year) ? 366 : 365;
	    }

	    // HOOKS

	    hooks.parseTwoDigitYear = function (input) {
	        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
	    };

	    // MOMENTS

	    var getSetYear = makeGetSet('FullYear', true);

	    function getIsLeapYear() {
	        return isLeapYear(this.year());
	    }

	    function createDate(y, m, d, h, M, s, ms) {
	        // can't just apply() to create a date:
	        // https://stackoverflow.com/q/181348
	        var date;
	        // the date constructor remaps years 0-99 to 1900-1999
	        if (y < 100 && y >= 0) {
	            // preserve leap years using a full 400 year cycle, then reset
	            date = new Date(y + 400, m, d, h, M, s, ms);
	            if (isFinite(date.getFullYear())) {
	                date.setFullYear(y);
	            }
	        } else {
	            date = new Date(y, m, d, h, M, s, ms);
	        }

	        return date;
	    }

	    function createUTCDate(y) {
	        var date, args;
	        // the Date.UTC function remaps years 0-99 to 1900-1999
	        if (y < 100 && y >= 0) {
	            args = Array.prototype.slice.call(arguments);
	            // preserve leap years using a full 400 year cycle, then reset
	            args[0] = y + 400;
	            date = new Date(Date.UTC.apply(null, args));
	            if (isFinite(date.getUTCFullYear())) {
	                date.setUTCFullYear(y);
	            }
	        } else {
	            date = new Date(Date.UTC.apply(null, arguments));
	        }

	        return date;
	    }

	    // start-of-first-week - start-of-year
	    function firstWeekOffset(year, dow, doy) {
	        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
	            fwd = 7 + dow - doy,
	            // first-week day local weekday -- which local weekday is fwd
	            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

	        return -fwdlw + fwd - 1;
	    }

	    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
	        var localWeekday = (7 + weekday - dow) % 7,
	            weekOffset = firstWeekOffset(year, dow, doy),
	            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
	            resYear,
	            resDayOfYear;

	        if (dayOfYear <= 0) {
	            resYear = year - 1;
	            resDayOfYear = daysInYear(resYear) + dayOfYear;
	        } else if (dayOfYear > daysInYear(year)) {
	            resYear = year + 1;
	            resDayOfYear = dayOfYear - daysInYear(year);
	        } else {
	            resYear = year;
	            resDayOfYear = dayOfYear;
	        }

	        return {
	            year: resYear,
	            dayOfYear: resDayOfYear,
	        };
	    }

	    function weekOfYear(mom, dow, doy) {
	        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
	            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
	            resWeek,
	            resYear;

	        if (week < 1) {
	            resYear = mom.year() - 1;
	            resWeek = week + weeksInYear(resYear, dow, doy);
	        } else if (week > weeksInYear(mom.year(), dow, doy)) {
	            resWeek = week - weeksInYear(mom.year(), dow, doy);
	            resYear = mom.year() + 1;
	        } else {
	            resYear = mom.year();
	            resWeek = week;
	        }

	        return {
	            week: resWeek,
	            year: resYear,
	        };
	    }

	    function weeksInYear(year, dow, doy) {
	        var weekOffset = firstWeekOffset(year, dow, doy),
	            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
	        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
	    }

	    // FORMATTING

	    addFormatToken('w', ['ww', 2], 'wo', 'week');
	    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

	    // ALIASES

	    addUnitAlias('week', 'w');
	    addUnitAlias('isoWeek', 'W');

	    // PRIORITIES

	    addUnitPriority('week', 5);
	    addUnitPriority('isoWeek', 5);

	    // PARSING

	    addRegexToken('w', match1to2);
	    addRegexToken('ww', match1to2, match2);
	    addRegexToken('W', match1to2);
	    addRegexToken('WW', match1to2, match2);

	    addWeekParseToken(
	        ['w', 'ww', 'W', 'WW'],
	        function (input, week, config, token) {
	            week[token.substr(0, 1)] = toInt(input);
	        }
	    );

	    // HELPERS

	    // LOCALES

	    function localeWeek(mom) {
	        return weekOfYear(mom, this._week.dow, this._week.doy).week;
	    }

	    var defaultLocaleWeek = {
	        dow: 0, // Sunday is the first day of the week.
	        doy: 6, // The week that contains Jan 6th is the first week of the year.
	    };

	    function localeFirstDayOfWeek() {
	        return this._week.dow;
	    }

	    function localeFirstDayOfYear() {
	        return this._week.doy;
	    }

	    // MOMENTS

	    function getSetWeek(input) {
	        var week = this.localeData().week(this);
	        return input == null ? week : this.add((input - week) * 7, 'd');
	    }

	    function getSetISOWeek(input) {
	        var week = weekOfYear(this, 1, 4).week;
	        return input == null ? week : this.add((input - week) * 7, 'd');
	    }

	    // FORMATTING

	    addFormatToken('d', 0, 'do', 'day');

	    addFormatToken('dd', 0, 0, function (format) {
	        return this.localeData().weekdaysMin(this, format);
	    });

	    addFormatToken('ddd', 0, 0, function (format) {
	        return this.localeData().weekdaysShort(this, format);
	    });

	    addFormatToken('dddd', 0, 0, function (format) {
	        return this.localeData().weekdays(this, format);
	    });

	    addFormatToken('e', 0, 0, 'weekday');
	    addFormatToken('E', 0, 0, 'isoWeekday');

	    // ALIASES

	    addUnitAlias('day', 'd');
	    addUnitAlias('weekday', 'e');
	    addUnitAlias('isoWeekday', 'E');

	    // PRIORITY
	    addUnitPriority('day', 11);
	    addUnitPriority('weekday', 11);
	    addUnitPriority('isoWeekday', 11);

	    // PARSING

	    addRegexToken('d', match1to2);
	    addRegexToken('e', match1to2);
	    addRegexToken('E', match1to2);
	    addRegexToken('dd', function (isStrict, locale) {
	        return locale.weekdaysMinRegex(isStrict);
	    });
	    addRegexToken('ddd', function (isStrict, locale) {
	        return locale.weekdaysShortRegex(isStrict);
	    });
	    addRegexToken('dddd', function (isStrict, locale) {
	        return locale.weekdaysRegex(isStrict);
	    });

	    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
	        var weekday = config._locale.weekdaysParse(input, token, config._strict);
	        // if we didn't get a weekday name, mark the date as invalid
	        if (weekday != null) {
	            week.d = weekday;
	        } else {
	            getParsingFlags(config).invalidWeekday = input;
	        }
	    });

	    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
	        week[token] = toInt(input);
	    });

	    // HELPERS

	    function parseWeekday(input, locale) {
	        if (typeof input !== 'string') {
	            return input;
	        }

	        if (!isNaN(input)) {
	            return parseInt(input, 10);
	        }

	        input = locale.weekdaysParse(input);
	        if (typeof input === 'number') {
	            return input;
	        }

	        return null;
	    }

	    function parseIsoWeekday(input, locale) {
	        if (typeof input === 'string') {
	            return locale.weekdaysParse(input) % 7 || 7;
	        }
	        return isNaN(input) ? null : input;
	    }

	    // LOCALES
	    function shiftWeekdays(ws, n) {
	        return ws.slice(n, 7).concat(ws.slice(0, n));
	    }

	    var defaultLocaleWeekdays =
	            'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	        defaultWeekdaysRegex = matchWord,
	        defaultWeekdaysShortRegex = matchWord,
	        defaultWeekdaysMinRegex = matchWord;

	    function localeWeekdays(m, format) {
	        var weekdays = isArray(this._weekdays)
	            ? this._weekdays
	            : this._weekdays[
	                  m && m !== true && this._weekdays.isFormat.test(format)
	                      ? 'format'
	                      : 'standalone'
	              ];
	        return m === true
	            ? shiftWeekdays(weekdays, this._week.dow)
	            : m
	            ? weekdays[m.day()]
	            : weekdays;
	    }

	    function localeWeekdaysShort(m) {
	        return m === true
	            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
	            : m
	            ? this._weekdaysShort[m.day()]
	            : this._weekdaysShort;
	    }

	    function localeWeekdaysMin(m) {
	        return m === true
	            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
	            : m
	            ? this._weekdaysMin[m.day()]
	            : this._weekdaysMin;
	    }

	    function handleStrictParse$1(weekdayName, format, strict) {
	        var i,
	            ii,
	            mom,
	            llc = weekdayName.toLocaleLowerCase();
	        if (!this._weekdaysParse) {
	            this._weekdaysParse = [];
	            this._shortWeekdaysParse = [];
	            this._minWeekdaysParse = [];

	            for (i = 0; i < 7; ++i) {
	                mom = createUTC([2000, 1]).day(i);
	                this._minWeekdaysParse[i] = this.weekdaysMin(
	                    mom,
	                    ''
	                ).toLocaleLowerCase();
	                this._shortWeekdaysParse[i] = this.weekdaysShort(
	                    mom,
	                    ''
	                ).toLocaleLowerCase();
	                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
	            }
	        }

	        if (strict) {
	            if (format === 'dddd') {
	                ii = indexOf.call(this._weekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else if (format === 'ddd') {
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        } else {
	            if (format === 'dddd') {
	                ii = indexOf.call(this._weekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else if (format === 'ddd') {
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._weekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._weekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        }
	    }

	    function localeWeekdaysParse(weekdayName, format, strict) {
	        var i, mom, regex;

	        if (this._weekdaysParseExact) {
	            return handleStrictParse$1.call(this, weekdayName, format, strict);
	        }

	        if (!this._weekdaysParse) {
	            this._weekdaysParse = [];
	            this._minWeekdaysParse = [];
	            this._shortWeekdaysParse = [];
	            this._fullWeekdaysParse = [];
	        }

	        for (i = 0; i < 7; i++) {
	            // make the regex if we don't have it already

	            mom = createUTC([2000, 1]).day(i);
	            if (strict && !this._fullWeekdaysParse[i]) {
	                this._fullWeekdaysParse[i] = new RegExp(
	                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
	                    'i'
	                );
	                this._shortWeekdaysParse[i] = new RegExp(
	                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
	                    'i'
	                );
	                this._minWeekdaysParse[i] = new RegExp(
	                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
	                    'i'
	                );
	            }
	            if (!this._weekdaysParse[i]) {
	                regex =
	                    '^' +
	                    this.weekdays(mom, '') +
	                    '|^' +
	                    this.weekdaysShort(mom, '') +
	                    '|^' +
	                    this.weekdaysMin(mom, '');
	                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
	            }
	            // test the regex
	            if (
	                strict &&
	                format === 'dddd' &&
	                this._fullWeekdaysParse[i].test(weekdayName)
	            ) {
	                return i;
	            } else if (
	                strict &&
	                format === 'ddd' &&
	                this._shortWeekdaysParse[i].test(weekdayName)
	            ) {
	                return i;
	            } else if (
	                strict &&
	                format === 'dd' &&
	                this._minWeekdaysParse[i].test(weekdayName)
	            ) {
	                return i;
	            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
	                return i;
	            }
	        }
	    }

	    // MOMENTS

	    function getSetDayOfWeek(input) {
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }
	        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
	        if (input != null) {
	            input = parseWeekday(input, this.localeData());
	            return this.add(input - day, 'd');
	        } else {
	            return day;
	        }
	    }

	    function getSetLocaleDayOfWeek(input) {
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }
	        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
	        return input == null ? weekday : this.add(input - weekday, 'd');
	    }

	    function getSetISODayOfWeek(input) {
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }

	        // behaves the same as moment#day except
	        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
	        // as a setter, sunday should belong to the previous week.

	        if (input != null) {
	            var weekday = parseIsoWeekday(input, this.localeData());
	            return this.day(this.day() % 7 ? weekday : weekday - 7);
	        } else {
	            return this.day() || 7;
	        }
	    }

	    function weekdaysRegex(isStrict) {
	        if (this._weekdaysParseExact) {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                computeWeekdaysParse.call(this);
	            }
	            if (isStrict) {
	                return this._weekdaysStrictRegex;
	            } else {
	                return this._weekdaysRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                this._weekdaysRegex = defaultWeekdaysRegex;
	            }
	            return this._weekdaysStrictRegex && isStrict
	                ? this._weekdaysStrictRegex
	                : this._weekdaysRegex;
	        }
	    }

	    function weekdaysShortRegex(isStrict) {
	        if (this._weekdaysParseExact) {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                computeWeekdaysParse.call(this);
	            }
	            if (isStrict) {
	                return this._weekdaysShortStrictRegex;
	            } else {
	                return this._weekdaysShortRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
	                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
	            }
	            return this._weekdaysShortStrictRegex && isStrict
	                ? this._weekdaysShortStrictRegex
	                : this._weekdaysShortRegex;
	        }
	    }

	    function weekdaysMinRegex(isStrict) {
	        if (this._weekdaysParseExact) {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                computeWeekdaysParse.call(this);
	            }
	            if (isStrict) {
	                return this._weekdaysMinStrictRegex;
	            } else {
	                return this._weekdaysMinRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
	                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
	            }
	            return this._weekdaysMinStrictRegex && isStrict
	                ? this._weekdaysMinStrictRegex
	                : this._weekdaysMinRegex;
	        }
	    }

	    function computeWeekdaysParse() {
	        function cmpLenRev(a, b) {
	            return b.length - a.length;
	        }

	        var minPieces = [],
	            shortPieces = [],
	            longPieces = [],
	            mixedPieces = [],
	            i,
	            mom,
	            minp,
	            shortp,
	            longp;
	        for (i = 0; i < 7; i++) {
	            // make the regex if we don't have it already
	            mom = createUTC([2000, 1]).day(i);
	            minp = regexEscape(this.weekdaysMin(mom, ''));
	            shortp = regexEscape(this.weekdaysShort(mom, ''));
	            longp = regexEscape(this.weekdays(mom, ''));
	            minPieces.push(minp);
	            shortPieces.push(shortp);
	            longPieces.push(longp);
	            mixedPieces.push(minp);
	            mixedPieces.push(shortp);
	            mixedPieces.push(longp);
	        }
	        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
	        // will match the longer piece.
	        minPieces.sort(cmpLenRev);
	        shortPieces.sort(cmpLenRev);
	        longPieces.sort(cmpLenRev);
	        mixedPieces.sort(cmpLenRev);

	        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	        this._weekdaysShortRegex = this._weekdaysRegex;
	        this._weekdaysMinRegex = this._weekdaysRegex;

	        this._weekdaysStrictRegex = new RegExp(
	            '^(' + longPieces.join('|') + ')',
	            'i'
	        );
	        this._weekdaysShortStrictRegex = new RegExp(
	            '^(' + shortPieces.join('|') + ')',
	            'i'
	        );
	        this._weekdaysMinStrictRegex = new RegExp(
	            '^(' + minPieces.join('|') + ')',
	            'i'
	        );
	    }

	    // FORMATTING

	    function hFormat() {
	        return this.hours() % 12 || 12;
	    }

	    function kFormat() {
	        return this.hours() || 24;
	    }

	    addFormatToken('H', ['HH', 2], 0, 'hour');
	    addFormatToken('h', ['hh', 2], 0, hFormat);
	    addFormatToken('k', ['kk', 2], 0, kFormat);

	    addFormatToken('hmm', 0, 0, function () {
	        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
	    });

	    addFormatToken('hmmss', 0, 0, function () {
	        return (
	            '' +
	            hFormat.apply(this) +
	            zeroFill(this.minutes(), 2) +
	            zeroFill(this.seconds(), 2)
	        );
	    });

	    addFormatToken('Hmm', 0, 0, function () {
	        return '' + this.hours() + zeroFill(this.minutes(), 2);
	    });

	    addFormatToken('Hmmss', 0, 0, function () {
	        return (
	            '' +
	            this.hours() +
	            zeroFill(this.minutes(), 2) +
	            zeroFill(this.seconds(), 2)
	        );
	    });

	    function meridiem(token, lowercase) {
	        addFormatToken(token, 0, 0, function () {
	            return this.localeData().meridiem(
	                this.hours(),
	                this.minutes(),
	                lowercase
	            );
	        });
	    }

	    meridiem('a', true);
	    meridiem('A', false);

	    // ALIASES

	    addUnitAlias('hour', 'h');

	    // PRIORITY
	    addUnitPriority('hour', 13);

	    // PARSING

	    function matchMeridiem(isStrict, locale) {
	        return locale._meridiemParse;
	    }

	    addRegexToken('a', matchMeridiem);
	    addRegexToken('A', matchMeridiem);
	    addRegexToken('H', match1to2);
	    addRegexToken('h', match1to2);
	    addRegexToken('k', match1to2);
	    addRegexToken('HH', match1to2, match2);
	    addRegexToken('hh', match1to2, match2);
	    addRegexToken('kk', match1to2, match2);

	    addRegexToken('hmm', match3to4);
	    addRegexToken('hmmss', match5to6);
	    addRegexToken('Hmm', match3to4);
	    addRegexToken('Hmmss', match5to6);

	    addParseToken(['H', 'HH'], HOUR);
	    addParseToken(['k', 'kk'], function (input, array, config) {
	        var kInput = toInt(input);
	        array[HOUR] = kInput === 24 ? 0 : kInput;
	    });
	    addParseToken(['a', 'A'], function (input, array, config) {
	        config._isPm = config._locale.isPM(input);
	        config._meridiem = input;
	    });
	    addParseToken(['h', 'hh'], function (input, array, config) {
	        array[HOUR] = toInt(input);
	        getParsingFlags(config).bigHour = true;
	    });
	    addParseToken('hmm', function (input, array, config) {
	        var pos = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos));
	        array[MINUTE] = toInt(input.substr(pos));
	        getParsingFlags(config).bigHour = true;
	    });
	    addParseToken('hmmss', function (input, array, config) {
	        var pos1 = input.length - 4,
	            pos2 = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos1));
	        array[MINUTE] = toInt(input.substr(pos1, 2));
	        array[SECOND] = toInt(input.substr(pos2));
	        getParsingFlags(config).bigHour = true;
	    });
	    addParseToken('Hmm', function (input, array, config) {
	        var pos = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos));
	        array[MINUTE] = toInt(input.substr(pos));
	    });
	    addParseToken('Hmmss', function (input, array, config) {
	        var pos1 = input.length - 4,
	            pos2 = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos1));
	        array[MINUTE] = toInt(input.substr(pos1, 2));
	        array[SECOND] = toInt(input.substr(pos2));
	    });

	    // LOCALES

	    function localeIsPM(input) {
	        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
	        // Using charAt should be more compatible.
	        return (input + '').toLowerCase().charAt(0) === 'p';
	    }

	    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
	        // Setting the hour should keep the time, because the user explicitly
	        // specified which hour they want. So trying to maintain the same hour (in
	        // a new timezone) makes sense. Adding/subtracting hours does not follow
	        // this rule.
	        getSetHour = makeGetSet('Hours', true);

	    function localeMeridiem(hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'pm' : 'PM';
	        } else {
	            return isLower ? 'am' : 'AM';
	        }
	    }

	    var baseConfig = {
	        calendar: defaultCalendar,
	        longDateFormat: defaultLongDateFormat,
	        invalidDate: defaultInvalidDate,
	        ordinal: defaultOrdinal,
	        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
	        relativeTime: defaultRelativeTime,

	        months: defaultLocaleMonths,
	        monthsShort: defaultLocaleMonthsShort,

	        week: defaultLocaleWeek,

	        weekdays: defaultLocaleWeekdays,
	        weekdaysMin: defaultLocaleWeekdaysMin,
	        weekdaysShort: defaultLocaleWeekdaysShort,

	        meridiemParse: defaultLocaleMeridiemParse,
	    };

	    // internal storage for locale config files
	    var locales = {},
	        localeFamilies = {},
	        globalLocale;

	    function commonPrefix(arr1, arr2) {
	        var i,
	            minl = Math.min(arr1.length, arr2.length);
	        for (i = 0; i < minl; i += 1) {
	            if (arr1[i] !== arr2[i]) {
	                return i;
	            }
	        }
	        return minl;
	    }

	    function normalizeLocale(key) {
	        return key ? key.toLowerCase().replace('_', '-') : key;
	    }

	    // pick the locale from the array
	    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	    function chooseLocale(names) {
	        var i = 0,
	            j,
	            next,
	            locale,
	            split;

	        while (i < names.length) {
	            split = normalizeLocale(names[i]).split('-');
	            j = split.length;
	            next = normalizeLocale(names[i + 1]);
	            next = next ? next.split('-') : null;
	            while (j > 0) {
	                locale = loadLocale(split.slice(0, j).join('-'));
	                if (locale) {
	                    return locale;
	                }
	                if (
	                    next &&
	                    next.length >= j &&
	                    commonPrefix(split, next) >= j - 1
	                ) {
	                    //the next array item is better than a shallower substring of this one
	                    break;
	                }
	                j--;
	            }
	            i++;
	        }
	        return globalLocale;
	    }

	    function isLocaleNameSane(name) {
	        // Prevent names that look like filesystem paths, i.e contain '/' or '\'
	        return name.match('^[^/\\\\]*$') != null;
	    }

	    function loadLocale(name) {
	        var oldLocale = null,
	            aliasedRequire;
	        // TODO: Find a better way to register and load all the locales in Node
	        if (
	            locales[name] === undefined &&
	            'object' !== 'undefined' &&
	            module &&
	            module.exports &&
	            isLocaleNameSane(name)
	        ) {
	            try {
	                oldLocale = globalLocale._abbr;
	                aliasedRequire = commonjsRequire;
	                aliasedRequire('./locale/' + name);
	                getSetGlobalLocale(oldLocale);
	            } catch (e) {
	                // mark as not found to avoid repeating expensive file require call causing high CPU
	                // when trying to find en-US, en_US, en-us for every format call
	                locales[name] = null; // null means not found
	            }
	        }
	        return locales[name];
	    }

	    // This function will load locale and then set the global locale.  If
	    // no arguments are passed in, it will simply return the current global
	    // locale key.
	    function getSetGlobalLocale(key, values) {
	        var data;
	        if (key) {
	            if (isUndefined(values)) {
	                data = getLocale(key);
	            } else {
	                data = defineLocale(key, values);
	            }

	            if (data) {
	                // moment.duration._locale = moment._locale = data;
	                globalLocale = data;
	            } else {
	                if (typeof console !== 'undefined' && console.warn) {
	                    //warn user if arguments are passed but the locale could not be set
	                    console.warn(
	                        'Locale ' + key + ' not found. Did you forget to load it?'
	                    );
	                }
	            }
	        }

	        return globalLocale._abbr;
	    }

	    function defineLocale(name, config) {
	        if (config !== null) {
	            var locale,
	                parentConfig = baseConfig;
	            config.abbr = name;
	            if (locales[name] != null) {
	                deprecateSimple(
	                    'defineLocaleOverride',
	                    'use moment.updateLocale(localeName, config) to change ' +
	                        'an existing locale. moment.defineLocale(localeName, ' +
	                        'config) should only be used for creating a new locale ' +
	                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
	                );
	                parentConfig = locales[name]._config;
	            } else if (config.parentLocale != null) {
	                if (locales[config.parentLocale] != null) {
	                    parentConfig = locales[config.parentLocale]._config;
	                } else {
	                    locale = loadLocale(config.parentLocale);
	                    if (locale != null) {
	                        parentConfig = locale._config;
	                    } else {
	                        if (!localeFamilies[config.parentLocale]) {
	                            localeFamilies[config.parentLocale] = [];
	                        }
	                        localeFamilies[config.parentLocale].push({
	                            name: name,
	                            config: config,
	                        });
	                        return null;
	                    }
	                }
	            }
	            locales[name] = new Locale(mergeConfigs(parentConfig, config));

	            if (localeFamilies[name]) {
	                localeFamilies[name].forEach(function (x) {
	                    defineLocale(x.name, x.config);
	                });
	            }

	            // backwards compat for now: also set the locale
	            // make sure we set the locale AFTER all child locales have been
	            // created, so we won't end up with the child locale set.
	            getSetGlobalLocale(name);

	            return locales[name];
	        } else {
	            // useful for testing
	            delete locales[name];
	            return null;
	        }
	    }

	    function updateLocale(name, config) {
	        if (config != null) {
	            var locale,
	                tmpLocale,
	                parentConfig = baseConfig;

	            if (locales[name] != null && locales[name].parentLocale != null) {
	                // Update existing child locale in-place to avoid memory-leaks
	                locales[name].set(mergeConfigs(locales[name]._config, config));
	            } else {
	                // MERGE
	                tmpLocale = loadLocale(name);
	                if (tmpLocale != null) {
	                    parentConfig = tmpLocale._config;
	                }
	                config = mergeConfigs(parentConfig, config);
	                if (tmpLocale == null) {
	                    // updateLocale is called for creating a new locale
	                    // Set abbr so it will have a name (getters return
	                    // undefined otherwise).
	                    config.abbr = name;
	                }
	                locale = new Locale(config);
	                locale.parentLocale = locales[name];
	                locales[name] = locale;
	            }

	            // backwards compat for now: also set the locale
	            getSetGlobalLocale(name);
	        } else {
	            // pass null for config to unupdate, useful for tests
	            if (locales[name] != null) {
	                if (locales[name].parentLocale != null) {
	                    locales[name] = locales[name].parentLocale;
	                    if (name === getSetGlobalLocale()) {
	                        getSetGlobalLocale(name);
	                    }
	                } else if (locales[name] != null) {
	                    delete locales[name];
	                }
	            }
	        }
	        return locales[name];
	    }

	    // returns locale data
	    function getLocale(key) {
	        var locale;

	        if (key && key._locale && key._locale._abbr) {
	            key = key._locale._abbr;
	        }

	        if (!key) {
	            return globalLocale;
	        }

	        if (!isArray(key)) {
	            //short-circuit everything else
	            locale = loadLocale(key);
	            if (locale) {
	                return locale;
	            }
	            key = [key];
	        }

	        return chooseLocale(key);
	    }

	    function listLocales() {
	        return keys(locales);
	    }

	    function checkOverflow(m) {
	        var overflow,
	            a = m._a;

	        if (a && getParsingFlags(m).overflow === -2) {
	            overflow =
	                a[MONTH] < 0 || a[MONTH] > 11
	                    ? MONTH
	                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
	                    ? DATE
	                    : a[HOUR] < 0 ||
	                      a[HOUR] > 24 ||
	                      (a[HOUR] === 24 &&
	                          (a[MINUTE] !== 0 ||
	                              a[SECOND] !== 0 ||
	                              a[MILLISECOND] !== 0))
	                    ? HOUR
	                    : a[MINUTE] < 0 || a[MINUTE] > 59
	                    ? MINUTE
	                    : a[SECOND] < 0 || a[SECOND] > 59
	                    ? SECOND
	                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
	                    ? MILLISECOND
	                    : -1;

	            if (
	                getParsingFlags(m)._overflowDayOfYear &&
	                (overflow < YEAR || overflow > DATE)
	            ) {
	                overflow = DATE;
	            }
	            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
	                overflow = WEEK;
	            }
	            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
	                overflow = WEEKDAY;
	            }

	            getParsingFlags(m).overflow = overflow;
	        }

	        return m;
	    }

	    // iso 8601 regex
	    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
	    var extendedIsoRegex =
	            /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
	        basicIsoRegex =
	            /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
	        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
	        isoDates = [
	            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
	            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
	            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
	            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
	            ['YYYY-DDD', /\d{4}-\d{3}/],
	            ['YYYY-MM', /\d{4}-\d\d/, false],
	            ['YYYYYYMMDD', /[+-]\d{10}/],
	            ['YYYYMMDD', /\d{8}/],
	            ['GGGG[W]WWE', /\d{4}W\d{3}/],
	            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
	            ['YYYYDDD', /\d{7}/],
	            ['YYYYMM', /\d{6}/, false],
	            ['YYYY', /\d{4}/, false],
	        ],
	        // iso time formats and regexes
	        isoTimes = [
	            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
	            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
	            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
	            ['HH:mm', /\d\d:\d\d/],
	            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
	            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
	            ['HHmmss', /\d\d\d\d\d\d/],
	            ['HHmm', /\d\d\d\d/],
	            ['HH', /\d\d/],
	        ],
	        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
	        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
	        rfc2822 =
	            /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
	        obsOffsets = {
	            UT: 0,
	            GMT: 0,
	            EDT: -4 * 60,
	            EST: -5 * 60,
	            CDT: -5 * 60,
	            CST: -6 * 60,
	            MDT: -6 * 60,
	            MST: -7 * 60,
	            PDT: -7 * 60,
	            PST: -8 * 60,
	        };

	    // date from iso format
	    function configFromISO(config) {
	        var i,
	            l,
	            string = config._i,
	            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
	            allowTime,
	            dateFormat,
	            timeFormat,
	            tzFormat,
	            isoDatesLen = isoDates.length,
	            isoTimesLen = isoTimes.length;

	        if (match) {
	            getParsingFlags(config).iso = true;
	            for (i = 0, l = isoDatesLen; i < l; i++) {
	                if (isoDates[i][1].exec(match[1])) {
	                    dateFormat = isoDates[i][0];
	                    allowTime = isoDates[i][2] !== false;
	                    break;
	                }
	            }
	            if (dateFormat == null) {
	                config._isValid = false;
	                return;
	            }
	            if (match[3]) {
	                for (i = 0, l = isoTimesLen; i < l; i++) {
	                    if (isoTimes[i][1].exec(match[3])) {
	                        // match[2] should be 'T' or space
	                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
	                        break;
	                    }
	                }
	                if (timeFormat == null) {
	                    config._isValid = false;
	                    return;
	                }
	            }
	            if (!allowTime && timeFormat != null) {
	                config._isValid = false;
	                return;
	            }
	            if (match[4]) {
	                if (tzRegex.exec(match[4])) {
	                    tzFormat = 'Z';
	                } else {
	                    config._isValid = false;
	                    return;
	                }
	            }
	            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
	            configFromStringAndFormat(config);
	        } else {
	            config._isValid = false;
	        }
	    }

	    function extractFromRFC2822Strings(
	        yearStr,
	        monthStr,
	        dayStr,
	        hourStr,
	        minuteStr,
	        secondStr
	    ) {
	        var result = [
	            untruncateYear(yearStr),
	            defaultLocaleMonthsShort.indexOf(monthStr),
	            parseInt(dayStr, 10),
	            parseInt(hourStr, 10),
	            parseInt(minuteStr, 10),
	        ];

	        if (secondStr) {
	            result.push(parseInt(secondStr, 10));
	        }

	        return result;
	    }

	    function untruncateYear(yearStr) {
	        var year = parseInt(yearStr, 10);
	        if (year <= 49) {
	            return 2000 + year;
	        } else if (year <= 999) {
	            return 1900 + year;
	        }
	        return year;
	    }

	    function preprocessRFC2822(s) {
	        // Remove comments and folding whitespace and replace multiple-spaces with a single space
	        return s
	            .replace(/\([^()]*\)|[\n\t]/g, ' ')
	            .replace(/(\s\s+)/g, ' ')
	            .replace(/^\s\s*/, '')
	            .replace(/\s\s*$/, '');
	    }

	    function checkWeekday(weekdayStr, parsedInput, config) {
	        if (weekdayStr) {
	            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
	            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
	                weekdayActual = new Date(
	                    parsedInput[0],
	                    parsedInput[1],
	                    parsedInput[2]
	                ).getDay();
	            if (weekdayProvided !== weekdayActual) {
	                getParsingFlags(config).weekdayMismatch = true;
	                config._isValid = false;
	                return false;
	            }
	        }
	        return true;
	    }

	    function calculateOffset(obsOffset, militaryOffset, numOffset) {
	        if (obsOffset) {
	            return obsOffsets[obsOffset];
	        } else if (militaryOffset) {
	            // the only allowed military tz is Z
	            return 0;
	        } else {
	            var hm = parseInt(numOffset, 10),
	                m = hm % 100,
	                h = (hm - m) / 100;
	            return h * 60 + m;
	        }
	    }

	    // date and time from ref 2822 format
	    function configFromRFC2822(config) {
	        var match = rfc2822.exec(preprocessRFC2822(config._i)),
	            parsedArray;
	        if (match) {
	            parsedArray = extractFromRFC2822Strings(
	                match[4],
	                match[3],
	                match[2],
	                match[5],
	                match[6],
	                match[7]
	            );
	            if (!checkWeekday(match[1], parsedArray, config)) {
	                return;
	            }

	            config._a = parsedArray;
	            config._tzm = calculateOffset(match[8], match[9], match[10]);

	            config._d = createUTCDate.apply(null, config._a);
	            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

	            getParsingFlags(config).rfc2822 = true;
	        } else {
	            config._isValid = false;
	        }
	    }

	    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
	    function configFromString(config) {
	        var matched = aspNetJsonRegex.exec(config._i);
	        if (matched !== null) {
	            config._d = new Date(+matched[1]);
	            return;
	        }

	        configFromISO(config);
	        if (config._isValid === false) {
	            delete config._isValid;
	        } else {
	            return;
	        }

	        configFromRFC2822(config);
	        if (config._isValid === false) {
	            delete config._isValid;
	        } else {
	            return;
	        }

	        if (config._strict) {
	            config._isValid = false;
	        } else {
	            // Final attempt, use Input Fallback
	            hooks.createFromInputFallback(config);
	        }
	    }

	    hooks.createFromInputFallback = deprecate(
	        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
	            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
	            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
	        function (config) {
	            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
	        }
	    );

	    // Pick the first defined of two or three arguments.
	    function defaults(a, b, c) {
	        if (a != null) {
	            return a;
	        }
	        if (b != null) {
	            return b;
	        }
	        return c;
	    }

	    function currentDateArray(config) {
	        // hooks is actually the exported moment object
	        var nowValue = new Date(hooks.now());
	        if (config._useUTC) {
	            return [
	                nowValue.getUTCFullYear(),
	                nowValue.getUTCMonth(),
	                nowValue.getUTCDate(),
	            ];
	        }
	        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
	    }

	    // convert an array to a date.
	    // the array should mirror the parameters below
	    // note: all values past the year are optional and will default to the lowest possible value.
	    // [year, month, day , hour, minute, second, millisecond]
	    function configFromArray(config) {
	        var i,
	            date,
	            input = [],
	            currentDate,
	            expectedWeekday,
	            yearToUse;

	        if (config._d) {
	            return;
	        }

	        currentDate = currentDateArray(config);

	        //compute day of the year from weeks and weekdays
	        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
	            dayOfYearFromWeekInfo(config);
	        }

	        //if the day of the year is set, figure out what it is
	        if (config._dayOfYear != null) {
	            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

	            if (
	                config._dayOfYear > daysInYear(yearToUse) ||
	                config._dayOfYear === 0
	            ) {
	                getParsingFlags(config)._overflowDayOfYear = true;
	            }

	            date = createUTCDate(yearToUse, 0, config._dayOfYear);
	            config._a[MONTH] = date.getUTCMonth();
	            config._a[DATE] = date.getUTCDate();
	        }

	        // Default to current date.
	        // * if no year, month, day of month are given, default to today
	        // * if day of month is given, default month and year
	        // * if month is given, default only year
	        // * if year is given, don't default anything
	        for (i = 0; i < 3 && config._a[i] == null; ++i) {
	            config._a[i] = input[i] = currentDate[i];
	        }

	        // Zero out whatever was not defaulted, including time
	        for (; i < 7; i++) {
	            config._a[i] = input[i] =
	                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
	        }

	        // Check for 24:00:00.000
	        if (
	            config._a[HOUR] === 24 &&
	            config._a[MINUTE] === 0 &&
	            config._a[SECOND] === 0 &&
	            config._a[MILLISECOND] === 0
	        ) {
	            config._nextDay = true;
	            config._a[HOUR] = 0;
	        }

	        config._d = (config._useUTC ? createUTCDate : createDate).apply(
	            null,
	            input
	        );
	        expectedWeekday = config._useUTC
	            ? config._d.getUTCDay()
	            : config._d.getDay();

	        // Apply timezone offset from input. The actual utcOffset can be changed
	        // with parseZone.
	        if (config._tzm != null) {
	            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
	        }

	        if (config._nextDay) {
	            config._a[HOUR] = 24;
	        }

	        // check for mismatching day of week
	        if (
	            config._w &&
	            typeof config._w.d !== 'undefined' &&
	            config._w.d !== expectedWeekday
	        ) {
	            getParsingFlags(config).weekdayMismatch = true;
	        }
	    }

	    function dayOfYearFromWeekInfo(config) {
	        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

	        w = config._w;
	        if (w.GG != null || w.W != null || w.E != null) {
	            dow = 1;
	            doy = 4;

	            // TODO: We need to take the current isoWeekYear, but that depends on
	            // how we interpret now (local, utc, fixed offset). So create
	            // a now version of current config (take local/utc/offset flags, and
	            // create now).
	            weekYear = defaults(
	                w.GG,
	                config._a[YEAR],
	                weekOfYear(createLocal(), 1, 4).year
	            );
	            week = defaults(w.W, 1);
	            weekday = defaults(w.E, 1);
	            if (weekday < 1 || weekday > 7) {
	                weekdayOverflow = true;
	            }
	        } else {
	            dow = config._locale._week.dow;
	            doy = config._locale._week.doy;

	            curWeek = weekOfYear(createLocal(), dow, doy);

	            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

	            // Default to current week.
	            week = defaults(w.w, curWeek.week);

	            if (w.d != null) {
	                // weekday -- low day numbers are considered next week
	                weekday = w.d;
	                if (weekday < 0 || weekday > 6) {
	                    weekdayOverflow = true;
	                }
	            } else if (w.e != null) {
	                // local weekday -- counting starts from beginning of week
	                weekday = w.e + dow;
	                if (w.e < 0 || w.e > 6) {
	                    weekdayOverflow = true;
	                }
	            } else {
	                // default to beginning of week
	                weekday = dow;
	            }
	        }
	        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
	            getParsingFlags(config)._overflowWeeks = true;
	        } else if (weekdayOverflow != null) {
	            getParsingFlags(config)._overflowWeekday = true;
	        } else {
	            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
	            config._a[YEAR] = temp.year;
	            config._dayOfYear = temp.dayOfYear;
	        }
	    }

	    // constant that refers to the ISO standard
	    hooks.ISO_8601 = function () {};

	    // constant that refers to the RFC 2822 form
	    hooks.RFC_2822 = function () {};

	    // date from string and format string
	    function configFromStringAndFormat(config) {
	        // TODO: Move this to another part of the creation flow to prevent circular deps
	        if (config._f === hooks.ISO_8601) {
	            configFromISO(config);
	            return;
	        }
	        if (config._f === hooks.RFC_2822) {
	            configFromRFC2822(config);
	            return;
	        }
	        config._a = [];
	        getParsingFlags(config).empty = true;

	        // This array is used to make a Date, either with `new Date` or `Date.UTC`
	        var string = '' + config._i,
	            i,
	            parsedInput,
	            tokens,
	            token,
	            skipped,
	            stringLength = string.length,
	            totalParsedInputLength = 0,
	            era,
	            tokenLen;

	        tokens =
	            expandFormat(config._f, config._locale).match(formattingTokens) || [];
	        tokenLen = tokens.length;
	        for (i = 0; i < tokenLen; i++) {
	            token = tokens[i];
	            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
	                [])[0];
	            if (parsedInput) {
	                skipped = string.substr(0, string.indexOf(parsedInput));
	                if (skipped.length > 0) {
	                    getParsingFlags(config).unusedInput.push(skipped);
	                }
	                string = string.slice(
	                    string.indexOf(parsedInput) + parsedInput.length
	                );
	                totalParsedInputLength += parsedInput.length;
	            }
	            // don't parse if it's not a known token
	            if (formatTokenFunctions[token]) {
	                if (parsedInput) {
	                    getParsingFlags(config).empty = false;
	                } else {
	                    getParsingFlags(config).unusedTokens.push(token);
	                }
	                addTimeToArrayFromToken(token, parsedInput, config);
	            } else if (config._strict && !parsedInput) {
	                getParsingFlags(config).unusedTokens.push(token);
	            }
	        }

	        // add remaining unparsed input length to the string
	        getParsingFlags(config).charsLeftOver =
	            stringLength - totalParsedInputLength;
	        if (string.length > 0) {
	            getParsingFlags(config).unusedInput.push(string);
	        }

	        // clear _12h flag if hour is <= 12
	        if (
	            config._a[HOUR] <= 12 &&
	            getParsingFlags(config).bigHour === true &&
	            config._a[HOUR] > 0
	        ) {
	            getParsingFlags(config).bigHour = undefined;
	        }

	        getParsingFlags(config).parsedDateParts = config._a.slice(0);
	        getParsingFlags(config).meridiem = config._meridiem;
	        // handle meridiem
	        config._a[HOUR] = meridiemFixWrap(
	            config._locale,
	            config._a[HOUR],
	            config._meridiem
	        );

	        // handle era
	        era = getParsingFlags(config).era;
	        if (era !== null) {
	            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
	        }

	        configFromArray(config);
	        checkOverflow(config);
	    }

	    function meridiemFixWrap(locale, hour, meridiem) {
	        var isPm;

	        if (meridiem == null) {
	            // nothing to do
	            return hour;
	        }
	        if (locale.meridiemHour != null) {
	            return locale.meridiemHour(hour, meridiem);
	        } else if (locale.isPM != null) {
	            // Fallback
	            isPm = locale.isPM(meridiem);
	            if (isPm && hour < 12) {
	                hour += 12;
	            }
	            if (!isPm && hour === 12) {
	                hour = 0;
	            }
	            return hour;
	        } else {
	            // this is not supposed to happen
	            return hour;
	        }
	    }

	    // date from string and array of format strings
	    function configFromStringAndArray(config) {
	        var tempConfig,
	            bestMoment,
	            scoreToBeat,
	            i,
	            currentScore,
	            validFormatFound,
	            bestFormatIsValid = false,
	            configfLen = config._f.length;

	        if (configfLen === 0) {
	            getParsingFlags(config).invalidFormat = true;
	            config._d = new Date(NaN);
	            return;
	        }

	        for (i = 0; i < configfLen; i++) {
	            currentScore = 0;
	            validFormatFound = false;
	            tempConfig = copyConfig({}, config);
	            if (config._useUTC != null) {
	                tempConfig._useUTC = config._useUTC;
	            }
	            tempConfig._f = config._f[i];
	            configFromStringAndFormat(tempConfig);

	            if (isValid(tempConfig)) {
	                validFormatFound = true;
	            }

	            // if there is any input that was not parsed add a penalty for that format
	            currentScore += getParsingFlags(tempConfig).charsLeftOver;

	            //or tokens
	            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

	            getParsingFlags(tempConfig).score = currentScore;

	            if (!bestFormatIsValid) {
	                if (
	                    scoreToBeat == null ||
	                    currentScore < scoreToBeat ||
	                    validFormatFound
	                ) {
	                    scoreToBeat = currentScore;
	                    bestMoment = tempConfig;
	                    if (validFormatFound) {
	                        bestFormatIsValid = true;
	                    }
	                }
	            } else {
	                if (currentScore < scoreToBeat) {
	                    scoreToBeat = currentScore;
	                    bestMoment = tempConfig;
	                }
	            }
	        }

	        extend(config, bestMoment || tempConfig);
	    }

	    function configFromObject(config) {
	        if (config._d) {
	            return;
	        }

	        var i = normalizeObjectUnits(config._i),
	            dayOrDate = i.day === undefined ? i.date : i.day;
	        config._a = map(
	            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
	            function (obj) {
	                return obj && parseInt(obj, 10);
	            }
	        );

	        configFromArray(config);
	    }

	    function createFromConfig(config) {
	        var res = new Moment(checkOverflow(prepareConfig(config)));
	        if (res._nextDay) {
	            // Adding is smart enough around DST
	            res.add(1, 'd');
	            res._nextDay = undefined;
	        }

	        return res;
	    }

	    function prepareConfig(config) {
	        var input = config._i,
	            format = config._f;

	        config._locale = config._locale || getLocale(config._l);

	        if (input === null || (format === undefined && input === '')) {
	            return createInvalid({ nullInput: true });
	        }

	        if (typeof input === 'string') {
	            config._i = input = config._locale.preparse(input);
	        }

	        if (isMoment(input)) {
	            return new Moment(checkOverflow(input));
	        } else if (isDate(input)) {
	            config._d = input;
	        } else if (isArray(format)) {
	            configFromStringAndArray(config);
	        } else if (format) {
	            configFromStringAndFormat(config);
	        } else {
	            configFromInput(config);
	        }

	        if (!isValid(config)) {
	            config._d = null;
	        }

	        return config;
	    }

	    function configFromInput(config) {
	        var input = config._i;
	        if (isUndefined(input)) {
	            config._d = new Date(hooks.now());
	        } else if (isDate(input)) {
	            config._d = new Date(input.valueOf());
	        } else if (typeof input === 'string') {
	            configFromString(config);
	        } else if (isArray(input)) {
	            config._a = map(input.slice(0), function (obj) {
	                return parseInt(obj, 10);
	            });
	            configFromArray(config);
	        } else if (isObject(input)) {
	            configFromObject(config);
	        } else if (isNumber(input)) {
	            // from milliseconds
	            config._d = new Date(input);
	        } else {
	            hooks.createFromInputFallback(config);
	        }
	    }

	    function createLocalOrUTC(input, format, locale, strict, isUTC) {
	        var c = {};

	        if (format === true || format === false) {
	            strict = format;
	            format = undefined;
	        }

	        if (locale === true || locale === false) {
	            strict = locale;
	            locale = undefined;
	        }

	        if (
	            (isObject(input) && isObjectEmpty(input)) ||
	            (isArray(input) && input.length === 0)
	        ) {
	            input = undefined;
	        }
	        // object construction must be done this way.
	        // https://github.com/moment/moment/issues/1423
	        c._isAMomentObject = true;
	        c._useUTC = c._isUTC = isUTC;
	        c._l = locale;
	        c._i = input;
	        c._f = format;
	        c._strict = strict;

	        return createFromConfig(c);
	    }

	    function createLocal(input, format, locale, strict) {
	        return createLocalOrUTC(input, format, locale, strict, false);
	    }

	    var prototypeMin = deprecate(
	            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
	            function () {
	                var other = createLocal.apply(null, arguments);
	                if (this.isValid() && other.isValid()) {
	                    return other < this ? this : other;
	                } else {
	                    return createInvalid();
	                }
	            }
	        ),
	        prototypeMax = deprecate(
	            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
	            function () {
	                var other = createLocal.apply(null, arguments);
	                if (this.isValid() && other.isValid()) {
	                    return other > this ? this : other;
	                } else {
	                    return createInvalid();
	                }
	            }
	        );

	    // Pick a moment m from moments so that m[fn](other) is true for all
	    // other. This relies on the function fn to be transitive.
	    //
	    // moments should either be an array of moment objects or an array, whose
	    // first element is an array of moment objects.
	    function pickBy(fn, moments) {
	        var res, i;
	        if (moments.length === 1 && isArray(moments[0])) {
	            moments = moments[0];
	        }
	        if (!moments.length) {
	            return createLocal();
	        }
	        res = moments[0];
	        for (i = 1; i < moments.length; ++i) {
	            if (!moments[i].isValid() || moments[i][fn](res)) {
	                res = moments[i];
	            }
	        }
	        return res;
	    }

	    // TODO: Use [].sort instead?
	    function min() {
	        var args = [].slice.call(arguments, 0);

	        return pickBy('isBefore', args);
	    }

	    function max() {
	        var args = [].slice.call(arguments, 0);

	        return pickBy('isAfter', args);
	    }

	    var now = function () {
	        return Date.now ? Date.now() : +new Date();
	    };

	    var ordering = [
	        'year',
	        'quarter',
	        'month',
	        'week',
	        'day',
	        'hour',
	        'minute',
	        'second',
	        'millisecond',
	    ];

	    function isDurationValid(m) {
	        var key,
	            unitHasDecimal = false,
	            i,
	            orderLen = ordering.length;
	        for (key in m) {
	            if (
	                hasOwnProp(m, key) &&
	                !(
	                    indexOf.call(ordering, key) !== -1 &&
	                    (m[key] == null || !isNaN(m[key]))
	                )
	            ) {
	                return false;
	            }
	        }

	        for (i = 0; i < orderLen; ++i) {
	            if (m[ordering[i]]) {
	                if (unitHasDecimal) {
	                    return false; // only allow non-integers for smallest unit
	                }
	                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
	                    unitHasDecimal = true;
	                }
	            }
	        }

	        return true;
	    }

	    function isValid$1() {
	        return this._isValid;
	    }

	    function createInvalid$1() {
	        return createDuration(NaN);
	    }

	    function Duration(duration) {
	        var normalizedInput = normalizeObjectUnits(duration),
	            years = normalizedInput.year || 0,
	            quarters = normalizedInput.quarter || 0,
	            months = normalizedInput.month || 0,
	            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
	            days = normalizedInput.day || 0,
	            hours = normalizedInput.hour || 0,
	            minutes = normalizedInput.minute || 0,
	            seconds = normalizedInput.second || 0,
	            milliseconds = normalizedInput.millisecond || 0;

	        this._isValid = isDurationValid(normalizedInput);

	        // representation for dateAddRemove
	        this._milliseconds =
	            +milliseconds +
	            seconds * 1e3 + // 1000
	            minutes * 6e4 + // 1000 * 60
	            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
	        // Because of dateAddRemove treats 24 hours as different from a
	        // day when working around DST, we need to store them separately
	        this._days = +days + weeks * 7;
	        // It is impossible to translate months into days without knowing
	        // which months you are are talking about, so we have to store
	        // it separately.
	        this._months = +months + quarters * 3 + years * 12;

	        this._data = {};

	        this._locale = getLocale();

	        this._bubble();
	    }

	    function isDuration(obj) {
	        return obj instanceof Duration;
	    }

	    function absRound(number) {
	        if (number < 0) {
	            return Math.round(-1 * number) * -1;
	        } else {
	            return Math.round(number);
	        }
	    }

	    // compare two arrays, return the number of differences
	    function compareArrays(array1, array2, dontConvert) {
	        var len = Math.min(array1.length, array2.length),
	            lengthDiff = Math.abs(array1.length - array2.length),
	            diffs = 0,
	            i;
	        for (i = 0; i < len; i++) {
	            if (
	                (dontConvert && array1[i] !== array2[i]) ||
	                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
	            ) {
	                diffs++;
	            }
	        }
	        return diffs + lengthDiff;
	    }

	    // FORMATTING

	    function offset(token, separator) {
	        addFormatToken(token, 0, 0, function () {
	            var offset = this.utcOffset(),
	                sign = '+';
	            if (offset < 0) {
	                offset = -offset;
	                sign = '-';
	            }
	            return (
	                sign +
	                zeroFill(~~(offset / 60), 2) +
	                separator +
	                zeroFill(~~offset % 60, 2)
	            );
	        });
	    }

	    offset('Z', ':');
	    offset('ZZ', '');

	    // PARSING

	    addRegexToken('Z', matchShortOffset);
	    addRegexToken('ZZ', matchShortOffset);
	    addParseToken(['Z', 'ZZ'], function (input, array, config) {
	        config._useUTC = true;
	        config._tzm = offsetFromString(matchShortOffset, input);
	    });

	    // HELPERS

	    // timezone chunker
	    // '+10:00' > ['10',  '00']
	    // '-1530'  > ['-15', '30']
	    var chunkOffset = /([\+\-]|\d\d)/gi;

	    function offsetFromString(matcher, string) {
	        var matches = (string || '').match(matcher),
	            chunk,
	            parts,
	            minutes;

	        if (matches === null) {
	            return null;
	        }

	        chunk = matches[matches.length - 1] || [];
	        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
	        minutes = +(parts[1] * 60) + toInt(parts[2]);

	        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
	    }

	    // Return a moment from input, that is local/utc/zone equivalent to model.
	    function cloneWithOffset(input, model) {
	        var res, diff;
	        if (model._isUTC) {
	            res = model.clone();
	            diff =
	                (isMoment(input) || isDate(input)
	                    ? input.valueOf()
	                    : createLocal(input).valueOf()) - res.valueOf();
	            // Use low-level api, because this fn is low-level api.
	            res._d.setTime(res._d.valueOf() + diff);
	            hooks.updateOffset(res, false);
	            return res;
	        } else {
	            return createLocal(input).local();
	        }
	    }

	    function getDateOffset(m) {
	        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
	        // https://github.com/moment/moment/pull/1871
	        return -Math.round(m._d.getTimezoneOffset());
	    }

	    // HOOKS

	    // This function will be called whenever a moment is mutated.
	    // It is intended to keep the offset in sync with the timezone.
	    hooks.updateOffset = function () {};

	    // MOMENTS

	    // keepLocalTime = true means only change the timezone, without
	    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	    // +0200, so we adjust the time as needed, to be valid.
	    //
	    // Keeping the time actually adds/subtracts (one hour)
	    // from the actual represented time. That is why we call updateOffset
	    // a second time. In case it wants us to change the offset again
	    // _changeInProgress == true case, then we have to adjust, because
	    // there is no such time in the given timezone.
	    function getSetOffset(input, keepLocalTime, keepMinutes) {
	        var offset = this._offset || 0,
	            localAdjust;
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }
	        if (input != null) {
	            if (typeof input === 'string') {
	                input = offsetFromString(matchShortOffset, input);
	                if (input === null) {
	                    return this;
	                }
	            } else if (Math.abs(input) < 16 && !keepMinutes) {
	                input = input * 60;
	            }
	            if (!this._isUTC && keepLocalTime) {
	                localAdjust = getDateOffset(this);
	            }
	            this._offset = input;
	            this._isUTC = true;
	            if (localAdjust != null) {
	                this.add(localAdjust, 'm');
	            }
	            if (offset !== input) {
	                if (!keepLocalTime || this._changeInProgress) {
	                    addSubtract(
	                        this,
	                        createDuration(input - offset, 'm'),
	                        1,
	                        false
	                    );
	                } else if (!this._changeInProgress) {
	                    this._changeInProgress = true;
	                    hooks.updateOffset(this, true);
	                    this._changeInProgress = null;
	                }
	            }
	            return this;
	        } else {
	            return this._isUTC ? offset : getDateOffset(this);
	        }
	    }

	    function getSetZone(input, keepLocalTime) {
	        if (input != null) {
	            if (typeof input !== 'string') {
	                input = -input;
	            }

	            this.utcOffset(input, keepLocalTime);

	            return this;
	        } else {
	            return -this.utcOffset();
	        }
	    }

	    function setOffsetToUTC(keepLocalTime) {
	        return this.utcOffset(0, keepLocalTime);
	    }

	    function setOffsetToLocal(keepLocalTime) {
	        if (this._isUTC) {
	            this.utcOffset(0, keepLocalTime);
	            this._isUTC = false;

	            if (keepLocalTime) {
	                this.subtract(getDateOffset(this), 'm');
	            }
	        }
	        return this;
	    }

	    function setOffsetToParsedOffset() {
	        if (this._tzm != null) {
	            this.utcOffset(this._tzm, false, true);
	        } else if (typeof this._i === 'string') {
	            var tZone = offsetFromString(matchOffset, this._i);
	            if (tZone != null) {
	                this.utcOffset(tZone);
	            } else {
	                this.utcOffset(0, true);
	            }
	        }
	        return this;
	    }

	    function hasAlignedHourOffset(input) {
	        if (!this.isValid()) {
	            return false;
	        }
	        input = input ? createLocal(input).utcOffset() : 0;

	        return (this.utcOffset() - input) % 60 === 0;
	    }

	    function isDaylightSavingTime() {
	        return (
	            this.utcOffset() > this.clone().month(0).utcOffset() ||
	            this.utcOffset() > this.clone().month(5).utcOffset()
	        );
	    }

	    function isDaylightSavingTimeShifted() {
	        if (!isUndefined(this._isDSTShifted)) {
	            return this._isDSTShifted;
	        }

	        var c = {},
	            other;

	        copyConfig(c, this);
	        c = prepareConfig(c);

	        if (c._a) {
	            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
	            this._isDSTShifted =
	                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
	        } else {
	            this._isDSTShifted = false;
	        }

	        return this._isDSTShifted;
	    }

	    function isLocal() {
	        return this.isValid() ? !this._isUTC : false;
	    }

	    function isUtcOffset() {
	        return this.isValid() ? this._isUTC : false;
	    }

	    function isUtc() {
	        return this.isValid() ? this._isUTC && this._offset === 0 : false;
	    }

	    // ASP.NET json date format regex
	    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
	        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	        // and further modified to allow for strings containing both week and day
	        isoRegex =
	            /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

	    function createDuration(input, key) {
	        var duration = input,
	            // matching against regexp is expensive, do it on demand
	            match = null,
	            sign,
	            ret,
	            diffRes;

	        if (isDuration(input)) {
	            duration = {
	                ms: input._milliseconds,
	                d: input._days,
	                M: input._months,
	            };
	        } else if (isNumber(input) || !isNaN(+input)) {
	            duration = {};
	            if (key) {
	                duration[key] = +input;
	            } else {
	                duration.milliseconds = +input;
	            }
	        } else if ((match = aspNetRegex.exec(input))) {
	            sign = match[1] === '-' ? -1 : 1;
	            duration = {
	                y: 0,
	                d: toInt(match[DATE]) * sign,
	                h: toInt(match[HOUR]) * sign,
	                m: toInt(match[MINUTE]) * sign,
	                s: toInt(match[SECOND]) * sign,
	                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
	            };
	        } else if ((match = isoRegex.exec(input))) {
	            sign = match[1] === '-' ? -1 : 1;
	            duration = {
	                y: parseIso(match[2], sign),
	                M: parseIso(match[3], sign),
	                w: parseIso(match[4], sign),
	                d: parseIso(match[5], sign),
	                h: parseIso(match[6], sign),
	                m: parseIso(match[7], sign),
	                s: parseIso(match[8], sign),
	            };
	        } else if (duration == null) {
	            // checks for null or undefined
	            duration = {};
	        } else if (
	            typeof duration === 'object' &&
	            ('from' in duration || 'to' in duration)
	        ) {
	            diffRes = momentsDifference(
	                createLocal(duration.from),
	                createLocal(duration.to)
	            );

	            duration = {};
	            duration.ms = diffRes.milliseconds;
	            duration.M = diffRes.months;
	        }

	        ret = new Duration(duration);

	        if (isDuration(input) && hasOwnProp(input, '_locale')) {
	            ret._locale = input._locale;
	        }

	        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
	            ret._isValid = input._isValid;
	        }

	        return ret;
	    }

	    createDuration.fn = Duration.prototype;
	    createDuration.invalid = createInvalid$1;

	    function parseIso(inp, sign) {
	        // We'd normally use ~~inp for this, but unfortunately it also
	        // converts floats to ints.
	        // inp may be undefined, so careful calling replace on it.
	        var res = inp && parseFloat(inp.replace(',', '.'));
	        // apply sign while we're at it
	        return (isNaN(res) ? 0 : res) * sign;
	    }

	    function positiveMomentsDifference(base, other) {
	        var res = {};

	        res.months =
	            other.month() - base.month() + (other.year() - base.year()) * 12;
	        if (base.clone().add(res.months, 'M').isAfter(other)) {
	            --res.months;
	        }

	        res.milliseconds = +other - +base.clone().add(res.months, 'M');

	        return res;
	    }

	    function momentsDifference(base, other) {
	        var res;
	        if (!(base.isValid() && other.isValid())) {
	            return { milliseconds: 0, months: 0 };
	        }

	        other = cloneWithOffset(other, base);
	        if (base.isBefore(other)) {
	            res = positiveMomentsDifference(base, other);
	        } else {
	            res = positiveMomentsDifference(other, base);
	            res.milliseconds = -res.milliseconds;
	            res.months = -res.months;
	        }

	        return res;
	    }

	    // TODO: remove 'name' arg after deprecation is removed
	    function createAdder(direction, name) {
	        return function (val, period) {
	            var dur, tmp;
	            //invert the arguments, but complain about it
	            if (period !== null && !isNaN(+period)) {
	                deprecateSimple(
	                    name,
	                    'moment().' +
	                        name +
	                        '(period, number) is deprecated. Please use moment().' +
	                        name +
	                        '(number, period). ' +
	                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
	                );
	                tmp = val;
	                val = period;
	                period = tmp;
	            }

	            dur = createDuration(val, period);
	            addSubtract(this, dur, direction);
	            return this;
	        };
	    }

	    function addSubtract(mom, duration, isAdding, updateOffset) {
	        var milliseconds = duration._milliseconds,
	            days = absRound(duration._days),
	            months = absRound(duration._months);

	        if (!mom.isValid()) {
	            // No op
	            return;
	        }

	        updateOffset = updateOffset == null ? true : updateOffset;

	        if (months) {
	            setMonth(mom, get(mom, 'Month') + months * isAdding);
	        }
	        if (days) {
	            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
	        }
	        if (milliseconds) {
	            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
	        }
	        if (updateOffset) {
	            hooks.updateOffset(mom, days || months);
	        }
	    }

	    var add = createAdder(1, 'add'),
	        subtract = createAdder(-1, 'subtract');

	    function isString(input) {
	        return typeof input === 'string' || input instanceof String;
	    }

	    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
	    function isMomentInput(input) {
	        return (
	            isMoment(input) ||
	            isDate(input) ||
	            isString(input) ||
	            isNumber(input) ||
	            isNumberOrStringArray(input) ||
	            isMomentInputObject(input) ||
	            input === null ||
	            input === undefined
	        );
	    }

	    function isMomentInputObject(input) {
	        var objectTest = isObject(input) && !isObjectEmpty(input),
	            propertyTest = false,
	            properties = [
	                'years',
	                'year',
	                'y',
	                'months',
	                'month',
	                'M',
	                'days',
	                'day',
	                'd',
	                'dates',
	                'date',
	                'D',
	                'hours',
	                'hour',
	                'h',
	                'minutes',
	                'minute',
	                'm',
	                'seconds',
	                'second',
	                's',
	                'milliseconds',
	                'millisecond',
	                'ms',
	            ],
	            i,
	            property,
	            propertyLen = properties.length;

	        for (i = 0; i < propertyLen; i += 1) {
	            property = properties[i];
	            propertyTest = propertyTest || hasOwnProp(input, property);
	        }

	        return objectTest && propertyTest;
	    }

	    function isNumberOrStringArray(input) {
	        var arrayTest = isArray(input),
	            dataTypeTest = false;
	        if (arrayTest) {
	            dataTypeTest =
	                input.filter(function (item) {
	                    return !isNumber(item) && isString(input);
	                }).length === 0;
	        }
	        return arrayTest && dataTypeTest;
	    }

	    function isCalendarSpec(input) {
	        var objectTest = isObject(input) && !isObjectEmpty(input),
	            propertyTest = false,
	            properties = [
	                'sameDay',
	                'nextDay',
	                'lastDay',
	                'nextWeek',
	                'lastWeek',
	                'sameElse',
	            ],
	            i,
	            property;

	        for (i = 0; i < properties.length; i += 1) {
	            property = properties[i];
	            propertyTest = propertyTest || hasOwnProp(input, property);
	        }

	        return objectTest && propertyTest;
	    }

	    function getCalendarFormat(myMoment, now) {
	        var diff = myMoment.diff(now, 'days', true);
	        return diff < -6
	            ? 'sameElse'
	            : diff < -1
	            ? 'lastWeek'
	            : diff < 0
	            ? 'lastDay'
	            : diff < 1
	            ? 'sameDay'
	            : diff < 2
	            ? 'nextDay'
	            : diff < 7
	            ? 'nextWeek'
	            : 'sameElse';
	    }

	    function calendar$1(time, formats) {
	        // Support for single parameter, formats only overload to the calendar function
	        if (arguments.length === 1) {
	            if (!arguments[0]) {
	                time = undefined;
	                formats = undefined;
	            } else if (isMomentInput(arguments[0])) {
	                time = arguments[0];
	                formats = undefined;
	            } else if (isCalendarSpec(arguments[0])) {
	                formats = arguments[0];
	                time = undefined;
	            }
	        }
	        // We want to compare the start of today, vs this.
	        // Getting start-of-today depends on whether we're local/utc/offset or not.
	        var now = time || createLocal(),
	            sod = cloneWithOffset(now, this).startOf('day'),
	            format = hooks.calendarFormat(this, sod) || 'sameElse',
	            output =
	                formats &&
	                (isFunction(formats[format])
	                    ? formats[format].call(this, now)
	                    : formats[format]);

	        return this.format(
	            output || this.localeData().calendar(format, this, createLocal(now))
	        );
	    }

	    function clone() {
	        return new Moment(this);
	    }

	    function isAfter(input, units) {
	        var localInput = isMoment(input) ? input : createLocal(input);
	        if (!(this.isValid() && localInput.isValid())) {
	            return false;
	        }
	        units = normalizeUnits(units) || 'millisecond';
	        if (units === 'millisecond') {
	            return this.valueOf() > localInput.valueOf();
	        } else {
	            return localInput.valueOf() < this.clone().startOf(units).valueOf();
	        }
	    }

	    function isBefore(input, units) {
	        var localInput = isMoment(input) ? input : createLocal(input);
	        if (!(this.isValid() && localInput.isValid())) {
	            return false;
	        }
	        units = normalizeUnits(units) || 'millisecond';
	        if (units === 'millisecond') {
	            return this.valueOf() < localInput.valueOf();
	        } else {
	            return this.clone().endOf(units).valueOf() < localInput.valueOf();
	        }
	    }

	    function isBetween(from, to, units, inclusivity) {
	        var localFrom = isMoment(from) ? from : createLocal(from),
	            localTo = isMoment(to) ? to : createLocal(to);
	        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
	            return false;
	        }
	        inclusivity = inclusivity || '()';
	        return (
	            (inclusivity[0] === '('
	                ? this.isAfter(localFrom, units)
	                : !this.isBefore(localFrom, units)) &&
	            (inclusivity[1] === ')'
	                ? this.isBefore(localTo, units)
	                : !this.isAfter(localTo, units))
	        );
	    }

	    function isSame(input, units) {
	        var localInput = isMoment(input) ? input : createLocal(input),
	            inputMs;
	        if (!(this.isValid() && localInput.isValid())) {
	            return false;
	        }
	        units = normalizeUnits(units) || 'millisecond';
	        if (units === 'millisecond') {
	            return this.valueOf() === localInput.valueOf();
	        } else {
	            inputMs = localInput.valueOf();
	            return (
	                this.clone().startOf(units).valueOf() <= inputMs &&
	                inputMs <= this.clone().endOf(units).valueOf()
	            );
	        }
	    }

	    function isSameOrAfter(input, units) {
	        return this.isSame(input, units) || this.isAfter(input, units);
	    }

	    function isSameOrBefore(input, units) {
	        return this.isSame(input, units) || this.isBefore(input, units);
	    }

	    function diff(input, units, asFloat) {
	        var that, zoneDelta, output;

	        if (!this.isValid()) {
	            return NaN;
	        }

	        that = cloneWithOffset(input, this);

	        if (!that.isValid()) {
	            return NaN;
	        }

	        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

	        units = normalizeUnits(units);

	        switch (units) {
	            case 'year':
	                output = monthDiff(this, that) / 12;
	                break;
	            case 'month':
	                output = monthDiff(this, that);
	                break;
	            case 'quarter':
	                output = monthDiff(this, that) / 3;
	                break;
	            case 'second':
	                output = (this - that) / 1e3;
	                break; // 1000
	            case 'minute':
	                output = (this - that) / 6e4;
	                break; // 1000 * 60
	            case 'hour':
	                output = (this - that) / 36e5;
	                break; // 1000 * 60 * 60
	            case 'day':
	                output = (this - that - zoneDelta) / 864e5;
	                break; // 1000 * 60 * 60 * 24, negate dst
	            case 'week':
	                output = (this - that - zoneDelta) / 6048e5;
	                break; // 1000 * 60 * 60 * 24 * 7, negate dst
	            default:
	                output = this - that;
	        }

	        return asFloat ? output : absFloor(output);
	    }

	    function monthDiff(a, b) {
	        if (a.date() < b.date()) {
	            // end-of-month calculations work correct when the start month has more
	            // days than the end month.
	            return -monthDiff(b, a);
	        }
	        // difference in months
	        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
	            // b is in (anchor - 1 month, anchor + 1 month)
	            anchor = a.clone().add(wholeMonthDiff, 'months'),
	            anchor2,
	            adjust;

	        if (b - anchor < 0) {
	            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
	            // linear across the month
	            adjust = (b - anchor) / (anchor - anchor2);
	        } else {
	            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
	            // linear across the month
	            adjust = (b - anchor) / (anchor2 - anchor);
	        }

	        //check for negative zero, return zero if negative zero
	        return -(wholeMonthDiff + adjust) || 0;
	    }

	    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
	    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

	    function toString() {
	        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
	    }

	    function toISOString(keepOffset) {
	        if (!this.isValid()) {
	            return null;
	        }
	        var utc = keepOffset !== true,
	            m = utc ? this.clone().utc() : this;
	        if (m.year() < 0 || m.year() > 9999) {
	            return formatMoment(
	                m,
	                utc
	                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
	                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
	            );
	        }
	        if (isFunction(Date.prototype.toISOString)) {
	            // native implementation is ~50x faster, use it when we can
	            if (utc) {
	                return this.toDate().toISOString();
	            } else {
	                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
	                    .toISOString()
	                    .replace('Z', formatMoment(m, 'Z'));
	            }
	        }
	        return formatMoment(
	            m,
	            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
	        );
	    }

	    /**
	     * Return a human readable representation of a moment that can
	     * also be evaluated to get a new moment which is the same
	     *
	     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
	     */
	    function inspect() {
	        if (!this.isValid()) {
	            return 'moment.invalid(/* ' + this._i + ' */)';
	        }
	        var func = 'moment',
	            zone = '',
	            prefix,
	            year,
	            datetime,
	            suffix;
	        if (!this.isLocal()) {
	            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
	            zone = 'Z';
	        }
	        prefix = '[' + func + '("]';
	        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
	        datetime = '-MM-DD[T]HH:mm:ss.SSS';
	        suffix = zone + '[")]';

	        return this.format(prefix + year + datetime + suffix);
	    }

	    function format(inputString) {
	        if (!inputString) {
	            inputString = this.isUtc()
	                ? hooks.defaultFormatUtc
	                : hooks.defaultFormat;
	        }
	        var output = formatMoment(this, inputString);
	        return this.localeData().postformat(output);
	    }

	    function from(time, withoutSuffix) {
	        if (
	            this.isValid() &&
	            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
	        ) {
	            return createDuration({ to: this, from: time })
	                .locale(this.locale())
	                .humanize(!withoutSuffix);
	        } else {
	            return this.localeData().invalidDate();
	        }
	    }

	    function fromNow(withoutSuffix) {
	        return this.from(createLocal(), withoutSuffix);
	    }

	    function to(time, withoutSuffix) {
	        if (
	            this.isValid() &&
	            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
	        ) {
	            return createDuration({ from: this, to: time })
	                .locale(this.locale())
	                .humanize(!withoutSuffix);
	        } else {
	            return this.localeData().invalidDate();
	        }
	    }

	    function toNow(withoutSuffix) {
	        return this.to(createLocal(), withoutSuffix);
	    }

	    // If passed a locale key, it will set the locale for this
	    // instance.  Otherwise, it will return the locale configuration
	    // variables for this instance.
	    function locale(key) {
	        var newLocaleData;

	        if (key === undefined) {
	            return this._locale._abbr;
	        } else {
	            newLocaleData = getLocale(key);
	            if (newLocaleData != null) {
	                this._locale = newLocaleData;
	            }
	            return this;
	        }
	    }

	    var lang = deprecate(
	        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
	        function (key) {
	            if (key === undefined) {
	                return this.localeData();
	            } else {
	                return this.locale(key);
	            }
	        }
	    );

	    function localeData() {
	        return this._locale;
	    }

	    var MS_PER_SECOND = 1000,
	        MS_PER_MINUTE = 60 * MS_PER_SECOND,
	        MS_PER_HOUR = 60 * MS_PER_MINUTE,
	        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

	    // actual modulo - handles negative numbers (for dates before 1970):
	    function mod$1(dividend, divisor) {
	        return ((dividend % divisor) + divisor) % divisor;
	    }

	    function localStartOfDate(y, m, d) {
	        // the date constructor remaps years 0-99 to 1900-1999
	        if (y < 100 && y >= 0) {
	            // preserve leap years using a full 400 year cycle, then reset
	            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
	        } else {
	            return new Date(y, m, d).valueOf();
	        }
	    }

	    function utcStartOfDate(y, m, d) {
	        // Date.UTC remaps years 0-99 to 1900-1999
	        if (y < 100 && y >= 0) {
	            // preserve leap years using a full 400 year cycle, then reset
	            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
	        } else {
	            return Date.UTC(y, m, d);
	        }
	    }

	    function startOf(units) {
	        var time, startOfDate;
	        units = normalizeUnits(units);
	        if (units === undefined || units === 'millisecond' || !this.isValid()) {
	            return this;
	        }

	        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

	        switch (units) {
	            case 'year':
	                time = startOfDate(this.year(), 0, 1);
	                break;
	            case 'quarter':
	                time = startOfDate(
	                    this.year(),
	                    this.month() - (this.month() % 3),
	                    1
	                );
	                break;
	            case 'month':
	                time = startOfDate(this.year(), this.month(), 1);
	                break;
	            case 'week':
	                time = startOfDate(
	                    this.year(),
	                    this.month(),
	                    this.date() - this.weekday()
	                );
	                break;
	            case 'isoWeek':
	                time = startOfDate(
	                    this.year(),
	                    this.month(),
	                    this.date() - (this.isoWeekday() - 1)
	                );
	                break;
	            case 'day':
	            case 'date':
	                time = startOfDate(this.year(), this.month(), this.date());
	                break;
	            case 'hour':
	                time = this._d.valueOf();
	                time -= mod$1(
	                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
	                    MS_PER_HOUR
	                );
	                break;
	            case 'minute':
	                time = this._d.valueOf();
	                time -= mod$1(time, MS_PER_MINUTE);
	                break;
	            case 'second':
	                time = this._d.valueOf();
	                time -= mod$1(time, MS_PER_SECOND);
	                break;
	        }

	        this._d.setTime(time);
	        hooks.updateOffset(this, true);
	        return this;
	    }

	    function endOf(units) {
	        var time, startOfDate;
	        units = normalizeUnits(units);
	        if (units === undefined || units === 'millisecond' || !this.isValid()) {
	            return this;
	        }

	        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

	        switch (units) {
	            case 'year':
	                time = startOfDate(this.year() + 1, 0, 1) - 1;
	                break;
	            case 'quarter':
	                time =
	                    startOfDate(
	                        this.year(),
	                        this.month() - (this.month() % 3) + 3,
	                        1
	                    ) - 1;
	                break;
	            case 'month':
	                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
	                break;
	            case 'week':
	                time =
	                    startOfDate(
	                        this.year(),
	                        this.month(),
	                        this.date() - this.weekday() + 7
	                    ) - 1;
	                break;
	            case 'isoWeek':
	                time =
	                    startOfDate(
	                        this.year(),
	                        this.month(),
	                        this.date() - (this.isoWeekday() - 1) + 7
	                    ) - 1;
	                break;
	            case 'day':
	            case 'date':
	                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
	                break;
	            case 'hour':
	                time = this._d.valueOf();
	                time +=
	                    MS_PER_HOUR -
	                    mod$1(
	                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
	                        MS_PER_HOUR
	                    ) -
	                    1;
	                break;
	            case 'minute':
	                time = this._d.valueOf();
	                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
	                break;
	            case 'second':
	                time = this._d.valueOf();
	                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
	                break;
	        }

	        this._d.setTime(time);
	        hooks.updateOffset(this, true);
	        return this;
	    }

	    function valueOf() {
	        return this._d.valueOf() - (this._offset || 0) * 60000;
	    }

	    function unix() {
	        return Math.floor(this.valueOf() / 1000);
	    }

	    function toDate() {
	        return new Date(this.valueOf());
	    }

	    function toArray() {
	        var m = this;
	        return [
	            m.year(),
	            m.month(),
	            m.date(),
	            m.hour(),
	            m.minute(),
	            m.second(),
	            m.millisecond(),
	        ];
	    }

	    function toObject() {
	        var m = this;
	        return {
	            years: m.year(),
	            months: m.month(),
	            date: m.date(),
	            hours: m.hours(),
	            minutes: m.minutes(),
	            seconds: m.seconds(),
	            milliseconds: m.milliseconds(),
	        };
	    }

	    function toJSON() {
	        // new Date(NaN).toJSON() === null
	        return this.isValid() ? this.toISOString() : null;
	    }

	    function isValid$2() {
	        return isValid(this);
	    }

	    function parsingFlags() {
	        return extend({}, getParsingFlags(this));
	    }

	    function invalidAt() {
	        return getParsingFlags(this).overflow;
	    }

	    function creationData() {
	        return {
	            input: this._i,
	            format: this._f,
	            locale: this._locale,
	            isUTC: this._isUTC,
	            strict: this._strict,
	        };
	    }

	    addFormatToken('N', 0, 0, 'eraAbbr');
	    addFormatToken('NN', 0, 0, 'eraAbbr');
	    addFormatToken('NNN', 0, 0, 'eraAbbr');
	    addFormatToken('NNNN', 0, 0, 'eraName');
	    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

	    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
	    addFormatToken('y', ['yy', 2], 0, 'eraYear');
	    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
	    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

	    addRegexToken('N', matchEraAbbr);
	    addRegexToken('NN', matchEraAbbr);
	    addRegexToken('NNN', matchEraAbbr);
	    addRegexToken('NNNN', matchEraName);
	    addRegexToken('NNNNN', matchEraNarrow);

	    addParseToken(
	        ['N', 'NN', 'NNN', 'NNNN', 'NNNNN'],
	        function (input, array, config, token) {
	            var era = config._locale.erasParse(input, token, config._strict);
	            if (era) {
	                getParsingFlags(config).era = era;
	            } else {
	                getParsingFlags(config).invalidEra = input;
	            }
	        }
	    );

	    addRegexToken('y', matchUnsigned);
	    addRegexToken('yy', matchUnsigned);
	    addRegexToken('yyy', matchUnsigned);
	    addRegexToken('yyyy', matchUnsigned);
	    addRegexToken('yo', matchEraYearOrdinal);

	    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
	    addParseToken(['yo'], function (input, array, config, token) {
	        var match;
	        if (config._locale._eraYearOrdinalRegex) {
	            match = input.match(config._locale._eraYearOrdinalRegex);
	        }

	        if (config._locale.eraYearOrdinalParse) {
	            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
	        } else {
	            array[YEAR] = parseInt(input, 10);
	        }
	    });

	    function localeEras(m, format) {
	        var i,
	            l,
	            date,
	            eras = this._eras || getLocale('en')._eras;
	        for (i = 0, l = eras.length; i < l; ++i) {
	            switch (typeof eras[i].since) {
	                case 'string':
	                    // truncate time
	                    date = hooks(eras[i].since).startOf('day');
	                    eras[i].since = date.valueOf();
	                    break;
	            }

	            switch (typeof eras[i].until) {
	                case 'undefined':
	                    eras[i].until = +Infinity;
	                    break;
	                case 'string':
	                    // truncate time
	                    date = hooks(eras[i].until).startOf('day').valueOf();
	                    eras[i].until = date.valueOf();
	                    break;
	            }
	        }
	        return eras;
	    }

	    function localeErasParse(eraName, format, strict) {
	        var i,
	            l,
	            eras = this.eras(),
	            name,
	            abbr,
	            narrow;
	        eraName = eraName.toUpperCase();

	        for (i = 0, l = eras.length; i < l; ++i) {
	            name = eras[i].name.toUpperCase();
	            abbr = eras[i].abbr.toUpperCase();
	            narrow = eras[i].narrow.toUpperCase();

	            if (strict) {
	                switch (format) {
	                    case 'N':
	                    case 'NN':
	                    case 'NNN':
	                        if (abbr === eraName) {
	                            return eras[i];
	                        }
	                        break;

	                    case 'NNNN':
	                        if (name === eraName) {
	                            return eras[i];
	                        }
	                        break;

	                    case 'NNNNN':
	                        if (narrow === eraName) {
	                            return eras[i];
	                        }
	                        break;
	                }
	            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
	                return eras[i];
	            }
	        }
	    }

	    function localeErasConvertYear(era, year) {
	        var dir = era.since <= era.until ? +1 : -1;
	        if (year === undefined) {
	            return hooks(era.since).year();
	        } else {
	            return hooks(era.since).year() + (year - era.offset) * dir;
	        }
	    }

	    function getEraName() {
	        var i,
	            l,
	            val,
	            eras = this.localeData().eras();
	        for (i = 0, l = eras.length; i < l; ++i) {
	            // truncate time
	            val = this.clone().startOf('day').valueOf();

	            if (eras[i].since <= val && val <= eras[i].until) {
	                return eras[i].name;
	            }
	            if (eras[i].until <= val && val <= eras[i].since) {
	                return eras[i].name;
	            }
	        }

	        return '';
	    }

	    function getEraNarrow() {
	        var i,
	            l,
	            val,
	            eras = this.localeData().eras();
	        for (i = 0, l = eras.length; i < l; ++i) {
	            // truncate time
	            val = this.clone().startOf('day').valueOf();

	            if (eras[i].since <= val && val <= eras[i].until) {
	                return eras[i].narrow;
	            }
	            if (eras[i].until <= val && val <= eras[i].since) {
	                return eras[i].narrow;
	            }
	        }

	        return '';
	    }

	    function getEraAbbr() {
	        var i,
	            l,
	            val,
	            eras = this.localeData().eras();
	        for (i = 0, l = eras.length; i < l; ++i) {
	            // truncate time
	            val = this.clone().startOf('day').valueOf();

	            if (eras[i].since <= val && val <= eras[i].until) {
	                return eras[i].abbr;
	            }
	            if (eras[i].until <= val && val <= eras[i].since) {
	                return eras[i].abbr;
	            }
	        }

	        return '';
	    }

	    function getEraYear() {
	        var i,
	            l,
	            dir,
	            val,
	            eras = this.localeData().eras();
	        for (i = 0, l = eras.length; i < l; ++i) {
	            dir = eras[i].since <= eras[i].until ? +1 : -1;

	            // truncate time
	            val = this.clone().startOf('day').valueOf();

	            if (
	                (eras[i].since <= val && val <= eras[i].until) ||
	                (eras[i].until <= val && val <= eras[i].since)
	            ) {
	                return (
	                    (this.year() - hooks(eras[i].since).year()) * dir +
	                    eras[i].offset
	                );
	            }
	        }

	        return this.year();
	    }

	    function erasNameRegex(isStrict) {
	        if (!hasOwnProp(this, '_erasNameRegex')) {
	            computeErasParse.call(this);
	        }
	        return isStrict ? this._erasNameRegex : this._erasRegex;
	    }

	    function erasAbbrRegex(isStrict) {
	        if (!hasOwnProp(this, '_erasAbbrRegex')) {
	            computeErasParse.call(this);
	        }
	        return isStrict ? this._erasAbbrRegex : this._erasRegex;
	    }

	    function erasNarrowRegex(isStrict) {
	        if (!hasOwnProp(this, '_erasNarrowRegex')) {
	            computeErasParse.call(this);
	        }
	        return isStrict ? this._erasNarrowRegex : this._erasRegex;
	    }

	    function matchEraAbbr(isStrict, locale) {
	        return locale.erasAbbrRegex(isStrict);
	    }

	    function matchEraName(isStrict, locale) {
	        return locale.erasNameRegex(isStrict);
	    }

	    function matchEraNarrow(isStrict, locale) {
	        return locale.erasNarrowRegex(isStrict);
	    }

	    function matchEraYearOrdinal(isStrict, locale) {
	        return locale._eraYearOrdinalRegex || matchUnsigned;
	    }

	    function computeErasParse() {
	        var abbrPieces = [],
	            namePieces = [],
	            narrowPieces = [],
	            mixedPieces = [],
	            i,
	            l,
	            eras = this.eras();

	        for (i = 0, l = eras.length; i < l; ++i) {
	            namePieces.push(regexEscape(eras[i].name));
	            abbrPieces.push(regexEscape(eras[i].abbr));
	            narrowPieces.push(regexEscape(eras[i].narrow));

	            mixedPieces.push(regexEscape(eras[i].name));
	            mixedPieces.push(regexEscape(eras[i].abbr));
	            mixedPieces.push(regexEscape(eras[i].narrow));
	        }

	        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
	        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
	        this._erasNarrowRegex = new RegExp(
	            '^(' + narrowPieces.join('|') + ')',
	            'i'
	        );
	    }

	    // FORMATTING

	    addFormatToken(0, ['gg', 2], 0, function () {
	        return this.weekYear() % 100;
	    });

	    addFormatToken(0, ['GG', 2], 0, function () {
	        return this.isoWeekYear() % 100;
	    });

	    function addWeekYearFormatToken(token, getter) {
	        addFormatToken(0, [token, token.length], 0, getter);
	    }

	    addWeekYearFormatToken('gggg', 'weekYear');
	    addWeekYearFormatToken('ggggg', 'weekYear');
	    addWeekYearFormatToken('GGGG', 'isoWeekYear');
	    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

	    // ALIASES

	    addUnitAlias('weekYear', 'gg');
	    addUnitAlias('isoWeekYear', 'GG');

	    // PRIORITY

	    addUnitPriority('weekYear', 1);
	    addUnitPriority('isoWeekYear', 1);

	    // PARSING

	    addRegexToken('G', matchSigned);
	    addRegexToken('g', matchSigned);
	    addRegexToken('GG', match1to2, match2);
	    addRegexToken('gg', match1to2, match2);
	    addRegexToken('GGGG', match1to4, match4);
	    addRegexToken('gggg', match1to4, match4);
	    addRegexToken('GGGGG', match1to6, match6);
	    addRegexToken('ggggg', match1to6, match6);

	    addWeekParseToken(
	        ['gggg', 'ggggg', 'GGGG', 'GGGGG'],
	        function (input, week, config, token) {
	            week[token.substr(0, 2)] = toInt(input);
	        }
	    );

	    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
	        week[token] = hooks.parseTwoDigitYear(input);
	    });

	    // MOMENTS

	    function getSetWeekYear(input) {
	        return getSetWeekYearHelper.call(
	            this,
	            input,
	            this.week(),
	            this.weekday(),
	            this.localeData()._week.dow,
	            this.localeData()._week.doy
	        );
	    }

	    function getSetISOWeekYear(input) {
	        return getSetWeekYearHelper.call(
	            this,
	            input,
	            this.isoWeek(),
	            this.isoWeekday(),
	            1,
	            4
	        );
	    }

	    function getISOWeeksInYear() {
	        return weeksInYear(this.year(), 1, 4);
	    }

	    function getISOWeeksInISOWeekYear() {
	        return weeksInYear(this.isoWeekYear(), 1, 4);
	    }

	    function getWeeksInYear() {
	        var weekInfo = this.localeData()._week;
	        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
	    }

	    function getWeeksInWeekYear() {
	        var weekInfo = this.localeData()._week;
	        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
	    }

	    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
	        var weeksTarget;
	        if (input == null) {
	            return weekOfYear(this, dow, doy).year;
	        } else {
	            weeksTarget = weeksInYear(input, dow, doy);
	            if (week > weeksTarget) {
	                week = weeksTarget;
	            }
	            return setWeekAll.call(this, input, week, weekday, dow, doy);
	        }
	    }

	    function setWeekAll(weekYear, week, weekday, dow, doy) {
	        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
	            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

	        this.year(date.getUTCFullYear());
	        this.month(date.getUTCMonth());
	        this.date(date.getUTCDate());
	        return this;
	    }

	    // FORMATTING

	    addFormatToken('Q', 0, 'Qo', 'quarter');

	    // ALIASES

	    addUnitAlias('quarter', 'Q');

	    // PRIORITY

	    addUnitPriority('quarter', 7);

	    // PARSING

	    addRegexToken('Q', match1);
	    addParseToken('Q', function (input, array) {
	        array[MONTH] = (toInt(input) - 1) * 3;
	    });

	    // MOMENTS

	    function getSetQuarter(input) {
	        return input == null
	            ? Math.ceil((this.month() + 1) / 3)
	            : this.month((input - 1) * 3 + (this.month() % 3));
	    }

	    // FORMATTING

	    addFormatToken('D', ['DD', 2], 'Do', 'date');

	    // ALIASES

	    addUnitAlias('date', 'D');

	    // PRIORITY
	    addUnitPriority('date', 9);

	    // PARSING

	    addRegexToken('D', match1to2);
	    addRegexToken('DD', match1to2, match2);
	    addRegexToken('Do', function (isStrict, locale) {
	        // TODO: Remove "ordinalParse" fallback in next major release.
	        return isStrict
	            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
	            : locale._dayOfMonthOrdinalParseLenient;
	    });

	    addParseToken(['D', 'DD'], DATE);
	    addParseToken('Do', function (input, array) {
	        array[DATE] = toInt(input.match(match1to2)[0]);
	    });

	    // MOMENTS

	    var getSetDayOfMonth = makeGetSet('Date', true);

	    // FORMATTING

	    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

	    // ALIASES

	    addUnitAlias('dayOfYear', 'DDD');

	    // PRIORITY
	    addUnitPriority('dayOfYear', 4);

	    // PARSING

	    addRegexToken('DDD', match1to3);
	    addRegexToken('DDDD', match3);
	    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
	        config._dayOfYear = toInt(input);
	    });

	    // HELPERS

	    // MOMENTS

	    function getSetDayOfYear(input) {
	        var dayOfYear =
	            Math.round(
	                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
	            ) + 1;
	        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
	    }

	    // FORMATTING

	    addFormatToken('m', ['mm', 2], 0, 'minute');

	    // ALIASES

	    addUnitAlias('minute', 'm');

	    // PRIORITY

	    addUnitPriority('minute', 14);

	    // PARSING

	    addRegexToken('m', match1to2);
	    addRegexToken('mm', match1to2, match2);
	    addParseToken(['m', 'mm'], MINUTE);

	    // MOMENTS

	    var getSetMinute = makeGetSet('Minutes', false);

	    // FORMATTING

	    addFormatToken('s', ['ss', 2], 0, 'second');

	    // ALIASES

	    addUnitAlias('second', 's');

	    // PRIORITY

	    addUnitPriority('second', 15);

	    // PARSING

	    addRegexToken('s', match1to2);
	    addRegexToken('ss', match1to2, match2);
	    addParseToken(['s', 'ss'], SECOND);

	    // MOMENTS

	    var getSetSecond = makeGetSet('Seconds', false);

	    // FORMATTING

	    addFormatToken('S', 0, 0, function () {
	        return ~~(this.millisecond() / 100);
	    });

	    addFormatToken(0, ['SS', 2], 0, function () {
	        return ~~(this.millisecond() / 10);
	    });

	    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
	    addFormatToken(0, ['SSSS', 4], 0, function () {
	        return this.millisecond() * 10;
	    });
	    addFormatToken(0, ['SSSSS', 5], 0, function () {
	        return this.millisecond() * 100;
	    });
	    addFormatToken(0, ['SSSSSS', 6], 0, function () {
	        return this.millisecond() * 1000;
	    });
	    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
	        return this.millisecond() * 10000;
	    });
	    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
	        return this.millisecond() * 100000;
	    });
	    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
	        return this.millisecond() * 1000000;
	    });

	    // ALIASES

	    addUnitAlias('millisecond', 'ms');

	    // PRIORITY

	    addUnitPriority('millisecond', 16);

	    // PARSING

	    addRegexToken('S', match1to3, match1);
	    addRegexToken('SS', match1to3, match2);
	    addRegexToken('SSS', match1to3, match3);

	    var token, getSetMillisecond;
	    for (token = 'SSSS'; token.length <= 9; token += 'S') {
	        addRegexToken(token, matchUnsigned);
	    }

	    function parseMs(input, array) {
	        array[MILLISECOND] = toInt(('0.' + input) * 1000);
	    }

	    for (token = 'S'; token.length <= 9; token += 'S') {
	        addParseToken(token, parseMs);
	    }

	    getSetMillisecond = makeGetSet('Milliseconds', false);

	    // FORMATTING

	    addFormatToken('z', 0, 0, 'zoneAbbr');
	    addFormatToken('zz', 0, 0, 'zoneName');

	    // MOMENTS

	    function getZoneAbbr() {
	        return this._isUTC ? 'UTC' : '';
	    }

	    function getZoneName() {
	        return this._isUTC ? 'Coordinated Universal Time' : '';
	    }

	    var proto = Moment.prototype;

	    proto.add = add;
	    proto.calendar = calendar$1;
	    proto.clone = clone;
	    proto.diff = diff;
	    proto.endOf = endOf;
	    proto.format = format;
	    proto.from = from;
	    proto.fromNow = fromNow;
	    proto.to = to;
	    proto.toNow = toNow;
	    proto.get = stringGet;
	    proto.invalidAt = invalidAt;
	    proto.isAfter = isAfter;
	    proto.isBefore = isBefore;
	    proto.isBetween = isBetween;
	    proto.isSame = isSame;
	    proto.isSameOrAfter = isSameOrAfter;
	    proto.isSameOrBefore = isSameOrBefore;
	    proto.isValid = isValid$2;
	    proto.lang = lang;
	    proto.locale = locale;
	    proto.localeData = localeData;
	    proto.max = prototypeMax;
	    proto.min = prototypeMin;
	    proto.parsingFlags = parsingFlags;
	    proto.set = stringSet;
	    proto.startOf = startOf;
	    proto.subtract = subtract;
	    proto.toArray = toArray;
	    proto.toObject = toObject;
	    proto.toDate = toDate;
	    proto.toISOString = toISOString;
	    proto.inspect = inspect;
	    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
	        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
	            return 'Moment<' + this.format() + '>';
	        };
	    }
	    proto.toJSON = toJSON;
	    proto.toString = toString;
	    proto.unix = unix;
	    proto.valueOf = valueOf;
	    proto.creationData = creationData;
	    proto.eraName = getEraName;
	    proto.eraNarrow = getEraNarrow;
	    proto.eraAbbr = getEraAbbr;
	    proto.eraYear = getEraYear;
	    proto.year = getSetYear;
	    proto.isLeapYear = getIsLeapYear;
	    proto.weekYear = getSetWeekYear;
	    proto.isoWeekYear = getSetISOWeekYear;
	    proto.quarter = proto.quarters = getSetQuarter;
	    proto.month = getSetMonth;
	    proto.daysInMonth = getDaysInMonth;
	    proto.week = proto.weeks = getSetWeek;
	    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
	    proto.weeksInYear = getWeeksInYear;
	    proto.weeksInWeekYear = getWeeksInWeekYear;
	    proto.isoWeeksInYear = getISOWeeksInYear;
	    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
	    proto.date = getSetDayOfMonth;
	    proto.day = proto.days = getSetDayOfWeek;
	    proto.weekday = getSetLocaleDayOfWeek;
	    proto.isoWeekday = getSetISODayOfWeek;
	    proto.dayOfYear = getSetDayOfYear;
	    proto.hour = proto.hours = getSetHour;
	    proto.minute = proto.minutes = getSetMinute;
	    proto.second = proto.seconds = getSetSecond;
	    proto.millisecond = proto.milliseconds = getSetMillisecond;
	    proto.utcOffset = getSetOffset;
	    proto.utc = setOffsetToUTC;
	    proto.local = setOffsetToLocal;
	    proto.parseZone = setOffsetToParsedOffset;
	    proto.hasAlignedHourOffset = hasAlignedHourOffset;
	    proto.isDST = isDaylightSavingTime;
	    proto.isLocal = isLocal;
	    proto.isUtcOffset = isUtcOffset;
	    proto.isUtc = isUtc;
	    proto.isUTC = isUtc;
	    proto.zoneAbbr = getZoneAbbr;
	    proto.zoneName = getZoneName;
	    proto.dates = deprecate(
	        'dates accessor is deprecated. Use date instead.',
	        getSetDayOfMonth
	    );
	    proto.months = deprecate(
	        'months accessor is deprecated. Use month instead',
	        getSetMonth
	    );
	    proto.years = deprecate(
	        'years accessor is deprecated. Use year instead',
	        getSetYear
	    );
	    proto.zone = deprecate(
	        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
	        getSetZone
	    );
	    proto.isDSTShifted = deprecate(
	        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
	        isDaylightSavingTimeShifted
	    );

	    function createUnix(input) {
	        return createLocal(input * 1000);
	    }

	    function createInZone() {
	        return createLocal.apply(null, arguments).parseZone();
	    }

	    function preParsePostFormat(string) {
	        return string;
	    }

	    var proto$1 = Locale.prototype;

	    proto$1.calendar = calendar;
	    proto$1.longDateFormat = longDateFormat;
	    proto$1.invalidDate = invalidDate;
	    proto$1.ordinal = ordinal;
	    proto$1.preparse = preParsePostFormat;
	    proto$1.postformat = preParsePostFormat;
	    proto$1.relativeTime = relativeTime;
	    proto$1.pastFuture = pastFuture;
	    proto$1.set = set;
	    proto$1.eras = localeEras;
	    proto$1.erasParse = localeErasParse;
	    proto$1.erasConvertYear = localeErasConvertYear;
	    proto$1.erasAbbrRegex = erasAbbrRegex;
	    proto$1.erasNameRegex = erasNameRegex;
	    proto$1.erasNarrowRegex = erasNarrowRegex;

	    proto$1.months = localeMonths;
	    proto$1.monthsShort = localeMonthsShort;
	    proto$1.monthsParse = localeMonthsParse;
	    proto$1.monthsRegex = monthsRegex;
	    proto$1.monthsShortRegex = monthsShortRegex;
	    proto$1.week = localeWeek;
	    proto$1.firstDayOfYear = localeFirstDayOfYear;
	    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

	    proto$1.weekdays = localeWeekdays;
	    proto$1.weekdaysMin = localeWeekdaysMin;
	    proto$1.weekdaysShort = localeWeekdaysShort;
	    proto$1.weekdaysParse = localeWeekdaysParse;

	    proto$1.weekdaysRegex = weekdaysRegex;
	    proto$1.weekdaysShortRegex = weekdaysShortRegex;
	    proto$1.weekdaysMinRegex = weekdaysMinRegex;

	    proto$1.isPM = localeIsPM;
	    proto$1.meridiem = localeMeridiem;

	    function get$1(format, index, field, setter) {
	        var locale = getLocale(),
	            utc = createUTC().set(setter, index);
	        return locale[field](utc, format);
	    }

	    function listMonthsImpl(format, index, field) {
	        if (isNumber(format)) {
	            index = format;
	            format = undefined;
	        }

	        format = format || '';

	        if (index != null) {
	            return get$1(format, index, field, 'month');
	        }

	        var i,
	            out = [];
	        for (i = 0; i < 12; i++) {
	            out[i] = get$1(format, i, field, 'month');
	        }
	        return out;
	    }

	    // ()
	    // (5)
	    // (fmt, 5)
	    // (fmt)
	    // (true)
	    // (true, 5)
	    // (true, fmt, 5)
	    // (true, fmt)
	    function listWeekdaysImpl(localeSorted, format, index, field) {
	        if (typeof localeSorted === 'boolean') {
	            if (isNumber(format)) {
	                index = format;
	                format = undefined;
	            }

	            format = format || '';
	        } else {
	            format = localeSorted;
	            index = format;
	            localeSorted = false;

	            if (isNumber(format)) {
	                index = format;
	                format = undefined;
	            }

	            format = format || '';
	        }

	        var locale = getLocale(),
	            shift = localeSorted ? locale._week.dow : 0,
	            i,
	            out = [];

	        if (index != null) {
	            return get$1(format, (index + shift) % 7, field, 'day');
	        }

	        for (i = 0; i < 7; i++) {
	            out[i] = get$1(format, (i + shift) % 7, field, 'day');
	        }
	        return out;
	    }

	    function listMonths(format, index) {
	        return listMonthsImpl(format, index, 'months');
	    }

	    function listMonthsShort(format, index) {
	        return listMonthsImpl(format, index, 'monthsShort');
	    }

	    function listWeekdays(localeSorted, format, index) {
	        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
	    }

	    function listWeekdaysShort(localeSorted, format, index) {
	        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
	    }

	    function listWeekdaysMin(localeSorted, format, index) {
	        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
	    }

	    getSetGlobalLocale('en', {
	        eras: [
	            {
	                since: '0001-01-01',
	                until: +Infinity,
	                offset: 1,
	                name: 'Anno Domini',
	                narrow: 'AD',
	                abbr: 'AD',
	            },
	            {
	                since: '0000-12-31',
	                until: -Infinity,
	                offset: 1,
	                name: 'Before Christ',
	                narrow: 'BC',
	                abbr: 'BC',
	            },
	        ],
	        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
	        ordinal: function (number) {
	            var b = number % 10,
	                output =
	                    toInt((number % 100) / 10) === 1
	                        ? 'th'
	                        : b === 1
	                        ? 'st'
	                        : b === 2
	                        ? 'nd'
	                        : b === 3
	                        ? 'rd'
	                        : 'th';
	            return number + output;
	        },
	    });

	    // Side effect imports

	    hooks.lang = deprecate(
	        'moment.lang is deprecated. Use moment.locale instead.',
	        getSetGlobalLocale
	    );
	    hooks.langData = deprecate(
	        'moment.langData is deprecated. Use moment.localeData instead.',
	        getLocale
	    );

	    var mathAbs = Math.abs;

	    function abs() {
	        var data = this._data;

	        this._milliseconds = mathAbs(this._milliseconds);
	        this._days = mathAbs(this._days);
	        this._months = mathAbs(this._months);

	        data.milliseconds = mathAbs(data.milliseconds);
	        data.seconds = mathAbs(data.seconds);
	        data.minutes = mathAbs(data.minutes);
	        data.hours = mathAbs(data.hours);
	        data.months = mathAbs(data.months);
	        data.years = mathAbs(data.years);

	        return this;
	    }

	    function addSubtract$1(duration, input, value, direction) {
	        var other = createDuration(input, value);

	        duration._milliseconds += direction * other._milliseconds;
	        duration._days += direction * other._days;
	        duration._months += direction * other._months;

	        return duration._bubble();
	    }

	    // supports only 2.0-style add(1, 's') or add(duration)
	    function add$1(input, value) {
	        return addSubtract$1(this, input, value, 1);
	    }

	    // supports only 2.0-style subtract(1, 's') or subtract(duration)
	    function subtract$1(input, value) {
	        return addSubtract$1(this, input, value, -1);
	    }

	    function absCeil(number) {
	        if (number < 0) {
	            return Math.floor(number);
	        } else {
	            return Math.ceil(number);
	        }
	    }

	    function bubble() {
	        var milliseconds = this._milliseconds,
	            days = this._days,
	            months = this._months,
	            data = this._data,
	            seconds,
	            minutes,
	            hours,
	            years,
	            monthsFromDays;

	        // if we have a mix of positive and negative values, bubble down first
	        // check: https://github.com/moment/moment/issues/2166
	        if (
	            !(
	                (milliseconds >= 0 && days >= 0 && months >= 0) ||
	                (milliseconds <= 0 && days <= 0 && months <= 0)
	            )
	        ) {
	            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
	            days = 0;
	            months = 0;
	        }

	        // The following code bubbles up values, see the tests for
	        // examples of what that means.
	        data.milliseconds = milliseconds % 1000;

	        seconds = absFloor(milliseconds / 1000);
	        data.seconds = seconds % 60;

	        minutes = absFloor(seconds / 60);
	        data.minutes = minutes % 60;

	        hours = absFloor(minutes / 60);
	        data.hours = hours % 24;

	        days += absFloor(hours / 24);

	        // convert days to months
	        monthsFromDays = absFloor(daysToMonths(days));
	        months += monthsFromDays;
	        days -= absCeil(monthsToDays(monthsFromDays));

	        // 12 months -> 1 year
	        years = absFloor(months / 12);
	        months %= 12;

	        data.days = days;
	        data.months = months;
	        data.years = years;

	        return this;
	    }

	    function daysToMonths(days) {
	        // 400 years have 146097 days (taking into account leap year rules)
	        // 400 years have 12 months === 4800
	        return (days * 4800) / 146097;
	    }

	    function monthsToDays(months) {
	        // the reverse of daysToMonths
	        return (months * 146097) / 4800;
	    }

	    function as(units) {
	        if (!this.isValid()) {
	            return NaN;
	        }
	        var days,
	            months,
	            milliseconds = this._milliseconds;

	        units = normalizeUnits(units);

	        if (units === 'month' || units === 'quarter' || units === 'year') {
	            days = this._days + milliseconds / 864e5;
	            months = this._months + daysToMonths(days);
	            switch (units) {
	                case 'month':
	                    return months;
	                case 'quarter':
	                    return months / 3;
	                case 'year':
	                    return months / 12;
	            }
	        } else {
	            // handle milliseconds separately because of floating point math errors (issue #1867)
	            days = this._days + Math.round(monthsToDays(this._months));
	            switch (units) {
	                case 'week':
	                    return days / 7 + milliseconds / 6048e5;
	                case 'day':
	                    return days + milliseconds / 864e5;
	                case 'hour':
	                    return days * 24 + milliseconds / 36e5;
	                case 'minute':
	                    return days * 1440 + milliseconds / 6e4;
	                case 'second':
	                    return days * 86400 + milliseconds / 1000;
	                // Math.floor prevents floating point math errors here
	                case 'millisecond':
	                    return Math.floor(days * 864e5) + milliseconds;
	                default:
	                    throw new Error('Unknown unit ' + units);
	            }
	        }
	    }

	    // TODO: Use this.as('ms')?
	    function valueOf$1() {
	        if (!this.isValid()) {
	            return NaN;
	        }
	        return (
	            this._milliseconds +
	            this._days * 864e5 +
	            (this._months % 12) * 2592e6 +
	            toInt(this._months / 12) * 31536e6
	        );
	    }

	    function makeAs(alias) {
	        return function () {
	            return this.as(alias);
	        };
	    }

	    var asMilliseconds = makeAs('ms'),
	        asSeconds = makeAs('s'),
	        asMinutes = makeAs('m'),
	        asHours = makeAs('h'),
	        asDays = makeAs('d'),
	        asWeeks = makeAs('w'),
	        asMonths = makeAs('M'),
	        asQuarters = makeAs('Q'),
	        asYears = makeAs('y');

	    function clone$1() {
	        return createDuration(this);
	    }

	    function get$2(units) {
	        units = normalizeUnits(units);
	        return this.isValid() ? this[units + 's']() : NaN;
	    }

	    function makeGetter(name) {
	        return function () {
	            return this.isValid() ? this._data[name] : NaN;
	        };
	    }

	    var milliseconds = makeGetter('milliseconds'),
	        seconds = makeGetter('seconds'),
	        minutes = makeGetter('minutes'),
	        hours = makeGetter('hours'),
	        days = makeGetter('days'),
	        months = makeGetter('months'),
	        years = makeGetter('years');

	    function weeks() {
	        return absFloor(this.days() / 7);
	    }

	    var round = Math.round,
	        thresholds = {
	            ss: 44, // a few seconds to seconds
	            s: 45, // seconds to minute
	            m: 45, // minutes to hour
	            h: 22, // hours to day
	            d: 26, // days to month/week
	            w: null, // weeks to month
	            M: 11, // months to year
	        };

	    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
	        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
	    }

	    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
	        var duration = createDuration(posNegDuration).abs(),
	            seconds = round(duration.as('s')),
	            minutes = round(duration.as('m')),
	            hours = round(duration.as('h')),
	            days = round(duration.as('d')),
	            months = round(duration.as('M')),
	            weeks = round(duration.as('w')),
	            years = round(duration.as('y')),
	            a =
	                (seconds <= thresholds.ss && ['s', seconds]) ||
	                (seconds < thresholds.s && ['ss', seconds]) ||
	                (minutes <= 1 && ['m']) ||
	                (minutes < thresholds.m && ['mm', minutes]) ||
	                (hours <= 1 && ['h']) ||
	                (hours < thresholds.h && ['hh', hours]) ||
	                (days <= 1 && ['d']) ||
	                (days < thresholds.d && ['dd', days]);

	        if (thresholds.w != null) {
	            a =
	                a ||
	                (weeks <= 1 && ['w']) ||
	                (weeks < thresholds.w && ['ww', weeks]);
	        }
	        a = a ||
	            (months <= 1 && ['M']) ||
	            (months < thresholds.M && ['MM', months]) ||
	            (years <= 1 && ['y']) || ['yy', years];

	        a[2] = withoutSuffix;
	        a[3] = +posNegDuration > 0;
	        a[4] = locale;
	        return substituteTimeAgo.apply(null, a);
	    }

	    // This function allows you to set the rounding function for relative time strings
	    function getSetRelativeTimeRounding(roundingFunction) {
	        if (roundingFunction === undefined) {
	            return round;
	        }
	        if (typeof roundingFunction === 'function') {
	            round = roundingFunction;
	            return true;
	        }
	        return false;
	    }

	    // This function allows you to set a threshold for relative time strings
	    function getSetRelativeTimeThreshold(threshold, limit) {
	        if (thresholds[threshold] === undefined) {
	            return false;
	        }
	        if (limit === undefined) {
	            return thresholds[threshold];
	        }
	        thresholds[threshold] = limit;
	        if (threshold === 's') {
	            thresholds.ss = limit - 1;
	        }
	        return true;
	    }

	    function humanize(argWithSuffix, argThresholds) {
	        if (!this.isValid()) {
	            return this.localeData().invalidDate();
	        }

	        var withSuffix = false,
	            th = thresholds,
	            locale,
	            output;

	        if (typeof argWithSuffix === 'object') {
	            argThresholds = argWithSuffix;
	            argWithSuffix = false;
	        }
	        if (typeof argWithSuffix === 'boolean') {
	            withSuffix = argWithSuffix;
	        }
	        if (typeof argThresholds === 'object') {
	            th = Object.assign({}, thresholds, argThresholds);
	            if (argThresholds.s != null && argThresholds.ss == null) {
	                th.ss = argThresholds.s - 1;
	            }
	        }

	        locale = this.localeData();
	        output = relativeTime$1(this, !withSuffix, th, locale);

	        if (withSuffix) {
	            output = locale.pastFuture(+this, output);
	        }

	        return locale.postformat(output);
	    }

	    var abs$1 = Math.abs;

	    function sign(x) {
	        return (x > 0) - (x < 0) || +x;
	    }

	    function toISOString$1() {
	        // for ISO strings we do not use the normal bubbling rules:
	        //  * milliseconds bubble up until they become hours
	        //  * days do not bubble at all
	        //  * months bubble up until they become years
	        // This is because there is no context-free conversion between hours and days
	        // (think of clock changes)
	        // and also not between days and months (28-31 days per month)
	        if (!this.isValid()) {
	            return this.localeData().invalidDate();
	        }

	        var seconds = abs$1(this._milliseconds) / 1000,
	            days = abs$1(this._days),
	            months = abs$1(this._months),
	            minutes,
	            hours,
	            years,
	            s,
	            total = this.asSeconds(),
	            totalSign,
	            ymSign,
	            daysSign,
	            hmsSign;

	        if (!total) {
	            // this is the same as C#'s (Noda) and python (isodate)...
	            // but not other JS (goog.date)
	            return 'P0D';
	        }

	        // 3600 seconds -> 60 minutes -> 1 hour
	        minutes = absFloor(seconds / 60);
	        hours = absFloor(minutes / 60);
	        seconds %= 60;
	        minutes %= 60;

	        // 12 months -> 1 year
	        years = absFloor(months / 12);
	        months %= 12;

	        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
	        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

	        totalSign = total < 0 ? '-' : '';
	        ymSign = sign(this._months) !== sign(total) ? '-' : '';
	        daysSign = sign(this._days) !== sign(total) ? '-' : '';
	        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

	        return (
	            totalSign +
	            'P' +
	            (years ? ymSign + years + 'Y' : '') +
	            (months ? ymSign + months + 'M' : '') +
	            (days ? daysSign + days + 'D' : '') +
	            (hours || minutes || seconds ? 'T' : '') +
	            (hours ? hmsSign + hours + 'H' : '') +
	            (minutes ? hmsSign + minutes + 'M' : '') +
	            (seconds ? hmsSign + s + 'S' : '')
	        );
	    }

	    var proto$2 = Duration.prototype;

	    proto$2.isValid = isValid$1;
	    proto$2.abs = abs;
	    proto$2.add = add$1;
	    proto$2.subtract = subtract$1;
	    proto$2.as = as;
	    proto$2.asMilliseconds = asMilliseconds;
	    proto$2.asSeconds = asSeconds;
	    proto$2.asMinutes = asMinutes;
	    proto$2.asHours = asHours;
	    proto$2.asDays = asDays;
	    proto$2.asWeeks = asWeeks;
	    proto$2.asMonths = asMonths;
	    proto$2.asQuarters = asQuarters;
	    proto$2.asYears = asYears;
	    proto$2.valueOf = valueOf$1;
	    proto$2._bubble = bubble;
	    proto$2.clone = clone$1;
	    proto$2.get = get$2;
	    proto$2.milliseconds = milliseconds;
	    proto$2.seconds = seconds;
	    proto$2.minutes = minutes;
	    proto$2.hours = hours;
	    proto$2.days = days;
	    proto$2.weeks = weeks;
	    proto$2.months = months;
	    proto$2.years = years;
	    proto$2.humanize = humanize;
	    proto$2.toISOString = toISOString$1;
	    proto$2.toString = toISOString$1;
	    proto$2.toJSON = toISOString$1;
	    proto$2.locale = locale;
	    proto$2.localeData = localeData;

	    proto$2.toIsoString = deprecate(
	        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
	        toISOString$1
	    );
	    proto$2.lang = lang;

	    // FORMATTING

	    addFormatToken('X', 0, 0, 'unix');
	    addFormatToken('x', 0, 0, 'valueOf');

	    // PARSING

	    addRegexToken('x', matchSigned);
	    addRegexToken('X', matchTimestamp);
	    addParseToken('X', function (input, array, config) {
	        config._d = new Date(parseFloat(input) * 1000);
	    });
	    addParseToken('x', function (input, array, config) {
	        config._d = new Date(toInt(input));
	    });

	    //! moment.js

	    hooks.version = '2.29.4';

	    setHookCallback(createLocal);

	    hooks.fn = proto;
	    hooks.min = min;
	    hooks.max = max;
	    hooks.now = now;
	    hooks.utc = createUTC;
	    hooks.unix = createUnix;
	    hooks.months = listMonths;
	    hooks.isDate = isDate;
	    hooks.locale = getSetGlobalLocale;
	    hooks.invalid = createInvalid;
	    hooks.duration = createDuration;
	    hooks.isMoment = isMoment;
	    hooks.weekdays = listWeekdays;
	    hooks.parseZone = createInZone;
	    hooks.localeData = getLocale;
	    hooks.isDuration = isDuration;
	    hooks.monthsShort = listMonthsShort;
	    hooks.weekdaysMin = listWeekdaysMin;
	    hooks.defineLocale = defineLocale;
	    hooks.updateLocale = updateLocale;
	    hooks.locales = listLocales;
	    hooks.weekdaysShort = listWeekdaysShort;
	    hooks.normalizeUnits = normalizeUnits;
	    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
	    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
	    hooks.calendarFormat = getCalendarFormat;
	    hooks.prototype = proto;

	    // currently HTML5 input type only supports 24-hour formats
	    hooks.HTML5_FMT = {
	        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
	        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
	        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
	        DATE: 'YYYY-MM-DD', // <input type="date" />
	        TIME: 'HH:mm', // <input type="time" />
	        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
	        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
	        WEEK: 'GGGG-[W]WW', // <input type="week" />
	        MONTH: 'YYYY-MM', // <input type="month" />
	    };

	    return hooks;

	}))); 
} (moment$1));

var momentExports = moment$1.exports;
var moment = /*@__PURE__*/getDefaultExportFromCjs(momentExports);

// Plugin settings
class PythonBridgeSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Obsidian Python Bridge Plugin Settings' });
        new obsidian.Setting(containerEl)
            .setName('Python Scripts Folder')
            .setDesc('Path to the folder containing your Python scripts (absolute or relative to the vault).')
            .addText((text) => text
            .setPlaceholder('/path/to/your/scripts or ./scripts-python')
            .setValue(this.plugin.settings.pythonScriptsFolder)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.pythonScriptsFolder = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName('Unix Socket Path')
            .setDesc('Path to the Unix socket file (default: /tmp/obsidian-python.sock).')
            .addText((text) => text
            .setPlaceholder('/tmp/obsidian-python.sock')
            .setValue(this.plugin.settings.socketPath)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.socketPath = value;
            yield this.plugin.saveSettings();
        })));
        // New option to disable Python cache (__pycache__)
        new obsidian.Setting(containerEl)
            .setName('Disable Python Cache (__pycache__)')
            .setDesc('Disable the generation of __pycache__ files when running Python scripts.')
            .addToggle((toggle) => toggle
            .setValue(this.plugin.settings.disablePyCache)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.disablePyCache = value;
            yield this.plugin.saveSettings();
        })));
    }
}

// Modal class for requesting user input
class UserInputModal extends obsidian.Modal {
    constructor(app, scriptName, inputType, message, onSubmit, validationRegex, minValue, maxValue, step) {
        super(app);
        this.scriptName = scriptName;
        this.inputType = inputType;
        this.message = message;
        this.onSubmit = onSubmit;
        this.validationRegex = validationRegex;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.step = step;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: this.scriptName });
        contentEl.createEl('p', { text: this.message });
        if (this.inputType === 'text') {
            this.inputEl = contentEl.createEl('input', { type: 'text' });
        }
        else if (this.inputType === 'number') {
            this.inputEl = contentEl.createEl('input', { type: 'range' });
            if (this.minValue !== undefined) {
                this.inputEl.setAttribute('min', this.minValue.toString());
            }
            if (this.maxValue !== undefined) {
                this.inputEl.setAttribute('max', this.maxValue.toString());
            }
            if (this.step !== undefined) {
                this.inputEl.setAttribute('step', this.step.toString());
            }
        }
        else if (this.inputType === 'boolean') {
            this.inputEl = contentEl.createEl('input', { type: 'checkbox' });
        }
        else if (this.inputType === 'date') {
            this.inputEl = contentEl.createEl('input', { type: 'date' });
        }
        const submitButton = contentEl.createEl('button', { text: 'Submit' });
        submitButton.addEventListener('click', () => {
            if (this.inputEl) {
                let inputValue;
                if (this.inputType === 'boolean') {
                    inputValue = this.inputEl.checked;
                }
                else {
                    inputValue = this.inputEl.value;
                }
                this.onSubmit(inputValue);
                this.close();
            }
        });
    }
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

const DEFAULT_SETTINGS = {
    pythonScriptsFolder: '',
    socketPath: '/tmp/obsidian-python.sock',
    disablePyCache: true // Disable Python cache by default
};
// Function to detect the type of value and convert it
function convertFrontmatterValue(value) {
    if (Array.isArray(value)) {
        // If it's a list, keep the list as is
        return value.map(v => convertFrontmatterValue(v)); // Recursive conversion for lists
    }
    else if (typeof value === 'string') {
        // If it's a string, try to detect if it's a date or datetime
        if (moment(value, moment.ISO_8601, true).isValid()) {
            if (value.length === 10) {
                // If the string length is 10, it's a date without time
                return value; // Format date "YYYY-MM-DD"
            }
            else {
                // Otherwise, it's a datetime with time
                return value; // Format datetime "YYYY-MM-DDTHH:mm:ss"
            }
        }
        else {
            return value; // Otherwise, it's plain text
        }
    }
    else if (typeof value === 'boolean') {
        // If it's a boolean (checkbox)
        return value;
    }
    else if (typeof value === 'number') {
        // If it's a number
        return value;
    }
    else {
        return value; // In all other cases, keep the value as is
    }
}
class ObsidianPythonBridge extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.server = null;
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Loading the Obsidian Python Bridge plugin');
            // Load settings
            yield this.loadSettings();
            // Add a settings tab
            this.addSettingTab(new PythonBridgeSettingTab(this.app, this));
            // Add a command to run a specific Python script
            this.addCommand({
                id: 'run-specific-python-script',
                name: 'Run a specific Python script',
                callback: () => this.chooseAndRunPythonScript(),
            });
            // Add a command to run all Python scripts
            this.addCommand({
                id: 'run-all-python-scripts',
                name: 'Run all Python scripts',
                callback: () => this.runAllPythonScripts(),
            });
            // Start the Unix Socket server
            this.startUnixSocketServer();
        });
    }
    // Unix Socket server to receive requests from Python
    startUnixSocketServer() {
        if (fs__namespace.existsSync(this.settings.socketPath)) {
            fs__namespace.unlinkSync(this.settings.socketPath); // Remove the old socket if present
        }
        this.server = net__namespace.createServer((connection) => {
            connection.on('data', (data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const request = JSON.parse(data.toString());
                    // Handle different actions from Python requests
                    if (request.action === 'get_active_note_content') {
                        const content = yield this.getActiveNoteContent();
                        connection.write(JSON.stringify({ content }));
                    }
                    else if (request.action === 'get_active_note_absolute_path') {
                        const absolutePath = this.getActiveNoteAbsolutePath();
                        connection.write(JSON.stringify({ absolutePath }));
                    }
                    else if (request.action === 'get_active_note_relative_path') {
                        const relativePath = this.getActiveNoteRelativePath();
                        connection.write(JSON.stringify({ relativePath }));
                    }
                    else if (request.action === 'get_active_note_title') {
                        const title = this.getActiveNoteTitle();
                        connection.write(JSON.stringify({ title }));
                    }
                    else if (request.action === 'get_current_vault_absolute_path') {
                        const vaultPath = this.getCurrentVaultAbsolutePath();
                        connection.write(JSON.stringify({ vaultPath }));
                    }
                    else if (request.action === 'show_notification') {
                        new obsidian.Notice(request.text_for_notif);
                        connection.write(JSON.stringify({ status: 'notification sent' }));
                    }
                    else if (request.action === 'get_frontmatter') {
                        // Get the frontmatter of the active note
                        const frontmatterData = yield this.getActiveNoteFrontmatter();
                        connection.write(JSON.stringify(frontmatterData));
                    }
                    else if (request.action === 'request_user_input') {
                        // Request user input
                        const userInput = yield this.requestUserInput(request.scriptName, request.inputType, request.message, request.validationRegex, request.minValue, request.maxValue, request.step);
                        connection.write(JSON.stringify({ userInput }));
                    }
                    else {
                        // Handle unknown actions
                        connection.write(JSON.stringify({ error: 'Unknown action' }));
                    }
                }
                catch (error) {
                    console.error('Error handling socket data:', error);
                    connection.write(JSON.stringify({ error: 'Invalid request format' }));
                }
                finally {
                    connection.end();
                }
            }));
            connection.on('error', (err) => {
                console.error('Socket error:', err);
            });
        });
        this.server.listen(this.settings.socketPath, () => {
            console.log(`Unix Socket server running at ${this.settings.socketPath}`);
        });
        // Ensure the socket is removed when the plugin is unloaded
        this.registerEvent(this.app.workspace.on('quit', () => {
            if (this.server) {
                this.server.close(() => {
                    console.log('Socket server stopped');
                    if (fs__namespace.existsSync(this.settings.socketPath)) {
                        fs__namespace.unlinkSync(this.settings.socketPath);
                    }
                });
            }
        }));
    }
    // Function to request user input via a modal
    requestUserInput(scriptName, inputType, message, validationRegex, minValue, maxValue, step) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const onSubmit = (input) => {
                    resolve(input);
                };
                new UserInputModal(this.app, scriptName, inputType, message, onSubmit, validationRegex, minValue, maxValue, step).open();
            });
        });
    }
    // Function to get the active note's file
    getActiveNote() {
        const activeLeaf = this.app.workspace.activeLeaf;
        if (!activeLeaf || !(activeLeaf.view instanceof obsidian.MarkdownView)) {
            return null;
        }
        return activeLeaf.view.file;
    }
    // Function to retrieve the content of the current active note
    getActiveNoteContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeNote = this.getActiveNote();
            if (!activeNote) {
                console.error('No active note found');
                return null;
            }
            const content = yield this.app.vault.read(activeNote);
            return content;
        });
    }
    // Function to retrieve the absolute path of the current active note
    getActiveNoteRelativePath() {
        const activeNote = this.getActiveNote();
        if (!activeNote) {
            console.error('No active note found');
            return null;
        }
        const absolutePath = activeNote.path;
        return absolutePath;
    }
    // Function to retrieve the absolute path of the current active note
    getActiveNoteAbsolutePath() {
        const activeNote = this.getActiveNote();
        if (!activeNote) {
            console.error('No active note found');
            return null;
        }
        // Retrieve the vault's absolute path
        const vaultPath = this.getCurrentVaultAbsolutePath();
        if (!vaultPath) {
            console.error('Unable to retrieve the vault path');
            return null;
        }
        // Retrieve the note's relative path
        const relativeNotePath = this.getActiveNoteRelativePath();
        if (!relativeNotePath) {
            console.error('Unable to retrieve the relative note path');
            return null;
        }
        // Construct and return the absolute path by combining the vault path and the note's relative path
        const absoluteNotePath = `${vaultPath}/${relativeNotePath}`;
        return absoluteNotePath;
    }
    // Function to retrieve the title of the current active note
    getActiveNoteTitle() {
        const activeNote = this.getActiveNote();
        if (!activeNote) {
            console.error('No active note found');
            return null;
        }
        const title = activeNote.basename;
        return title;
    }
    // Function to retrieve the absolute path of the current vault
    getCurrentVaultAbsolutePath() {
        const adapter = this.app.vault.adapter;
        // Ensure the adapter is a FileSystemAdapter (which gives access to the local file system)
        if (adapter instanceof obsidian.FileSystemAdapter) {
            const vaultPath = adapter.getBasePath(); // Correct method for FileSystemAdapter
            return vaultPath;
        }
        else {
            return null; // If the adapter is not a FileSystemAdapter (e.g., in a non-file system vault)
        }
    }
    // Function to retrieve the active note's Frontmatter and convert the values
    getActiveNoteFrontmatter() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeNote = this.getActiveNote();
            if (!activeNote) {
                return { error: 'No active note found' };
            }
            const cache = this.app.metadataCache.getFileCache(activeNote);
            if (cache && cache.frontmatter) {
                // Convert each frontmatter value
                const convertedFrontmatter = Object.keys(cache.frontmatter).reduce((result, key) => {
                    // Use the ! operator to tell TypeScript that cache.frontmatter[key] is not undefined
                    result[key] = convertFrontmatterValue(cache.frontmatter[key]);
                    return result;
                }, {});
                return { frontmatter: convertedFrontmatter };
            }
            else {
                return null;
            }
        });
    }
    // Function to run a Python script
    runPythonScript(scriptPath) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Running Python script: ${scriptPath}`);
            // If the option to disable Python cache is enabled in settings
            const pythonArgs = this.settings.disablePyCache ? ['-B', scriptPath] : [scriptPath];
            const process = child_process.spawn('python3', pythonArgs);
            process.stdout.on('data', (data) => {
                console.log(`Output from Python script: ${data.toString()}`);
                try {
                    const message = JSON.parse(data.toString());
                    if (message.action === 'show_notification' && message.text) {
                        new obsidian.Notice(message.text);
                    }
                }
                catch (error) {
                    console.error('Error parsing JSON message from Python script:', error);
                    console.log('Received non-JSON output:', data.toString());
                }
            });
            process.stderr.on('data', (data) => {
                console.error(`Error from Python script: ${data}`);
            });
            process.on('close', (code) => {
                console.log(`Python script finished with exit code ${code}`);
            });
        });
    }
    // Function to choose a Python script and run it
    chooseAndRunPythonScript() {
        return __awaiter(this, void 0, void 0, function* () {
            const scriptsFolder = this.getScriptsFolderPath();
            if (!scriptsFolder || !fs__namespace.existsSync(scriptsFolder)) {
                new obsidian.Notice('Please specify a valid folder for Python scripts in the plugin settings.');
                console.log('Invalid or non-existent Python scripts folder.');
                return;
            }
            const pythonFiles = fs__namespace.readdirSync(scriptsFolder).filter((file) => file.endsWith('.py'));
            if (pythonFiles.length === 0) {
                new obsidian.Notice('No Python scripts found in the specified folder.');
                console.log('No Python files found in the specified folder.');
                return;
            }
            const scriptChoices = pythonFiles.map((file) => ({
                label: file,
                value: path__namespace.join(scriptsFolder, file),
            }));
            // Use a modal to allow the user to choose the script
            new ScriptSelectionModal(this.app, scriptChoices, (selectedScript) => {
                if (selectedScript) {
                    this.runPythonScript(selectedScript);
                }
                else {
                    new obsidian.Notice('No script selected.');
                }
            }).open();
        });
    }
    // Function to run all Python scripts in the specified folder
    runAllPythonScripts() {
        return __awaiter(this, void 0, void 0, function* () {
            const scriptsFolder = this.getScriptsFolderPath();
            if (!scriptsFolder || !fs__namespace.existsSync(scriptsFolder)) {
                new obsidian.Notice('Please specify a valid folder for Python scripts in the plugin settings.');
                console.log('Invalid or non-existent Python scripts folder.');
                return;
            }
            const pythonFiles = fs__namespace.readdirSync(scriptsFolder).filter((file) => file.endsWith('.py'));
            if (pythonFiles.length === 0) {
                new obsidian.Notice('No Python scripts found in the specified folder.');
                console.log('No Python files found in the specified folder.');
                return;
            }
            for (const file of pythonFiles) {
                const scriptPath = path__namespace.join(scriptsFolder, file);
                yield this.runPythonScript(scriptPath);
            }
        });
    }
    // Get the path to the Python scripts folder
    getScriptsFolderPath() {
        const { pythonScriptsFolder } = this.settings;
        if (!pythonScriptsFolder) {
            return '';
        }
        if (path__namespace.isAbsolute(pythonScriptsFolder)) {
            return pythonScriptsFolder;
        }
        else {
            const adapter = this.app.vault.adapter;
            let basePath;
            if (adapter instanceof obsidian.FileSystemAdapter) {
                basePath = adapter.getBasePath();
            }
            else {
                // Handle other types of adapters if necessary
                new obsidian.Notice('Cannot determine base path for non-filesystem vault.');
                console.log('Vault adapter is not a FileSystemAdapter.');
                return '';
            }
            return path__namespace.join(basePath, pythonScriptsFolder);
        }
    }
    onunload() {
        console.log('Unloading the Obsidian Python Bridge plugin');
        if (this.server) {
            this.server.close(() => {
                console.log('Socket server stopped');
                if (fs__namespace.existsSync(this.settings.socketPath)) {
                    fs__namespace.unlinkSync(this.settings.socketPath);
                }
            });
        }
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
// Modal class for selecting a Python script from the list
class ScriptSelectionModal extends obsidian.SuggestModal {
    constructor(app, scriptChoices, onChoose) {
        super(app);
        this.scriptChoices = scriptChoices;
        this.onChoose = onChoose;
    }
    getSuggestions(query) {
        return this.scriptChoices
            .filter((choice) => choice.label.toLowerCase().includes(query.toLowerCase()))
            .map((choice) => choice.label);
    }
    renderSuggestion(value, el) {
        el.createEl('div', { text: value });
    }
    onChooseSuggestion(item, evt) {
        const selected = this.scriptChoices.find(choice => choice.label === item);
        if (selected) {
            this.onChoose(selected.value);
        }
        else {
            this.onChoose(null);
        }
    }
}

module.exports = ObsidianPythonBridge;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL21vbWVudC9tb21lbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8hIG1vbWVudC5qc1xuLy8hIHZlcnNpb24gOiAyLjI5LjRcbi8vISBhdXRob3JzIDogVGltIFdvb2QsIElza3JlbiBDaGVybmV2LCBNb21lbnQuanMgY29udHJpYnV0b3JzXG4vLyEgbGljZW5zZSA6IE1JVFxuLy8hIG1vbWVudGpzLmNvbVxuXG47KGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgICBnbG9iYWwubW9tZW50ID0gZmFjdG9yeSgpXG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBob29rQ2FsbGJhY2s7XG5cbiAgICBmdW5jdGlvbiBob29rcygpIHtcbiAgICAgICAgcmV0dXJuIGhvb2tDYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgaXMgZG9uZSB0byByZWdpc3RlciB0aGUgbWV0aG9kIGNhbGxlZCB3aXRoIG1vbWVudCgpXG4gICAgLy8gd2l0aG91dCBjcmVhdGluZyBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG4gICAgZnVuY3Rpb24gc2V0SG9va0NhbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgICAgIGhvb2tDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQXJyYXkoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGlucHV0IGluc3RhbmNlb2YgQXJyYXkgfHxcbiAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc09iamVjdChpbnB1dCkge1xuICAgICAgICAvLyBJRTggd2lsbCB0cmVhdCB1bmRlZmluZWQgYW5kIG51bGwgYXMgb2JqZWN0IGlmIGl0IHdhc24ndCBmb3JcbiAgICAgICAgLy8gaW5wdXQgIT0gbnVsbFxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgaW5wdXQgIT0gbnVsbCAmJlxuICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNPd25Qcm9wKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLCBiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc09iamVjdEVtcHR5KG9iaikge1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBrO1xuICAgICAgICAgICAgZm9yIChrIGluIG9iaikge1xuICAgICAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKG9iaiwgaykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWQoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09PSB2b2lkIDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNOdW1iZXIoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IE51bWJlcl0nXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXRlKGlucHV0KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBpbnB1dCBpbnN0YW5jZW9mIERhdGUgfHxcbiAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IERhdGVdJ1xuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hcChhcnIsIGZuKSB7XG4gICAgICAgIHZhciByZXMgPSBbXSxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBhcnJMZW4gPSBhcnIubGVuZ3RoO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyTGVuOyArK2kpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGZuKGFycltpXSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBiKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChiLCBpKSkge1xuICAgICAgICAgICAgICAgIGFbaV0gPSBiW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgICAgIGEudG9TdHJpbmcgPSBiLnRvU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3ZhbHVlT2YnKSkge1xuICAgICAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCB0cnVlKS51dGMoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0UGFyc2luZ0ZsYWdzKCkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGRlZXAgY2xvbmUgdGhpcyBvYmplY3QuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbXB0eTogZmFsc2UsXG4gICAgICAgICAgICB1bnVzZWRUb2tlbnM6IFtdLFxuICAgICAgICAgICAgdW51c2VkSW5wdXQ6IFtdLFxuICAgICAgICAgICAgb3ZlcmZsb3c6IC0yLFxuICAgICAgICAgICAgY2hhcnNMZWZ0T3ZlcjogMCxcbiAgICAgICAgICAgIG51bGxJbnB1dDogZmFsc2UsXG4gICAgICAgICAgICBpbnZhbGlkRXJhOiBudWxsLFxuICAgICAgICAgICAgaW52YWxpZE1vbnRoOiBudWxsLFxuICAgICAgICAgICAgaW52YWxpZEZvcm1hdDogZmFsc2UsXG4gICAgICAgICAgICB1c2VySW52YWxpZGF0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgaXNvOiBmYWxzZSxcbiAgICAgICAgICAgIHBhcnNlZERhdGVQYXJ0czogW10sXG4gICAgICAgICAgICBlcmE6IG51bGwsXG4gICAgICAgICAgICBtZXJpZGllbTogbnVsbCxcbiAgICAgICAgICAgIHJmYzI4MjI6IGZhbHNlLFxuICAgICAgICAgICAgd2Vla2RheU1pc21hdGNoOiBmYWxzZSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJzaW5nRmxhZ3MobSkge1xuICAgICAgICBpZiAobS5fcGYgPT0gbnVsbCkge1xuICAgICAgICAgICAgbS5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG0uX3BmO1xuICAgIH1cblxuICAgIHZhciBzb21lO1xuICAgIGlmIChBcnJheS5wcm90b3R5cGUuc29tZSkge1xuICAgICAgICBzb21lID0gQXJyYXkucHJvdG90eXBlLnNvbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc29tZSA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICAgICAgICAgIHZhciB0ID0gT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgICAgIGxlbiA9IHQubGVuZ3RoID4+PiAwLFxuICAgICAgICAgICAgICAgIGk7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpIGluIHQgJiYgZnVuLmNhbGwodGhpcywgdFtpXSwgaSwgdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZChtKSB7XG4gICAgICAgIGlmIChtLl9pc1ZhbGlkID09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBmbGFncyA9IGdldFBhcnNpbmdGbGFncyhtKSxcbiAgICAgICAgICAgICAgICBwYXJzZWRQYXJ0cyA9IHNvbWUuY2FsbChmbGFncy5wYXJzZWREYXRlUGFydHMsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpICE9IG51bGw7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgaXNOb3dWYWxpZCA9XG4gICAgICAgICAgICAgICAgICAgICFpc05hTihtLl9kLmdldFRpbWUoKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3Mub3ZlcmZsb3cgPCAwICYmXG4gICAgICAgICAgICAgICAgICAgICFmbGFncy5lbXB0eSAmJlxuICAgICAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZEVyYSAmJlxuICAgICAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZE1vbnRoICYmXG4gICAgICAgICAgICAgICAgICAgICFmbGFncy5pbnZhbGlkV2Vla2RheSAmJlxuICAgICAgICAgICAgICAgICAgICAhZmxhZ3Mud2Vla2RheU1pc21hdGNoICYmXG4gICAgICAgICAgICAgICAgICAgICFmbGFncy5udWxsSW5wdXQgJiZcbiAgICAgICAgICAgICAgICAgICAgIWZsYWdzLmludmFsaWRGb3JtYXQgJiZcbiAgICAgICAgICAgICAgICAgICAgIWZsYWdzLnVzZXJJbnZhbGlkYXRlZCAmJlxuICAgICAgICAgICAgICAgICAgICAoIWZsYWdzLm1lcmlkaWVtIHx8IChmbGFncy5tZXJpZGllbSAmJiBwYXJzZWRQYXJ0cykpO1xuXG4gICAgICAgICAgICBpZiAobS5fc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgaXNOb3dWYWxpZCA9XG4gICAgICAgICAgICAgICAgICAgIGlzTm93VmFsaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MuY2hhcnNMZWZ0T3ZlciA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFncy51bnVzZWRUb2tlbnMubGVuZ3RoID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLmJpZ0hvdXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKE9iamVjdC5pc0Zyb3plbiA9PSBudWxsIHx8ICFPYmplY3QuaXNGcm96ZW4obSkpIHtcbiAgICAgICAgICAgICAgICBtLl9pc1ZhbGlkID0gaXNOb3dWYWxpZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzTm93VmFsaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG0uX2lzVmFsaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSW52YWxpZChmbGFncykge1xuICAgICAgICB2YXIgbSA9IGNyZWF0ZVVUQyhOYU4pO1xuICAgICAgICBpZiAoZmxhZ3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZXh0ZW5kKGdldFBhcnNpbmdGbGFncyhtKSwgZmxhZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLnVzZXJJbnZhbGlkYXRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICAvLyBQbHVnaW5zIHRoYXQgYWRkIHByb3BlcnRpZXMgc2hvdWxkIGFsc28gYWRkIHRoZSBrZXkgaGVyZSAobnVsbCB2YWx1ZSksXG4gICAgLy8gc28gd2UgY2FuIHByb3Blcmx5IGNsb25lIG91cnNlbHZlcy5cbiAgICB2YXIgbW9tZW50UHJvcGVydGllcyA9IChob29rcy5tb21lbnRQcm9wZXJ0aWVzID0gW10pLFxuICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG5cbiAgICBmdW5jdGlvbiBjb3B5Q29uZmlnKHRvLCBmcm9tKSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgcHJvcCxcbiAgICAgICAgICAgIHZhbCxcbiAgICAgICAgICAgIG1vbWVudFByb3BlcnRpZXNMZW4gPSBtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aDtcblxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2lzQU1vbWVudE9iamVjdCkpIHtcbiAgICAgICAgICAgIHRvLl9pc0FNb21lbnRPYmplY3QgPSBmcm9tLl9pc0FNb21lbnRPYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9pKSkge1xuICAgICAgICAgICAgdG8uX2kgPSBmcm9tLl9pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fZikpIHtcbiAgICAgICAgICAgIHRvLl9mID0gZnJvbS5fZjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2wpKSB7XG4gICAgICAgICAgICB0by5fbCA9IGZyb20uX2w7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9zdHJpY3QpKSB7XG4gICAgICAgICAgICB0by5fc3RyaWN0ID0gZnJvbS5fc3RyaWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fdHptKSkge1xuICAgICAgICAgICAgdG8uX3R6bSA9IGZyb20uX3R6bTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2lzVVRDKSkge1xuICAgICAgICAgICAgdG8uX2lzVVRDID0gZnJvbS5faXNVVEM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9vZmZzZXQpKSB7XG4gICAgICAgICAgICB0by5fb2Zmc2V0ID0gZnJvbS5fb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fcGYpKSB7XG4gICAgICAgICAgICB0by5fcGYgPSBnZXRQYXJzaW5nRmxhZ3MoZnJvbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9sb2NhbGUpKSB7XG4gICAgICAgICAgICB0by5fbG9jYWxlID0gZnJvbS5fbG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vbWVudFByb3BlcnRpZXNMZW4gPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbW9tZW50UHJvcGVydGllc0xlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IG1vbWVudFByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICAgICAgdmFsID0gZnJvbVtwcm9wXTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKHZhbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9bcHJvcF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cblxuICAgIC8vIE1vbWVudCBwcm90b3R5cGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gTW9tZW50KGNvbmZpZykge1xuICAgICAgICBjb3B5Q29uZmlnKHRoaXMsIGNvbmZpZyk7XG4gICAgICAgIHRoaXMuX2QgPSBuZXcgRGF0ZShjb25maWcuX2QgIT0gbnVsbCA/IGNvbmZpZy5fZC5nZXRUaW1lKCkgOiBOYU4pO1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICB0aGlzLl9kID0gbmV3IERhdGUoTmFOKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBQcmV2ZW50IGluZmluaXRlIGxvb3AgaW4gY2FzZSB1cGRhdGVPZmZzZXQgY3JlYXRlcyBuZXcgbW9tZW50XG4gICAgICAgIC8vIG9iamVjdHMuXG4gICAgICAgIGlmICh1cGRhdGVJblByb2dyZXNzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc01vbWVudChvYmopIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIG9iaiBpbnN0YW5jZW9mIE1vbWVudCB8fCAob2JqICE9IG51bGwgJiYgb2JqLl9pc0FNb21lbnRPYmplY3QgIT0gbnVsbClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3YXJuKG1zZykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBob29rcy5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPT09IGZhbHNlICYmXG4gICAgICAgICAgICB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgIGNvbnNvbGUud2FyblxuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRGVwcmVjYXRpb24gd2FybmluZzogJyArIG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXByZWNhdGUobXNnLCBmbikge1xuICAgICAgICB2YXIgZmlyc3RUaW1lID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChob29rcy5kZXByZWNhdGlvbkhhbmRsZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlcihudWxsLCBtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gW10sXG4gICAgICAgICAgICAgICAgICAgIGFyZyxcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgICAgICBhcmdMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcmdMZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhcmcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgKz0gJ1xcblsnICsgaSArICddICc7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGtleSBpbiBhcmd1bWVudHNbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzT3duUHJvcChhcmd1bWVudHNbMF0sIGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnICs9IGtleSArICc6ICcgKyBhcmd1bWVudHNbMF1ba2V5XSArICcsICc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKDAsIC0yKTsgLy8gUmVtb3ZlIHRyYWlsaW5nIGNvbW1hIGFuZCBzcGFjZVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChhcmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3YXJuKFxuICAgICAgICAgICAgICAgICAgICBtc2cgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1xcbkFyZ3VtZW50czogJyArXG4gICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzKS5qb2luKCcnKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAnXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRXJyb3IoKS5zdGFja1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSwgZm4pO1xuICAgIH1cblxuICAgIHZhciBkZXByZWNhdGlvbnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCBtc2cpIHtcbiAgICAgICAgaWYgKGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlciAhPSBudWxsKSB7XG4gICAgICAgICAgICBob29rcy5kZXByZWNhdGlvbkhhbmRsZXIobmFtZSwgbXNnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRlcHJlY2F0aW9uc1tuYW1lXSkge1xuICAgICAgICAgICAgd2Fybihtc2cpO1xuICAgICAgICAgICAgZGVwcmVjYXRpb25zW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhvb2tzLnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9IGZhbHNlO1xuICAgIGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlciA9IG51bGw7XG5cbiAgICBmdW5jdGlvbiBpc0Z1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAodHlwZW9mIEZ1bmN0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBpbnB1dCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB8fFxuICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJ1xuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldChjb25maWcpIHtcbiAgICAgICAgdmFyIHByb3AsIGk7XG4gICAgICAgIGZvciAoaSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGNvbmZpZywgaSkpIHtcbiAgICAgICAgICAgICAgICBwcm9wID0gY29uZmlnW2ldO1xuICAgICAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbaV0gPSBwcm9wO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbJ18nICsgaV0gPSBwcm9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gICAgICAgIC8vIExlbmllbnQgb3JkaW5hbCBwYXJzaW5nIGFjY2VwdHMganVzdCBhIG51bWJlciBpbiBhZGRpdGlvbiB0b1xuICAgICAgICAvLyBudW1iZXIgKyAocG9zc2libHkpIHN0dWZmIGNvbWluZyBmcm9tIF9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlLlxuICAgICAgICAvLyBUT0RPOiBSZW1vdmUgXCJvcmRpbmFsUGFyc2VcIiBmYWxsYmFjayBpbiBuZXh0IG1ham9yIHJlbGVhc2UuXG4gICAgICAgIHRoaXMuX2RheU9mTW9udGhPcmRpbmFsUGFyc2VMZW5pZW50ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICh0aGlzLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlLnNvdXJjZSB8fCB0aGlzLl9vcmRpbmFsUGFyc2Uuc291cmNlKSArXG4gICAgICAgICAgICAgICAgJ3wnICtcbiAgICAgICAgICAgICAgICAvXFxkezEsMn0vLnNvdXJjZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lcmdlQ29uZmlncyhwYXJlbnRDb25maWcsIGNoaWxkQ29uZmlnKSB7XG4gICAgICAgIHZhciByZXMgPSBleHRlbmQoe30sIHBhcmVudENvbmZpZyksXG4gICAgICAgICAgICBwcm9wO1xuICAgICAgICBmb3IgKHByb3AgaW4gY2hpbGRDb25maWcpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGNoaWxkQ29uZmlnLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc09iamVjdChwYXJlbnRDb25maWdbcHJvcF0pICYmIGlzT2JqZWN0KGNoaWxkQ29uZmlnW3Byb3BdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXNbcHJvcF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kKHJlc1twcm9wXSwgcGFyZW50Q29uZmlnW3Byb3BdKTtcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kKHJlc1twcm9wXSwgY2hpbGRDb25maWdbcHJvcF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGRDb25maWdbcHJvcF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXNbcHJvcF0gPSBjaGlsZENvbmZpZ1twcm9wXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHByb3AgaW4gcGFyZW50Q29uZmlnKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgaGFzT3duUHJvcChwYXJlbnRDb25maWcsIHByb3ApICYmXG4gICAgICAgICAgICAgICAgIWhhc093blByb3AoY2hpbGRDb25maWcsIHByb3ApICYmXG4gICAgICAgICAgICAgICAgaXNPYmplY3QocGFyZW50Q29uZmlnW3Byb3BdKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIGNoYW5nZXMgdG8gcHJvcGVydGllcyBkb24ndCBtb2RpZnkgcGFyZW50IGNvbmZpZ1xuICAgICAgICAgICAgICAgIHJlc1twcm9wXSA9IGV4dGVuZCh7fSwgcmVzW3Byb3BdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIExvY2FsZShjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnNldChjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGtleXM7XG5cbiAgICBpZiAoT2JqZWN0LmtleXMpIHtcbiAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGtleXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgICAgICByZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoaSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzT3duUHJvcChvYmosIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRDYWxlbmRhciA9IHtcbiAgICAgICAgc2FtZURheTogJ1tUb2RheSBhdF0gTFQnLFxuICAgICAgICBuZXh0RGF5OiAnW1RvbW9ycm93IGF0XSBMVCcsXG4gICAgICAgIG5leHRXZWVrOiAnZGRkZCBbYXRdIExUJyxcbiAgICAgICAgbGFzdERheTogJ1tZZXN0ZXJkYXkgYXRdIExUJyxcbiAgICAgICAgbGFzdFdlZWs6ICdbTGFzdF0gZGRkZCBbYXRdIExUJyxcbiAgICAgICAgc2FtZUVsc2U6ICdMJyxcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY2FsZW5kYXIoa2V5LCBtb20sIG5vdykge1xuICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fY2FsZW5kYXJba2V5XSB8fCB0aGlzLl9jYWxlbmRhclsnc2FtZUVsc2UnXTtcbiAgICAgICAgcmV0dXJuIGlzRnVuY3Rpb24ob3V0cHV0KSA/IG91dHB1dC5jYWxsKG1vbSwgbm93KSA6IG91dHB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB6ZXJvRmlsbChudW1iZXIsIHRhcmdldExlbmd0aCwgZm9yY2VTaWduKSB7XG4gICAgICAgIHZhciBhYnNOdW1iZXIgPSAnJyArIE1hdGguYWJzKG51bWJlciksXG4gICAgICAgICAgICB6ZXJvc1RvRmlsbCA9IHRhcmdldExlbmd0aCAtIGFic051bWJlci5sZW5ndGgsXG4gICAgICAgICAgICBzaWduID0gbnVtYmVyID49IDA7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAoc2lnbiA/IChmb3JjZVNpZ24gPyAnKycgOiAnJykgOiAnLScpICtcbiAgICAgICAgICAgIE1hdGgucG93KDEwLCBNYXRoLm1heCgwLCB6ZXJvc1RvRmlsbCkpLnRvU3RyaW5nKCkuc3Vic3RyKDEpICtcbiAgICAgICAgICAgIGFic051bWJlclxuICAgICAgICApO1xuICAgIH1cblxuICAgIHZhciBmb3JtYXR0aW5nVG9rZW5zID1cbiAgICAgICAgICAgIC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhbSGhdbW0oc3MpP3xNb3xNTT9NP00/fERvfERERG98REQ/RD9EP3xkZGQ/ZD98ZG8/fHdbb3x3XT98V1tvfFddP3xRbz98TnsxLDV9fFlZWVlZWXxZWVlZWXxZWVlZfFlZfHl7Miw0fXx5bz98Z2coZ2dnPyk/fEdHKEdHRz8pP3xlfEV8YXxBfGhoP3xISD98a2s/fG1tP3xzcz98U3sxLDl9fHh8WHx6ej98Wlo/fC4pL2csXG4gICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhMVFN8TFR8TEw/TD9MP3xsezEsNH0pL2csXG4gICAgICAgIGZvcm1hdEZ1bmN0aW9ucyA9IHt9LFxuICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9ucyA9IHt9O1xuXG4gICAgLy8gdG9rZW46ICAgICdNJ1xuICAgIC8vIHBhZGRlZDogICBbJ01NJywgMl1cbiAgICAvLyBvcmRpbmFsOiAgJ01vJ1xuICAgIC8vIGNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7IHRoaXMubW9udGgoKSArIDEgfVxuICAgIGZ1bmN0aW9uIGFkZEZvcm1hdFRva2VuKHRva2VuLCBwYWRkZWQsIG9yZGluYWwsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBmdW5jID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2NhbGxiYWNrXSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhZGRlZCkge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbcGFkZGVkWzBdXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gemVyb0ZpbGwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBwYWRkZWRbMV0sIHBhZGRlZFsyXSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcmRpbmFsKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1tvcmRpbmFsXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkub3JkaW5hbChcbiAgICAgICAgICAgICAgICAgICAgZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLFxuICAgICAgICAgICAgICAgICAgICB0b2tlblxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQubWF0Y2goL1xcW1tcXHNcXFNdLykpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXFxcL2csICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgICAgIHZhciBhcnJheSA9IGZvcm1hdC5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBsZW5ndGg7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV0pIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGFycmF5W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobW9tKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gJycsXG4gICAgICAgICAgICAgICAgaTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBpc0Z1bmN0aW9uKGFycmF5W2ldKVxuICAgICAgICAgICAgICAgICAgICA/IGFycmF5W2ldLmNhbGwobW9tLCBmb3JtYXQpXG4gICAgICAgICAgICAgICAgICAgIDogYXJyYXlbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIGZvcm1hdCBkYXRlIHVzaW5nIG5hdGl2ZSBkYXRlIG9iamVjdFxuICAgIGZ1bmN0aW9uIGZvcm1hdE1vbWVudChtLCBmb3JtYXQpIHtcbiAgICAgICAgaWYgKCFtLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG0ubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXQgPSBleHBhbmRGb3JtYXQoZm9ybWF0LCBtLmxvY2FsZURhdGEoKSk7XG4gICAgICAgIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdID1cbiAgICAgICAgICAgIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdIHx8IG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpO1xuXG4gICAgICAgIHJldHVybiBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XShtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHBhbmRGb3JtYXQoZm9ybWF0LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGkgPSA1O1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2VucyhpbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5sb25nRGF0ZUZvcm1hdChpbnB1dCkgfHwgaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPj0gMCAmJiBsb2NhbEZvcm1hdHRpbmdUb2tlbnMudGVzdChmb3JtYXQpKSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShcbiAgICAgICAgICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMsXG4gICAgICAgICAgICAgICAgcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICBpIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9uZ0RhdGVGb3JtYXQgPSB7XG4gICAgICAgIExUUzogJ2g6bW06c3MgQScsXG4gICAgICAgIExUOiAnaDptbSBBJyxcbiAgICAgICAgTDogJ01NL0REL1lZWVknLFxuICAgICAgICBMTDogJ01NTU0gRCwgWVlZWScsXG4gICAgICAgIExMTDogJ01NTU0gRCwgWVlZWSBoOm1tIEEnLFxuICAgICAgICBMTExMOiAnZGRkZCwgTU1NTSBELCBZWVlZIGg6bW0gQScsXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvbmdEYXRlRm9ybWF0KGtleSkge1xuICAgICAgICB2YXIgZm9ybWF0ID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSxcbiAgICAgICAgICAgIGZvcm1hdFVwcGVyID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5LnRvVXBwZXJDYXNlKCldO1xuXG4gICAgICAgIGlmIChmb3JtYXQgfHwgIWZvcm1hdFVwcGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSA9IGZvcm1hdFVwcGVyXG4gICAgICAgICAgICAubWF0Y2goZm9ybWF0dGluZ1Rva2VucylcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHRvaykge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgdG9rID09PSAnTU1NTScgfHxcbiAgICAgICAgICAgICAgICAgICAgdG9rID09PSAnTU0nIHx8XG4gICAgICAgICAgICAgICAgICAgIHRvayA9PT0gJ0REJyB8fFxuICAgICAgICAgICAgICAgICAgICB0b2sgPT09ICdkZGRkJ1xuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9rLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKCcnKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdEludmFsaWREYXRlID0gJ0ludmFsaWQgZGF0ZSc7XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkRGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludmFsaWREYXRlO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0T3JkaW5hbCA9ICclZCcsXG4gICAgICAgIGRlZmF1bHREYXlPZk1vbnRoT3JkaW5hbFBhcnNlID0gL1xcZHsxLDJ9LztcblxuICAgIGZ1bmN0aW9uIG9yZGluYWwobnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcmRpbmFsLnJlcGxhY2UoJyVkJywgbnVtYmVyKTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdFJlbGF0aXZlVGltZSA9IHtcbiAgICAgICAgZnV0dXJlOiAnaW4gJXMnLFxuICAgICAgICBwYXN0OiAnJXMgYWdvJyxcbiAgICAgICAgczogJ2EgZmV3IHNlY29uZHMnLFxuICAgICAgICBzczogJyVkIHNlY29uZHMnLFxuICAgICAgICBtOiAnYSBtaW51dGUnLFxuICAgICAgICBtbTogJyVkIG1pbnV0ZXMnLFxuICAgICAgICBoOiAnYW4gaG91cicsXG4gICAgICAgIGhoOiAnJWQgaG91cnMnLFxuICAgICAgICBkOiAnYSBkYXknLFxuICAgICAgICBkZDogJyVkIGRheXMnLFxuICAgICAgICB3OiAnYSB3ZWVrJyxcbiAgICAgICAgd3c6ICclZCB3ZWVrcycsXG4gICAgICAgIE06ICdhIG1vbnRoJyxcbiAgICAgICAgTU06ICclZCBtb250aHMnLFxuICAgICAgICB5OiAnYSB5ZWFyJyxcbiAgICAgICAgeXk6ICclZCB5ZWFycycsXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHJlbGF0aXZlVGltZShudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX3JlbGF0aXZlVGltZVtzdHJpbmddO1xuICAgICAgICByZXR1cm4gaXNGdW5jdGlvbihvdXRwdXQpXG4gICAgICAgICAgICA/IG91dHB1dChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpXG4gICAgICAgICAgICA6IG91dHB1dC5yZXBsYWNlKC8lZC9pLCBudW1iZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhc3RGdXR1cmUoZGlmZiwgb3V0cHV0KSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbZGlmZiA+IDAgPyAnZnV0dXJlJyA6ICdwYXN0J107XG4gICAgICAgIHJldHVybiBpc0Z1bmN0aW9uKGZvcm1hdCkgPyBmb3JtYXQob3V0cHV0KSA6IGZvcm1hdC5yZXBsYWNlKC8lcy9pLCBvdXRwdXQpO1xuICAgIH1cblxuICAgIHZhciBhbGlhc2VzID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRVbml0QWxpYXModW5pdCwgc2hvcnRoYW5kKSB7XG4gICAgICAgIHZhciBsb3dlckNhc2UgPSB1bml0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGFsaWFzZXNbbG93ZXJDYXNlXSA9IGFsaWFzZXNbbG93ZXJDYXNlICsgJ3MnXSA9IGFsaWFzZXNbc2hvcnRoYW5kXSA9IHVuaXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplVW5pdHModW5pdHMpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB1bml0cyA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgID8gYWxpYXNlc1t1bml0c10gfHwgYWxpYXNlc1t1bml0cy50b0xvd2VyQ2FzZSgpXVxuICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplT2JqZWN0VW5pdHMoaW5wdXRPYmplY3QpIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IHt9LFxuICAgICAgICAgICAgbm9ybWFsaXplZFByb3AsXG4gICAgICAgICAgICBwcm9wO1xuXG4gICAgICAgIGZvciAocHJvcCBpbiBpbnB1dE9iamVjdCkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoaW5wdXRPYmplY3QsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3AgPSBub3JtYWxpemVVbml0cyhwcm9wKTtcbiAgICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZElucHV0W25vcm1hbGl6ZWRQcm9wXSA9IGlucHV0T2JqZWN0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub3JtYWxpemVkSW5wdXQ7XG4gICAgfVxuXG4gICAgdmFyIHByaW9yaXRpZXMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGFkZFVuaXRQcmlvcml0eSh1bml0LCBwcmlvcml0eSkge1xuICAgICAgICBwcmlvcml0aWVzW3VuaXRdID0gcHJpb3JpdHk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UHJpb3JpdGl6ZWRVbml0cyh1bml0c09iaikge1xuICAgICAgICB2YXIgdW5pdHMgPSBbXSxcbiAgICAgICAgICAgIHU7XG4gICAgICAgIGZvciAodSBpbiB1bml0c09iaikge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AodW5pdHNPYmosIHUpKSB7XG4gICAgICAgICAgICAgICAgdW5pdHMucHVzaCh7IHVuaXQ6IHUsIHByaW9yaXR5OiBwcmlvcml0aWVzW3VdIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHVuaXRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhLnByaW9yaXR5IC0gYi5wcmlvcml0eTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB1bml0cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0xlYXBZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuICh5ZWFyICUgNCA9PT0gMCAmJiB5ZWFyICUgMTAwICE9PSAwKSB8fCB5ZWFyICUgNDAwID09PSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFic0Zsb29yKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgLy8gLTAgLT4gMFxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpIHx8IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JbnQoYXJndW1lbnRGb3JDb2VyY2lvbikge1xuICAgICAgICB2YXIgY29lcmNlZE51bWJlciA9ICthcmd1bWVudEZvckNvZXJjaW9uLFxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuXG4gICAgICAgIGlmIChjb2VyY2VkTnVtYmVyICE9PSAwICYmIGlzRmluaXRlKGNvZXJjZWROdW1iZXIpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGFic0Zsb29yKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VHZXRTZXQodW5pdCwga2VlcFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzZXQkMSh0aGlzLCB1bml0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIGtlZXBUaW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldCh0aGlzLCB1bml0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXQobW9tLCB1bml0KSB7XG4gICAgICAgIHJldHVybiBtb20uaXNWYWxpZCgpXG4gICAgICAgICAgICA/IG1vbS5fZFsnZ2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSgpXG4gICAgICAgICAgICA6IE5hTjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXQkMShtb20sIHVuaXQsIHZhbHVlKSB7XG4gICAgICAgIGlmIChtb20uaXNWYWxpZCgpICYmICFpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB1bml0ID09PSAnRnVsbFllYXInICYmXG4gICAgICAgICAgICAgICAgaXNMZWFwWWVhcihtb20ueWVhcigpKSAmJlxuICAgICAgICAgICAgICAgIG1vbS5tb250aCgpID09PSAxICYmXG4gICAgICAgICAgICAgICAgbW9tLmRhdGUoKSA9PT0gMjlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdG9JbnQodmFsdWUpO1xuICAgICAgICAgICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XShcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG1vbS5tb250aCgpLFxuICAgICAgICAgICAgICAgICAgICBkYXlzSW5Nb250aCh2YWx1ZSwgbW9tLm1vbnRoKCkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIHN0cmluZ0dldCh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odGhpc1t1bml0c10pKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1t1bml0c10oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdHJpbmdTZXQodW5pdHMsIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdW5pdHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIHZhciBwcmlvcml0aXplZCA9IGdldFByaW9yaXRpemVkVW5pdHModW5pdHMpLFxuICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgcHJpb3JpdGl6ZWRMZW4gPSBwcmlvcml0aXplZC5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcHJpb3JpdGl6ZWRMZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXNbcHJpb3JpdGl6ZWRbaV0udW5pdF0odW5pdHNbcHJpb3JpdGl6ZWRbaV0udW5pdF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbih0aGlzW3VuaXRzXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1t1bml0c10odmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBtYXRjaDEgPSAvXFxkLywgLy8gICAgICAgMCAtIDlcbiAgICAgICAgbWF0Y2gyID0gL1xcZFxcZC8sIC8vICAgICAgMDAgLSA5OVxuICAgICAgICBtYXRjaDMgPSAvXFxkezN9LywgLy8gICAgIDAwMCAtIDk5OVxuICAgICAgICBtYXRjaDQgPSAvXFxkezR9LywgLy8gICAgMDAwMCAtIDk5OTlcbiAgICAgICAgbWF0Y2g2ID0gL1srLV0/XFxkezZ9LywgLy8gLTk5OTk5OSAtIDk5OTk5OVxuICAgICAgICBtYXRjaDF0bzIgPSAvXFxkXFxkPy8sIC8vICAgICAgIDAgLSA5OVxuICAgICAgICBtYXRjaDN0bzQgPSAvXFxkXFxkXFxkXFxkPy8sIC8vICAgICA5OTkgLSA5OTk5XG4gICAgICAgIG1hdGNoNXRvNiA9IC9cXGRcXGRcXGRcXGRcXGRcXGQ/LywgLy8gICA5OTk5OSAtIDk5OTk5OVxuICAgICAgICBtYXRjaDF0bzMgPSAvXFxkezEsM30vLCAvLyAgICAgICAwIC0gOTk5XG4gICAgICAgIG1hdGNoMXRvNCA9IC9cXGR7MSw0fS8sIC8vICAgICAgIDAgLSA5OTk5XG4gICAgICAgIG1hdGNoMXRvNiA9IC9bKy1dP1xcZHsxLDZ9LywgLy8gLTk5OTk5OSAtIDk5OTk5OVxuICAgICAgICBtYXRjaFVuc2lnbmVkID0gL1xcZCsvLCAvLyAgICAgICAwIC0gaW5mXG4gICAgICAgIG1hdGNoU2lnbmVkID0gL1srLV0/XFxkKy8sIC8vICAgIC1pbmYgLSBpbmZcbiAgICAgICAgbWF0Y2hPZmZzZXQgPSAvWnxbKy1dXFxkXFxkOj9cXGRcXGQvZ2ksIC8vICswMDowMCAtMDA6MDAgKzAwMDAgLTAwMDAgb3IgWlxuICAgICAgICBtYXRjaFNob3J0T2Zmc2V0ID0gL1p8WystXVxcZFxcZCg/Ojo/XFxkXFxkKT8vZ2ksIC8vICswMCAtMDAgKzAwOjAwIC0wMDowMCArMDAwMCAtMDAwMCBvciBaXG4gICAgICAgIG1hdGNoVGltZXN0YW1wID0gL1srLV0/XFxkKyhcXC5cXGR7MSwzfSk/LywgLy8gMTIzNDU2Nzg5IDEyMzQ1Njc4OS4xMjNcbiAgICAgICAgLy8gYW55IHdvcmQgKG9yIHR3bykgY2hhcmFjdGVycyBvciBudW1iZXJzIGluY2x1ZGluZyB0d28vdGhyZWUgd29yZCBtb250aCBpbiBhcmFiaWMuXG4gICAgICAgIC8vIGluY2x1ZGVzIHNjb3R0aXNoIGdhZWxpYyB0d28gd29yZCBhbmQgaHlwaGVuYXRlZCBtb250aHNcbiAgICAgICAgbWF0Y2hXb3JkID1cbiAgICAgICAgICAgIC9bMC05XXswLDI1Nn1bJ2EtelxcdTAwQTAtXFx1MDVGRlxcdTA3MDAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkYwN1xcdUZGMTAtXFx1RkZFRl17MSwyNTZ9fFtcXHUwNjAwLVxcdTA2RkZcXC9dezEsMjU2fShcXHMqP1tcXHUwNjAwLVxcdTA2RkZdezEsMjU2fSl7MSwyfS9pLFxuICAgICAgICByZWdleGVzO1xuXG4gICAgcmVnZXhlcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkUmVnZXhUb2tlbih0b2tlbiwgcmVnZXgsIHN0cmljdFJlZ2V4KSB7XG4gICAgICAgIHJlZ2V4ZXNbdG9rZW5dID0gaXNGdW5jdGlvbihyZWdleClcbiAgICAgICAgICAgID8gcmVnZXhcbiAgICAgICAgICAgIDogZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGVEYXRhKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gaXNTdHJpY3QgJiYgc3RyaWN0UmVnZXggPyBzdHJpY3RSZWdleCA6IHJlZ2V4O1xuICAgICAgICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBhcnNlUmVnZXhGb3JUb2tlbih0b2tlbiwgY29uZmlnKSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcChyZWdleGVzLCB0b2tlbikpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHVuZXNjYXBlRm9ybWF0KHRva2VuKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVnZXhlc1t0b2tlbl0oY29uZmlnLl9zdHJpY3QsIGNvbmZpZy5fbG9jYWxlKTtcbiAgICB9XG5cbiAgICAvLyBDb2RlIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNTYxNDkzL2lzLXRoZXJlLWEtcmVnZXhwLWVzY2FwZS1mdW5jdGlvbi1pbi1qYXZhc2NyaXB0XG4gICAgZnVuY3Rpb24gdW5lc2NhcGVGb3JtYXQocykge1xuICAgICAgICByZXR1cm4gcmVnZXhFc2NhcGUoXG4gICAgICAgICAgICBzXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJ1xcXFwnLCAnJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgL1xcXFwoXFxbKXxcXFxcKFxcXSl8XFxbKFteXFxdXFxbXSopXFxdfFxcXFwoLikvZyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKG1hdGNoZWQsIHAxLCBwMiwgcDMsIHA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcDEgfHwgcDIgfHwgcDMgfHwgcDQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVnZXhFc2NhcGUocykge1xuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgICB9XG5cbiAgICB2YXIgdG9rZW5zID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRQYXJzZVRva2VuKHRva2VuLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGZ1bmMgPSBjYWxsYmFjayxcbiAgICAgICAgICAgIHRva2VuTGVuO1xuICAgICAgICBpZiAodHlwZW9mIHRva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdG9rZW4gPSBbdG9rZW5dO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc051bWJlcihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgIGZ1bmMgPSBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbY2FsbGJhY2tdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0b2tlbkxlbiA9IHRva2VuLmxlbmd0aDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2VuTGVuOyBpKyspIHtcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbltpXV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkV2Vla1BhcnNlVG9rZW4odG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIGFkZFBhcnNlVG9rZW4odG9rZW4sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgIGNhbGxiYWNrKGlucHV0LCBjb25maWcuX3csIGNvbmZpZywgdG9rZW4pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgaW5wdXQsIGNvbmZpZykge1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCAmJiBoYXNPd25Qcm9wKHRva2VucywgdG9rZW4pKSB7XG4gICAgICAgICAgICB0b2tlbnNbdG9rZW5dKGlucHV0LCBjb25maWcuX2EsIGNvbmZpZywgdG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFlFQVIgPSAwLFxuICAgICAgICBNT05USCA9IDEsXG4gICAgICAgIERBVEUgPSAyLFxuICAgICAgICBIT1VSID0gMyxcbiAgICAgICAgTUlOVVRFID0gNCxcbiAgICAgICAgU0VDT05EID0gNSxcbiAgICAgICAgTUlMTElTRUNPTkQgPSA2LFxuICAgICAgICBXRUVLID0gNyxcbiAgICAgICAgV0VFS0RBWSA9IDg7XG5cbiAgICBmdW5jdGlvbiBtb2QobiwgeCkge1xuICAgICAgICByZXR1cm4gKChuICUgeCkgKyB4KSAlIHg7XG4gICAgfVxuXG4gICAgdmFyIGluZGV4T2Y7XG5cbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLmluZGV4T2YpIHtcbiAgICAgICAgaW5kZXhPZiA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4T2YgPSBmdW5jdGlvbiAobykge1xuICAgICAgICAgICAgLy8gSSBrbm93XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbaV0gPT09IG8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNJbk1vbnRoKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIGlmIChpc05hTih5ZWFyKSB8fCBpc05hTihtb250aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1vZE1vbnRoID0gbW9kKG1vbnRoLCAxMik7XG4gICAgICAgIHllYXIgKz0gKG1vbnRoIC0gbW9kTW9udGgpIC8gMTI7XG4gICAgICAgIHJldHVybiBtb2RNb250aCA9PT0gMVxuICAgICAgICAgICAgPyBpc0xlYXBZZWFyKHllYXIpXG4gICAgICAgICAgICAgICAgPyAyOVxuICAgICAgICAgICAgICAgIDogMjhcbiAgICAgICAgICAgIDogMzEgLSAoKG1vZE1vbnRoICUgNykgJSAyKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignTScsIFsnTU0nLCAyXSwgJ01vJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb250aCgpICsgMTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNTU0nLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ01NTU0nLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHModGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbW9udGgnLCAnTScpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnbW9udGgnLCA4KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ00nLCBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTScsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUubW9udGhzU2hvcnRSZWdleChpc1N0cmljdCk7XG4gICAgfSk7XG4gICAgYWRkUmVnZXhUb2tlbignTU1NTScsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUubW9udGhzUmVnZXgoaXNTdHJpY3QpO1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ00nLCAnTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNT05USF0gPSB0b0ludChpbnB1dCkgLSAxO1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ01NTScsICdNTU1NJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgdmFyIG1vbnRoID0gY29uZmlnLl9sb2NhbGUubW9udGhzUGFyc2UoaW5wdXQsIHRva2VuLCBjb25maWcuX3N0cmljdCk7XG4gICAgICAgIC8vIGlmIHdlIGRpZG4ndCBmaW5kIGEgbW9udGggbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkLlxuICAgICAgICBpZiAobW9udGggIT0gbnVsbCkge1xuICAgICAgICAgICAgYXJyYXlbTU9OVEhdID0gbW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkTW9udGggPSBpbnB1dDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNb250aHMgPVxuICAgICAgICAgICAgJ0phbnVhcnlfRmVicnVhcnlfTWFyY2hfQXByaWxfTWF5X0p1bmVfSnVseV9BdWd1c3RfU2VwdGVtYmVyX09jdG9iZXJfTm92ZW1iZXJfRGVjZW1iZXInLnNwbGl0KFxuICAgICAgICAgICAgICAgICdfJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0ID1cbiAgICAgICAgICAgICdKYW5fRmViX01hcl9BcHJfTWF5X0p1bl9KdWxfQXVnX1NlcF9PY3RfTm92X0RlYycuc3BsaXQoJ18nKSxcbiAgICAgICAgTU9OVEhTX0lOX0ZPUk1BVCA9IC9EW29EXT8oXFxbW15cXFtcXF1dKlxcXXxcXHMpK01NTU0/LyxcbiAgICAgICAgZGVmYXVsdE1vbnRoc1Nob3J0UmVnZXggPSBtYXRjaFdvcmQsXG4gICAgICAgIGRlZmF1bHRNb250aHNSZWdleCA9IG1hdGNoV29yZDtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRocyhtLCBmb3JtYXQpIHtcbiAgICAgICAgaWYgKCFtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl9tb250aHMpXG4gICAgICAgICAgICAgICAgPyB0aGlzLl9tb250aHNcbiAgICAgICAgICAgICAgICA6IHRoaXMuX21vbnRoc1snc3RhbmRhbG9uZSddO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0FycmF5KHRoaXMuX21vbnRocylcbiAgICAgICAgICAgID8gdGhpcy5fbW9udGhzW20ubW9udGgoKV1cbiAgICAgICAgICAgIDogdGhpcy5fbW9udGhzW1xuICAgICAgICAgICAgICAgICAgKHRoaXMuX21vbnRocy5pc0Zvcm1hdCB8fCBNT05USFNfSU5fRk9STUFUKS50ZXN0KGZvcm1hdClcbiAgICAgICAgICAgICAgICAgICAgICA/ICdmb3JtYXQnXG4gICAgICAgICAgICAgICAgICAgICAgOiAnc3RhbmRhbG9uZSdcbiAgICAgICAgICAgICAgXVttLm1vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRoc1Nob3J0KG0sIGZvcm1hdCkge1xuICAgICAgICBpZiAoIW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpc0FycmF5KHRoaXMuX21vbnRoc1Nob3J0KVxuICAgICAgICAgICAgICAgID8gdGhpcy5fbW9udGhzU2hvcnRcbiAgICAgICAgICAgICAgICA6IHRoaXMuX21vbnRoc1Nob3J0WydzdGFuZGFsb25lJ107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzU2hvcnQpXG4gICAgICAgICAgICA/IHRoaXMuX21vbnRoc1Nob3J0W20ubW9udGgoKV1cbiAgICAgICAgICAgIDogdGhpcy5fbW9udGhzU2hvcnRbXG4gICAgICAgICAgICAgICAgICBNT05USFNfSU5fRk9STUFULnRlc3QoZm9ybWF0KSA/ICdmb3JtYXQnIDogJ3N0YW5kYWxvbmUnXG4gICAgICAgICAgICAgIF1bbS5tb250aCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVTdHJpY3RQYXJzZShtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgaWksXG4gICAgICAgICAgICBtb20sXG4gICAgICAgICAgICBsbGMgPSBtb250aE5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBub3QgdXNlZFxuICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyArK2kpIHtcbiAgICAgICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldID0gdGhpcy5tb250aHNTaG9ydChcbiAgICAgICAgICAgICAgICAgICAgbW9tLFxuICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICkudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0gPSB0aGlzLm1vbnRocyhtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ01NTScpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydE1vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX2xvbmdNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ01NTScpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydE1vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9sb25nTW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbG9uZ01vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydE1vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHNQYXJzZShtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgIGlmICh0aGlzLl9tb250aHNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlU3RyaWN0UGFyc2UuY2FsbCh0aGlzLCBtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fbW9udGhzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IGFkZCBzb3J0aW5nXG4gICAgICAgIC8vIFNvcnRpbmcgbWFrZXMgc3VyZSBpZiBvbmUgbW9udGggKG9yIGFiYnIpIGlzIGEgcHJlZml4IG9mIGFub3RoZXJcbiAgICAgICAgLy8gc2VlIHNvcnRpbmcgaW4gY29tcHV0ZU1vbnRoc1BhcnNlXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiAhdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICAgICAgICAgJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykucmVwbGFjZSgnLicsICcnKSArICckJyxcbiAgICAgICAgICAgICAgICAgICAgJ2knXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICAgICAgICAgJ14nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLFxuICAgICAgICAgICAgICAgICAgICAnaSdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzdHJpY3QgJiYgIXRoaXMuX21vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgcmVnZXggPVxuICAgICAgICAgICAgICAgICAgICAnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKSArICd8XicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBzdHJpY3QgJiZcbiAgICAgICAgICAgICAgICBmb3JtYXQgPT09ICdNTU1NJyAmJlxuICAgICAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICBzdHJpY3QgJiZcbiAgICAgICAgICAgICAgICBmb3JtYXQgPT09ICdNTU0nICYmXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc3RyaWN0ICYmIHRoaXMuX21vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gc2V0TW9udGgobW9tLCB2YWx1ZSkge1xuICAgICAgICB2YXIgZGF5T2ZNb250aDtcblxuICAgICAgICBpZiAoIW1vbS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIC8vIE5vIG9wXG4gICAgICAgICAgICByZXR1cm4gbW9tO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmICgvXlxcZCskLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdG9JbnQodmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG1vbS5sb2NhbGVEYXRhKCkubW9udGhzUGFyc2UodmFsdWUpO1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IEFub3RoZXIgc2lsZW50IGZhaWx1cmU/XG4gICAgICAgICAgICAgICAgaWYgKCFpc051bWJlcih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkYXlPZk1vbnRoID0gTWF0aC5taW4obW9tLmRhdGUoKSwgZGF5c0luTW9udGgobW9tLnllYXIoKSwgdmFsdWUpKTtcbiAgICAgICAgbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArICdNb250aCddKHZhbHVlLCBkYXlPZk1vbnRoKTtcbiAgICAgICAgcmV0dXJuIG1vbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRNb250aCh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgc2V0TW9udGgodGhpcywgdmFsdWUpO1xuICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0KHRoaXMsICdNb250aCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGF5c0luTW9udGgoKSB7XG4gICAgICAgIHJldHVybiBkYXlzSW5Nb250aCh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb250aHNTaG9ydFJlZ2V4KGlzU3RyaWN0KSB7XG4gICAgICAgIGlmICh0aGlzLl9tb250aHNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZU1vbnRoc1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1Nob3J0UmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNTaG9ydFJlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNTaG9ydFJlZ2V4ID0gZGVmYXVsdE1vbnRoc1Nob3J0UmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleCAmJiBpc1N0cmljdFxuICAgICAgICAgICAgICAgID8gdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleFxuICAgICAgICAgICAgICAgIDogdGhpcy5fbW9udGhzU2hvcnRSZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbnRoc1JlZ2V4KGlzU3RyaWN0KSB7XG4gICAgICAgIGlmICh0aGlzLl9tb250aHNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZU1vbnRoc1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU3RyaWN0UmVnZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNSZWdleCA9IGRlZmF1bHRNb250aHNSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTdHJpY3RSZWdleCAmJiBpc1N0cmljdFxuICAgICAgICAgICAgICAgID8gdGhpcy5fbW9udGhzU3RyaWN0UmVnZXhcbiAgICAgICAgICAgICAgICA6IHRoaXMuX21vbnRoc1JlZ2V4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcHV0ZU1vbnRoc1BhcnNlKCkge1xuICAgICAgICBmdW5jdGlvbiBjbXBMZW5SZXYoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2hvcnRQaWVjZXMgPSBbXSxcbiAgICAgICAgICAgIGxvbmdQaWVjZXMgPSBbXSxcbiAgICAgICAgICAgIG1peGVkUGllY2VzID0gW10sXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgbW9tO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgIHNob3J0UGllY2VzLnB1c2godGhpcy5tb250aHNTaG9ydChtb20sICcnKSk7XG4gICAgICAgICAgICBsb25nUGllY2VzLnB1c2godGhpcy5tb250aHMobW9tLCAnJykpO1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXMucHVzaCh0aGlzLm1vbnRocyhtb20sICcnKSk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHRoaXMubW9udGhzU2hvcnQobW9tLCAnJykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNvcnRpbmcgbWFrZXMgc3VyZSBpZiBvbmUgbW9udGggKG9yIGFiYnIpIGlzIGEgcHJlZml4IG9mIGFub3RoZXIgaXRcbiAgICAgICAgLy8gd2lsbCBtYXRjaCB0aGUgbG9uZ2VyIHBpZWNlLlxuICAgICAgICBzaG9ydFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIGxvbmdQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgICAgICBtaXhlZFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICBzaG9ydFBpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKHNob3J0UGllY2VzW2ldKTtcbiAgICAgICAgICAgIGxvbmdQaWVjZXNbaV0gPSByZWdleEVzY2FwZShsb25nUGllY2VzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMjQ7IGkrKykge1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXNbaV0gPSByZWdleEVzY2FwZShtaXhlZFBpZWNlc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb250aHNSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIG1peGVkUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICAgICAgdGhpcy5fbW9udGhzU2hvcnRSZWdleCA9IHRoaXMuX21vbnRoc1JlZ2V4O1xuICAgICAgICB0aGlzLl9tb250aHNTdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAnXignICsgbG9uZ1BpZWNlcy5qb2luKCd8JykgKyAnKScsXG4gICAgICAgICAgICAnaSdcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAnXignICsgc2hvcnRQaWVjZXMuam9pbignfCcpICsgJyknLFxuICAgICAgICAgICAgJ2knXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1knLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB5ID0gdGhpcy55ZWFyKCk7XG4gICAgICAgIHJldHVybiB5IDw9IDk5OTkgPyB6ZXJvRmlsbCh5LCA0KSA6ICcrJyArIHk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZJywgNF0sIDAsICd5ZWFyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZWScsIDVdLCAwLCAneWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVlZJywgNiwgdHJ1ZV0sIDAsICd5ZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3llYXInLCAneScpO1xuXG4gICAgLy8gUFJJT1JJVElFU1xuXG4gICAgYWRkVW5pdFByaW9yaXR5KCd5ZWFyJywgMSk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdZJywgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVknLCBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVknLCBtYXRjaDF0bzYsIG1hdGNoNik7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVlZJywgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ1lZWVlZJywgJ1lZWVlZWSddLCBZRUFSKTtcbiAgICBhZGRQYXJzZVRva2VuKCdZWVlZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9XG4gICAgICAgICAgICBpbnB1dC5sZW5ndGggPT09IDIgPyBob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCkgOiB0b0ludChpbnB1dCk7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignWVknLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W1lFQVJdID0gaG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1knLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W1lFQVJdID0gcGFyc2VJbnQoaW5wdXQsIDEwKTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIGRheXNJblllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih5ZWFyKSA/IDM2NiA6IDM2NTtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgaG9va3MucGFyc2VUd29EaWdpdFllYXIgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHRvSW50KGlucHV0KSArICh0b0ludChpbnB1dCkgPiA2OCA/IDE5MDAgOiAyMDAwKTtcbiAgICB9O1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldFllYXIgPSBtYWtlR2V0U2V0KCdGdWxsWWVhcicsIHRydWUpO1xuXG4gICAgZnVuY3Rpb24gZ2V0SXNMZWFwWWVhcigpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIodGhpcy55ZWFyKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZURhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpIHtcbiAgICAgICAgLy8gY2FuJ3QganVzdCBhcHBseSgpIHRvIGNyZWF0ZSBhIGRhdGU6XG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcS8xODEzNDhcbiAgICAgICAgdmFyIGRhdGU7XG4gICAgICAgIC8vIHRoZSBkYXRlIGNvbnN0cnVjdG9yIHJlbWFwcyB5ZWFycyAwLTk5IHRvIDE5MDAtMTk5OVxuICAgICAgICBpZiAoeSA8IDEwMCAmJiB5ID49IDApIHtcbiAgICAgICAgICAgIC8vIHByZXNlcnZlIGxlYXAgeWVhcnMgdXNpbmcgYSBmdWxsIDQwMCB5ZWFyIGN5Y2xlLCB0aGVuIHJlc2V0XG4gICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoeSArIDQwMCwgbSwgZCwgaCwgTSwgcywgbXMpO1xuICAgICAgICAgICAgaWYgKGlzRmluaXRlKGRhdGUuZ2V0RnVsbFllYXIoKSkpIHtcbiAgICAgICAgICAgICAgICBkYXRlLnNldEZ1bGxZZWFyKHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKHksIG0sIGQsIGgsIE0sIHMsIG1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVUQ0RhdGUoeSkge1xuICAgICAgICB2YXIgZGF0ZSwgYXJncztcbiAgICAgICAgLy8gdGhlIERhdGUuVVRDIGZ1bmN0aW9uIHJlbWFwcyB5ZWFycyAwLTk5IHRvIDE5MDAtMTk5OVxuICAgICAgICBpZiAoeSA8IDEwMCAmJiB5ID49IDApIHtcbiAgICAgICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgLy8gcHJlc2VydmUgbGVhcCB5ZWFycyB1c2luZyBhIGZ1bGwgNDAwIHllYXIgY3ljbGUsIHRoZW4gcmVzZXRcbiAgICAgICAgICAgIGFyZ3NbMF0gPSB5ICsgNDAwO1xuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDLmFwcGx5KG51bGwsIGFyZ3MpKTtcbiAgICAgICAgICAgIGlmIChpc0Zpbml0ZShkYXRlLmdldFVUQ0Z1bGxZZWFyKCkpKSB7XG4gICAgICAgICAgICAgICAgZGF0ZS5zZXRVVENGdWxsWWVhcih5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQy5hcHBseShudWxsLCBhcmd1bWVudHMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIC8vIHN0YXJ0LW9mLWZpcnN0LXdlZWsgLSBzdGFydC1vZi15ZWFyXG4gICAgZnVuY3Rpb24gZmlyc3RXZWVrT2Zmc2V0KHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHZhciAvLyBmaXJzdC13ZWVrIGRheSAtLSB3aGljaCBqYW51YXJ5IGlzIGFsd2F5cyBpbiB0aGUgZmlyc3Qgd2VlayAoNCBmb3IgaXNvLCAxIGZvciBvdGhlcilcbiAgICAgICAgICAgIGZ3ZCA9IDcgKyBkb3cgLSBkb3ksXG4gICAgICAgICAgICAvLyBmaXJzdC13ZWVrIGRheSBsb2NhbCB3ZWVrZGF5IC0tIHdoaWNoIGxvY2FsIHdlZWtkYXkgaXMgZndkXG4gICAgICAgICAgICBmd2RsdyA9ICg3ICsgY3JlYXRlVVRDRGF0ZSh5ZWFyLCAwLCBmd2QpLmdldFVUQ0RheSgpIC0gZG93KSAlIDc7XG5cbiAgICAgICAgcmV0dXJuIC1md2RsdyArIGZ3ZCAtIDE7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZSNDYWxjdWxhdGluZ19hX2RhdGVfZ2l2ZW5fdGhlX3llYXIuMkNfd2Vla19udW1iZXJfYW5kX3dlZWtkYXlcbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla3MoeWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpIHtcbiAgICAgICAgdmFyIGxvY2FsV2Vla2RheSA9ICg3ICsgd2Vla2RheSAtIGRvdykgJSA3LFxuICAgICAgICAgICAgd2Vla09mZnNldCA9IGZpcnN0V2Vla09mZnNldCh5ZWFyLCBkb3csIGRveSksXG4gICAgICAgICAgICBkYXlPZlllYXIgPSAxICsgNyAqICh3ZWVrIC0gMSkgKyBsb2NhbFdlZWtkYXkgKyB3ZWVrT2Zmc2V0LFxuICAgICAgICAgICAgcmVzWWVhcixcbiAgICAgICAgICAgIHJlc0RheU9mWWVhcjtcblxuICAgICAgICBpZiAoZGF5T2ZZZWFyIDw9IDApIHtcbiAgICAgICAgICAgIHJlc1llYXIgPSB5ZWFyIC0gMTtcbiAgICAgICAgICAgIHJlc0RheU9mWWVhciA9IGRheXNJblllYXIocmVzWWVhcikgKyBkYXlPZlllYXI7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF5T2ZZZWFyID4gZGF5c0luWWVhcih5ZWFyKSkge1xuICAgICAgICAgICAgcmVzWWVhciA9IHllYXIgKyAxO1xuICAgICAgICAgICAgcmVzRGF5T2ZZZWFyID0gZGF5T2ZZZWFyIC0gZGF5c0luWWVhcih5ZWFyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc1llYXIgPSB5ZWFyO1xuICAgICAgICAgICAgcmVzRGF5T2ZZZWFyID0gZGF5T2ZZZWFyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXI6IHJlc1llYXIsXG4gICAgICAgICAgICBkYXlPZlllYXI6IHJlc0RheU9mWWVhcixcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3ZWVrT2ZZZWFyKG1vbSwgZG93LCBkb3kpIHtcbiAgICAgICAgdmFyIHdlZWtPZmZzZXQgPSBmaXJzdFdlZWtPZmZzZXQobW9tLnllYXIoKSwgZG93LCBkb3kpLFxuICAgICAgICAgICAgd2VlayA9IE1hdGguZmxvb3IoKG1vbS5kYXlPZlllYXIoKSAtIHdlZWtPZmZzZXQgLSAxKSAvIDcpICsgMSxcbiAgICAgICAgICAgIHJlc1dlZWssXG4gICAgICAgICAgICByZXNZZWFyO1xuXG4gICAgICAgIGlmICh3ZWVrIDwgMSkge1xuICAgICAgICAgICAgcmVzWWVhciA9IG1vbS55ZWFyKCkgLSAxO1xuICAgICAgICAgICAgcmVzV2VlayA9IHdlZWsgKyB3ZWVrc0luWWVhcihyZXNZZWFyLCBkb3csIGRveSk7XG4gICAgICAgIH0gZWxzZSBpZiAod2VlayA+IHdlZWtzSW5ZZWFyKG1vbS55ZWFyKCksIGRvdywgZG95KSkge1xuICAgICAgICAgICAgcmVzV2VlayA9IHdlZWsgLSB3ZWVrc0luWWVhcihtb20ueWVhcigpLCBkb3csIGRveSk7XG4gICAgICAgICAgICByZXNZZWFyID0gbW9tLnllYXIoKSArIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNZZWFyID0gbW9tLnllYXIoKTtcbiAgICAgICAgICAgIHJlc1dlZWsgPSB3ZWVrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdlZWs6IHJlc1dlZWssXG4gICAgICAgICAgICB5ZWFyOiByZXNZZWFyLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlZWtzSW5ZZWFyKHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHZhciB3ZWVrT2Zmc2V0ID0gZmlyc3RXZWVrT2Zmc2V0KHllYXIsIGRvdywgZG95KSxcbiAgICAgICAgICAgIHdlZWtPZmZzZXROZXh0ID0gZmlyc3RXZWVrT2Zmc2V0KHllYXIgKyAxLCBkb3csIGRveSk7XG4gICAgICAgIHJldHVybiAoZGF5c0luWWVhcih5ZWFyKSAtIHdlZWtPZmZzZXQgKyB3ZWVrT2Zmc2V0TmV4dCkgLyA3O1xuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCd3JywgWyd3dycsIDJdLCAnd28nLCAnd2VlaycpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdXJywgWydXVycsIDJdLCAnV28nLCAnaXNvV2VlaycpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrJywgJ3cnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWsnLCAnVycpO1xuXG4gICAgLy8gUFJJT1JJVElFU1xuXG4gICAgYWRkVW5pdFByaW9yaXR5KCd3ZWVrJywgNSk7XG4gICAgYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrJywgNSk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCd3JywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCd3dycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdXJywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdXVycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFxuICAgICAgICBbJ3cnLCAnd3cnLCAnVycsICdXVyddLFxuICAgICAgICBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgICAgIHdlZWtbdG9rZW4uc3Vic3RyKDAsIDEpXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrKG1vbSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihtb20sIHRoaXMuX3dlZWsuZG93LCB0aGlzLl93ZWVrLmRveSkud2VlaztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWsgPSB7XG4gICAgICAgIGRvdzogMCwgLy8gU3VuZGF5IGlzIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAgICAgIGRveTogNiwgLy8gVGhlIHdlZWsgdGhhdCBjb250YWlucyBKYW4gNnRoIGlzIHRoZSBmaXJzdCB3ZWVrIG9mIHRoZSB5ZWFyLlxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVGaXJzdERheU9mV2VlaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZZZWFyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vlay5kb3k7XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2VlayhpbnB1dCkge1xuICAgICAgICB2YXIgd2VlayA9IHRoaXMubG9jYWxlRGF0YSgpLndlZWsodGhpcyk7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09XZWVrKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS53ZWVrO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2QnLCAwLCAnZG8nLCAnZGF5Jyk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c01pbih0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXModGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdlJywgMCwgMCwgJ3dlZWtkYXknKTtcbiAgICBhZGRGb3JtYXRUb2tlbignRScsIDAsIDAsICdpc29XZWVrZGF5Jyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RheScsICdkJyk7XG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrZGF5JywgJ2UnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWtkYXknLCAnRScpO1xuXG4gICAgLy8gUFJJT1JJVFlcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2RheScsIDExKTtcbiAgICBhZGRVbml0UHJpb3JpdHkoJ3dlZWtkYXknLCAxMSk7XG4gICAgYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrZGF5JywgMTEpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignZCcsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignZScsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignRScsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignZGQnLCBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzTWluUmVnZXgoaXNTdHJpY3QpO1xuICAgIH0pO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2RkZCcsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUud2Vla2RheXNTaG9ydFJlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGRkJywgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS53ZWVrZGF5c1JlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZGQnLCAnZGRkJywgJ2RkZGQnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHZhciB3ZWVrZGF5ID0gY29uZmlnLl9sb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCwgdG9rZW4sIGNvbmZpZy5fc3RyaWN0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGdldCBhIHdlZWtkYXkgbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkXG4gICAgICAgIGlmICh3ZWVrZGF5ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHdlZWsuZCA9IHdlZWtkYXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkV2Vla2RheSA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2QnLCAnZScsICdFJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzTmFOKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnB1dCA9IGxvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlSXNvV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpICUgNyB8fCA3O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc05hTihpbnB1dCkgPyBudWxsIDogaW5wdXQ7XG4gICAgfVxuXG4gICAgLy8gTE9DQUxFU1xuICAgIGZ1bmN0aW9uIHNoaWZ0V2Vla2RheXMod3MsIG4pIHtcbiAgICAgICAgcmV0dXJuIHdzLnNsaWNlKG4sIDcpLmNvbmNhdCh3cy5zbGljZSgwLCBuKSk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5cyA9XG4gICAgICAgICAgICAnU3VuZGF5X01vbmRheV9UdWVzZGF5X1dlZG5lc2RheV9UaHVyc2RheV9GcmlkYXlfU2F0dXJkYXknLnNwbGl0KCdfJyksXG4gICAgICAgIGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0ID0gJ1N1bl9Nb25fVHVlX1dlZF9UaHVfRnJpX1NhdCcuc3BsaXQoJ18nKSxcbiAgICAgICAgZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluID0gJ1N1X01vX1R1X1dlX1RoX0ZyX1NhJy5zcGxpdCgnXycpLFxuICAgICAgICBkZWZhdWx0V2Vla2RheXNSZWdleCA9IG1hdGNoV29yZCxcbiAgICAgICAgZGVmYXVsdFdlZWtkYXlzU2hvcnRSZWdleCA9IG1hdGNoV29yZCxcbiAgICAgICAgZGVmYXVsdFdlZWtkYXlzTWluUmVnZXggPSBtYXRjaFdvcmQ7XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5cyhtLCBmb3JtYXQpIHtcbiAgICAgICAgdmFyIHdlZWtkYXlzID0gaXNBcnJheSh0aGlzLl93ZWVrZGF5cylcbiAgICAgICAgICAgID8gdGhpcy5fd2Vla2RheXNcbiAgICAgICAgICAgIDogdGhpcy5fd2Vla2RheXNbXG4gICAgICAgICAgICAgICAgICBtICYmIG0gIT09IHRydWUgJiYgdGhpcy5fd2Vla2RheXMuaXNGb3JtYXQudGVzdChmb3JtYXQpXG4gICAgICAgICAgICAgICAgICAgICAgPyAnZm9ybWF0J1xuICAgICAgICAgICAgICAgICAgICAgIDogJ3N0YW5kYWxvbmUnXG4gICAgICAgICAgICAgIF07XG4gICAgICAgIHJldHVybiBtID09PSB0cnVlXG4gICAgICAgICAgICA/IHNoaWZ0V2Vla2RheXMod2Vla2RheXMsIHRoaXMuX3dlZWsuZG93KVxuICAgICAgICAgICAgOiBtXG4gICAgICAgICAgICA/IHdlZWtkYXlzW20uZGF5KCldXG4gICAgICAgICAgICA6IHdlZWtkYXlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzU2hvcnQobSkge1xuICAgICAgICByZXR1cm4gbSA9PT0gdHJ1ZVxuICAgICAgICAgICAgPyBzaGlmdFdlZWtkYXlzKHRoaXMuX3dlZWtkYXlzU2hvcnQsIHRoaXMuX3dlZWsuZG93KVxuICAgICAgICAgICAgOiBtXG4gICAgICAgICAgICA/IHRoaXMuX3dlZWtkYXlzU2hvcnRbbS5kYXkoKV1cbiAgICAgICAgICAgIDogdGhpcy5fd2Vla2RheXNTaG9ydDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c01pbihtKSB7XG4gICAgICAgIHJldHVybiBtID09PSB0cnVlXG4gICAgICAgICAgICA/IHNoaWZ0V2Vla2RheXModGhpcy5fd2Vla2RheXNNaW4sIHRoaXMuX3dlZWsuZG93KVxuICAgICAgICAgICAgOiBtXG4gICAgICAgICAgICA/IHRoaXMuX3dlZWtkYXlzTWluW20uZGF5KCldXG4gICAgICAgICAgICA6IHRoaXMuX3dlZWtkYXlzTWluO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVN0cmljdFBhcnNlJDEod2Vla2RheU5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgaWksXG4gICAgICAgICAgICBtb20sXG4gICAgICAgICAgICBsbGMgPSB3ZWVrZGF5TmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbWluV2Vla2RheXNQYXJzZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgKytpKSB7XG4gICAgICAgICAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2VbaV0gPSB0aGlzLndlZWtkYXlzTWluKFxuICAgICAgICAgICAgICAgICAgICBtb20sXG4gICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZVtpXSA9IHRoaXMud2Vla2RheXNTaG9ydChcbiAgICAgICAgICAgICAgICAgICAgbW9tLFxuICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICkudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldID0gdGhpcy53ZWVrZGF5cyhtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ2RkZGQnKSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQgPT09ICdkZGQnKSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX21pbldlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09ICdkZGRkJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3dlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQgPT09ICdkZGQnKSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl93ZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9taW5XZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX21pbldlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3dlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNQYXJzZSh3ZWVrZGF5TmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZVN0cmljdFBhcnNlJDEuY2FsbCh0aGlzLCB3ZWVrZGF5TmFtZSwgZm9ybWF0LCBzdHJpY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2Z1bGxXZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcblxuICAgICAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiAhdGhpcy5fZnVsbFdlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mdWxsV2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAgICAgICAgICdeJyArIHRoaXMud2Vla2RheXMobW9tLCAnJykucmVwbGFjZSgnLicsICdcXFxcLj8nKSArICckJyxcbiAgICAgICAgICAgICAgICAgICAgJ2knXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgICAgICAgICAnXicgKyB0aGlzLndlZWtkYXlzU2hvcnQobW9tLCAnJykucmVwbGFjZSgnLicsICdcXFxcLj8nKSArICckJyxcbiAgICAgICAgICAgICAgICAgICAgJ2knXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICAgICAgICAgJ14nICsgdGhpcy53ZWVrZGF5c01pbihtb20sICcnKS5yZXBsYWNlKCcuJywgJ1xcXFwuPycpICsgJyQnLFxuICAgICAgICAgICAgICAgICAgICAnaSdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgcmVnZXggPVxuICAgICAgICAgICAgICAgICAgICAnXicgK1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndlZWtkYXlzKG1vbSwgJycpICtcbiAgICAgICAgICAgICAgICAgICAgJ3xeJyArXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKSArXG4gICAgICAgICAgICAgICAgICAgICd8XicgK1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHN0cmljdCAmJlxuICAgICAgICAgICAgICAgIGZvcm1hdCA9PT0gJ2RkZGQnICYmXG4gICAgICAgICAgICAgICAgdGhpcy5fZnVsbFdlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICBzdHJpY3QgJiZcbiAgICAgICAgICAgICAgICBmb3JtYXQgPT09ICdkZGQnICYmXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgc3RyaWN0ICYmXG4gICAgICAgICAgICAgICAgZm9ybWF0ID09PSAnZGQnICYmXG4gICAgICAgICAgICAgICAgdGhpcy5fbWluV2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzdHJpY3QgJiYgdGhpcy5fd2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0RGF5T2ZXZWVrKGlucHV0KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF5ID0gdGhpcy5faXNVVEMgPyB0aGlzLl9kLmdldFVUQ0RheSgpIDogdGhpcy5fZC5nZXREYXkoKTtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlucHV0ID0gcGFyc2VXZWVrZGF5KGlucHV0LCB0aGlzLmxvY2FsZURhdGEoKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoaW5wdXQgLSBkYXksICdkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrKGlucHV0KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgd2Vla2RheSA9ICh0aGlzLmRheSgpICsgNyAtIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdykgJSA3O1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWtkYXkgOiB0aGlzLmFkZChpbnB1dCAtIHdlZWtkYXksICdkJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPRGF5T2ZXZWVrKGlucHV0KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJlaGF2ZXMgdGhlIHNhbWUgYXMgbW9tZW50I2RheSBleGNlcHRcbiAgICAgICAgLy8gYXMgYSBnZXR0ZXIsIHJldHVybnMgNyBpbnN0ZWFkIG9mIDAgKDEtNyByYW5nZSBpbnN0ZWFkIG9mIDAtNilcbiAgICAgICAgLy8gYXMgYSBzZXR0ZXIsIHN1bmRheSBzaG91bGQgYmVsb25nIHRvIHRoZSBwcmV2aW91cyB3ZWVrLlxuXG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgd2Vla2RheSA9IHBhcnNlSXNvV2Vla2RheShpbnB1dCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF5KHRoaXMuZGF5KCkgJSA3ID8gd2Vla2RheSA6IHdlZWtkYXkgLSA3KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRheSgpIHx8IDc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3ZWVrZGF5c1JlZ2V4KGlzU3RyaWN0KSB7XG4gICAgICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlRXhhY3QpIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzUmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVXZWVrZGF5c1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTdHJpY3RSZWdleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzUmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1JlZ2V4ID0gZGVmYXVsdFdlZWtkYXlzUmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTdHJpY3RSZWdleCAmJiBpc1N0cmljdFxuICAgICAgICAgICAgICAgID8gdGhpcy5fd2Vla2RheXNTdHJpY3RSZWdleFxuICAgICAgICAgICAgICAgIDogdGhpcy5fd2Vla2RheXNSZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlZWtkYXlzU2hvcnRSZWdleChpc1N0cmljdCkge1xuICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlV2Vla2RheXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzU2hvcnRSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNTaG9ydFJlZ2V4ID0gZGVmYXVsdFdlZWtkYXlzU2hvcnRSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0U3RyaWN0UmVnZXggJiYgaXNTdHJpY3RcbiAgICAgICAgICAgICAgICA/IHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleFxuICAgICAgICAgICAgICAgIDogdGhpcy5fd2Vla2RheXNTaG9ydFJlZ2V4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Vla2RheXNNaW5SZWdleChpc1N0cmljdCkge1xuICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlV2Vla2RheXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblJlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNNaW5SZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNNaW5SZWdleCA9IGRlZmF1bHRXZWVrZGF5c01pblJlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXggJiYgaXNTdHJpY3RcbiAgICAgICAgICAgICAgICA/IHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXhcbiAgICAgICAgICAgICAgICA6IHRoaXMuX3dlZWtkYXlzTWluUmVnZXg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlV2Vla2RheXNQYXJzZSgpIHtcbiAgICAgICAgZnVuY3Rpb24gY21wTGVuUmV2KGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBiLmxlbmd0aCAtIGEubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1pblBpZWNlcyA9IFtdLFxuICAgICAgICAgICAgc2hvcnRQaWVjZXMgPSBbXSxcbiAgICAgICAgICAgIGxvbmdQaWVjZXMgPSBbXSxcbiAgICAgICAgICAgIG1peGVkUGllY2VzID0gW10sXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgbW9tLFxuICAgICAgICAgICAgbWlucCxcbiAgICAgICAgICAgIHNob3J0cCxcbiAgICAgICAgICAgIGxvbmdwO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgIG1pbnAgPSByZWdleEVzY2FwZSh0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpKTtcbiAgICAgICAgICAgIHNob3J0cCA9IHJlZ2V4RXNjYXBlKHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKSk7XG4gICAgICAgICAgICBsb25ncCA9IHJlZ2V4RXNjYXBlKHRoaXMud2Vla2RheXMobW9tLCAnJykpO1xuICAgICAgICAgICAgbWluUGllY2VzLnB1c2gobWlucCk7XG4gICAgICAgICAgICBzaG9ydFBpZWNlcy5wdXNoKHNob3J0cCk7XG4gICAgICAgICAgICBsb25nUGllY2VzLnB1c2gobG9uZ3ApO1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXMucHVzaChtaW5wKTtcbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2goc2hvcnRwKTtcbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2gobG9uZ3ApO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNvcnRpbmcgbWFrZXMgc3VyZSBpZiBvbmUgd2Vla2RheSAob3IgYWJicikgaXMgYSBwcmVmaXggb2YgYW5vdGhlciBpdFxuICAgICAgICAvLyB3aWxsIG1hdGNoIHRoZSBsb25nZXIgcGllY2UuXG4gICAgICAgIG1pblBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIHNob3J0UGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgbG9uZ1BpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIG1peGVkUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcblxuICAgICAgICB0aGlzLl93ZWVrZGF5c1JlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbWl4ZWRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgICAgICB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXggPSB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuICAgICAgICB0aGlzLl93ZWVrZGF5c01pblJlZ2V4ID0gdGhpcy5fd2Vla2RheXNSZWdleDtcblxuICAgICAgICB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICdeKCcgKyBsb25nUGllY2VzLmpvaW4oJ3wnKSArICcpJyxcbiAgICAgICAgICAgICdpJ1xuICAgICAgICApO1xuICAgICAgICB0aGlzLl93ZWVrZGF5c1Nob3J0U3RyaWN0UmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgJ14oJyArIHNob3J0UGllY2VzLmpvaW4oJ3wnKSArICcpJyxcbiAgICAgICAgICAgICdpJ1xuICAgICAgICApO1xuICAgICAgICB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICdeKCcgKyBtaW5QaWVjZXMuam9pbignfCcpICsgJyknLFxuICAgICAgICAgICAgJ2knXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgZnVuY3Rpb24gaEZvcm1hdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKSAlIDEyIHx8IDEyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGtGb3JtYXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhvdXJzKCkgfHwgMjQ7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0gnLCBbJ0hIJywgMl0sIDAsICdob3VyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ2gnLCBbJ2hoJywgMl0sIDAsIGhGb3JtYXQpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdrJywgWydraycsIDJdLCAwLCBrRm9ybWF0KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdobW0nLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAnJyArIGhGb3JtYXQuYXBwbHkodGhpcykgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMik7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignaG1tc3MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAnJyArXG4gICAgICAgICAgICBoRm9ybWF0LmFwcGx5KHRoaXMpICtcbiAgICAgICAgICAgIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKSArXG4gICAgICAgICAgICB6ZXJvRmlsbCh0aGlzLnNlY29uZHMoKSwgMilcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdIbW0nLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAnJyArIHRoaXMuaG91cnMoKSArIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdIbW1zcycsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICcnICtcbiAgICAgICAgICAgIHRoaXMuaG91cnMoKSArXG4gICAgICAgICAgICB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMikgK1xuICAgICAgICAgICAgemVyb0ZpbGwodGhpcy5zZWNvbmRzKCksIDIpXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbSh0b2tlbiwgbG93ZXJjYXNlKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKHRva2VuLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubWVyaWRpZW0oXG4gICAgICAgICAgICAgICAgdGhpcy5ob3VycygpLFxuICAgICAgICAgICAgICAgIHRoaXMubWludXRlcygpLFxuICAgICAgICAgICAgICAgIGxvd2VyY2FzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbWVyaWRpZW0oJ2EnLCB0cnVlKTtcbiAgICBtZXJpZGllbSgnQScsIGZhbHNlKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnaG91cicsICdoJyk7XG5cbiAgICAvLyBQUklPUklUWVxuICAgIGFkZFVuaXRQcmlvcml0eSgnaG91cicsIDEzKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGZ1bmN0aW9uIG1hdGNoTWVyaWRpZW0oaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLl9tZXJpZGllbVBhcnNlO1xuICAgIH1cblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2EnLCBtYXRjaE1lcmlkaWVtKTtcbiAgICBhZGRSZWdleFRva2VuKCdBJywgbWF0Y2hNZXJpZGllbSk7XG4gICAgYWRkUmVnZXhUb2tlbignSCcsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignaCcsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignaycsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignSEgnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignaGgnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbigna2snLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5cbiAgICBhZGRSZWdleFRva2VuKCdobW0nLCBtYXRjaDN0bzQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2htbXNzJywgbWF0Y2g1dG82KTtcbiAgICBhZGRSZWdleFRva2VuKCdIbW0nLCBtYXRjaDN0bzQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0htbXNzJywgbWF0Y2g1dG82KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydIJywgJ0hIJ10sIEhPVVIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydrJywgJ2trJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICB2YXIga0lucHV0ID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICBhcnJheVtIT1VSXSA9IGtJbnB1dCA9PT0gMjQgPyAwIDoga0lucHV0O1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oWydhJywgJ0EnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5faXNQbSA9IGNvbmZpZy5fbG9jYWxlLmlzUE0oaW5wdXQpO1xuICAgICAgICBjb25maWcuX21lcmlkaWVtID0gaW5wdXQ7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2gnLCAnaGgnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdobW0nLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgdmFyIHBvcyA9IGlucHV0Lmxlbmd0aCAtIDI7XG4gICAgICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQuc3Vic3RyKDAsIHBvcykpO1xuICAgICAgICBhcnJheVtNSU5VVEVdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvcykpO1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdobW1zcycsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICB2YXIgcG9zMSA9IGlucHV0Lmxlbmd0aCAtIDQsXG4gICAgICAgICAgICBwb3MyID0gaW5wdXQubGVuZ3RoIC0gMjtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dC5zdWJzdHIoMCwgcG9zMSkpO1xuICAgICAgICBhcnJheVtNSU5VVEVdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczEsIDIpKTtcbiAgICAgICAgYXJyYXlbU0VDT05EXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MyKSk7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ0htbScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICB2YXIgcG9zID0gaW5wdXQubGVuZ3RoIC0gMjtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dC5zdWJzdHIoMCwgcG9zKSk7XG4gICAgICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zKSk7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignSG1tc3MnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgdmFyIHBvczEgPSBpbnB1dC5sZW5ndGggLSA0LFxuICAgICAgICAgICAgcG9zMiA9IGlucHV0Lmxlbmd0aCAtIDI7XG4gICAgICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQuc3Vic3RyKDAsIHBvczEpKTtcbiAgICAgICAgYXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MxLCAyKSk7XG4gICAgICAgIGFycmF5W1NFQ09ORF0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zMikpO1xuICAgIH0pO1xuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlSXNQTShpbnB1dCkge1xuICAgICAgICAvLyBJRTggUXVpcmtzIE1vZGUgJiBJRTcgU3RhbmRhcmRzIE1vZGUgZG8gbm90IGFsbG93IGFjY2Vzc2luZyBzdHJpbmdzIGxpa2UgYXJyYXlzXG4gICAgICAgIC8vIFVzaW5nIGNoYXJBdCBzaG91bGQgYmUgbW9yZSBjb21wYXRpYmxlLlxuICAgICAgICByZXR1cm4gKGlucHV0ICsgJycpLnRvTG93ZXJDYXNlKCkuY2hhckF0KDApID09PSAncCc7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNZXJpZGllbVBhcnNlID0gL1thcF1cXC4/bT9cXC4/L2ksXG4gICAgICAgIC8vIFNldHRpbmcgdGhlIGhvdXIgc2hvdWxkIGtlZXAgdGhlIHRpbWUsIGJlY2F1c2UgdGhlIHVzZXIgZXhwbGljaXRseVxuICAgICAgICAvLyBzcGVjaWZpZWQgd2hpY2ggaG91ciB0aGV5IHdhbnQuIFNvIHRyeWluZyB0byBtYWludGFpbiB0aGUgc2FtZSBob3VyIChpblxuICAgICAgICAvLyBhIG5ldyB0aW1lem9uZSkgbWFrZXMgc2Vuc2UuIEFkZGluZy9zdWJ0cmFjdGluZyBob3VycyBkb2VzIG5vdCBmb2xsb3dcbiAgICAgICAgLy8gdGhpcyBydWxlLlxuICAgICAgICBnZXRTZXRIb3VyID0gbWFrZUdldFNldCgnSG91cnMnLCB0cnVlKTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZU1lcmlkaWVtKGhvdXJzLCBtaW51dGVzLCBpc0xvd2VyKSB7XG4gICAgICAgIGlmIChob3VycyA+IDExKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdwbScgOiAnUE0nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAnYW0nIDogJ0FNJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBiYXNlQ29uZmlnID0ge1xuICAgICAgICBjYWxlbmRhcjogZGVmYXVsdENhbGVuZGFyLFxuICAgICAgICBsb25nRGF0ZUZvcm1hdDogZGVmYXVsdExvbmdEYXRlRm9ybWF0LFxuICAgICAgICBpbnZhbGlkRGF0ZTogZGVmYXVsdEludmFsaWREYXRlLFxuICAgICAgICBvcmRpbmFsOiBkZWZhdWx0T3JkaW5hbCxcbiAgICAgICAgZGF5T2ZNb250aE9yZGluYWxQYXJzZTogZGVmYXVsdERheU9mTW9udGhPcmRpbmFsUGFyc2UsXG4gICAgICAgIHJlbGF0aXZlVGltZTogZGVmYXVsdFJlbGF0aXZlVGltZSxcblxuICAgICAgICBtb250aHM6IGRlZmF1bHRMb2NhbGVNb250aHMsXG4gICAgICAgIG1vbnRoc1Nob3J0OiBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQsXG5cbiAgICAgICAgd2VlazogZGVmYXVsdExvY2FsZVdlZWssXG5cbiAgICAgICAgd2Vla2RheXM6IGRlZmF1bHRMb2NhbGVXZWVrZGF5cyxcbiAgICAgICAgd2Vla2RheXNNaW46IGRlZmF1bHRMb2NhbGVXZWVrZGF5c01pbixcbiAgICAgICAgd2Vla2RheXNTaG9ydDogZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQsXG5cbiAgICAgICAgbWVyaWRpZW1QYXJzZTogZGVmYXVsdExvY2FsZU1lcmlkaWVtUGFyc2UsXG4gICAgfTtcblxuICAgIC8vIGludGVybmFsIHN0b3JhZ2UgZm9yIGxvY2FsZSBjb25maWcgZmlsZXNcbiAgICB2YXIgbG9jYWxlcyA9IHt9LFxuICAgICAgICBsb2NhbGVGYW1pbGllcyA9IHt9LFxuICAgICAgICBnbG9iYWxMb2NhbGU7XG5cbiAgICBmdW5jdGlvbiBjb21tb25QcmVmaXgoYXJyMSwgYXJyMikge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIG1pbmwgPSBNYXRoLm1pbihhcnIxLmxlbmd0aCwgYXJyMi5sZW5ndGgpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWlubDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAoYXJyMVtpXSAhPT0gYXJyMltpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW5sO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZUxvY2FsZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleSA/IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ18nLCAnLScpIDoga2V5O1xuICAgIH1cblxuICAgIC8vIHBpY2sgdGhlIGxvY2FsZSBmcm9tIHRoZSBhcnJheVxuICAgIC8vIHRyeSBbJ2VuLWF1JywgJ2VuLWdiJ10gYXMgJ2VuLWF1JywgJ2VuLWdiJywgJ2VuJywgYXMgaW4gbW92ZSB0aHJvdWdoIHRoZSBsaXN0IHRyeWluZyBlYWNoXG4gICAgLy8gc3Vic3RyaW5nIGZyb20gbW9zdCBzcGVjaWZpYyB0byBsZWFzdCwgYnV0IG1vdmUgdG8gdGhlIG5leHQgYXJyYXkgaXRlbSBpZiBpdCdzIGEgbW9yZSBzcGVjaWZpYyB2YXJpYW50IHRoYW4gdGhlIGN1cnJlbnQgcm9vdFxuICAgIGZ1bmN0aW9uIGNob29zZUxvY2FsZShuYW1lcykge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBqLFxuICAgICAgICAgICAgbmV4dCxcbiAgICAgICAgICAgIGxvY2FsZSxcbiAgICAgICAgICAgIHNwbGl0O1xuXG4gICAgICAgIHdoaWxlIChpIDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzcGxpdCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpXSkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGogPSBzcGxpdC5sZW5ndGg7XG4gICAgICAgICAgICBuZXh0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2kgKyAxXSk7XG4gICAgICAgICAgICBuZXh0ID0gbmV4dCA/IG5leHQuc3BsaXQoJy0nKSA6IG51bGw7XG4gICAgICAgICAgICB3aGlsZSAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKHNwbGl0LnNsaWNlKDAsIGopLmpvaW4oJy0nKSk7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIG5leHQgJiZcbiAgICAgICAgICAgICAgICAgICAgbmV4dC5sZW5ndGggPj0gaiAmJlxuICAgICAgICAgICAgICAgICAgICBjb21tb25QcmVmaXgoc3BsaXQsIG5leHQpID49IGogLSAxXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhlIG5leHQgYXJyYXkgaXRlbSBpcyBiZXR0ZXIgdGhhbiBhIHNoYWxsb3dlciBzdWJzdHJpbmcgb2YgdGhpcyBvbmVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGotLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTG9jYWxlTmFtZVNhbmUobmFtZSkge1xuICAgICAgICAvLyBQcmV2ZW50IG5hbWVzIHRoYXQgbG9vayBsaWtlIGZpbGVzeXN0ZW0gcGF0aHMsIGkuZSBjb250YWluICcvJyBvciAnXFwnXG4gICAgICAgIHJldHVybiBuYW1lLm1hdGNoKCdeW14vXFxcXFxcXFxdKiQnKSAhPSBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRMb2NhbGUobmFtZSkge1xuICAgICAgICB2YXIgb2xkTG9jYWxlID0gbnVsbCxcbiAgICAgICAgICAgIGFsaWFzZWRSZXF1aXJlO1xuICAgICAgICAvLyBUT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZWdpc3RlciBhbmQgbG9hZCBhbGwgdGhlIGxvY2FsZXMgaW4gTm9kZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBsb2NhbGVzW25hbWVdID09PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICBtb2R1bGUgJiZcbiAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzICYmXG4gICAgICAgICAgICBpc0xvY2FsZU5hbWVTYW5lKG5hbWUpXG4gICAgICAgICkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvbGRMb2NhbGUgPSBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgICAgICAgICAgICAgYWxpYXNlZFJlcXVpcmUgPSByZXF1aXJlO1xuICAgICAgICAgICAgICAgIGFsaWFzZWRSZXF1aXJlKCcuL2xvY2FsZS8nICsgbmFtZSk7XG4gICAgICAgICAgICAgICAgZ2V0U2V0R2xvYmFsTG9jYWxlKG9sZExvY2FsZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gbWFyayBhcyBub3QgZm91bmQgdG8gYXZvaWQgcmVwZWF0aW5nIGV4cGVuc2l2ZSBmaWxlIHJlcXVpcmUgY2FsbCBjYXVzaW5nIGhpZ2ggQ1BVXG4gICAgICAgICAgICAgICAgLy8gd2hlbiB0cnlpbmcgdG8gZmluZCBlbi1VUywgZW5fVVMsIGVuLXVzIGZvciBldmVyeSBmb3JtYXQgY2FsbFxuICAgICAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0gPSBudWxsOyAvLyBudWxsIG1lYW5zIG5vdCBmb3VuZFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBsb2FkIGxvY2FsZSBhbmQgdGhlbiBzZXQgdGhlIGdsb2JhbCBsb2NhbGUuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnQgZ2xvYmFsXG4gICAgLy8gbG9jYWxlIGtleS5cbiAgICBmdW5jdGlvbiBnZXRTZXRHbG9iYWxMb2NhbGUoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChpc1VuZGVmaW5lZCh2YWx1ZXMpKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGdldExvY2FsZShrZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGVmaW5lTG9jYWxlKGtleSwgdmFsdWVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBtb21lbnQuZHVyYXRpb24uX2xvY2FsZSA9IG1vbWVudC5fbG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgICAgICBnbG9iYWxMb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgICAgICAgICAvL3dhcm4gdXNlciBpZiBhcmd1bWVudHMgYXJlIHBhc3NlZCBidXQgdGhlIGxvY2FsZSBjb3VsZCBub3QgYmUgc2V0XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgICAgICAgICAgICdMb2NhbGUgJyArIGtleSArICcgbm90IGZvdW5kLiBEaWQgeW91IGZvcmdldCB0byBsb2FkIGl0PydcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlLl9hYmJyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmluZUxvY2FsZShuYW1lLCBjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGxvY2FsZSxcbiAgICAgICAgICAgICAgICBwYXJlbnRDb25maWcgPSBiYXNlQ29uZmlnO1xuICAgICAgICAgICAgY29uZmlnLmFiYnIgPSBuYW1lO1xuICAgICAgICAgICAgaWYgKGxvY2FsZXNbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRlcHJlY2F0ZVNpbXBsZShcbiAgICAgICAgICAgICAgICAgICAgJ2RlZmluZUxvY2FsZU92ZXJyaWRlJyxcbiAgICAgICAgICAgICAgICAgICAgJ3VzZSBtb21lbnQudXBkYXRlTG9jYWxlKGxvY2FsZU5hbWUsIGNvbmZpZykgdG8gY2hhbmdlICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2FuIGV4aXN0aW5nIGxvY2FsZS4gbW9tZW50LmRlZmluZUxvY2FsZShsb2NhbGVOYW1lLCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcpIHNob3VsZCBvbmx5IGJlIHVzZWQgZm9yIGNyZWF0aW5nIGEgbmV3IGxvY2FsZSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdTZWUgaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9kZWZpbmUtbG9jYWxlLyBmb3IgbW9yZSBpbmZvLidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IGxvY2FsZXNbbmFtZV0uX2NvbmZpZztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLnBhcmVudExvY2FsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsZXNbY29uZmlnLnBhcmVudExvY2FsZV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRDb25maWcgPSBsb2NhbGVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdLl9jb25maWc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShjb25maWcucGFyZW50TG9jYWxlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRDb25maWcgPSBsb2NhbGUuX2NvbmZpZztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbG9jYWxlRmFtaWxpZXNbY29uZmlnLnBhcmVudExvY2FsZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGVGYW1pbGllc1tjb25maWcucGFyZW50TG9jYWxlXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxlRmFtaWxpZXNbY29uZmlnLnBhcmVudExvY2FsZV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbmV3IExvY2FsZShtZXJnZUNvbmZpZ3MocGFyZW50Q29uZmlnLCBjb25maWcpKTtcblxuICAgICAgICAgICAgaWYgKGxvY2FsZUZhbWlsaWVzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlRmFtaWxpZXNbbmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICBkZWZpbmVMb2NhbGUoeC5uYW1lLCB4LmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIHNldCB0aGUgbG9jYWxlIEFGVEVSIGFsbCBjaGlsZCBsb2NhbGVzIGhhdmUgYmVlblxuICAgICAgICAgICAgLy8gY3JlYXRlZCwgc28gd2Ugd29uJ3QgZW5kIHVwIHdpdGggdGhlIGNoaWxkIGxvY2FsZSBzZXQuXG4gICAgICAgICAgICBnZXRTZXRHbG9iYWxMb2NhbGUobmFtZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdXNlZnVsIGZvciB0ZXN0aW5nXG4gICAgICAgICAgICBkZWxldGUgbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9jYWxlKG5hbWUsIGNvbmZpZykge1xuICAgICAgICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBsb2NhbGUsXG4gICAgICAgICAgICAgICAgdG1wTG9jYWxlLFxuICAgICAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IGJhc2VDb25maWc7XG5cbiAgICAgICAgICAgIGlmIChsb2NhbGVzW25hbWVdICE9IG51bGwgJiYgbG9jYWxlc1tuYW1lXS5wYXJlbnRMb2NhbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBleGlzdGluZyBjaGlsZCBsb2NhbGUgaW4tcGxhY2UgdG8gYXZvaWQgbWVtb3J5LWxlYWtzXG4gICAgICAgICAgICAgICAgbG9jYWxlc1tuYW1lXS5zZXQobWVyZ2VDb25maWdzKGxvY2FsZXNbbmFtZV0uX2NvbmZpZywgY29uZmlnKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE1FUkdFXG4gICAgICAgICAgICAgICAgdG1wTG9jYWxlID0gbG9hZExvY2FsZShuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAodG1wTG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gdG1wTG9jYWxlLl9jb25maWc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbmZpZyA9IG1lcmdlQ29uZmlncyhwYXJlbnRDb25maWcsIGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgaWYgKHRtcExvY2FsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZUxvY2FsZSBpcyBjYWxsZWQgZm9yIGNyZWF0aW5nIGEgbmV3IGxvY2FsZVxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgYWJiciBzbyBpdCB3aWxsIGhhdmUgYSBuYW1lIChnZXR0ZXJzIHJldHVyblxuICAgICAgICAgICAgICAgICAgICAvLyB1bmRlZmluZWQgb3RoZXJ3aXNlKS5cbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLmFiYnIgPSBuYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsb2NhbGUgPSBuZXcgTG9jYWxlKGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgbG9jYWxlLnBhcmVudExvY2FsZSA9IGxvY2FsZXNbbmFtZV07XG4gICAgICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IGxvY2FsZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYmFja3dhcmRzIGNvbXBhdCBmb3Igbm93OiBhbHNvIHNldCB0aGUgbG9jYWxlXG4gICAgICAgICAgICBnZXRTZXRHbG9iYWxMb2NhbGUobmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBwYXNzIG51bGwgZm9yIGNvbmZpZyB0byB1bnVwZGF0ZSwgdXNlZnVsIGZvciB0ZXN0c1xuICAgICAgICAgICAgaWYgKGxvY2FsZXNbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbGVzW25hbWVdLnBhcmVudExvY2FsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0gPSBsb2NhbGVzW25hbWVdLnBhcmVudExvY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IGdldFNldEdsb2JhbExvY2FsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRTZXRHbG9iYWxMb2NhbGUobmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxvY2FsZXNbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgfVxuXG4gICAgLy8gcmV0dXJucyBsb2NhbGUgZGF0YVxuICAgIGZ1bmN0aW9uIGdldExvY2FsZShrZXkpIHtcbiAgICAgICAgdmFyIGxvY2FsZTtcblxuICAgICAgICBpZiAoa2V5ICYmIGtleS5fbG9jYWxlICYmIGtleS5fbG9jYWxlLl9hYmJyKSB7XG4gICAgICAgICAgICBrZXkgPSBrZXkuX2xvY2FsZS5fYWJicjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0FycmF5KGtleSkpIHtcbiAgICAgICAgICAgIC8vc2hvcnQtY2lyY3VpdCBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5ID0gW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hvb3NlTG9jYWxlKGtleSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdExvY2FsZXMoKSB7XG4gICAgICAgIHJldHVybiBrZXlzKGxvY2FsZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrT3ZlcmZsb3cobSkge1xuICAgICAgICB2YXIgb3ZlcmZsb3csXG4gICAgICAgICAgICBhID0gbS5fYTtcblxuICAgICAgICBpZiAoYSAmJiBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPT09IC0yKSB7XG4gICAgICAgICAgICBvdmVyZmxvdyA9XG4gICAgICAgICAgICAgICAgYVtNT05USF0gPCAwIHx8IGFbTU9OVEhdID4gMTFcbiAgICAgICAgICAgICAgICAgICAgPyBNT05USFxuICAgICAgICAgICAgICAgICAgICA6IGFbREFURV0gPCAxIHx8IGFbREFURV0gPiBkYXlzSW5Nb250aChhW1lFQVJdLCBhW01PTlRIXSlcbiAgICAgICAgICAgICAgICAgICAgPyBEQVRFXG4gICAgICAgICAgICAgICAgICAgIDogYVtIT1VSXSA8IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgICBhW0hPVVJdID4gMjQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAoYVtIT1VSXSA9PT0gMjQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGFbTUlOVVRFXSAhPT0gMCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYVtTRUNPTkRdICE9PSAwIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhW01JTExJU0VDT05EXSAhPT0gMCkpXG4gICAgICAgICAgICAgICAgICAgID8gSE9VUlxuICAgICAgICAgICAgICAgICAgICA6IGFbTUlOVVRFXSA8IDAgfHwgYVtNSU5VVEVdID4gNTlcbiAgICAgICAgICAgICAgICAgICAgPyBNSU5VVEVcbiAgICAgICAgICAgICAgICAgICAgOiBhW1NFQ09ORF0gPCAwIHx8IGFbU0VDT05EXSA+IDU5XG4gICAgICAgICAgICAgICAgICAgID8gU0VDT05EXG4gICAgICAgICAgICAgICAgICAgIDogYVtNSUxMSVNFQ09ORF0gPCAwIHx8IGFbTUlMTElTRUNPTkRdID4gOTk5XG4gICAgICAgICAgICAgICAgICAgID8gTUlMTElTRUNPTkRcbiAgICAgICAgICAgICAgICAgICAgOiAtMTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dEYXlPZlllYXIgJiZcbiAgICAgICAgICAgICAgICAob3ZlcmZsb3cgPCBZRUFSIHx8IG92ZXJmbG93ID4gREFURSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gREFURTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MobSkuX292ZXJmbG93V2Vla3MgJiYgb3ZlcmZsb3cgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBXRUVLO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dXZWVrZGF5ICYmIG92ZXJmbG93ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gV0VFS0RBWTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLm92ZXJmbG93ID0gb3ZlcmZsb3c7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICAvLyBpc28gODYwMSByZWdleFxuICAgIC8vIDAwMDAtMDAtMDAgMDAwMC1XMDAgb3IgMDAwMC1XMDAtMCArIFQgKyAwMCBvciAwMDowMCBvciAwMDowMDowMCBvciAwMDowMDowMC4wMDAgKyArMDA6MDAgb3IgKzAwMDAgb3IgKzAwKVxuICAgIHZhciBleHRlbmRlZElzb1JlZ2V4ID1cbiAgICAgICAgICAgIC9eXFxzKigoPzpbKy1dXFxkezZ9fFxcZHs0fSktKD86XFxkXFxkLVxcZFxcZHxXXFxkXFxkLVxcZHxXXFxkXFxkfFxcZFxcZFxcZHxcXGRcXGQpKSg/OihUfCApKFxcZFxcZCg/OjpcXGRcXGQoPzo6XFxkXFxkKD86Wy4sXVxcZCspPyk/KT8pKFsrLV1cXGRcXGQoPzo6P1xcZFxcZCk/fFxccypaKT8pPyQvLFxuICAgICAgICBiYXNpY0lzb1JlZ2V4ID1cbiAgICAgICAgICAgIC9eXFxzKigoPzpbKy1dXFxkezZ9fFxcZHs0fSkoPzpcXGRcXGRcXGRcXGR8V1xcZFxcZFxcZHxXXFxkXFxkfFxcZFxcZFxcZHxcXGRcXGR8KSkoPzooVHwgKShcXGRcXGQoPzpcXGRcXGQoPzpcXGRcXGQoPzpbLixdXFxkKyk/KT8pPykoWystXVxcZFxcZCg/Ojo/XFxkXFxkKT98XFxzKlopPyk/JC8sXG4gICAgICAgIHR6UmVnZXggPSAvWnxbKy1dXFxkXFxkKD86Oj9cXGRcXGQpPy8sXG4gICAgICAgIGlzb0RhdGVzID0gW1xuICAgICAgICAgICAgWydZWVlZWVktTU0tREQnLCAvWystXVxcZHs2fS1cXGRcXGQtXFxkXFxkL10sXG4gICAgICAgICAgICBbJ1lZWVktTU0tREQnLCAvXFxkezR9LVxcZFxcZC1cXGRcXGQvXSxcbiAgICAgICAgICAgIFsnR0dHRy1bV11XVy1FJywgL1xcZHs0fS1XXFxkXFxkLVxcZC9dLFxuICAgICAgICAgICAgWydHR0dHLVtXXVdXJywgL1xcZHs0fS1XXFxkXFxkLywgZmFsc2VdLFxuICAgICAgICAgICAgWydZWVlZLURERCcsIC9cXGR7NH0tXFxkezN9L10sXG4gICAgICAgICAgICBbJ1lZWVktTU0nLCAvXFxkezR9LVxcZFxcZC8sIGZhbHNlXSxcbiAgICAgICAgICAgIFsnWVlZWVlZTU1ERCcsIC9bKy1dXFxkezEwfS9dLFxuICAgICAgICAgICAgWydZWVlZTU1ERCcsIC9cXGR7OH0vXSxcbiAgICAgICAgICAgIFsnR0dHR1tXXVdXRScsIC9cXGR7NH1XXFxkezN9L10sXG4gICAgICAgICAgICBbJ0dHR0dbV11XVycsIC9cXGR7NH1XXFxkezJ9LywgZmFsc2VdLFxuICAgICAgICAgICAgWydZWVlZREREJywgL1xcZHs3fS9dLFxuICAgICAgICAgICAgWydZWVlZTU0nLCAvXFxkezZ9LywgZmFsc2VdLFxuICAgICAgICAgICAgWydZWVlZJywgL1xcZHs0fS8sIGZhbHNlXSxcbiAgICAgICAgXSxcbiAgICAgICAgLy8gaXNvIHRpbWUgZm9ybWF0cyBhbmQgcmVnZXhlc1xuICAgICAgICBpc29UaW1lcyA9IFtcbiAgICAgICAgICAgIFsnSEg6bW06c3MuU1NTUycsIC9cXGRcXGQ6XFxkXFxkOlxcZFxcZFxcLlxcZCsvXSxcbiAgICAgICAgICAgIFsnSEg6bW06c3MsU1NTUycsIC9cXGRcXGQ6XFxkXFxkOlxcZFxcZCxcXGQrL10sXG4gICAgICAgICAgICBbJ0hIOm1tOnNzJywgL1xcZFxcZDpcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgICAgICBbJ0hIOm1tJywgL1xcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgICAgIFsnSEhtbXNzLlNTU1MnLCAvXFxkXFxkXFxkXFxkXFxkXFxkXFwuXFxkKy9dLFxuICAgICAgICAgICAgWydISG1tc3MsU1NTUycsIC9cXGRcXGRcXGRcXGRcXGRcXGQsXFxkKy9dLFxuICAgICAgICAgICAgWydISG1tc3MnLCAvXFxkXFxkXFxkXFxkXFxkXFxkL10sXG4gICAgICAgICAgICBbJ0hIbW0nLCAvXFxkXFxkXFxkXFxkL10sXG4gICAgICAgICAgICBbJ0hIJywgL1xcZFxcZC9dLFxuICAgICAgICBdLFxuICAgICAgICBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKC0/XFxkKykvaSxcbiAgICAgICAgLy8gUkZDIDI4MjIgcmVnZXg6IEZvciBkZXRhaWxzIHNlZSBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMjgyMiNzZWN0aW9uLTMuM1xuICAgICAgICByZmMyODIyID1cbiAgICAgICAgICAgIC9eKD86KE1vbnxUdWV8V2VkfFRodXxGcml8U2F0fFN1biksP1xccyk/KFxcZHsxLDJ9KVxccyhKYW58RmVifE1hcnxBcHJ8TWF5fEp1bnxKdWx8QXVnfFNlcHxPY3R8Tm92fERlYylcXHMoXFxkezIsNH0pXFxzKFxcZFxcZCk6KFxcZFxcZCkoPzo6KFxcZFxcZCkpP1xccyg/OihVVHxHTVR8W0VDTVBdW1NEXVQpfChbWnpdKXwoWystXVxcZHs0fSkpJC8sXG4gICAgICAgIG9ic09mZnNldHMgPSB7XG4gICAgICAgICAgICBVVDogMCxcbiAgICAgICAgICAgIEdNVDogMCxcbiAgICAgICAgICAgIEVEVDogLTQgKiA2MCxcbiAgICAgICAgICAgIEVTVDogLTUgKiA2MCxcbiAgICAgICAgICAgIENEVDogLTUgKiA2MCxcbiAgICAgICAgICAgIENTVDogLTYgKiA2MCxcbiAgICAgICAgICAgIE1EVDogLTYgKiA2MCxcbiAgICAgICAgICAgIE1TVDogLTcgKiA2MCxcbiAgICAgICAgICAgIFBEVDogLTcgKiA2MCxcbiAgICAgICAgICAgIFBTVDogLTggKiA2MCxcbiAgICAgICAgfTtcblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0XG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUlTTyhjb25maWcpIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBsLFxuICAgICAgICAgICAgc3RyaW5nID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgbWF0Y2ggPSBleHRlbmRlZElzb1JlZ2V4LmV4ZWMoc3RyaW5nKSB8fCBiYXNpY0lzb1JlZ2V4LmV4ZWMoc3RyaW5nKSxcbiAgICAgICAgICAgIGFsbG93VGltZSxcbiAgICAgICAgICAgIGRhdGVGb3JtYXQsXG4gICAgICAgICAgICB0aW1lRm9ybWF0LFxuICAgICAgICAgICAgdHpGb3JtYXQsXG4gICAgICAgICAgICBpc29EYXRlc0xlbiA9IGlzb0RhdGVzLmxlbmd0aCxcbiAgICAgICAgICAgIGlzb1RpbWVzTGVuID0gaXNvVGltZXMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaXNvID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29EYXRlc0xlbjsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29EYXRlc1tpXVsxXS5leGVjKG1hdGNoWzFdKSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRlRm9ybWF0ID0gaXNvRGF0ZXNbaV1bMF07XG4gICAgICAgICAgICAgICAgICAgIGFsbG93VGltZSA9IGlzb0RhdGVzW2ldWzJdICE9PSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRhdGVGb3JtYXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaFszXSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29UaW1lc0xlbjsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNvVGltZXNbaV1bMV0uZXhlYyhtYXRjaFszXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoWzJdIHNob3VsZCBiZSAnVCcgb3Igc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVGb3JtYXQgPSAobWF0Y2hbMl0gfHwgJyAnKSArIGlzb1RpbWVzW2ldWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVGb3JtYXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYWxsb3dUaW1lICYmIHRpbWVGb3JtYXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaFs0XSkge1xuICAgICAgICAgICAgICAgIGlmICh0elJlZ2V4LmV4ZWMobWF0Y2hbNF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHR6Rm9ybWF0ID0gJ1onO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uZmlnLl9mID0gZGF0ZUZvcm1hdCArICh0aW1lRm9ybWF0IHx8ICcnKSArICh0ekZvcm1hdCB8fCAnJyk7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dHJhY3RGcm9tUkZDMjgyMlN0cmluZ3MoXG4gICAgICAgIHllYXJTdHIsXG4gICAgICAgIG1vbnRoU3RyLFxuICAgICAgICBkYXlTdHIsXG4gICAgICAgIGhvdXJTdHIsXG4gICAgICAgIG1pbnV0ZVN0cixcbiAgICAgICAgc2Vjb25kU3RyXG4gICAgKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXG4gICAgICAgICAgICB1bnRydW5jYXRlWWVhcih5ZWFyU3RyKSxcbiAgICAgICAgICAgIGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydC5pbmRleE9mKG1vbnRoU3RyKSxcbiAgICAgICAgICAgIHBhcnNlSW50KGRheVN0ciwgMTApLFxuICAgICAgICAgICAgcGFyc2VJbnQoaG91clN0ciwgMTApLFxuICAgICAgICAgICAgcGFyc2VJbnQobWludXRlU3RyLCAxMCksXG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKHNlY29uZFN0cikge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VJbnQoc2Vjb25kU3RyLCAxMCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bnRydW5jYXRlWWVhcih5ZWFyU3RyKSB7XG4gICAgICAgIHZhciB5ZWFyID0gcGFyc2VJbnQoeWVhclN0ciwgMTApO1xuICAgICAgICBpZiAoeWVhciA8PSA0OSkge1xuICAgICAgICAgICAgcmV0dXJuIDIwMDAgKyB5ZWFyO1xuICAgICAgICB9IGVsc2UgaWYgKHllYXIgPD0gOTk5KSB7XG4gICAgICAgICAgICByZXR1cm4gMTkwMCArIHllYXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHllYXI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlcHJvY2Vzc1JGQzI4MjIocykge1xuICAgICAgICAvLyBSZW1vdmUgY29tbWVudHMgYW5kIGZvbGRpbmcgd2hpdGVzcGFjZSBhbmQgcmVwbGFjZSBtdWx0aXBsZS1zcGFjZXMgd2l0aCBhIHNpbmdsZSBzcGFjZVxuICAgICAgICByZXR1cm4gc1xuICAgICAgICAgICAgLnJlcGxhY2UoL1xcKFteKCldKlxcKXxbXFxuXFx0XS9nLCAnICcpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFxcc1xccyspL2csICcgJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9eXFxzXFxzKi8sICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcc1xccyokLywgJycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrV2Vla2RheSh3ZWVrZGF5U3RyLCBwYXJzZWRJbnB1dCwgY29uZmlnKSB7XG4gICAgICAgIGlmICh3ZWVrZGF5U3RyKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBSZXBsYWNlIHRoZSB2YW5pbGxhIEpTIERhdGUgb2JqZWN0IHdpdGggYW4gaW5kZXBlbmRlbnQgZGF5LW9mLXdlZWsgY2hlY2suXG4gICAgICAgICAgICB2YXIgd2Vla2RheVByb3ZpZGVkID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQuaW5kZXhPZih3ZWVrZGF5U3RyKSxcbiAgICAgICAgICAgICAgICB3ZWVrZGF5QWN0dWFsID0gbmV3IERhdGUoXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZElucHV0WzBdLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZWRJbnB1dFsxXSxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkSW5wdXRbMl1cbiAgICAgICAgICAgICAgICApLmdldERheSgpO1xuICAgICAgICAgICAgaWYgKHdlZWtkYXlQcm92aWRlZCAhPT0gd2Vla2RheUFjdHVhbCkge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLndlZWtkYXlNaXNtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZU9mZnNldChvYnNPZmZzZXQsIG1pbGl0YXJ5T2Zmc2V0LCBudW1PZmZzZXQpIHtcbiAgICAgICAgaWYgKG9ic09mZnNldCkge1xuICAgICAgICAgICAgcmV0dXJuIG9ic09mZnNldHNbb2JzT2Zmc2V0XTtcbiAgICAgICAgfSBlbHNlIGlmIChtaWxpdGFyeU9mZnNldCkge1xuICAgICAgICAgICAgLy8gdGhlIG9ubHkgYWxsb3dlZCBtaWxpdGFyeSB0eiBpcyBaXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBobSA9IHBhcnNlSW50KG51bU9mZnNldCwgMTApLFxuICAgICAgICAgICAgICAgIG0gPSBobSAlIDEwMCxcbiAgICAgICAgICAgICAgICBoID0gKGhtIC0gbSkgLyAxMDA7XG4gICAgICAgICAgICByZXR1cm4gaCAqIDYwICsgbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgYW5kIHRpbWUgZnJvbSByZWYgMjgyMiBmb3JtYXRcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tUkZDMjgyMihjb25maWcpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gcmZjMjgyMi5leGVjKHByZXByb2Nlc3NSRkMyODIyKGNvbmZpZy5faSkpLFxuICAgICAgICAgICAgcGFyc2VkQXJyYXk7XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgcGFyc2VkQXJyYXkgPSBleHRyYWN0RnJvbVJGQzI4MjJTdHJpbmdzKFxuICAgICAgICAgICAgICAgIG1hdGNoWzRdLFxuICAgICAgICAgICAgICAgIG1hdGNoWzNdLFxuICAgICAgICAgICAgICAgIG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgIG1hdGNoWzVdLFxuICAgICAgICAgICAgICAgIG1hdGNoWzZdLFxuICAgICAgICAgICAgICAgIG1hdGNoWzddXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFjaGVja1dlZWtkYXkobWF0Y2hbMV0sIHBhcnNlZEFycmF5LCBjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25maWcuX2EgPSBwYXJzZWRBcnJheTtcbiAgICAgICAgICAgIGNvbmZpZy5fdHptID0gY2FsY3VsYXRlT2Zmc2V0KG1hdGNoWzhdLCBtYXRjaFs5XSwgbWF0Y2hbMTBdKTtcblxuICAgICAgICAgICAgY29uZmlnLl9kID0gY3JlYXRlVVRDRGF0ZS5hcHBseShudWxsLCBjb25maWcuX2EpO1xuICAgICAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSAtIGNvbmZpZy5fdHptKTtcblxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykucmZjMjgyMiA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSAxKSBBU1AuTkVULCAyKSBJU08sIDMpIFJGQyAyODIyIGZvcm1hdHMsIG9yIDQpIG9wdGlvbmFsIGZhbGxiYWNrIGlmIHBhcnNpbmcgaXNuJ3Qgc3RyaWN0XG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZyhjb25maWcpIHtcbiAgICAgICAgdmFyIG1hdGNoZWQgPSBhc3BOZXRKc29uUmVnZXguZXhlYyhjb25maWcuX2kpO1xuICAgICAgICBpZiAobWF0Y2hlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK21hdGNoZWRbMV0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnRnJvbUlTTyhjb25maWcpO1xuICAgICAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZ0Zyb21SRkMyODIyKGNvbmZpZyk7XG4gICAgICAgIGlmIChjb25maWcuX2lzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkZWxldGUgY29uZmlnLl9pc1ZhbGlkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fc3RyaWN0KSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZpbmFsIGF0dGVtcHQsIHVzZSBJbnB1dCBGYWxsYmFja1xuICAgICAgICAgICAgaG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrID0gZGVwcmVjYXRlKFxuICAgICAgICAndmFsdWUgcHJvdmlkZWQgaXMgbm90IGluIGEgcmVjb2duaXplZCBSRkMyODIyIG9yIElTTyBmb3JtYXQuIG1vbWVudCBjb25zdHJ1Y3Rpb24gZmFsbHMgYmFjayB0byBqcyBEYXRlKCksICcgK1xuICAgICAgICAgICAgJ3doaWNoIGlzIG5vdCByZWxpYWJsZSBhY3Jvc3MgYWxsIGJyb3dzZXJzIGFuZCB2ZXJzaW9ucy4gTm9uIFJGQzI4MjIvSVNPIGRhdGUgZm9ybWF0cyBhcmUgJyArXG4gICAgICAgICAgICAnZGlzY291cmFnZWQuIFBsZWFzZSByZWZlciB0byBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL2pzLWRhdGUvIGZvciBtb3JlIGluZm8uJyxcbiAgICAgICAgZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoY29uZmlnLl9pICsgKGNvbmZpZy5fdXNlVVRDID8gJyBVVEMnIDogJycpKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBQaWNrIHRoZSBmaXJzdCBkZWZpbmVkIG9mIHR3byBvciB0aHJlZSBhcmd1bWVudHMuXG4gICAgZnVuY3Rpb24gZGVmYXVsdHMoYSwgYiwgYykge1xuICAgICAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYiAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZykge1xuICAgICAgICAvLyBob29rcyBpcyBhY3R1YWxseSB0aGUgZXhwb3J0ZWQgbW9tZW50IG9iamVjdFxuICAgICAgICB2YXIgbm93VmFsdWUgPSBuZXcgRGF0ZShob29rcy5ub3coKSk7XG4gICAgICAgIGlmIChjb25maWcuX3VzZVVUQykge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBub3dWYWx1ZS5nZXRVVENGdWxsWWVhcigpLFxuICAgICAgICAgICAgICAgIG5vd1ZhbHVlLmdldFVUQ01vbnRoKCksXG4gICAgICAgICAgICAgICAgbm93VmFsdWUuZ2V0VVRDRGF0ZSgpLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW25vd1ZhbHVlLmdldEZ1bGxZZWFyKCksIG5vd1ZhbHVlLmdldE1vbnRoKCksIG5vd1ZhbHVlLmdldERhdGUoKV07XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBhbiBhcnJheSB0byBhIGRhdGUuXG4gICAgLy8gdGhlIGFycmF5IHNob3VsZCBtaXJyb3IgdGhlIHBhcmFtZXRlcnMgYmVsb3dcbiAgICAvLyBub3RlOiBhbGwgdmFsdWVzIHBhc3QgdGhlIHllYXIgYXJlIG9wdGlvbmFsIGFuZCB3aWxsIGRlZmF1bHQgdG8gdGhlIGxvd2VzdCBwb3NzaWJsZSB2YWx1ZS5cbiAgICAvLyBbeWVhciwgbW9udGgsIGRheSAsIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaXNlY29uZF1cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgZGF0ZSxcbiAgICAgICAgICAgIGlucHV0ID0gW10sXG4gICAgICAgICAgICBjdXJyZW50RGF0ZSxcbiAgICAgICAgICAgIGV4cGVjdGVkV2Vla2RheSxcbiAgICAgICAgICAgIHllYXJUb1VzZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKTtcblxuICAgICAgICAvL2NvbXB1dGUgZGF5IG9mIHRoZSB5ZWFyIGZyb20gd2Vla3MgYW5kIHdlZWtkYXlzXG4gICAgICAgIGlmIChjb25maWcuX3cgJiYgY29uZmlnLl9hW0RBVEVdID09IG51bGwgJiYgY29uZmlnLl9hW01PTlRIXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgdGhlIGRheSBvZiB0aGUgeWVhciBpcyBzZXQsIGZpZ3VyZSBvdXQgd2hhdCBpdCBpc1xuICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgeWVhclRvVXNlID0gZGVmYXVsdHMoY29uZmlnLl9hW1lFQVJdLCBjdXJyZW50RGF0ZVtZRUFSXSk7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjb25maWcuX2RheU9mWWVhciA+IGRheXNJblllYXIoeWVhclRvVXNlKSB8fFxuICAgICAgICAgICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID09PSAwXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5fb3ZlcmZsb3dEYXlPZlllYXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRlID0gY3JlYXRlVVRDRGF0ZSh5ZWFyVG9Vc2UsIDAsIGNvbmZpZy5fZGF5T2ZZZWFyKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtNT05USF0gPSBkYXRlLmdldFVUQ01vbnRoKCk7XG4gICAgICAgICAgICBjb25maWcuX2FbREFURV0gPSBkYXRlLmdldFVUQ0RhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlZmF1bHQgdG8gY3VycmVudCBkYXRlLlxuICAgICAgICAvLyAqIGlmIG5vIHllYXIsIG1vbnRoLCBkYXkgb2YgbW9udGggYXJlIGdpdmVuLCBkZWZhdWx0IHRvIHRvZGF5XG4gICAgICAgIC8vICogaWYgZGF5IG9mIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG1vbnRoIGFuZCB5ZWFyXG4gICAgICAgIC8vICogaWYgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgb25seSB5ZWFyXG4gICAgICAgIC8vICogaWYgeWVhciBpcyBnaXZlbiwgZG9uJ3QgZGVmYXVsdCBhbnl0aGluZ1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMyAmJiBjb25maWcuX2FbaV0gPT0gbnVsbDsgKytpKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IGN1cnJlbnREYXRlW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gWmVybyBvdXQgd2hhdGV2ZXIgd2FzIG5vdCBkZWZhdWx0ZWQsIGluY2x1ZGluZyB0aW1lXG4gICAgICAgIGZvciAoOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9XG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW2ldID09IG51bGwgPyAoaSA9PT0gMiA/IDEgOiAwKSA6IGNvbmZpZy5fYVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGZvciAyNDowMDowMC4wMDBcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID09PSAyNCAmJlxuICAgICAgICAgICAgY29uZmlnLl9hW01JTlVURV0gPT09IDAgJiZcbiAgICAgICAgICAgIGNvbmZpZy5fYVtTRUNPTkRdID09PSAwICYmXG4gICAgICAgICAgICBjb25maWcuX2FbTUlMTElTRUNPTkRdID09PSAwXG4gICAgICAgICkge1xuICAgICAgICAgICAgY29uZmlnLl9uZXh0RGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2QgPSAoY29uZmlnLl91c2VVVEMgPyBjcmVhdGVVVENEYXRlIDogY3JlYXRlRGF0ZSkuYXBwbHkoXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgaW5wdXRcbiAgICAgICAgKTtcbiAgICAgICAgZXhwZWN0ZWRXZWVrZGF5ID0gY29uZmlnLl91c2VVVENcbiAgICAgICAgICAgID8gY29uZmlnLl9kLmdldFVUQ0RheSgpXG4gICAgICAgICAgICA6IGNvbmZpZy5fZC5nZXREYXkoKTtcblxuICAgICAgICAvLyBBcHBseSB0aW1lem9uZSBvZmZzZXQgZnJvbSBpbnB1dC4gVGhlIGFjdHVhbCB1dGNPZmZzZXQgY2FuIGJlIGNoYW5nZWRcbiAgICAgICAgLy8gd2l0aCBwYXJzZVpvbmUuXG4gICAgICAgIGlmIChjb25maWcuX3R6bSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2Quc2V0VVRDTWludXRlcyhjb25maWcuX2QuZ2V0VVRDTWludXRlcygpIC0gY29uZmlnLl90em0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fbmV4dERheSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMjQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBmb3IgbWlzbWF0Y2hpbmcgZGF5IG9mIHdlZWtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgY29uZmlnLl93ICYmXG4gICAgICAgICAgICB0eXBlb2YgY29uZmlnLl93LmQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICBjb25maWcuX3cuZCAhPT0gZXhwZWN0ZWRXZWVrZGF5XG4gICAgICAgICkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykud2Vla2RheU1pc21hdGNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpIHtcbiAgICAgICAgdmFyIHcsIHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSwgdGVtcCwgd2Vla2RheU92ZXJmbG93LCBjdXJXZWVrO1xuXG4gICAgICAgIHcgPSBjb25maWcuX3c7XG4gICAgICAgIGlmICh3LkdHICE9IG51bGwgfHwgdy5XICE9IG51bGwgfHwgdy5FICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRvdyA9IDE7XG4gICAgICAgICAgICBkb3kgPSA0O1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBXZSBuZWVkIHRvIHRha2UgdGhlIGN1cnJlbnQgaXNvV2Vla1llYXIsIGJ1dCB0aGF0IGRlcGVuZHMgb25cbiAgICAgICAgICAgIC8vIGhvdyB3ZSBpbnRlcnByZXQgbm93IChsb2NhbCwgdXRjLCBmaXhlZCBvZmZzZXQpLiBTbyBjcmVhdGVcbiAgICAgICAgICAgIC8vIGEgbm93IHZlcnNpb24gb2YgY3VycmVudCBjb25maWcgKHRha2UgbG9jYWwvdXRjL29mZnNldCBmbGFncywgYW5kXG4gICAgICAgICAgICAvLyBjcmVhdGUgbm93KS5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMoXG4gICAgICAgICAgICAgICAgdy5HRyxcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbWUVBUl0sXG4gICAgICAgICAgICAgICAgd2Vla09mWWVhcihjcmVhdGVMb2NhbCgpLCAxLCA0KS55ZWFyXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgd2VlayA9IGRlZmF1bHRzKHcuVywgMSk7XG4gICAgICAgICAgICB3ZWVrZGF5ID0gZGVmYXVsdHMody5FLCAxKTtcbiAgICAgICAgICAgIGlmICh3ZWVrZGF5IDwgMSB8fCB3ZWVrZGF5ID4gNykge1xuICAgICAgICAgICAgICAgIHdlZWtkYXlPdmVyZmxvdyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb3cgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3c7XG4gICAgICAgICAgICBkb3kgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3k7XG5cbiAgICAgICAgICAgIGN1cldlZWsgPSB3ZWVrT2ZZZWFyKGNyZWF0ZUxvY2FsKCksIGRvdywgZG95KTtcblxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZWZhdWx0cyh3LmdnLCBjb25maWcuX2FbWUVBUl0sIGN1cldlZWsueWVhcik7XG5cbiAgICAgICAgICAgIC8vIERlZmF1bHQgdG8gY3VycmVudCB3ZWVrLlxuICAgICAgICAgICAgd2VlayA9IGRlZmF1bHRzKHcudywgY3VyV2Vlay53ZWVrKTtcblxuICAgICAgICAgICAgaWYgKHcuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gd2Vla2RheSAtLSBsb3cgZGF5IG51bWJlcnMgYXJlIGNvbnNpZGVyZWQgbmV4dCB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IHcuZDtcbiAgICAgICAgICAgICAgICBpZiAod2Vla2RheSA8IDAgfHwgd2Vla2RheSA+IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgd2Vla2RheU92ZXJmbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHcuZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9jYWwgd2Vla2RheSAtLSBjb3VudGluZyBzdGFydHMgZnJvbSBiZWdpbm5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmUgKyBkb3c7XG4gICAgICAgICAgICAgICAgaWYgKHcuZSA8IDAgfHwgdy5lID4gNikge1xuICAgICAgICAgICAgICAgICAgICB3ZWVrZGF5T3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBiZWdpbm5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSBkb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdlZWsgPCAxIHx8IHdlZWsgPiB3ZWVrc0luWWVhcih3ZWVrWWVhciwgZG93LCBkb3kpKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5fb3ZlcmZsb3dXZWVrcyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAod2Vla2RheU92ZXJmbG93ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLl9vdmVyZmxvd1dlZWtkYXkgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVtcCA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpO1xuICAgICAgICAgICAgY29uZmlnLl9hW1lFQVJdID0gdGVtcC55ZWFyO1xuICAgICAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0ZW1wLmRheU9mWWVhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnN0YW50IHRoYXQgcmVmZXJzIHRvIHRoZSBJU08gc3RhbmRhcmRcbiAgICBob29rcy5JU09fODYwMSA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gY29uc3RhbnQgdGhhdCByZWZlcnMgdG8gdGhlIFJGQyAyODIyIGZvcm1cbiAgICBob29rcy5SRkNfMjgyMiA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgZm9ybWF0IHN0cmluZ1xuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKSB7XG4gICAgICAgIC8vIFRPRE86IE1vdmUgdGhpcyB0byBhbm90aGVyIHBhcnQgb2YgdGhlIGNyZWF0aW9uIGZsb3cgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzXG4gICAgICAgIGlmIChjb25maWcuX2YgPT09IGhvb2tzLklTT184NjAxKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmZpZy5fZiA9PT0gaG9va3MuUkZDXzI4MjIpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21SRkMyODIyKGNvbmZpZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uZmlnLl9hID0gW107XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gdHJ1ZTtcblxuICAgICAgICAvLyBUaGlzIGFycmF5IGlzIHVzZWQgdG8gbWFrZSBhIERhdGUsIGVpdGhlciB3aXRoIGBuZXcgRGF0ZWAgb3IgYERhdGUuVVRDYFxuICAgICAgICB2YXIgc3RyaW5nID0gJycgKyBjb25maWcuX2ksXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgcGFyc2VkSW5wdXQsXG4gICAgICAgICAgICB0b2tlbnMsXG4gICAgICAgICAgICB0b2tlbixcbiAgICAgICAgICAgIHNraXBwZWQsXG4gICAgICAgICAgICBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCA9IDAsXG4gICAgICAgICAgICBlcmEsXG4gICAgICAgICAgICB0b2tlbkxlbjtcblxuICAgICAgICB0b2tlbnMgPVxuICAgICAgICAgICAgZXhwYW5kRm9ybWF0KGNvbmZpZy5fZiwgY29uZmlnLl9sb2NhbGUpLm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpIHx8IFtdO1xuICAgICAgICB0b2tlbkxlbiA9IHRva2Vucy5sZW5ndGg7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbkxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgIHBhcnNlZElucHV0ID0gKHN0cmluZy5tYXRjaChnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykpIHx8XG4gICAgICAgICAgICAgICAgW10pWzBdO1xuICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgc2tpcHBlZCA9IHN0cmluZy5zdWJzdHIoMCwgc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpKTtcbiAgICAgICAgICAgICAgICBpZiAoc2tpcHBlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZElucHV0LnB1c2goc2tpcHBlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5zbGljZShcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpICsgcGFyc2VkSW5wdXQubGVuZ3RoXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoICs9IHBhcnNlZElucHV0Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRvbid0IHBhcnNlIGlmIGl0J3Mgbm90IGEga25vd24gdG9rZW5cbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBwYXJzZWRJbnB1dCwgY29uZmlnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLl9zdHJpY3QgJiYgIXBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHJlbWFpbmluZyB1bnBhcnNlZCBpbnB1dCBsZW5ndGggdG8gdGhlIHN0cmluZ1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5jaGFyc0xlZnRPdmVyID1cbiAgICAgICAgICAgIHN0cmluZ0xlbmd0aCAtIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGg7XG4gICAgICAgIGlmIChzdHJpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkSW5wdXQucHVzaChzdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2xlYXIgXzEyaCBmbGFnIGlmIGhvdXIgaXMgPD0gMTJcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdIDw9IDEyICYmXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID09PSB0cnVlICYmXG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPiAwXG4gICAgICAgICkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnBhcnNlZERhdGVQYXJ0cyA9IGNvbmZpZy5fYS5zbGljZSgwKTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykubWVyaWRpZW0gPSBjb25maWcuX21lcmlkaWVtO1xuICAgICAgICAvLyBoYW5kbGUgbWVyaWRpZW1cbiAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gbWVyaWRpZW1GaXhXcmFwKFxuICAgICAgICAgICAgY29uZmlnLl9sb2NhbGUsXG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0sXG4gICAgICAgICAgICBjb25maWcuX21lcmlkaWVtXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gaGFuZGxlIGVyYVxuICAgICAgICBlcmEgPSBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5lcmE7XG4gICAgICAgIGlmIChlcmEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtZRUFSXSA9IGNvbmZpZy5fbG9jYWxlLmVyYXNDb252ZXJ0WWVhcihlcmEsIGNvbmZpZy5fYVtZRUFSXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICAgICAgY2hlY2tPdmVyZmxvdyhjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lcmlkaWVtRml4V3JhcChsb2NhbGUsIGhvdXIsIG1lcmlkaWVtKSB7XG4gICAgICAgIHZhciBpc1BtO1xuXG4gICAgICAgIGlmIChtZXJpZGllbSA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBub3RoaW5nIHRvIGRvXG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlLm1lcmlkaWVtSG91ciAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLm1lcmlkaWVtSG91cihob3VyLCBtZXJpZGllbSk7XG4gICAgICAgIH0gZWxzZSBpZiAobG9jYWxlLmlzUE0gIT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gRmFsbGJhY2tcbiAgICAgICAgICAgIGlzUG0gPSBsb2NhbGUuaXNQTShtZXJpZGllbSk7XG4gICAgICAgICAgICBpZiAoaXNQbSAmJiBob3VyIDwgMTIpIHtcbiAgICAgICAgICAgICAgICBob3VyICs9IDEyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1BtICYmIGhvdXIgPT09IDEyKSB7XG4gICAgICAgICAgICAgICAgaG91ciA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgbm90IHN1cHBvc2VkIHRvIGhhcHBlblxuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBhcnJheSBvZiBmb3JtYXQgc3RyaW5nc1xuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmdBbmRBcnJheShjb25maWcpIHtcbiAgICAgICAgdmFyIHRlbXBDb25maWcsXG4gICAgICAgICAgICBiZXN0TW9tZW50LFxuICAgICAgICAgICAgc2NvcmVUb0JlYXQsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgY3VycmVudFNjb3JlLFxuICAgICAgICAgICAgdmFsaWRGb3JtYXRGb3VuZCxcbiAgICAgICAgICAgIGJlc3RGb3JtYXRJc1ZhbGlkID0gZmFsc2UsXG4gICAgICAgICAgICBjb25maWdmTGVuID0gY29uZmlnLl9mLmxlbmd0aDtcblxuICAgICAgICBpZiAoY29uZmlnZkxlbiA9PT0gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZEZvcm1hdCA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbmZpZ2ZMZW47IGkrKykge1xuICAgICAgICAgICAgY3VycmVudFNjb3JlID0gMDtcbiAgICAgICAgICAgIHZhbGlkRm9ybWF0Rm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRlbXBDb25maWcgPSBjb3B5Q29uZmlnKHt9LCBjb25maWcpO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wQ29uZmlnLl91c2VVVEMgPSBjb25maWcuX3VzZVVUQztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBDb25maWcuX2YgPSBjb25maWcuX2ZbaV07XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KHRlbXBDb25maWcpO1xuXG4gICAgICAgICAgICBpZiAoaXNWYWxpZCh0ZW1wQ29uZmlnKSkge1xuICAgICAgICAgICAgICAgIHZhbGlkRm9ybWF0Rm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhbnkgaW5wdXQgdGhhdCB3YXMgbm90IHBhcnNlZCBhZGQgYSBwZW5hbHR5IGZvciB0aGF0IGZvcm1hdFxuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS5jaGFyc0xlZnRPdmVyO1xuXG4gICAgICAgICAgICAvL29yIHRva2Vuc1xuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS51bnVzZWRUb2tlbnMubGVuZ3RoICogMTA7XG5cbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS5zY29yZSA9IGN1cnJlbnRTY29yZTtcblxuICAgICAgICAgICAgaWYgKCFiZXN0Rm9ybWF0SXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgc2NvcmVUb0JlYXQgPT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NvcmUgPCBzY29yZVRvQmVhdCB8fFxuICAgICAgICAgICAgICAgICAgICB2YWxpZEZvcm1hdEZvdW5kXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3JlVG9CZWF0ID0gY3VycmVudFNjb3JlO1xuICAgICAgICAgICAgICAgICAgICBiZXN0TW9tZW50ID0gdGVtcENvbmZpZztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkRm9ybWF0Rm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlc3RGb3JtYXRJc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTY29yZSA8IHNjb3JlVG9CZWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3JlVG9CZWF0ID0gY3VycmVudFNjb3JlO1xuICAgICAgICAgICAgICAgICAgICBiZXN0TW9tZW50ID0gdGVtcENvbmZpZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHRlbmQoY29uZmlnLCBiZXN0TW9tZW50IHx8IHRlbXBDb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoY29uZmlnLl9pKSxcbiAgICAgICAgICAgIGRheU9yRGF0ZSA9IGkuZGF5ID09PSB1bmRlZmluZWQgPyBpLmRhdGUgOiBpLmRheTtcbiAgICAgICAgY29uZmlnLl9hID0gbWFwKFxuICAgICAgICAgICAgW2kueWVhciwgaS5tb250aCwgZGF5T3JEYXRlLCBpLmhvdXIsIGkubWludXRlLCBpLnNlY29uZCwgaS5taWxsaXNlY29uZF0sXG4gICAgICAgICAgICBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iaiAmJiBwYXJzZUludChvYmosIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVGcm9tQ29uZmlnKGNvbmZpZykge1xuICAgICAgICB2YXIgcmVzID0gbmV3IE1vbWVudChjaGVja092ZXJmbG93KHByZXBhcmVDb25maWcoY29uZmlnKSkpO1xuICAgICAgICBpZiAocmVzLl9uZXh0RGF5KSB7XG4gICAgICAgICAgICAvLyBBZGRpbmcgaXMgc21hcnQgZW5vdWdoIGFyb3VuZCBEU1RcbiAgICAgICAgICAgIHJlcy5hZGQoMSwgJ2QnKTtcbiAgICAgICAgICAgIHJlcy5fbmV4dERheSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlcGFyZUNvbmZpZyhjb25maWcpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgZm9ybWF0ID0gY29uZmlnLl9mO1xuXG4gICAgICAgIGNvbmZpZy5fbG9jYWxlID0gY29uZmlnLl9sb2NhbGUgfHwgZ2V0TG9jYWxlKGNvbmZpZy5fbCk7XG5cbiAgICAgICAgaWYgKGlucHV0ID09PSBudWxsIHx8IChmb3JtYXQgPT09IHVuZGVmaW5lZCAmJiBpbnB1dCA9PT0gJycpKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlSW52YWxpZCh7IG51bGxJbnB1dDogdHJ1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25maWcuX2kgPSBpbnB1dCA9IGNvbmZpZy5fbG9jYWxlLnByZXBhcnNlKGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc01vbWVudChpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9tZW50KGNoZWNrT3ZlcmZsb3coaW5wdXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBpbnB1dDtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRBcnJheShjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCkge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnRnJvbUlucHV0KGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzVmFsaWQoY29uZmlnKSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUlucHV0KGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2k7XG4gICAgICAgIGlmIChpc1VuZGVmaW5lZChpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGhvb2tzLm5vdygpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dC52YWx1ZU9mKCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9hID0gbWFwKGlucHV0LnNsaWNlKDApLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcihpbnB1dCkpIHtcbiAgICAgICAgICAgIC8vIGZyb20gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgaXNVVEMpIHtcbiAgICAgICAgdmFyIGMgPSB7fTtcblxuICAgICAgICBpZiAoZm9ybWF0ID09PSB0cnVlIHx8IGZvcm1hdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHN0cmljdCA9IGZvcm1hdDtcbiAgICAgICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsb2NhbGUgPT09IHRydWUgfHwgbG9jYWxlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgc3RyaWN0ID0gbG9jYWxlO1xuICAgICAgICAgICAgbG9jYWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKGlzT2JqZWN0KGlucHV0KSAmJiBpc09iamVjdEVtcHR5KGlucHV0KSkgfHxcbiAgICAgICAgICAgIChpc0FycmF5KGlucHV0KSAmJiBpbnB1dC5sZW5ndGggPT09IDApXG4gICAgICAgICkge1xuICAgICAgICAgICAgaW5wdXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb2JqZWN0IGNvbnN0cnVjdGlvbiBtdXN0IGJlIGRvbmUgdGhpcyB3YXkuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDIzXG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX3VzZVVUQyA9IGMuX2lzVVRDID0gaXNVVEM7XG4gICAgICAgIGMuX2wgPSBsb2NhbGU7XG4gICAgICAgIGMuX2kgPSBpbnB1dDtcbiAgICAgICAgYy5fZiA9IGZvcm1hdDtcbiAgICAgICAgYy5fc3RyaWN0ID0gc3RyaWN0O1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVGcm9tQ29uZmlnKGMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxvY2FsKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvdHlwZU1pbiA9IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICdtb21lbnQoKS5taW4gaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5tYXggaW5zdGVhZC4gaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9taW4tbWF4LycsXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkgJiYgb3RoZXIuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdGhlciA8IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUludmFsaWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICksXG4gICAgICAgIHByb3RvdHlwZU1heCA9IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICdtb21lbnQoKS5tYXggaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5taW4gaW5zdGVhZC4gaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9taW4tbWF4LycsXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkgJiYgb3RoZXIuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdGhlciA+IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUludmFsaWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAvLyBQaWNrIGEgbW9tZW50IG0gZnJvbSBtb21lbnRzIHNvIHRoYXQgbVtmbl0ob3RoZXIpIGlzIHRydWUgZm9yIGFsbFxuICAgIC8vIG90aGVyLiBUaGlzIHJlbGllcyBvbiB0aGUgZnVuY3Rpb24gZm4gdG8gYmUgdHJhbnNpdGl2ZS5cbiAgICAvL1xuICAgIC8vIG1vbWVudHMgc2hvdWxkIGVpdGhlciBiZSBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cyBvciBhbiBhcnJheSwgd2hvc2VcbiAgICAvLyBmaXJzdCBlbGVtZW50IGlzIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzLlxuICAgIGZ1bmN0aW9uIHBpY2tCeShmbiwgbW9tZW50cykge1xuICAgICAgICB2YXIgcmVzLCBpO1xuICAgICAgICBpZiAobW9tZW50cy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShtb21lbnRzWzBdKSkge1xuICAgICAgICAgICAgbW9tZW50cyA9IG1vbWVudHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtb21lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gbW9tZW50c1swXTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IG1vbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmICghbW9tZW50c1tpXS5pc1ZhbGlkKCkgfHwgbW9tZW50c1tpXVtmbl0ocmVzKSkge1xuICAgICAgICAgICAgICAgIHJlcyA9IG1vbWVudHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBVc2UgW10uc29ydCBpbnN0ZWFkP1xuICAgIGZ1bmN0aW9uIG1pbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgcmV0dXJuIHBpY2tCeSgnaXNCZWZvcmUnLCBhcmdzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXgoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQWZ0ZXInLCBhcmdzKTtcbiAgICB9XG5cbiAgICB2YXIgbm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3cgPyBEYXRlLm5vdygpIDogK25ldyBEYXRlKCk7XG4gICAgfTtcblxuICAgIHZhciBvcmRlcmluZyA9IFtcbiAgICAgICAgJ3llYXInLFxuICAgICAgICAncXVhcnRlcicsXG4gICAgICAgICdtb250aCcsXG4gICAgICAgICd3ZWVrJyxcbiAgICAgICAgJ2RheScsXG4gICAgICAgICdob3VyJyxcbiAgICAgICAgJ21pbnV0ZScsXG4gICAgICAgICdzZWNvbmQnLFxuICAgICAgICAnbWlsbGlzZWNvbmQnLFxuICAgIF07XG5cbiAgICBmdW5jdGlvbiBpc0R1cmF0aW9uVmFsaWQobSkge1xuICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgdW5pdEhhc0RlY2ltYWwgPSBmYWxzZSxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBvcmRlckxlbiA9IG9yZGVyaW5nLmxlbmd0aDtcbiAgICAgICAgZm9yIChrZXkgaW4gbSkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGhhc093blByb3AobSwga2V5KSAmJlxuICAgICAgICAgICAgICAgICEoXG4gICAgICAgICAgICAgICAgICAgIGluZGV4T2YuY2FsbChvcmRlcmluZywga2V5KSAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgKG1ba2V5XSA9PSBudWxsIHx8ICFpc05hTihtW2tleV0pKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcmRlckxlbjsgKytpKSB7XG4gICAgICAgICAgICBpZiAobVtvcmRlcmluZ1tpXV0pIHtcbiAgICAgICAgICAgICAgICBpZiAodW5pdEhhc0RlY2ltYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBvbmx5IGFsbG93IG5vbi1pbnRlZ2VycyBmb3Igc21hbGxlc3QgdW5pdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdChtW29yZGVyaW5nW2ldXSkgIT09IHRvSW50KG1bb3JkZXJpbmdbaV1dKSkge1xuICAgICAgICAgICAgICAgICAgICB1bml0SGFzRGVjaW1hbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZCQxKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNWYWxpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVJbnZhbGlkJDEoKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVEdXJhdGlvbihOYU4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIER1cmF0aW9uKGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSBub3JtYWxpemVPYmplY3RVbml0cyhkdXJhdGlvbiksXG4gICAgICAgICAgICB5ZWFycyA9IG5vcm1hbGl6ZWRJbnB1dC55ZWFyIHx8IDAsXG4gICAgICAgICAgICBxdWFydGVycyA9IG5vcm1hbGl6ZWRJbnB1dC5xdWFydGVyIHx8IDAsXG4gICAgICAgICAgICBtb250aHMgPSBub3JtYWxpemVkSW5wdXQubW9udGggfHwgMCxcbiAgICAgICAgICAgIHdlZWtzID0gbm9ybWFsaXplZElucHV0LndlZWsgfHwgbm9ybWFsaXplZElucHV0Lmlzb1dlZWsgfHwgMCxcbiAgICAgICAgICAgIGRheXMgPSBub3JtYWxpemVkSW5wdXQuZGF5IHx8IDAsXG4gICAgICAgICAgICBob3VycyA9IG5vcm1hbGl6ZWRJbnB1dC5ob3VyIHx8IDAsXG4gICAgICAgICAgICBtaW51dGVzID0gbm9ybWFsaXplZElucHV0Lm1pbnV0ZSB8fCAwLFxuICAgICAgICAgICAgc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQgfHwgMCxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5taWxsaXNlY29uZCB8fCAwO1xuXG4gICAgICAgIHRoaXMuX2lzVmFsaWQgPSBpc0R1cmF0aW9uVmFsaWQobm9ybWFsaXplZElucHV0KTtcblxuICAgICAgICAvLyByZXByZXNlbnRhdGlvbiBmb3IgZGF0ZUFkZFJlbW92ZVxuICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgPVxuICAgICAgICAgICAgK21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICBzZWNvbmRzICogMWUzICsgLy8gMTAwMFxuICAgICAgICAgICAgbWludXRlcyAqIDZlNCArIC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgaG91cnMgKiAxMDAwICogNjAgKiA2MDsgLy91c2luZyAxMDAwICogNjAgKiA2MCBpbnN0ZWFkIG9mIDM2ZTUgdG8gYXZvaWQgZmxvYXRpbmcgcG9pbnQgcm91bmRpbmcgZXJyb3JzIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8yOTc4XG4gICAgICAgIC8vIEJlY2F1c2Ugb2YgZGF0ZUFkZFJlbW92ZSB0cmVhdHMgMjQgaG91cnMgYXMgZGlmZmVyZW50IGZyb20gYVxuICAgICAgICAvLyBkYXkgd2hlbiB3b3JraW5nIGFyb3VuZCBEU1QsIHdlIG5lZWQgdG8gc3RvcmUgdGhlbSBzZXBhcmF0ZWx5XG4gICAgICAgIHRoaXMuX2RheXMgPSArZGF5cyArIHdlZWtzICogNztcbiAgICAgICAgLy8gSXQgaXMgaW1wb3NzaWJsZSB0byB0cmFuc2xhdGUgbW9udGhzIGludG8gZGF5cyB3aXRob3V0IGtub3dpbmdcbiAgICAgICAgLy8gd2hpY2ggbW9udGhzIHlvdSBhcmUgYXJlIHRhbGtpbmcgYWJvdXQsIHNvIHdlIGhhdmUgdG8gc3RvcmVcbiAgICAgICAgLy8gaXQgc2VwYXJhdGVseS5cbiAgICAgICAgdGhpcy5fbW9udGhzID0gK21vbnRocyArIHF1YXJ0ZXJzICogMyArIHllYXJzICogMTI7XG5cbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuXG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IGdldExvY2FsZSgpO1xuXG4gICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRHVyYXRpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEdXJhdGlvbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNSb3VuZChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKC0xICogbnVtYmVyKSAqIC0xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQobnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbXBhcmUgdHdvIGFycmF5cywgcmV0dXJuIHRoZSBudW1iZXIgb2YgZGlmZmVyZW5jZXNcbiAgICBmdW5jdGlvbiBjb21wYXJlQXJyYXlzKGFycmF5MSwgYXJyYXkyLCBkb250Q29udmVydCkge1xuICAgICAgICB2YXIgbGVuID0gTWF0aC5taW4oYXJyYXkxLmxlbmd0aCwgYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBsZW5ndGhEaWZmID0gTWF0aC5hYnMoYXJyYXkxLmxlbmd0aCAtIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgZGlmZnMgPSAwLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKGRvbnRDb252ZXJ0ICYmIGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB8fFxuICAgICAgICAgICAgICAgICghZG9udENvbnZlcnQgJiYgdG9JbnQoYXJyYXkxW2ldKSAhPT0gdG9JbnQoYXJyYXkyW2ldKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGRpZmZzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpZmZzICsgbGVuZ3RoRGlmZjtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBmdW5jdGlvbiBvZmZzZXQodG9rZW4sIHNlcGFyYXRvcikge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbih0b2tlbiwgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudXRjT2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgc2lnbiA9ICcrJztcbiAgICAgICAgICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gLW9mZnNldDtcbiAgICAgICAgICAgICAgICBzaWduID0gJy0nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICBzaWduICtcbiAgICAgICAgICAgICAgICB6ZXJvRmlsbCh+fihvZmZzZXQgLyA2MCksIDIpICtcbiAgICAgICAgICAgICAgICBzZXBhcmF0b3IgK1xuICAgICAgICAgICAgICAgIHplcm9GaWxsKH5+b2Zmc2V0ICUgNjAsIDIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvZmZzZXQoJ1onLCAnOicpO1xuICAgIG9mZnNldCgnWlonLCAnJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdaJywgbWF0Y2hTaG9ydE9mZnNldCk7XG4gICAgYWRkUmVnZXhUb2tlbignWlonLCBtYXRjaFNob3J0T2Zmc2V0KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnWicsICdaWiddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl91c2VVVEMgPSB0cnVlO1xuICAgICAgICBjb25maWcuX3R6bSA9IG9mZnNldEZyb21TdHJpbmcobWF0Y2hTaG9ydE9mZnNldCwgaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gdGltZXpvbmUgY2h1bmtlclxuICAgIC8vICcrMTA6MDAnID4gWycxMCcsICAnMDAnXVxuICAgIC8vICctMTUzMCcgID4gWyctMTUnLCAnMzAnXVxuICAgIHZhciBjaHVua09mZnNldCA9IC8oW1xcK1xcLV18XFxkXFxkKS9naTtcblxuICAgIGZ1bmN0aW9uIG9mZnNldEZyb21TdHJpbmcobWF0Y2hlciwgc3RyaW5nKSB7XG4gICAgICAgIHZhciBtYXRjaGVzID0gKHN0cmluZyB8fCAnJykubWF0Y2gobWF0Y2hlciksXG4gICAgICAgICAgICBjaHVuayxcbiAgICAgICAgICAgIHBhcnRzLFxuICAgICAgICAgICAgbWludXRlcztcblxuICAgICAgICBpZiAobWF0Y2hlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjaHVuayA9IG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAxXSB8fCBbXTtcbiAgICAgICAgcGFydHMgPSAoY2h1bmsgKyAnJykubWF0Y2goY2h1bmtPZmZzZXQpIHx8IFsnLScsIDAsIDBdO1xuICAgICAgICBtaW51dGVzID0gKyhwYXJ0c1sxXSAqIDYwKSArIHRvSW50KHBhcnRzWzJdKTtcblxuICAgICAgICByZXR1cm4gbWludXRlcyA9PT0gMCA/IDAgOiBwYXJ0c1swXSA9PT0gJysnID8gbWludXRlcyA6IC1taW51dGVzO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhIG1vbWVudCBmcm9tIGlucHV0LCB0aGF0IGlzIGxvY2FsL3V0Yy96b25lIGVxdWl2YWxlbnQgdG8gbW9kZWwuXG4gICAgZnVuY3Rpb24gY2xvbmVXaXRoT2Zmc2V0KGlucHV0LCBtb2RlbCkge1xuICAgICAgICB2YXIgcmVzLCBkaWZmO1xuICAgICAgICBpZiAobW9kZWwuX2lzVVRDKSB7XG4gICAgICAgICAgICByZXMgPSBtb2RlbC5jbG9uZSgpO1xuICAgICAgICAgICAgZGlmZiA9XG4gICAgICAgICAgICAgICAgKGlzTW9tZW50KGlucHV0KSB8fCBpc0RhdGUoaW5wdXQpXG4gICAgICAgICAgICAgICAgICAgID8gaW5wdXQudmFsdWVPZigpXG4gICAgICAgICAgICAgICAgICAgIDogY3JlYXRlTG9jYWwoaW5wdXQpLnZhbHVlT2YoKSkgLSByZXMudmFsdWVPZigpO1xuICAgICAgICAgICAgLy8gVXNlIGxvdy1sZXZlbCBhcGksIGJlY2F1c2UgdGhpcyBmbiBpcyBsb3ctbGV2ZWwgYXBpLlxuICAgICAgICAgICAgcmVzLl9kLnNldFRpbWUocmVzLl9kLnZhbHVlT2YoKSArIGRpZmYpO1xuICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHJlcywgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVMb2NhbChpbnB1dCkubG9jYWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERhdGVPZmZzZXQobSkge1xuICAgICAgICAvLyBPbiBGaXJlZm94LjI0IERhdGUjZ2V0VGltZXpvbmVPZmZzZXQgcmV0dXJucyBhIGZsb2F0aW5nIHBvaW50LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9wdWxsLzE4NzFcbiAgICAgICAgcmV0dXJuIC1NYXRoLnJvdW5kKG0uX2QuZ2V0VGltZXpvbmVPZmZzZXQoKSk7XG4gICAgfVxuXG4gICAgLy8gSE9PS1NcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXIgYSBtb21lbnQgaXMgbXV0YXRlZC5cbiAgICAvLyBJdCBpcyBpbnRlbmRlZCB0byBrZWVwIHRoZSBvZmZzZXQgaW4gc3luYyB3aXRoIHRoZSB0aW1lem9uZS5cbiAgICBob29rcy51cGRhdGVPZmZzZXQgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIC8vIGtlZXBMb2NhbFRpbWUgPSB0cnVlIG1lYW5zIG9ubHkgY2hhbmdlIHRoZSB0aW1lem9uZSwgd2l0aG91dFxuICAgIC8vIGFmZmVjdGluZyB0aGUgbG9jYWwgaG91ci4gU28gNTozMToyNiArMDMwMCAtLVt1dGNPZmZzZXQoMiwgdHJ1ZSldLS0+XG4gICAgLy8gNTozMToyNiArMDIwMCBJdCBpcyBwb3NzaWJsZSB0aGF0IDU6MzE6MjYgZG9lc24ndCBleGlzdCB3aXRoIG9mZnNldFxuICAgIC8vICswMjAwLCBzbyB3ZSBhZGp1c3QgdGhlIHRpbWUgYXMgbmVlZGVkLCB0byBiZSB2YWxpZC5cbiAgICAvL1xuICAgIC8vIEtlZXBpbmcgdGhlIHRpbWUgYWN0dWFsbHkgYWRkcy9zdWJ0cmFjdHMgKG9uZSBob3VyKVxuICAgIC8vIGZyb20gdGhlIGFjdHVhbCByZXByZXNlbnRlZCB0aW1lLiBUaGF0IGlzIHdoeSB3ZSBjYWxsIHVwZGF0ZU9mZnNldFxuICAgIC8vIGEgc2Vjb25kIHRpbWUuIEluIGNhc2UgaXQgd2FudHMgdXMgdG8gY2hhbmdlIHRoZSBvZmZzZXQgYWdhaW5cbiAgICAvLyBfY2hhbmdlSW5Qcm9ncmVzcyA9PSB0cnVlIGNhc2UsIHRoZW4gd2UgaGF2ZSB0byBhZGp1c3QsIGJlY2F1c2VcbiAgICAvLyB0aGVyZSBpcyBubyBzdWNoIHRpbWUgaW4gdGhlIGdpdmVuIHRpbWV6b25lLlxuICAgIGZ1bmN0aW9uIGdldFNldE9mZnNldChpbnB1dCwga2VlcExvY2FsVGltZSwga2VlcE1pbnV0ZXMpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuX29mZnNldCB8fCAwLFxuICAgICAgICAgICAgbG9jYWxBZGp1c3Q7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG9mZnNldEZyb21TdHJpbmcobWF0Y2hTaG9ydE9mZnNldCwgaW5wdXQpO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGlucHV0KSA8IDE2ICYmICFrZWVwTWludXRlcykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQgKiA2MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5faXNVVEMgJiYga2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgIGxvY2FsQWRqdXN0ID0gZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IGlucHV0O1xuICAgICAgICAgICAgdGhpcy5faXNVVEMgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGxvY2FsQWRqdXN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZChsb2NhbEFkanVzdCwgJ20nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvZmZzZXQgIT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFrZWVwTG9jYWxUaW1lIHx8IHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkU3VidHJhY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlRHVyYXRpb24oaW5wdXQgLSBvZmZzZXQsICdtJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gb2Zmc2V0IDogZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldFpvbmUoaW5wdXQsIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSAtaW5wdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KGlucHV0LCBrZWVwTG9jYWxUaW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gLXRoaXMudXRjT2Zmc2V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb1VUQyhrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnV0Y09mZnNldCgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb0xvY2FsKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzVVRDKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJ0cmFjdChnZXREYXRlT2Zmc2V0KHRoaXMpLCAnbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0KCkge1xuICAgICAgICBpZiAodGhpcy5fdHptICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KHRoaXMuX3R6bSwgZmFsc2UsIHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLl9pID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFyIHRab25lID0gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaE9mZnNldCwgdGhpcy5faSk7XG4gICAgICAgICAgICBpZiAodFpvbmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KHRab25lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoMCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzQWxpZ25lZEhvdXJPZmZzZXQoaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0ID0gaW5wdXQgPyBjcmVhdGVMb2NhbChpbnB1dCkudXRjT2Zmc2V0KCkgOiAwO1xuXG4gICAgICAgIHJldHVybiAodGhpcy51dGNPZmZzZXQoKSAtIGlucHV0KSAlIDYwID09PSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoKSA+IHRoaXMuY2xvbmUoKS5tb250aCgwKS51dGNPZmZzZXQoKSB8fFxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoKSA+IHRoaXMuY2xvbmUoKS5tb250aCg1KS51dGNPZmZzZXQoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lU2hpZnRlZCgpIHtcbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9pc0RTVFNoaWZ0ZWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNEU1RTaGlmdGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGMgPSB7fSxcbiAgICAgICAgICAgIG90aGVyO1xuXG4gICAgICAgIGNvcHlDb25maWcoYywgdGhpcyk7XG4gICAgICAgIGMgPSBwcmVwYXJlQ29uZmlnKGMpO1xuXG4gICAgICAgIGlmIChjLl9hKSB7XG4gICAgICAgICAgICBvdGhlciA9IGMuX2lzVVRDID8gY3JlYXRlVVRDKGMuX2EpIDogY3JlYXRlTG9jYWwoYy5fYSk7XG4gICAgICAgICAgICB0aGlzLl9pc0RTVFNoaWZ0ZWQgPVxuICAgICAgICAgICAgICAgIHRoaXMuaXNWYWxpZCgpICYmIGNvbXBhcmVBcnJheXMoYy5fYSwgb3RoZXIudG9BcnJheSgpKSA+IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pc0RTVFNoaWZ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0RTVFNoaWZ0ZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMb2NhbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gIXRoaXMuX2lzVVRDIDogZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVdGNPZmZzZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMuX2lzVVRDIDogZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVdGMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMuX2lzVVRDICYmIHRoaXMuX29mZnNldCA9PT0gMCA6IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEFTUC5ORVQganNvbiBkYXRlIGZvcm1hdCByZWdleFxuICAgIHZhciBhc3BOZXRSZWdleCA9IC9eKC18XFwrKT8oPzooXFxkKilbLiBdKT8oXFxkKyk6KFxcZCspKD86OihcXGQrKShcXC5cXGQqKT8pPyQvLFxuICAgICAgICAvLyBmcm9tIGh0dHA6Ly9kb2NzLmNsb3N1cmUtbGlicmFyeS5nb29nbGVjb2RlLmNvbS9naXQvY2xvc3VyZV9nb29nX2RhdGVfZGF0ZS5qcy5zb3VyY2UuaHRtbFxuICAgICAgICAvLyBzb21ld2hhdCBtb3JlIGluIGxpbmUgd2l0aCA0LjQuMy4yIDIwMDQgc3BlYywgYnV0IGFsbG93cyBkZWNpbWFsIGFueXdoZXJlXG4gICAgICAgIC8vIGFuZCBmdXJ0aGVyIG1vZGlmaWVkIHRvIGFsbG93IGZvciBzdHJpbmdzIGNvbnRhaW5pbmcgYm90aCB3ZWVrIGFuZCBkYXlcbiAgICAgICAgaXNvUmVnZXggPVxuICAgICAgICAgICAgL14oLXxcXCspP1AoPzooWy0rXT9bMC05LC5dKilZKT8oPzooWy0rXT9bMC05LC5dKilNKT8oPzooWy0rXT9bMC05LC5dKilXKT8oPzooWy0rXT9bMC05LC5dKilEKT8oPzpUKD86KFstK10/WzAtOSwuXSopSCk/KD86KFstK10/WzAtOSwuXSopTSk/KD86KFstK10/WzAtOSwuXSopUyk/KT8kLztcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUR1cmF0aW9uKGlucHV0LCBrZXkpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5wdXQsXG4gICAgICAgICAgICAvLyBtYXRjaGluZyBhZ2FpbnN0IHJlZ2V4cCBpcyBleHBlbnNpdmUsIGRvIGl0IG9uIGRlbWFuZFxuICAgICAgICAgICAgbWF0Y2ggPSBudWxsLFxuICAgICAgICAgICAgc2lnbixcbiAgICAgICAgICAgIHJldCxcbiAgICAgICAgICAgIGRpZmZSZXM7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBtczogaW5wdXQuX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgICAgICBkOiBpbnB1dC5fZGF5cyxcbiAgICAgICAgICAgICAgICBNOiBpbnB1dC5fbW9udGhzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcihpbnB1dCkgfHwgIWlzTmFOKCtpbnB1dCkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb25ba2V5XSA9ICtpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24ubWlsbGlzZWNvbmRzID0gK2lucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKChtYXRjaCA9IGFzcE5ldFJlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IG1hdGNoWzFdID09PSAnLScgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgICAgIGQ6IHRvSW50KG1hdGNoW0RBVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgaDogdG9JbnQobWF0Y2hbSE9VUl0pICogc2lnbixcbiAgICAgICAgICAgICAgICBtOiB0b0ludChtYXRjaFtNSU5VVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgczogdG9JbnQobWF0Y2hbU0VDT05EXSkgKiBzaWduLFxuICAgICAgICAgICAgICAgIG1zOiB0b0ludChhYnNSb3VuZChtYXRjaFtNSUxMSVNFQ09ORF0gKiAxMDAwKSkgKiBzaWduLCAvLyB0aGUgbWlsbGlzZWNvbmQgZGVjaW1hbCBwb2ludCBpcyBpbmNsdWRlZCBpbiB0aGUgbWF0Y2hcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoKG1hdGNoID0gaXNvUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gbWF0Y2hbMV0gPT09ICctJyA/IC0xIDogMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHk6IHBhcnNlSXNvKG1hdGNoWzJdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBNOiBwYXJzZUlzbyhtYXRjaFszXSwgc2lnbiksXG4gICAgICAgICAgICAgICAgdzogcGFyc2VJc28obWF0Y2hbNF0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIGQ6IHBhcnNlSXNvKG1hdGNoWzVdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBoOiBwYXJzZUlzbyhtYXRjaFs2XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgbTogcGFyc2VJc28obWF0Y2hbN10sIHNpZ24pLFxuICAgICAgICAgICAgICAgIHM6IHBhcnNlSXNvKG1hdGNoWzhdLCBzaWduKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gY2hlY2tzIGZvciBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIHR5cGVvZiBkdXJhdGlvbiA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICgnZnJvbScgaW4gZHVyYXRpb24gfHwgJ3RvJyBpbiBkdXJhdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBkaWZmUmVzID0gbW9tZW50c0RpZmZlcmVuY2UoXG4gICAgICAgICAgICAgICAgY3JlYXRlTG9jYWwoZHVyYXRpb24uZnJvbSksXG4gICAgICAgICAgICAgICAgY3JlYXRlTG9jYWwoZHVyYXRpb24udG8pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgZHVyYXRpb24ubXMgPSBkaWZmUmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIGR1cmF0aW9uLk0gPSBkaWZmUmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCA9IG5ldyBEdXJhdGlvbihkdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpICYmIGhhc093blByb3AoaW5wdXQsICdfbG9jYWxlJykpIHtcbiAgICAgICAgICAgIHJldC5fbG9jYWxlID0gaW5wdXQuX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0R1cmF0aW9uKGlucHV0KSAmJiBoYXNPd25Qcm9wKGlucHV0LCAnX2lzVmFsaWQnKSkge1xuICAgICAgICAgICAgcmV0Ll9pc1ZhbGlkID0gaW5wdXQuX2lzVmFsaWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGNyZWF0ZUR1cmF0aW9uLmZuID0gRHVyYXRpb24ucHJvdG90eXBlO1xuICAgIGNyZWF0ZUR1cmF0aW9uLmludmFsaWQgPSBjcmVhdGVJbnZhbGlkJDE7XG5cbiAgICBmdW5jdGlvbiBwYXJzZUlzbyhpbnAsIHNpZ24pIHtcbiAgICAgICAgLy8gV2UnZCBub3JtYWxseSB1c2Ugfn5pbnAgZm9yIHRoaXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IGl0IGFsc29cbiAgICAgICAgLy8gY29udmVydHMgZmxvYXRzIHRvIGludHMuXG4gICAgICAgIC8vIGlucCBtYXkgYmUgdW5kZWZpbmVkLCBzbyBjYXJlZnVsIGNhbGxpbmcgcmVwbGFjZSBvbiBpdC5cbiAgICAgICAgdmFyIHJlcyA9IGlucCAmJiBwYXJzZUZsb2F0KGlucC5yZXBsYWNlKCcsJywgJy4nKSk7XG4gICAgICAgIC8vIGFwcGx5IHNpZ24gd2hpbGUgd2UncmUgYXQgaXRcbiAgICAgICAgcmV0dXJuIChpc05hTihyZXMpID8gMCA6IHJlcykgKiBzaWduO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcyA9IHt9O1xuXG4gICAgICAgIHJlcy5tb250aHMgPVxuICAgICAgICAgICAgb3RoZXIubW9udGgoKSAtIGJhc2UubW9udGgoKSArIChvdGhlci55ZWFyKCkgLSBiYXNlLnllYXIoKSkgKiAxMjtcbiAgICAgICAgaWYgKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKS5pc0FmdGVyKG90aGVyKSkge1xuICAgICAgICAgICAgLS1yZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9ICtvdGhlciAtICtiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJyk7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcikge1xuICAgICAgICB2YXIgcmVzO1xuICAgICAgICBpZiAoIShiYXNlLmlzVmFsaWQoKSAmJiBvdGhlci5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4geyBtaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgb3RoZXIgPSBjbG9uZVdpdGhPZmZzZXQob3RoZXIsIGJhc2UpO1xuICAgICAgICBpZiAoYmFzZS5pc0JlZm9yZShvdGhlcikpIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShvdGhlciwgYmFzZSk7XG4gICAgICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gLXJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICByZXMubW9udGhzID0gLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHJlbW92ZSAnbmFtZScgYXJnIGFmdGVyIGRlcHJlY2F0aW9uIGlzIHJlbW92ZWRcbiAgICBmdW5jdGlvbiBjcmVhdGVBZGRlcihkaXJlY3Rpb24sIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWwsIHBlcmlvZCkge1xuICAgICAgICAgICAgdmFyIGR1ciwgdG1wO1xuICAgICAgICAgICAgLy9pbnZlcnQgdGhlIGFyZ3VtZW50cywgYnV0IGNvbXBsYWluIGFib3V0IGl0XG4gICAgICAgICAgICBpZiAocGVyaW9kICE9PSBudWxsICYmICFpc05hTigrcGVyaW9kKSkge1xuICAgICAgICAgICAgICAgIGRlcHJlY2F0ZVNpbXBsZShcbiAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgJ21vbWVudCgpLicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAnKHBlcmlvZCwgbnVtYmVyKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIG1vbWVudCgpLicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAnKG51bWJlciwgcGVyaW9kKS4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnU2VlIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvYWRkLWludmVydGVkLXBhcmFtLyBmb3IgbW9yZSBpbmZvLidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRtcCA9IHZhbDtcbiAgICAgICAgICAgICAgICB2YWwgPSBwZXJpb2Q7XG4gICAgICAgICAgICAgICAgcGVyaW9kID0gdG1wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkdXIgPSBjcmVhdGVEdXJhdGlvbih2YWwsIHBlcmlvZCk7XG4gICAgICAgICAgICBhZGRTdWJ0cmFjdCh0aGlzLCBkdXIsIGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRTdWJ0cmFjdChtb20sIGR1cmF0aW9uLCBpc0FkZGluZywgdXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgZGF5cyA9IGFic1JvdW5kKGR1cmF0aW9uLl9kYXlzKSxcbiAgICAgICAgICAgIG1vbnRocyA9IGFic1JvdW5kKGR1cmF0aW9uLl9tb250aHMpO1xuXG4gICAgICAgIGlmICghbW9tLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgLy8gTm8gb3BcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZU9mZnNldCA9IHVwZGF0ZU9mZnNldCA9PSBudWxsID8gdHJ1ZSA6IHVwZGF0ZU9mZnNldDtcblxuICAgICAgICBpZiAobW9udGhzKSB7XG4gICAgICAgICAgICBzZXRNb250aChtb20sIGdldChtb20sICdNb250aCcpICsgbW9udGhzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXlzKSB7XG4gICAgICAgICAgICBzZXQkMShtb20sICdEYXRlJywgZ2V0KG1vbSwgJ0RhdGUnKSArIGRheXMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1pbGxpc2Vjb25kcykge1xuICAgICAgICAgICAgbW9tLl9kLnNldFRpbWUobW9tLl9kLnZhbHVlT2YoKSArIG1pbGxpc2Vjb25kcyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQobW9tLCBkYXlzIHx8IG1vbnRocyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYWRkID0gY3JlYXRlQWRkZXIoMSwgJ2FkZCcpLFxuICAgICAgICBzdWJ0cmFjdCA9IGNyZWF0ZUFkZGVyKC0xLCAnc3VidHJhY3QnKTtcblxuICAgIGZ1bmN0aW9uIGlzU3RyaW5nKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnIHx8IGlucHV0IGluc3RhbmNlb2YgU3RyaW5nO1xuICAgIH1cblxuICAgIC8vIHR5cGUgTW9tZW50SW5wdXQgPSBNb21lbnQgfCBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyIHwgKG51bWJlciB8IHN0cmluZylbXSB8IE1vbWVudElucHV0T2JqZWN0IHwgdm9pZDsgLy8gbnVsbCB8IHVuZGVmaW5lZFxuICAgIGZ1bmN0aW9uIGlzTW9tZW50SW5wdXQoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGlzTW9tZW50KGlucHV0KSB8fFxuICAgICAgICAgICAgaXNEYXRlKGlucHV0KSB8fFxuICAgICAgICAgICAgaXNTdHJpbmcoaW5wdXQpIHx8XG4gICAgICAgICAgICBpc051bWJlcihpbnB1dCkgfHxcbiAgICAgICAgICAgIGlzTnVtYmVyT3JTdHJpbmdBcnJheShpbnB1dCkgfHxcbiAgICAgICAgICAgIGlzTW9tZW50SW5wdXRPYmplY3QoaW5wdXQpIHx8XG4gICAgICAgICAgICBpbnB1dCA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgaW5wdXQgPT09IHVuZGVmaW5lZFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTW9tZW50SW5wdXRPYmplY3QoaW5wdXQpIHtcbiAgICAgICAgdmFyIG9iamVjdFRlc3QgPSBpc09iamVjdChpbnB1dCkgJiYgIWlzT2JqZWN0RW1wdHkoaW5wdXQpLFxuICAgICAgICAgICAgcHJvcGVydHlUZXN0ID0gZmFsc2UsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0gW1xuICAgICAgICAgICAgICAgICd5ZWFycycsXG4gICAgICAgICAgICAgICAgJ3llYXInLFxuICAgICAgICAgICAgICAgICd5JyxcbiAgICAgICAgICAgICAgICAnbW9udGhzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnLFxuICAgICAgICAgICAgICAgICdNJyxcbiAgICAgICAgICAgICAgICAnZGF5cycsXG4gICAgICAgICAgICAgICAgJ2RheScsXG4gICAgICAgICAgICAgICAgJ2QnLFxuICAgICAgICAgICAgICAgICdkYXRlcycsXG4gICAgICAgICAgICAgICAgJ2RhdGUnLFxuICAgICAgICAgICAgICAgICdEJyxcbiAgICAgICAgICAgICAgICAnaG91cnMnLFxuICAgICAgICAgICAgICAgICdob3VyJyxcbiAgICAgICAgICAgICAgICAnaCcsXG4gICAgICAgICAgICAgICAgJ21pbnV0ZXMnLFxuICAgICAgICAgICAgICAgICdtaW51dGUnLFxuICAgICAgICAgICAgICAgICdtJyxcbiAgICAgICAgICAgICAgICAnc2Vjb25kcycsXG4gICAgICAgICAgICAgICAgJ3NlY29uZCcsXG4gICAgICAgICAgICAgICAgJ3MnLFxuICAgICAgICAgICAgICAgICdtaWxsaXNlY29uZHMnLFxuICAgICAgICAgICAgICAgICdtaWxsaXNlY29uZCcsXG4gICAgICAgICAgICAgICAgJ21zJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgcHJvcGVydHksXG4gICAgICAgICAgICBwcm9wZXJ0eUxlbiA9IHByb3BlcnRpZXMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBwcm9wZXJ0eUxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICBwcm9wZXJ0eSA9IHByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICBwcm9wZXJ0eVRlc3QgPSBwcm9wZXJ0eVRlc3QgfHwgaGFzT3duUHJvcChpbnB1dCwgcHJvcGVydHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iamVjdFRlc3QgJiYgcHJvcGVydHlUZXN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTnVtYmVyT3JTdHJpbmdBcnJheShpbnB1dCkge1xuICAgICAgICB2YXIgYXJyYXlUZXN0ID0gaXNBcnJheShpbnB1dCksXG4gICAgICAgICAgICBkYXRhVHlwZVRlc3QgPSBmYWxzZTtcbiAgICAgICAgaWYgKGFycmF5VGVzdCkge1xuICAgICAgICAgICAgZGF0YVR5cGVUZXN0ID1cbiAgICAgICAgICAgICAgICBpbnB1dC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFpc051bWJlcihpdGVtKSAmJiBpc1N0cmluZyhpbnB1dCk7XG4gICAgICAgICAgICAgICAgfSkubGVuZ3RoID09PSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheVRlc3QgJiYgZGF0YVR5cGVUZXN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQ2FsZW5kYXJTcGVjKGlucHV0KSB7XG4gICAgICAgIHZhciBvYmplY3RUZXN0ID0gaXNPYmplY3QoaW5wdXQpICYmICFpc09iamVjdEVtcHR5KGlucHV0KSxcbiAgICAgICAgICAgIHByb3BlcnR5VGVzdCA9IGZhbHNlLFxuICAgICAgICAgICAgcHJvcGVydGllcyA9IFtcbiAgICAgICAgICAgICAgICAnc2FtZURheScsXG4gICAgICAgICAgICAgICAgJ25leHREYXknLFxuICAgICAgICAgICAgICAgICdsYXN0RGF5JyxcbiAgICAgICAgICAgICAgICAnbmV4dFdlZWsnLFxuICAgICAgICAgICAgICAgICdsYXN0V2VlaycsXG4gICAgICAgICAgICAgICAgJ3NhbWVFbHNlJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgcHJvcGVydHk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHByb3BlcnR5ID0gcHJvcGVydGllc1tpXTtcbiAgICAgICAgICAgIHByb3BlcnR5VGVzdCA9IHByb3BlcnR5VGVzdCB8fCBoYXNPd25Qcm9wKGlucHV0LCBwcm9wZXJ0eSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqZWN0VGVzdCAmJiBwcm9wZXJ0eVRlc3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q2FsZW5kYXJGb3JtYXQobXlNb21lbnQsIG5vdykge1xuICAgICAgICB2YXIgZGlmZiA9IG15TW9tZW50LmRpZmYobm93LCAnZGF5cycsIHRydWUpO1xuICAgICAgICByZXR1cm4gZGlmZiA8IC02XG4gICAgICAgICAgICA/ICdzYW1lRWxzZSdcbiAgICAgICAgICAgIDogZGlmZiA8IC0xXG4gICAgICAgICAgICA/ICdsYXN0V2VlaydcbiAgICAgICAgICAgIDogZGlmZiA8IDBcbiAgICAgICAgICAgID8gJ2xhc3REYXknXG4gICAgICAgICAgICA6IGRpZmYgPCAxXG4gICAgICAgICAgICA/ICdzYW1lRGF5J1xuICAgICAgICAgICAgOiBkaWZmIDwgMlxuICAgICAgICAgICAgPyAnbmV4dERheSdcbiAgICAgICAgICAgIDogZGlmZiA8IDdcbiAgICAgICAgICAgID8gJ25leHRXZWVrJ1xuICAgICAgICAgICAgOiAnc2FtZUVsc2UnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGVuZGFyJDEodGltZSwgZm9ybWF0cykge1xuICAgICAgICAvLyBTdXBwb3J0IGZvciBzaW5nbGUgcGFyYW1ldGVyLCBmb3JtYXRzIG9ubHkgb3ZlcmxvYWQgdG8gdGhlIGNhbGVuZGFyIGZ1bmN0aW9uXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBpZiAoIWFyZ3VtZW50c1swXSkge1xuICAgICAgICAgICAgICAgIHRpbWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgZm9ybWF0cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNNb21lbnRJbnB1dChhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgICAgICAgICAgdGltZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICBmb3JtYXRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0NhbGVuZGFyU3BlYyhhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0cyA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICB0aW1lID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFdlIHdhbnQgdG8gY29tcGFyZSB0aGUgc3RhcnQgb2YgdG9kYXksIHZzIHRoaXMuXG4gICAgICAgIC8vIEdldHRpbmcgc3RhcnQtb2YtdG9kYXkgZGVwZW5kcyBvbiB3aGV0aGVyIHdlJ3JlIGxvY2FsL3V0Yy9vZmZzZXQgb3Igbm90LlxuICAgICAgICB2YXIgbm93ID0gdGltZSB8fCBjcmVhdGVMb2NhbCgpLFxuICAgICAgICAgICAgc29kID0gY2xvbmVXaXRoT2Zmc2V0KG5vdywgdGhpcykuc3RhcnRPZignZGF5JyksXG4gICAgICAgICAgICBmb3JtYXQgPSBob29rcy5jYWxlbmRhckZvcm1hdCh0aGlzLCBzb2QpIHx8ICdzYW1lRWxzZScsXG4gICAgICAgICAgICBvdXRwdXQgPVxuICAgICAgICAgICAgICAgIGZvcm1hdHMgJiZcbiAgICAgICAgICAgICAgICAoaXNGdW5jdGlvbihmb3JtYXRzW2Zvcm1hdF0pXG4gICAgICAgICAgICAgICAgICAgID8gZm9ybWF0c1tmb3JtYXRdLmNhbGwodGhpcywgbm93KVxuICAgICAgICAgICAgICAgICAgICA6IGZvcm1hdHNbZm9ybWF0XSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KFxuICAgICAgICAgICAgb3V0cHV0IHx8IHRoaXMubG9jYWxlRGF0YSgpLmNhbGVuZGFyKGZvcm1hdCwgdGhpcywgY3JlYXRlTG9jYWwobm93KSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNBZnRlcihpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGxvY2FsSW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGNyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgaWYgKCEodGhpcy5pc1ZhbGlkKCkgJiYgbG9jYWxJbnB1dC5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cykgfHwgJ21pbGxpc2Vjb25kJztcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCkgPiBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbElucHV0LnZhbHVlT2YoKSA8IHRoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKS52YWx1ZU9mKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0JlZm9yZShpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGxvY2FsSW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGNyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgaWYgKCEodGhpcy5pc1ZhbGlkKCkgJiYgbG9jYWxJbnB1dC5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cykgfHwgJ21pbGxpc2Vjb25kJztcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCkgPCBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpLnZhbHVlT2YoKSA8IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNCZXR3ZWVuKGZyb20sIHRvLCB1bml0cywgaW5jbHVzaXZpdHkpIHtcbiAgICAgICAgdmFyIGxvY2FsRnJvbSA9IGlzTW9tZW50KGZyb20pID8gZnJvbSA6IGNyZWF0ZUxvY2FsKGZyb20pLFxuICAgICAgICAgICAgbG9jYWxUbyA9IGlzTW9tZW50KHRvKSA/IHRvIDogY3JlYXRlTG9jYWwodG8pO1xuICAgICAgICBpZiAoISh0aGlzLmlzVmFsaWQoKSAmJiBsb2NhbEZyb20uaXNWYWxpZCgpICYmIGxvY2FsVG8uaXNWYWxpZCgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGluY2x1c2l2aXR5ID0gaW5jbHVzaXZpdHkgfHwgJygpJztcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIChpbmNsdXNpdml0eVswXSA9PT0gJygnXG4gICAgICAgICAgICAgICAgPyB0aGlzLmlzQWZ0ZXIobG9jYWxGcm9tLCB1bml0cylcbiAgICAgICAgICAgICAgICA6ICF0aGlzLmlzQmVmb3JlKGxvY2FsRnJvbSwgdW5pdHMpKSAmJlxuICAgICAgICAgICAgKGluY2x1c2l2aXR5WzFdID09PSAnKSdcbiAgICAgICAgICAgICAgICA/IHRoaXMuaXNCZWZvcmUobG9jYWxUbywgdW5pdHMpXG4gICAgICAgICAgICAgICAgOiAhdGhpcy5pc0FmdGVyKGxvY2FsVG8sIHVuaXRzKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1NhbWUoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHZhciBsb2NhbElucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBjcmVhdGVMb2NhbChpbnB1dCksXG4gICAgICAgICAgICBpbnB1dE1zO1xuICAgICAgICBpZiAoISh0aGlzLmlzVmFsaWQoKSAmJiBsb2NhbElucHV0LmlzVmFsaWQoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB8fCAnbWlsbGlzZWNvbmQnO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKSA9PT0gbG9jYWxJbnB1dC52YWx1ZU9mKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dE1zID0gbG9jYWxJbnB1dC52YWx1ZU9mKCk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIHRoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKS52YWx1ZU9mKCkgPD0gaW5wdXRNcyAmJlxuICAgICAgICAgICAgICAgIGlucHV0TXMgPD0gdGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKS52YWx1ZU9mKClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1NhbWVPckFmdGVyKGlucHV0LCB1bml0cykge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1NhbWUoaW5wdXQsIHVuaXRzKSB8fCB0aGlzLmlzQWZ0ZXIoaW5wdXQsIHVuaXRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1NhbWVPckJlZm9yZShpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNTYW1lKGlucHV0LCB1bml0cykgfHwgdGhpcy5pc0JlZm9yZShpbnB1dCwgdW5pdHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpZmYoaW5wdXQsIHVuaXRzLCBhc0Zsb2F0KSB7XG4gICAgICAgIHZhciB0aGF0LCB6b25lRGVsdGEsIG91dHB1dDtcblxuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhhdCA9IGNsb25lV2l0aE9mZnNldChpbnB1dCwgdGhpcyk7XG5cbiAgICAgICAgaWYgKCF0aGF0LmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuXG4gICAgICAgIHpvbmVEZWx0YSA9ICh0aGF0LnV0Y09mZnNldCgpIC0gdGhpcy51dGNPZmZzZXQoKSkgKiA2ZTQ7XG5cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpIC8gMTI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpIC8gMztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKHRoaXMgLSB0aGF0KSAvIDFlMztcbiAgICAgICAgICAgICAgICBicmVhazsgLy8gMTAwMFxuICAgICAgICAgICAgY2FzZSAnbWludXRlJzpcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSAodGhpcyAtIHRoYXQpIC8gNmU0O1xuICAgICAgICAgICAgICAgIGJyZWFrOyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGNhc2UgJ2hvdXInOlxuICAgICAgICAgICAgICAgIG91dHB1dCA9ICh0aGlzIC0gdGhhdCkgLyAzNmU1O1xuICAgICAgICAgICAgICAgIGJyZWFrOyAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSAodGhpcyAtIHRoYXQgLSB6b25lRGVsdGEpIC8gODY0ZTU7XG4gICAgICAgICAgICAgICAgYnJlYWs7IC8vIDEwMDAgKiA2MCAqIDYwICogMjQsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgIGNhc2UgJ3dlZWsnOlxuICAgICAgICAgICAgICAgIG91dHB1dCA9ICh0aGlzIC0gdGhhdCAtIHpvbmVEZWx0YSkgLyA2MDQ4ZTU7XG4gICAgICAgICAgICAgICAgYnJlYWs7IC8vIDEwMDAgKiA2MCAqIDYwICogMjQgKiA3LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMgLSB0aGF0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFzRmxvYXQgPyBvdXRwdXQgOiBhYnNGbG9vcihvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbnRoRGlmZihhLCBiKSB7XG4gICAgICAgIGlmIChhLmRhdGUoKSA8IGIuZGF0ZSgpKSB7XG4gICAgICAgICAgICAvLyBlbmQtb2YtbW9udGggY2FsY3VsYXRpb25zIHdvcmsgY29ycmVjdCB3aGVuIHRoZSBzdGFydCBtb250aCBoYXMgbW9yZVxuICAgICAgICAgICAgLy8gZGF5cyB0aGFuIHRoZSBlbmQgbW9udGguXG4gICAgICAgICAgICByZXR1cm4gLW1vbnRoRGlmZihiLCBhKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICAgICAgICB2YXIgd2hvbGVNb250aERpZmYgPSAoYi55ZWFyKCkgLSBhLnllYXIoKSkgKiAxMiArIChiLm1vbnRoKCkgLSBhLm1vbnRoKCkpLFxuICAgICAgICAgICAgLy8gYiBpcyBpbiAoYW5jaG9yIC0gMSBtb250aCwgYW5jaG9yICsgMSBtb250aClcbiAgICAgICAgICAgIGFuY2hvciA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYsICdtb250aHMnKSxcbiAgICAgICAgICAgIGFuY2hvcjIsXG4gICAgICAgICAgICBhZGp1c3Q7XG5cbiAgICAgICAgaWYgKGIgLSBhbmNob3IgPCAwKSB7XG4gICAgICAgICAgICBhbmNob3IyID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiAtIDEsICdtb250aHMnKTtcbiAgICAgICAgICAgIC8vIGxpbmVhciBhY3Jvc3MgdGhlIG1vbnRoXG4gICAgICAgICAgICBhZGp1c3QgPSAoYiAtIGFuY2hvcikgLyAoYW5jaG9yIC0gYW5jaG9yMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbmNob3IyID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiArIDEsICdtb250aHMnKTtcbiAgICAgICAgICAgIC8vIGxpbmVhciBhY3Jvc3MgdGhlIG1vbnRoXG4gICAgICAgICAgICBhZGp1c3QgPSAoYiAtIGFuY2hvcikgLyAoYW5jaG9yMiAtIGFuY2hvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvL2NoZWNrIGZvciBuZWdhdGl2ZSB6ZXJvLCByZXR1cm4gemVybyBpZiBuZWdhdGl2ZSB6ZXJvXG4gICAgICAgIHJldHVybiAtKHdob2xlTW9udGhEaWZmICsgYWRqdXN0KSB8fCAwO1xuICAgIH1cblxuICAgIGhvb2tzLmRlZmF1bHRGb3JtYXQgPSAnWVlZWS1NTS1ERFRISDptbTpzc1onO1xuICAgIGhvb2tzLmRlZmF1bHRGb3JtYXRVdGMgPSAnWVlZWS1NTS1ERFRISDptbTpzc1taXSc7XG5cbiAgICBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb2NhbGUoJ2VuJykuZm9ybWF0KCdkZGQgTU1NIEREIFlZWVkgSEg6bW06c3MgW0dNVF1aWicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSVNPU3RyaW5nKGtlZXBPZmZzZXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHV0YyA9IGtlZXBPZmZzZXQgIT09IHRydWUsXG4gICAgICAgICAgICBtID0gdXRjID8gdGhpcy5jbG9uZSgpLnV0YygpIDogdGhpcztcbiAgICAgICAgaWYgKG0ueWVhcigpIDwgMCB8fCBtLnllYXIoKSA+IDk5OTkpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQoXG4gICAgICAgICAgICAgICAgbSxcbiAgICAgICAgICAgICAgICB1dGNcbiAgICAgICAgICAgICAgICAgICAgPyAnWVlZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJ1xuICAgICAgICAgICAgICAgICAgICA6ICdZWVlZWVktTU0tRERbVF1ISDptbTpzcy5TU1NaJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNGdW5jdGlvbihEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZykpIHtcbiAgICAgICAgICAgIC8vIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBpcyB+NTB4IGZhc3RlciwgdXNlIGl0IHdoZW4gd2UgY2FuXG4gICAgICAgICAgICBpZiAodXRjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9EYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMudmFsdWVPZigpICsgdGhpcy51dGNPZmZzZXQoKSAqIDYwICogMTAwMClcbiAgICAgICAgICAgICAgICAgICAgLnRvSVNPU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ1onLCBmb3JtYXRNb21lbnQobSwgJ1onKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChcbiAgICAgICAgICAgIG0sXG4gICAgICAgICAgICB1dGMgPyAnWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScgOiAnWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1onXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgcmVwcmVzZW50YXRpb24gb2YgYSBtb21lbnQgdGhhdCBjYW5cbiAgICAgKiBhbHNvIGJlIGV2YWx1YXRlZCB0byBnZXQgYSBuZXcgbW9tZW50IHdoaWNoIGlzIHRoZSBzYW1lXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwczovL25vZGVqcy5vcmcvZGlzdC9sYXRlc3QvZG9jcy9hcGkvdXRpbC5odG1sI3V0aWxfY3VzdG9tX2luc3BlY3RfZnVuY3Rpb25fb25fb2JqZWN0c1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluc3BlY3QoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiAnbW9tZW50LmludmFsaWQoLyogJyArIHRoaXMuX2kgKyAnICovKSc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZ1bmMgPSAnbW9tZW50JyxcbiAgICAgICAgICAgIHpvbmUgPSAnJyxcbiAgICAgICAgICAgIHByZWZpeCxcbiAgICAgICAgICAgIHllYXIsXG4gICAgICAgICAgICBkYXRldGltZSxcbiAgICAgICAgICAgIHN1ZmZpeDtcbiAgICAgICAgaWYgKCF0aGlzLmlzTG9jYWwoKSkge1xuICAgICAgICAgICAgZnVuYyA9IHRoaXMudXRjT2Zmc2V0KCkgPT09IDAgPyAnbW9tZW50LnV0YycgOiAnbW9tZW50LnBhcnNlWm9uZSc7XG4gICAgICAgICAgICB6b25lID0gJ1onO1xuICAgICAgICB9XG4gICAgICAgIHByZWZpeCA9ICdbJyArIGZ1bmMgKyAnKFwiXSc7XG4gICAgICAgIHllYXIgPSAwIDw9IHRoaXMueWVhcigpICYmIHRoaXMueWVhcigpIDw9IDk5OTkgPyAnWVlZWScgOiAnWVlZWVlZJztcbiAgICAgICAgZGF0ZXRpbWUgPSAnLU1NLUREW1RdSEg6bW06c3MuU1NTJztcbiAgICAgICAgc3VmZml4ID0gem9uZSArICdbXCIpXSc7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KHByZWZpeCArIHllYXIgKyBkYXRldGltZSArIHN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0KGlucHV0U3RyaW5nKSB7XG4gICAgICAgIGlmICghaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgICAgIGlucHV0U3RyaW5nID0gdGhpcy5pc1V0YygpXG4gICAgICAgICAgICAgICAgPyBob29rcy5kZWZhdWx0Rm9ybWF0VXRjXG4gICAgICAgICAgICAgICAgOiBob29rcy5kZWZhdWx0Rm9ybWF0O1xuICAgICAgICB9XG4gICAgICAgIHZhciBvdXRwdXQgPSBmb3JtYXRNb21lbnQodGhpcywgaW5wdXRTdHJpbmcpO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb20odGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmlzVmFsaWQoKSAmJlxuICAgICAgICAgICAgKChpc01vbWVudCh0aW1lKSAmJiB0aW1lLmlzVmFsaWQoKSkgfHwgY3JlYXRlTG9jYWwodGltZSkuaXNWYWxpZCgpKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVEdXJhdGlvbih7IHRvOiB0aGlzLCBmcm9tOiB0aW1lIH0pXG4gICAgICAgICAgICAgICAgLmxvY2FsZSh0aGlzLmxvY2FsZSgpKVxuICAgICAgICAgICAgICAgIC5odW1hbml6ZSghd2l0aG91dFN1ZmZpeCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb21Ob3cod2l0aG91dFN1ZmZpeCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tKGNyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5pc1ZhbGlkKCkgJiZcbiAgICAgICAgICAgICgoaXNNb21lbnQodGltZSkgJiYgdGltZS5pc1ZhbGlkKCkpIHx8IGNyZWF0ZUxvY2FsKHRpbWUpLmlzVmFsaWQoKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24oeyBmcm9tOiB0aGlzLCB0bzogdGltZSB9KVxuICAgICAgICAgICAgICAgIC5sb2NhbGUodGhpcy5sb2NhbGUoKSlcbiAgICAgICAgICAgICAgICAuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b05vdyh3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvKGNyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIC8vIElmIHBhc3NlZCBhIGxvY2FsZSBrZXksIGl0IHdpbGwgc2V0IHRoZSBsb2NhbGUgZm9yIHRoaXNcbiAgICAvLyBpbnN0YW5jZS4gIE90aGVyd2lzZSwgaXQgd2lsbCByZXR1cm4gdGhlIGxvY2FsZSBjb25maWd1cmF0aW9uXG4gICAgLy8gdmFyaWFibGVzIGZvciB0aGlzIGluc3RhbmNlLlxuICAgIGZ1bmN0aW9uIGxvY2FsZShrZXkpIHtcbiAgICAgICAgdmFyIG5ld0xvY2FsZURhdGE7XG5cbiAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3TG9jYWxlRGF0YSA9IGdldExvY2FsZShrZXkpO1xuICAgICAgICAgICAgaWYgKG5ld0xvY2FsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IG5ld0xvY2FsZURhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsYW5nID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkubGFuZygpIGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQsIHVzZSBtb21lbnQoKS5sb2NhbGVEYXRhKCkgdG8gZ2V0IHRoZSBsYW5ndWFnZSBjb25maWd1cmF0aW9uLiBVc2UgbW9tZW50KCkubG9jYWxlKCkgdG8gY2hhbmdlIGxhbmd1YWdlcy4nLFxuICAgICAgICBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZShrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZURhdGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgfVxuXG4gICAgdmFyIE1TX1BFUl9TRUNPTkQgPSAxMDAwLFxuICAgICAgICBNU19QRVJfTUlOVVRFID0gNjAgKiBNU19QRVJfU0VDT05ELFxuICAgICAgICBNU19QRVJfSE9VUiA9IDYwICogTVNfUEVSX01JTlVURSxcbiAgICAgICAgTVNfUEVSXzQwMF9ZRUFSUyA9ICgzNjUgKiA0MDAgKyA5NykgKiAyNCAqIE1TX1BFUl9IT1VSO1xuXG4gICAgLy8gYWN0dWFsIG1vZHVsbyAtIGhhbmRsZXMgbmVnYXRpdmUgbnVtYmVycyAoZm9yIGRhdGVzIGJlZm9yZSAxOTcwKTpcbiAgICBmdW5jdGlvbiBtb2QkMShkaXZpZGVuZCwgZGl2aXNvcikge1xuICAgICAgICByZXR1cm4gKChkaXZpZGVuZCAlIGRpdmlzb3IpICsgZGl2aXNvcikgJSBkaXZpc29yO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsU3RhcnRPZkRhdGUoeSwgbSwgZCkge1xuICAgICAgICAvLyB0aGUgZGF0ZSBjb25zdHJ1Y3RvciByZW1hcHMgeWVhcnMgMC05OSB0byAxOTAwLTE5OTlcbiAgICAgICAgaWYgKHkgPCAxMDAgJiYgeSA+PSAwKSB7XG4gICAgICAgICAgICAvLyBwcmVzZXJ2ZSBsZWFwIHllYXJzIHVzaW5nIGEgZnVsbCA0MDAgeWVhciBjeWNsZSwgdGhlbiByZXNldFxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHkgKyA0MDAsIG0sIGQpIC0gTVNfUEVSXzQwMF9ZRUFSUztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh5LCBtLCBkKS52YWx1ZU9mKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1dGNTdGFydE9mRGF0ZSh5LCBtLCBkKSB7XG4gICAgICAgIC8vIERhdGUuVVRDIHJlbWFwcyB5ZWFycyAwLTk5IHRvIDE5MDAtMTk5OVxuICAgICAgICBpZiAoeSA8IDEwMCAmJiB5ID49IDApIHtcbiAgICAgICAgICAgIC8vIHByZXNlcnZlIGxlYXAgeWVhcnMgdXNpbmcgYSBmdWxsIDQwMCB5ZWFyIGN5Y2xlLCB0aGVuIHJlc2V0XG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5VVEMoeSArIDQwMCwgbSwgZCkgLSBNU19QRVJfNDAwX1lFQVJTO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIERhdGUuVVRDKHksIG0sIGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRPZih1bml0cykge1xuICAgICAgICB2YXIgdGltZSwgc3RhcnRPZkRhdGU7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICBpZiAodW5pdHMgPT09IHVuZGVmaW5lZCB8fCB1bml0cyA9PT0gJ21pbGxpc2Vjb25kJyB8fCAhdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnRPZkRhdGUgPSB0aGlzLl9pc1VUQyA/IHV0Y1N0YXJ0T2ZEYXRlIDogbG9jYWxTdGFydE9mRGF0ZTtcblxuICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgICAgICAgICB0aW1lID0gc3RhcnRPZkRhdGUodGhpcy55ZWFyKCksIDAsIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgICAgICAgICAgdGltZSA9IHN0YXJ0T2ZEYXRlKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnllYXIoKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb250aCgpIC0gKHRoaXMubW9udGgoKSAlIDMpLFxuICAgICAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgICAgICAgICB0aW1lID0gc3RhcnRPZkRhdGUodGhpcy55ZWFyKCksIHRoaXMubW9udGgoKSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgICAgICAgICB0aW1lID0gc3RhcnRPZkRhdGUoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMueWVhcigpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vbnRoKCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZSgpIC0gdGhpcy53ZWVrZGF5KClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaXNvV2Vlayc6XG4gICAgICAgICAgICAgICAgdGltZSA9IHN0YXJ0T2ZEYXRlKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnllYXIoKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb250aCgpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGUoKSAtICh0aGlzLmlzb1dlZWtkYXkoKSAtIDEpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICAgICAgICB0aW1lID0gc3RhcnRPZkRhdGUodGhpcy55ZWFyKCksIHRoaXMubW9udGgoKSwgdGhpcy5kYXRlKCkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICAgICAgdGltZSA9IHRoaXMuX2QudmFsdWVPZigpO1xuICAgICAgICAgICAgICAgIHRpbWUgLT0gbW9kJDEoXG4gICAgICAgICAgICAgICAgICAgIHRpbWUgKyAodGhpcy5faXNVVEMgPyAwIDogdGhpcy51dGNPZmZzZXQoKSAqIE1TX1BFUl9NSU5VVEUpLFxuICAgICAgICAgICAgICAgICAgICBNU19QRVJfSE9VUlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtaW51dGUnOlxuICAgICAgICAgICAgICAgIHRpbWUgPSB0aGlzLl9kLnZhbHVlT2YoKTtcbiAgICAgICAgICAgICAgICB0aW1lIC09IG1vZCQxKHRpbWUsIE1TX1BFUl9NSU5VVEUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc2Vjb25kJzpcbiAgICAgICAgICAgICAgICB0aW1lID0gdGhpcy5fZC52YWx1ZU9mKCk7XG4gICAgICAgICAgICAgICAgdGltZSAtPSBtb2QkMSh0aW1lLCBNU19QRVJfU0VDT05EKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2Quc2V0VGltZSh0aW1lKTtcbiAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmRPZih1bml0cykge1xuICAgICAgICB2YXIgdGltZSwgc3RhcnRPZkRhdGU7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICBpZiAodW5pdHMgPT09IHVuZGVmaW5lZCB8fCB1bml0cyA9PT0gJ21pbGxpc2Vjb25kJyB8fCAhdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnRPZkRhdGUgPSB0aGlzLl9pc1VUQyA/IHV0Y1N0YXJ0T2ZEYXRlIDogbG9jYWxTdGFydE9mRGF0ZTtcblxuICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgICAgICAgICB0aW1lID0gc3RhcnRPZkRhdGUodGhpcy55ZWFyKCkgKyAxLCAwLCAxKSAtIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgICAgICAgICB0aW1lID1cbiAgICAgICAgICAgICAgICAgICAgc3RhcnRPZkRhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnllYXIoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9udGgoKSAtICh0aGlzLm1vbnRoKCkgJSAzKSArIDMsXG4gICAgICAgICAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICAgICAgICkgLSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgICAgIHRpbWUgPSBzdGFydE9mRGF0ZSh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpICsgMSwgMSkgLSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgICAgICAgICAgdGltZSA9XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0T2ZEYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55ZWFyKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vbnRoKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGUoKSAtIHRoaXMud2Vla2RheSgpICsgN1xuICAgICAgICAgICAgICAgICAgICApIC0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2lzb1dlZWsnOlxuICAgICAgICAgICAgICAgIHRpbWUgPVxuICAgICAgICAgICAgICAgICAgICBzdGFydE9mRGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueWVhcigpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb250aCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRlKCkgLSAodGhpcy5pc29XZWVrZGF5KCkgLSAxKSArIDdcbiAgICAgICAgICAgICAgICAgICAgKSAtIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkYXknOlxuICAgICAgICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgICAgICAgICAgdGltZSA9IHN0YXJ0T2ZEYXRlKHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCksIHRoaXMuZGF0ZSgpICsgMSkgLSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICAgICAgdGltZSA9IHRoaXMuX2QudmFsdWVPZigpO1xuICAgICAgICAgICAgICAgIHRpbWUgKz1cbiAgICAgICAgICAgICAgICAgICAgTVNfUEVSX0hPVVIgLVxuICAgICAgICAgICAgICAgICAgICBtb2QkMShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWUgKyAodGhpcy5faXNVVEMgPyAwIDogdGhpcy51dGNPZmZzZXQoKSAqIE1TX1BFUl9NSU5VVEUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgTVNfUEVSX0hPVVJcbiAgICAgICAgICAgICAgICAgICAgKSAtXG4gICAgICAgICAgICAgICAgICAgIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtaW51dGUnOlxuICAgICAgICAgICAgICAgIHRpbWUgPSB0aGlzLl9kLnZhbHVlT2YoKTtcbiAgICAgICAgICAgICAgICB0aW1lICs9IE1TX1BFUl9NSU5VVEUgLSBtb2QkMSh0aW1lLCBNU19QRVJfTUlOVVRFKSAtIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzZWNvbmQnOlxuICAgICAgICAgICAgICAgIHRpbWUgPSB0aGlzLl9kLnZhbHVlT2YoKTtcbiAgICAgICAgICAgICAgICB0aW1lICs9IE1TX1BFUl9TRUNPTkQgLSBtb2QkMSh0aW1lLCBNU19QRVJfU0VDT05EKSAtIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kLnNldFRpbWUodGltZSk7XG4gICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsdWVPZigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2QudmFsdWVPZigpIC0gKHRoaXMuX29mZnNldCB8fCAwKSAqIDYwMDAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuaXgoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMudmFsdWVPZigpIC8gMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9EYXRlKCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUodGhpcy52YWx1ZU9mKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG0ueWVhcigpLFxuICAgICAgICAgICAgbS5tb250aCgpLFxuICAgICAgICAgICAgbS5kYXRlKCksXG4gICAgICAgICAgICBtLmhvdXIoKSxcbiAgICAgICAgICAgIG0ubWludXRlKCksXG4gICAgICAgICAgICBtLnNlY29uZCgpLFxuICAgICAgICAgICAgbS5taWxsaXNlY29uZCgpLFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvT2JqZWN0KCkge1xuICAgICAgICB2YXIgbSA9IHRoaXM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyczogbS55ZWFyKCksXG4gICAgICAgICAgICBtb250aHM6IG0ubW9udGgoKSxcbiAgICAgICAgICAgIGRhdGU6IG0uZGF0ZSgpLFxuICAgICAgICAgICAgaG91cnM6IG0uaG91cnMoKSxcbiAgICAgICAgICAgIG1pbnV0ZXM6IG0ubWludXRlcygpLFxuICAgICAgICAgICAgc2Vjb25kczogbS5zZWNvbmRzKCksXG4gICAgICAgICAgICBtaWxsaXNlY29uZHM6IG0ubWlsbGlzZWNvbmRzKCksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9KU09OKCkge1xuICAgICAgICAvLyBuZXcgRGF0ZShOYU4pLnRvSlNPTigpID09PSBudWxsXG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMudG9JU09TdHJpbmcoKSA6IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZCQyKCkge1xuICAgICAgICByZXR1cm4gaXNWYWxpZCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzaW5nRmxhZ3MoKSB7XG4gICAgICAgIHJldHVybiBleHRlbmQoe30sIGdldFBhcnNpbmdGbGFncyh0aGlzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW52YWxpZEF0KCkge1xuICAgICAgICByZXR1cm4gZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpLm92ZXJmbG93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0aW9uRGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlucHV0OiB0aGlzLl9pLFxuICAgICAgICAgICAgZm9ybWF0OiB0aGlzLl9mLFxuICAgICAgICAgICAgbG9jYWxlOiB0aGlzLl9sb2NhbGUsXG4gICAgICAgICAgICBpc1VUQzogdGhpcy5faXNVVEMsXG4gICAgICAgICAgICBzdHJpY3Q6IHRoaXMuX3N0cmljdCxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignTicsIDAsIDAsICdlcmFBYmJyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ05OJywgMCwgMCwgJ2VyYUFiYnInKTtcbiAgICBhZGRGb3JtYXRUb2tlbignTk5OJywgMCwgMCwgJ2VyYUFiYnInKTtcbiAgICBhZGRGb3JtYXRUb2tlbignTk5OTicsIDAsIDAsICdlcmFOYW1lJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ05OTk5OJywgMCwgMCwgJ2VyYU5hcnJvdycpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3knLCBbJ3knLCAxXSwgJ3lvJywgJ2VyYVllYXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbigneScsIFsneXknLCAyXSwgMCwgJ2VyYVllYXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbigneScsIFsneXl5JywgM10sIDAsICdlcmFZZWFyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ3knLCBbJ3l5eXknLCA0XSwgMCwgJ2VyYVllYXInKTtcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ04nLCBtYXRjaEVyYUFiYnIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ05OJywgbWF0Y2hFcmFBYmJyKTtcbiAgICBhZGRSZWdleFRva2VuKCdOTk4nLCBtYXRjaEVyYUFiYnIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ05OTk4nLCBtYXRjaEVyYU5hbWUpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ05OTk5OJywgbWF0Y2hFcmFOYXJyb3cpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihcbiAgICAgICAgWydOJywgJ05OJywgJ05OTicsICdOTk5OJywgJ05OTk5OJ10sXG4gICAgICAgIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgICAgIHZhciBlcmEgPSBjb25maWcuX2xvY2FsZS5lcmFzUGFyc2UoaW5wdXQsIHRva2VuLCBjb25maWcuX3N0cmljdCk7XG4gICAgICAgICAgICBpZiAoZXJhKSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZXJhID0gZXJhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkRXJhID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgYWRkUmVnZXhUb2tlbigneScsIG1hdGNoVW5zaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3l5JywgbWF0Y2hVbnNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbigneXl5JywgbWF0Y2hVbnNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbigneXl5eScsIG1hdGNoVW5zaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3lvJywgbWF0Y2hFcmFZZWFyT3JkaW5hbCk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsneScsICd5eScsICd5eXknLCAneXl5eSddLCBZRUFSKTtcbiAgICBhZGRQYXJzZVRva2VuKFsneW8nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB2YXIgbWF0Y2g7XG4gICAgICAgIGlmIChjb25maWcuX2xvY2FsZS5fZXJhWWVhck9yZGluYWxSZWdleCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBpbnB1dC5tYXRjaChjb25maWcuX2xvY2FsZS5fZXJhWWVhck9yZGluYWxSZWdleCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLl9sb2NhbGUuZXJhWWVhck9yZGluYWxQYXJzZSkge1xuICAgICAgICAgICAgYXJyYXlbWUVBUl0gPSBjb25maWcuX2xvY2FsZS5lcmFZZWFyT3JkaW5hbFBhcnNlKGlucHV0LCBtYXRjaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcnJheVtZRUFSXSA9IHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUVyYXMobSwgZm9ybWF0KSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgbCxcbiAgICAgICAgICAgIGRhdGUsXG4gICAgICAgICAgICBlcmFzID0gdGhpcy5fZXJhcyB8fCBnZXRMb2NhbGUoJ2VuJykuX2VyYXM7XG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBlcmFzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgc3dpdGNoICh0eXBlb2YgZXJhc1tpXS5zaW5jZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICAgICAgICAgIC8vIHRydW5jYXRlIHRpbWVcbiAgICAgICAgICAgICAgICAgICAgZGF0ZSA9IGhvb2tzKGVyYXNbaV0uc2luY2UpLnN0YXJ0T2YoJ2RheScpO1xuICAgICAgICAgICAgICAgICAgICBlcmFzW2ldLnNpbmNlID0gZGF0ZS52YWx1ZU9mKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiBlcmFzW2ldLnVudGlsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgICAgICAgICAgICAgZXJhc1tpXS51bnRpbCA9ICtJbmZpbml0eTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gdHJ1bmNhdGUgdGltZVxuICAgICAgICAgICAgICAgICAgICBkYXRlID0gaG9va3MoZXJhc1tpXS51bnRpbCkuc3RhcnRPZignZGF5JykudmFsdWVPZigpO1xuICAgICAgICAgICAgICAgICAgICBlcmFzW2ldLnVudGlsID0gZGF0ZS52YWx1ZU9mKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcmFzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZUVyYXNQYXJzZShlcmFOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICBlcmFzID0gdGhpcy5lcmFzKCksXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgYWJicixcbiAgICAgICAgICAgIG5hcnJvdztcbiAgICAgICAgZXJhTmFtZSA9IGVyYU5hbWUudG9VcHBlckNhc2UoKTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gZXJhcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIG5hbWUgPSBlcmFzW2ldLm5hbWUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIGFiYnIgPSBlcmFzW2ldLmFiYnIudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIG5hcnJvdyA9IGVyYXNbaV0ubmFycm93LnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdOJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTk4nOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdOTk4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFiYnIgPT09IGVyYU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXJhc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ05OTk4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IGVyYU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXJhc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ05OTk5OJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYXJyb3cgPT09IGVyYU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXJhc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoW25hbWUsIGFiYnIsIG5hcnJvd10uaW5kZXhPZihlcmFOYW1lKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVyYXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVFcmFzQ29udmVydFllYXIoZXJhLCB5ZWFyKSB7XG4gICAgICAgIHZhciBkaXIgPSBlcmEuc2luY2UgPD0gZXJhLnVudGlsID8gKzEgOiAtMTtcbiAgICAgICAgaWYgKHllYXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGhvb2tzKGVyYS5zaW5jZSkueWVhcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGhvb2tzKGVyYS5zaW5jZSkueWVhcigpICsgKHllYXIgLSBlcmEub2Zmc2V0KSAqIGRpcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEVyYU5hbWUoKSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgbCxcbiAgICAgICAgICAgIHZhbCxcbiAgICAgICAgICAgIGVyYXMgPSB0aGlzLmxvY2FsZURhdGEoKS5lcmFzKCk7XG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBlcmFzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgLy8gdHJ1bmNhdGUgdGltZVxuICAgICAgICAgICAgdmFsID0gdGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpLnZhbHVlT2YoKTtcblxuICAgICAgICAgICAgaWYgKGVyYXNbaV0uc2luY2UgPD0gdmFsICYmIHZhbCA8PSBlcmFzW2ldLnVudGlsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVyYXNbaV0ubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlcmFzW2ldLnVudGlsIDw9IHZhbCAmJiB2YWwgPD0gZXJhc1tpXS5zaW5jZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlcmFzW2ldLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RXJhTmFycm93KCkge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICB2YWwsXG4gICAgICAgICAgICBlcmFzID0gdGhpcy5sb2NhbGVEYXRhKCkuZXJhcygpO1xuICAgICAgICBmb3IgKGkgPSAwLCBsID0gZXJhcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIC8vIHRydW5jYXRlIHRpbWVcbiAgICAgICAgICAgIHZhbCA9IHRoaXMuY2xvbmUoKS5zdGFydE9mKCdkYXknKS52YWx1ZU9mKCk7XG5cbiAgICAgICAgICAgIGlmIChlcmFzW2ldLnNpbmNlIDw9IHZhbCAmJiB2YWwgPD0gZXJhc1tpXS51bnRpbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlcmFzW2ldLm5hcnJvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlcmFzW2ldLnVudGlsIDw9IHZhbCAmJiB2YWwgPD0gZXJhc1tpXS5zaW5jZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlcmFzW2ldLm5hcnJvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFcmFBYmJyKCkge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICB2YWwsXG4gICAgICAgICAgICBlcmFzID0gdGhpcy5sb2NhbGVEYXRhKCkuZXJhcygpO1xuICAgICAgICBmb3IgKGkgPSAwLCBsID0gZXJhcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIC8vIHRydW5jYXRlIHRpbWVcbiAgICAgICAgICAgIHZhbCA9IHRoaXMuY2xvbmUoKS5zdGFydE9mKCdkYXknKS52YWx1ZU9mKCk7XG5cbiAgICAgICAgICAgIGlmIChlcmFzW2ldLnNpbmNlIDw9IHZhbCAmJiB2YWwgPD0gZXJhc1tpXS51bnRpbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlcmFzW2ldLmFiYnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJhc1tpXS51bnRpbCA8PSB2YWwgJiYgdmFsIDw9IGVyYXNbaV0uc2luY2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJhc1tpXS5hYmJyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEVyYVllYXIoKSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgbCxcbiAgICAgICAgICAgIGRpcixcbiAgICAgICAgICAgIHZhbCxcbiAgICAgICAgICAgIGVyYXMgPSB0aGlzLmxvY2FsZURhdGEoKS5lcmFzKCk7XG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBlcmFzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgZGlyID0gZXJhc1tpXS5zaW5jZSA8PSBlcmFzW2ldLnVudGlsID8gKzEgOiAtMTtcblxuICAgICAgICAgICAgLy8gdHJ1bmNhdGUgdGltZVxuICAgICAgICAgICAgdmFsID0gdGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpLnZhbHVlT2YoKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIChlcmFzW2ldLnNpbmNlIDw9IHZhbCAmJiB2YWwgPD0gZXJhc1tpXS51bnRpbCkgfHxcbiAgICAgICAgICAgICAgICAoZXJhc1tpXS51bnRpbCA8PSB2YWwgJiYgdmFsIDw9IGVyYXNbaV0uc2luY2UpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAodGhpcy55ZWFyKCkgLSBob29rcyhlcmFzW2ldLnNpbmNlKS55ZWFyKCkpICogZGlyICtcbiAgICAgICAgICAgICAgICAgICAgZXJhc1tpXS5vZmZzZXRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMueWVhcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVyYXNOYW1lUmVnZXgoaXNTdHJpY3QpIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfZXJhc05hbWVSZWdleCcpKSB7XG4gICAgICAgICAgICBjb21wdXRlRXJhc1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzU3RyaWN0ID8gdGhpcy5fZXJhc05hbWVSZWdleCA6IHRoaXMuX2VyYXNSZWdleDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcmFzQWJiclJlZ2V4KGlzU3RyaWN0KSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX2VyYXNBYmJyUmVnZXgnKSkge1xuICAgICAgICAgICAgY29tcHV0ZUVyYXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc1N0cmljdCA/IHRoaXMuX2VyYXNBYmJyUmVnZXggOiB0aGlzLl9lcmFzUmVnZXg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJhc05hcnJvd1JlZ2V4KGlzU3RyaWN0KSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX2VyYXNOYXJyb3dSZWdleCcpKSB7XG4gICAgICAgICAgICBjb21wdXRlRXJhc1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzU3RyaWN0ID8gdGhpcy5fZXJhc05hcnJvd1JlZ2V4IDogdGhpcy5fZXJhc1JlZ2V4O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hdGNoRXJhQWJicihpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUuZXJhc0FiYnJSZWdleChpc1N0cmljdCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWF0Y2hFcmFOYW1lKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5lcmFzTmFtZVJlZ2V4KGlzU3RyaWN0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXRjaEVyYU5hcnJvdyhpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUuZXJhc05hcnJvd1JlZ2V4KGlzU3RyaWN0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXRjaEVyYVllYXJPcmRpbmFsKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5fZXJhWWVhck9yZGluYWxSZWdleCB8fCBtYXRjaFVuc2lnbmVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXB1dGVFcmFzUGFyc2UoKSB7XG4gICAgICAgIHZhciBhYmJyUGllY2VzID0gW10sXG4gICAgICAgICAgICBuYW1lUGllY2VzID0gW10sXG4gICAgICAgICAgICBuYXJyb3dQaWVjZXMgPSBbXSxcbiAgICAgICAgICAgIG1peGVkUGllY2VzID0gW10sXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgbCxcbiAgICAgICAgICAgIGVyYXMgPSB0aGlzLmVyYXMoKTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gZXJhcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIG5hbWVQaWVjZXMucHVzaChyZWdleEVzY2FwZShlcmFzW2ldLm5hbWUpKTtcbiAgICAgICAgICAgIGFiYnJQaWVjZXMucHVzaChyZWdleEVzY2FwZShlcmFzW2ldLmFiYnIpKTtcbiAgICAgICAgICAgIG5hcnJvd1BpZWNlcy5wdXNoKHJlZ2V4RXNjYXBlKGVyYXNbaV0ubmFycm93KSk7XG5cbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2gocmVnZXhFc2NhcGUoZXJhc1tpXS5uYW1lKSk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHJlZ2V4RXNjYXBlKGVyYXNbaV0uYWJicikpO1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXMucHVzaChyZWdleEVzY2FwZShlcmFzW2ldLm5hcnJvdykpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZXJhc1JlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbWl4ZWRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgICAgICB0aGlzLl9lcmFzTmFtZVJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbmFtZVBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgICAgIHRoaXMuX2VyYXNBYmJyUmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBhYmJyUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICAgICAgdGhpcy5fZXJhc05hcnJvd1JlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICdeKCcgKyBuYXJyb3dQaWVjZXMuam9pbignfCcpICsgJyknLFxuICAgICAgICAgICAgJ2knXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydnZycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlZWtZZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ0dHJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNvV2Vla1llYXIoKSAlIDEwMDtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4odG9rZW4sIGdldHRlcikge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbigwLCBbdG9rZW4sIHRva2VuLmxlbmd0aF0sIDAsIGdldHRlcik7XG4gICAgfVxuXG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignZ2dnZycsICd3ZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2dnJywgJ3dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignR0dHRycsICdpc29XZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ0dHR0dHJywgJ2lzb1dlZWtZZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3dlZWtZZWFyJywgJ2dnJyk7XG4gICAgYWRkVW5pdEFsaWFzKCdpc29XZWVrWWVhcicsICdHRycpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnd2Vla1llYXInLCAxKTtcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2lzb1dlZWtZZWFyJywgMSk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdHJywgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2cnLCBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignR0cnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignZ2cnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignR0dHRycsIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdnZ2dnJywgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHR0dHJywgbWF0Y2gxdG82LCBtYXRjaDYpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnZ2dnJywgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oXG4gICAgICAgIFsnZ2dnZycsICdnZ2dnZycsICdHR0dHJywgJ0dHR0dHJ10sXG4gICAgICAgIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICAgICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMildID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZ2cnLCAnR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW5dID0gaG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2Vla1llYXIoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGdldFNldFdlZWtZZWFySGVscGVyLmNhbGwoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICB0aGlzLndlZWsoKSxcbiAgICAgICAgICAgIHRoaXMud2Vla2RheSgpLFxuICAgICAgICAgICAgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93LFxuICAgICAgICAgICAgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG95XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPV2Vla1llYXIoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGdldFNldFdlZWtZZWFySGVscGVyLmNhbGwoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICB0aGlzLmlzb1dlZWsoKSxcbiAgICAgICAgICAgIHRoaXMuaXNvV2Vla2RheSgpLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDRcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJU09XZWVrc0luWWVhcigpIHtcbiAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCAxLCA0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJU09XZWVrc0luSVNPV2Vla1llYXIoKSB7XG4gICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLmlzb1dlZWtZZWFyKCksIDEsIDQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFdlZWtzSW5ZZWFyKCkge1xuICAgICAgICB2YXIgd2Vla0luZm8gPSB0aGlzLmxvY2FsZURhdGEoKS5fd2VlaztcbiAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0V2Vla3NJbldlZWtZZWFyKCkge1xuICAgICAgICB2YXIgd2Vla0luZm8gPSB0aGlzLmxvY2FsZURhdGEoKS5fd2VlaztcbiAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMud2Vla1llYXIoKSwgd2Vla0luZm8uZG93LCB3ZWVrSW5mby5kb3kpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldFdlZWtZZWFySGVscGVyKGlucHV0LCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSkge1xuICAgICAgICB2YXIgd2Vla3NUYXJnZXQ7XG4gICAgICAgIGlmIChpbnB1dCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gd2Vla09mWWVhcih0aGlzLCBkb3csIGRveSkueWVhcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdlZWtzVGFyZ2V0ID0gd2Vla3NJblllYXIoaW5wdXQsIGRvdywgZG95KTtcbiAgICAgICAgICAgIGlmICh3ZWVrID4gd2Vla3NUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICB3ZWVrID0gd2Vla3NUYXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2V0V2Vla0FsbC5jYWxsKHRoaXMsIGlucHV0LCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRXZWVrQWxsKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSkge1xuICAgICAgICB2YXIgZGF5T2ZZZWFyRGF0YSA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpLFxuICAgICAgICAgICAgZGF0ZSA9IGNyZWF0ZVVUQ0RhdGUoZGF5T2ZZZWFyRGF0YS55ZWFyLCAwLCBkYXlPZlllYXJEYXRhLmRheU9mWWVhcik7XG5cbiAgICAgICAgdGhpcy55ZWFyKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSk7XG4gICAgICAgIHRoaXMubW9udGgoZGF0ZS5nZXRVVENNb250aCgpKTtcbiAgICAgICAgdGhpcy5kYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1EnLCAwLCAnUW8nLCAncXVhcnRlcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdxdWFydGVyJywgJ1EnKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3F1YXJ0ZXInLCA3KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1EnLCBtYXRjaDEpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1EnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9ICh0b0ludChpbnB1dCkgLSAxKSAqIDM7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRRdWFydGVyKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsXG4gICAgICAgICAgICA/IE1hdGguY2VpbCgodGhpcy5tb250aCgpICsgMSkgLyAzKVxuICAgICAgICAgICAgOiB0aGlzLm1vbnRoKChpbnB1dCAtIDEpICogMyArICh0aGlzLm1vbnRoKCkgJSAzKSk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0QnLCBbJ0REJywgMl0sICdEbycsICdkYXRlJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RhdGUnLCAnRCcpO1xuXG4gICAgLy8gUFJJT1JJVFlcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2RhdGUnLCA5KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0QnLCBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIFwib3JkaW5hbFBhcnNlXCIgZmFsbGJhY2sgaW4gbmV4dCBtYWpvciByZWxlYXNlLlxuICAgICAgICByZXR1cm4gaXNTdHJpY3RcbiAgICAgICAgICAgID8gbG9jYWxlLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlIHx8IGxvY2FsZS5fb3JkaW5hbFBhcnNlXG4gICAgICAgICAgICA6IGxvY2FsZS5fZGF5T2ZNb250aE9yZGluYWxQYXJzZUxlbmllbnQ7XG4gICAgfSk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnRCcsICdERCddLCBEQVRFKTtcbiAgICBhZGRQYXJzZVRva2VuKCdEbycsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbREFURV0gPSB0b0ludChpbnB1dC5tYXRjaChtYXRjaDF0bzIpWzBdKTtcbiAgICB9KTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXREYXlPZk1vbnRoID0gbWFrZUdldFNldCgnRGF0ZScsIHRydWUpO1xuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0RERCcsIFsnRERERCcsIDNdLCAnREREbycsICdkYXlPZlllYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF5T2ZZZWFyJywgJ0RERCcpO1xuXG4gICAgLy8gUFJJT1JJVFlcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2RheU9mWWVhcicsIDQpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignREREJywgbWF0Y2gxdG8zKTtcbiAgICBhZGRSZWdleFRva2VuKCdEREREJywgbWF0Y2gzKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnREREJywgJ0REREQnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0RGF5T2ZZZWFyKGlucHV0KSB7XG4gICAgICAgIHZhciBkYXlPZlllYXIgPVxuICAgICAgICAgICAgTWF0aC5yb3VuZChcbiAgICAgICAgICAgICAgICAodGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpIC0gdGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ3llYXInKSkgLyA4NjRlNVxuICAgICAgICAgICAgKSArIDE7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gZGF5T2ZZZWFyIDogdGhpcy5hZGQoaW5wdXQgLSBkYXlPZlllYXIsICdkJyk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ20nLCBbJ21tJywgMl0sIDAsICdtaW51dGUnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbWludXRlJywgJ20nKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ21pbnV0ZScsIDE0KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ20nLCBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ21tJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydtJywgJ21tJ10sIE1JTlVURSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0TWludXRlID0gbWFrZUdldFNldCgnTWludXRlcycsIGZhbHNlKTtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdzJywgWydzcycsIDJdLCAwLCAnc2Vjb25kJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3NlY29uZCcsICdzJyk7XG5cbiAgICAvLyBQUklPUklUWVxuXG4gICAgYWRkVW5pdFByaW9yaXR5KCdzZWNvbmQnLCAxNSk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdzJywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdzcycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRQYXJzZVRva2VuKFsncycsICdzcyddLCBTRUNPTkQpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldFNlY29uZCA9IG1ha2VHZXRTZXQoJ1NlY29uZHMnLCBmYWxzZSk7XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignUycsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIH5+KHRoaXMubWlsbGlzZWNvbmQoKSAvIDEwMCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIH5+KHRoaXMubWlsbGlzZWNvbmQoKSAvIDEwKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTJywgM10sIDAsICdtaWxsaXNlY29uZCcpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTUycsIDRdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTJywgNV0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTUycsIDZdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTUycsIDddLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1NTJywgOF0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1NTUycsIDldLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDAwO1xuICAgIH0pO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaWxsaXNlY29uZCcsICdtcycpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnbWlsbGlzZWNvbmQnLCAxNik7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdTJywgbWF0Y2gxdG8zLCBtYXRjaDEpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTJywgbWF0Y2gxdG8zLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTUycsIG1hdGNoMXRvMywgbWF0Y2gzKTtcblxuICAgIHZhciB0b2tlbiwgZ2V0U2V0TWlsbGlzZWNvbmQ7XG4gICAgZm9yICh0b2tlbiA9ICdTU1NTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgICAgICBhZGRSZWdleFRva2VuKHRva2VuLCBtYXRjaFVuc2lnbmVkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU1zKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xuICAgIH1cblxuICAgIGZvciAodG9rZW4gPSAnUyc7IHRva2VuLmxlbmd0aCA8PSA5OyB0b2tlbiArPSAnUycpIHtcbiAgICAgICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgcGFyc2VNcyk7XG4gICAgfVxuXG4gICAgZ2V0U2V0TWlsbGlzZWNvbmQgPSBtYWtlR2V0U2V0KCdNaWxsaXNlY29uZHMnLCBmYWxzZSk7XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbigneicsIDAsIDAsICd6b25lQWJicicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd6eicsIDAsIDAsICd6b25lTmFtZScpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZUFiYnIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdVVEMnIDogJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZU5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdDb29yZGluYXRlZCBVbml2ZXJzYWwgVGltZScgOiAnJztcbiAgICB9XG5cbiAgICB2YXIgcHJvdG8gPSBNb21lbnQucHJvdG90eXBlO1xuXG4gICAgcHJvdG8uYWRkID0gYWRkO1xuICAgIHByb3RvLmNhbGVuZGFyID0gY2FsZW5kYXIkMTtcbiAgICBwcm90by5jbG9uZSA9IGNsb25lO1xuICAgIHByb3RvLmRpZmYgPSBkaWZmO1xuICAgIHByb3RvLmVuZE9mID0gZW5kT2Y7XG4gICAgcHJvdG8uZm9ybWF0ID0gZm9ybWF0O1xuICAgIHByb3RvLmZyb20gPSBmcm9tO1xuICAgIHByb3RvLmZyb21Ob3cgPSBmcm9tTm93O1xuICAgIHByb3RvLnRvID0gdG87XG4gICAgcHJvdG8udG9Ob3cgPSB0b05vdztcbiAgICBwcm90by5nZXQgPSBzdHJpbmdHZXQ7XG4gICAgcHJvdG8uaW52YWxpZEF0ID0gaW52YWxpZEF0O1xuICAgIHByb3RvLmlzQWZ0ZXIgPSBpc0FmdGVyO1xuICAgIHByb3RvLmlzQmVmb3JlID0gaXNCZWZvcmU7XG4gICAgcHJvdG8uaXNCZXR3ZWVuID0gaXNCZXR3ZWVuO1xuICAgIHByb3RvLmlzU2FtZSA9IGlzU2FtZTtcbiAgICBwcm90by5pc1NhbWVPckFmdGVyID0gaXNTYW1lT3JBZnRlcjtcbiAgICBwcm90by5pc1NhbWVPckJlZm9yZSA9IGlzU2FtZU9yQmVmb3JlO1xuICAgIHByb3RvLmlzVmFsaWQgPSBpc1ZhbGlkJDI7XG4gICAgcHJvdG8ubGFuZyA9IGxhbmc7XG4gICAgcHJvdG8ubG9jYWxlID0gbG9jYWxlO1xuICAgIHByb3RvLmxvY2FsZURhdGEgPSBsb2NhbGVEYXRhO1xuICAgIHByb3RvLm1heCA9IHByb3RvdHlwZU1heDtcbiAgICBwcm90by5taW4gPSBwcm90b3R5cGVNaW47XG4gICAgcHJvdG8ucGFyc2luZ0ZsYWdzID0gcGFyc2luZ0ZsYWdzO1xuICAgIHByb3RvLnNldCA9IHN0cmluZ1NldDtcbiAgICBwcm90by5zdGFydE9mID0gc3RhcnRPZjtcbiAgICBwcm90by5zdWJ0cmFjdCA9IHN1YnRyYWN0O1xuICAgIHByb3RvLnRvQXJyYXkgPSB0b0FycmF5O1xuICAgIHByb3RvLnRvT2JqZWN0ID0gdG9PYmplY3Q7XG4gICAgcHJvdG8udG9EYXRlID0gdG9EYXRlO1xuICAgIHByb3RvLnRvSVNPU3RyaW5nID0gdG9JU09TdHJpbmc7XG4gICAgcHJvdG8uaW5zcGVjdCA9IGluc3BlY3Q7XG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC5mb3IgIT0gbnVsbCkge1xuICAgICAgICBwcm90b1tTeW1ib2wuZm9yKCdub2RlanMudXRpbC5pbnNwZWN0LmN1c3RvbScpXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnTW9tZW50PCcgKyB0aGlzLmZvcm1hdCgpICsgJz4nO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBwcm90by50b0pTT04gPSB0b0pTT047XG4gICAgcHJvdG8udG9TdHJpbmcgPSB0b1N0cmluZztcbiAgICBwcm90by51bml4ID0gdW5peDtcbiAgICBwcm90by52YWx1ZU9mID0gdmFsdWVPZjtcbiAgICBwcm90by5jcmVhdGlvbkRhdGEgPSBjcmVhdGlvbkRhdGE7XG4gICAgcHJvdG8uZXJhTmFtZSA9IGdldEVyYU5hbWU7XG4gICAgcHJvdG8uZXJhTmFycm93ID0gZ2V0RXJhTmFycm93O1xuICAgIHByb3RvLmVyYUFiYnIgPSBnZXRFcmFBYmJyO1xuICAgIHByb3RvLmVyYVllYXIgPSBnZXRFcmFZZWFyO1xuICAgIHByb3RvLnllYXIgPSBnZXRTZXRZZWFyO1xuICAgIHByb3RvLmlzTGVhcFllYXIgPSBnZXRJc0xlYXBZZWFyO1xuICAgIHByb3RvLndlZWtZZWFyID0gZ2V0U2V0V2Vla1llYXI7XG4gICAgcHJvdG8uaXNvV2Vla1llYXIgPSBnZXRTZXRJU09XZWVrWWVhcjtcbiAgICBwcm90by5xdWFydGVyID0gcHJvdG8ucXVhcnRlcnMgPSBnZXRTZXRRdWFydGVyO1xuICAgIHByb3RvLm1vbnRoID0gZ2V0U2V0TW9udGg7XG4gICAgcHJvdG8uZGF5c0luTW9udGggPSBnZXREYXlzSW5Nb250aDtcbiAgICBwcm90by53ZWVrID0gcHJvdG8ud2Vla3MgPSBnZXRTZXRXZWVrO1xuICAgIHByb3RvLmlzb1dlZWsgPSBwcm90by5pc29XZWVrcyA9IGdldFNldElTT1dlZWs7XG4gICAgcHJvdG8ud2Vla3NJblllYXIgPSBnZXRXZWVrc0luWWVhcjtcbiAgICBwcm90by53ZWVrc0luV2Vla1llYXIgPSBnZXRXZWVrc0luV2Vla1llYXI7XG4gICAgcHJvdG8uaXNvV2Vla3NJblllYXIgPSBnZXRJU09XZWVrc0luWWVhcjtcbiAgICBwcm90by5pc29XZWVrc0luSVNPV2Vla1llYXIgPSBnZXRJU09XZWVrc0luSVNPV2Vla1llYXI7XG4gICAgcHJvdG8uZGF0ZSA9IGdldFNldERheU9mTW9udGg7XG4gICAgcHJvdG8uZGF5ID0gcHJvdG8uZGF5cyA9IGdldFNldERheU9mV2VlaztcbiAgICBwcm90by53ZWVrZGF5ID0gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrO1xuICAgIHByb3RvLmlzb1dlZWtkYXkgPSBnZXRTZXRJU09EYXlPZldlZWs7XG4gICAgcHJvdG8uZGF5T2ZZZWFyID0gZ2V0U2V0RGF5T2ZZZWFyO1xuICAgIHByb3RvLmhvdXIgPSBwcm90by5ob3VycyA9IGdldFNldEhvdXI7XG4gICAgcHJvdG8ubWludXRlID0gcHJvdG8ubWludXRlcyA9IGdldFNldE1pbnV0ZTtcbiAgICBwcm90by5zZWNvbmQgPSBwcm90by5zZWNvbmRzID0gZ2V0U2V0U2Vjb25kO1xuICAgIHByb3RvLm1pbGxpc2Vjb25kID0gcHJvdG8ubWlsbGlzZWNvbmRzID0gZ2V0U2V0TWlsbGlzZWNvbmQ7XG4gICAgcHJvdG8udXRjT2Zmc2V0ID0gZ2V0U2V0T2Zmc2V0O1xuICAgIHByb3RvLnV0YyA9IHNldE9mZnNldFRvVVRDO1xuICAgIHByb3RvLmxvY2FsID0gc2V0T2Zmc2V0VG9Mb2NhbDtcbiAgICBwcm90by5wYXJzZVpvbmUgPSBzZXRPZmZzZXRUb1BhcnNlZE9mZnNldDtcbiAgICBwcm90by5oYXNBbGlnbmVkSG91ck9mZnNldCA9IGhhc0FsaWduZWRIb3VyT2Zmc2V0O1xuICAgIHByb3RvLmlzRFNUID0gaXNEYXlsaWdodFNhdmluZ1RpbWU7XG4gICAgcHJvdG8uaXNMb2NhbCA9IGlzTG9jYWw7XG4gICAgcHJvdG8uaXNVdGNPZmZzZXQgPSBpc1V0Y09mZnNldDtcbiAgICBwcm90by5pc1V0YyA9IGlzVXRjO1xuICAgIHByb3RvLmlzVVRDID0gaXNVdGM7XG4gICAgcHJvdG8uem9uZUFiYnIgPSBnZXRab25lQWJicjtcbiAgICBwcm90by56b25lTmFtZSA9IGdldFpvbmVOYW1lO1xuICAgIHByb3RvLmRhdGVzID0gZGVwcmVjYXRlKFxuICAgICAgICAnZGF0ZXMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIGRhdGUgaW5zdGVhZC4nLFxuICAgICAgICBnZXRTZXREYXlPZk1vbnRoXG4gICAgKTtcbiAgICBwcm90by5tb250aHMgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb250aHMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbnRoIGluc3RlYWQnLFxuICAgICAgICBnZXRTZXRNb250aFxuICAgICk7XG4gICAgcHJvdG8ueWVhcnMgPSBkZXByZWNhdGUoXG4gICAgICAgICd5ZWFycyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgeWVhciBpbnN0ZWFkJyxcbiAgICAgICAgZ2V0U2V0WWVhclxuICAgICk7XG4gICAgcHJvdG8uem9uZSA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudCgpLnpvbmUgaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudCgpLnV0Y09mZnNldCBpbnN0ZWFkLiBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL3pvbmUvJyxcbiAgICAgICAgZ2V0U2V0Wm9uZVxuICAgICk7XG4gICAgcHJvdG8uaXNEU1RTaGlmdGVkID0gZGVwcmVjYXRlKFxuICAgICAgICAnaXNEU1RTaGlmdGVkIGlzIGRlcHJlY2F0ZWQuIFNlZSBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL2RzdC1zaGlmdGVkLyBmb3IgbW9yZSBpbmZvcm1hdGlvbicsXG4gICAgICAgIGlzRGF5bGlnaHRTYXZpbmdUaW1lU2hpZnRlZFxuICAgICk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVVbml4KGlucHV0KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbChpbnB1dCAqIDEwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUluWm9uZSgpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cykucGFyc2Vab25lKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlUGFyc2VQb3N0Rm9ybWF0KHN0cmluZykge1xuICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgIH1cblxuICAgIHZhciBwcm90byQxID0gTG9jYWxlLnByb3RvdHlwZTtcblxuICAgIHByb3RvJDEuY2FsZW5kYXIgPSBjYWxlbmRhcjtcbiAgICBwcm90byQxLmxvbmdEYXRlRm9ybWF0ID0gbG9uZ0RhdGVGb3JtYXQ7XG4gICAgcHJvdG8kMS5pbnZhbGlkRGF0ZSA9IGludmFsaWREYXRlO1xuICAgIHByb3RvJDEub3JkaW5hbCA9IG9yZGluYWw7XG4gICAgcHJvdG8kMS5wcmVwYXJzZSA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbiAgICBwcm90byQxLnBvc3Rmb3JtYXQgPSBwcmVQYXJzZVBvc3RGb3JtYXQ7XG4gICAgcHJvdG8kMS5yZWxhdGl2ZVRpbWUgPSByZWxhdGl2ZVRpbWU7XG4gICAgcHJvdG8kMS5wYXN0RnV0dXJlID0gcGFzdEZ1dHVyZTtcbiAgICBwcm90byQxLnNldCA9IHNldDtcbiAgICBwcm90byQxLmVyYXMgPSBsb2NhbGVFcmFzO1xuICAgIHByb3RvJDEuZXJhc1BhcnNlID0gbG9jYWxlRXJhc1BhcnNlO1xuICAgIHByb3RvJDEuZXJhc0NvbnZlcnRZZWFyID0gbG9jYWxlRXJhc0NvbnZlcnRZZWFyO1xuICAgIHByb3RvJDEuZXJhc0FiYnJSZWdleCA9IGVyYXNBYmJyUmVnZXg7XG4gICAgcHJvdG8kMS5lcmFzTmFtZVJlZ2V4ID0gZXJhc05hbWVSZWdleDtcbiAgICBwcm90byQxLmVyYXNOYXJyb3dSZWdleCA9IGVyYXNOYXJyb3dSZWdleDtcblxuICAgIHByb3RvJDEubW9udGhzID0gbG9jYWxlTW9udGhzO1xuICAgIHByb3RvJDEubW9udGhzU2hvcnQgPSBsb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90byQxLm1vbnRoc1BhcnNlID0gbG9jYWxlTW9udGhzUGFyc2U7XG4gICAgcHJvdG8kMS5tb250aHNSZWdleCA9IG1vbnRoc1JlZ2V4O1xuICAgIHByb3RvJDEubW9udGhzU2hvcnRSZWdleCA9IG1vbnRoc1Nob3J0UmVnZXg7XG4gICAgcHJvdG8kMS53ZWVrID0gbG9jYWxlV2VlaztcbiAgICBwcm90byQxLmZpcnN0RGF5T2ZZZWFyID0gbG9jYWxlRmlyc3REYXlPZlllYXI7XG4gICAgcHJvdG8kMS5maXJzdERheU9mV2VlayA9IGxvY2FsZUZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgcHJvdG8kMS53ZWVrZGF5cyA9IGxvY2FsZVdlZWtkYXlzO1xuICAgIHByb3RvJDEud2Vla2RheXNNaW4gPSBsb2NhbGVXZWVrZGF5c01pbjtcbiAgICBwcm90byQxLndlZWtkYXlzU2hvcnQgPSBsb2NhbGVXZWVrZGF5c1Nob3J0O1xuICAgIHByb3RvJDEud2Vla2RheXNQYXJzZSA9IGxvY2FsZVdlZWtkYXlzUGFyc2U7XG5cbiAgICBwcm90byQxLndlZWtkYXlzUmVnZXggPSB3ZWVrZGF5c1JlZ2V4O1xuICAgIHByb3RvJDEud2Vla2RheXNTaG9ydFJlZ2V4ID0gd2Vla2RheXNTaG9ydFJlZ2V4O1xuICAgIHByb3RvJDEud2Vla2RheXNNaW5SZWdleCA9IHdlZWtkYXlzTWluUmVnZXg7XG5cbiAgICBwcm90byQxLmlzUE0gPSBsb2NhbGVJc1BNO1xuICAgIHByb3RvJDEubWVyaWRpZW0gPSBsb2NhbGVNZXJpZGllbTtcblxuICAgIGZ1bmN0aW9uIGdldCQxKGZvcm1hdCwgaW5kZXgsIGZpZWxkLCBzZXR0ZXIpIHtcbiAgICAgICAgdmFyIGxvY2FsZSA9IGdldExvY2FsZSgpLFxuICAgICAgICAgICAgdXRjID0gY3JlYXRlVVRDKCkuc2V0KHNldHRlciwgaW5kZXgpO1xuICAgICAgICByZXR1cm4gbG9jYWxlW2ZpZWxkXSh1dGMsIGZvcm1hdCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdE1vbnRoc0ltcGwoZm9ybWF0LCBpbmRleCwgZmllbGQpIHtcbiAgICAgICAgaWYgKGlzTnVtYmVyKGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuXG4gICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0JDEoZm9ybWF0LCBpbmRleCwgZmllbGQsICdtb250aCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBvdXQgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIG91dFtpXSA9IGdldCQxKGZvcm1hdCwgaSwgZmllbGQsICdtb250aCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLy8gKClcbiAgICAvLyAoNSlcbiAgICAvLyAoZm10LCA1KVxuICAgIC8vIChmbXQpXG4gICAgLy8gKHRydWUpXG4gICAgLy8gKHRydWUsIDUpXG4gICAgLy8gKHRydWUsIGZtdCwgNSlcbiAgICAvLyAodHJ1ZSwgZm10KVxuICAgIGZ1bmN0aW9uIGxpc3RXZWVrZGF5c0ltcGwobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCBmaWVsZCkge1xuICAgICAgICBpZiAodHlwZW9mIGxvY2FsZVNvcnRlZCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBpZiAoaXNOdW1iZXIoZm9ybWF0KSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9ybWF0ID0gbG9jYWxlU29ydGVkO1xuICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICBsb2NhbGVTb3J0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGlzTnVtYmVyKGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2NhbGUgPSBnZXRMb2NhbGUoKSxcbiAgICAgICAgICAgIHNoaWZ0ID0gbG9jYWxlU29ydGVkID8gbG9jYWxlLl93ZWVrLmRvdyA6IDAsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgb3V0ID0gW107XG5cbiAgICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXQkMShmb3JtYXQsIChpbmRleCArIHNoaWZ0KSAlIDcsIGZpZWxkLCAnZGF5Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBvdXRbaV0gPSBnZXQkMShmb3JtYXQsIChpICsgc2hpZnQpICUgNywgZmllbGQsICdkYXknKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RNb250aHMoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdE1vbnRoc0ltcGwoZm9ybWF0LCBpbmRleCwgJ21vbnRocycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RNb250aHNTaG9ydChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0TW9udGhzSW1wbChmb3JtYXQsIGluZGV4LCAnbW9udGhzU2hvcnQnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0V2Vla2RheXMobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0V2Vla2RheXNJbXBsKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdFdlZWtkYXlzU2hvcnQobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0V2Vla2RheXNJbXBsKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzU2hvcnQnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0V2Vla2RheXNNaW4obG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0V2Vla2RheXNJbXBsKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzTWluJyk7XG4gICAgfVxuXG4gICAgZ2V0U2V0R2xvYmFsTG9jYWxlKCdlbicsIHtcbiAgICAgICAgZXJhczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNpbmNlOiAnMDAwMS0wMS0wMScsXG4gICAgICAgICAgICAgICAgdW50aWw6ICtJbmZpbml0eSxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDEsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0Fubm8gRG9taW5pJyxcbiAgICAgICAgICAgICAgICBuYXJyb3c6ICdBRCcsXG4gICAgICAgICAgICAgICAgYWJicjogJ0FEJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2luY2U6ICcwMDAwLTEyLTMxJyxcbiAgICAgICAgICAgICAgICB1bnRpbDogLUluZmluaXR5LFxuICAgICAgICAgICAgICAgIG9mZnNldDogMSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnQmVmb3JlIENocmlzdCcsXG4gICAgICAgICAgICAgICAgbmFycm93OiAnQkMnLFxuICAgICAgICAgICAgICAgIGFiYnI6ICdCQycsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBkYXlPZk1vbnRoT3JkaW5hbFBhcnNlOiAvXFxkezEsMn0odGh8c3R8bmR8cmQpLyxcbiAgICAgICAgb3JkaW5hbDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICAgICAgdmFyIGIgPSBudW1iZXIgJSAxMCxcbiAgICAgICAgICAgICAgICBvdXRwdXQgPVxuICAgICAgICAgICAgICAgICAgICB0b0ludCgobnVtYmVyICUgMTAwKSAvIDEwKSA9PT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgPyAndGgnXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGIgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ3N0J1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBiID09PSAyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICduZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIDogYiA9PT0gM1xuICAgICAgICAgICAgICAgICAgICAgICAgPyAncmQnXG4gICAgICAgICAgICAgICAgICAgICAgICA6ICd0aCc7XG4gICAgICAgICAgICByZXR1cm4gbnVtYmVyICsgb3V0cHV0O1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuXG4gICAgaG9va3MubGFuZyA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudC5sYW5nIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlIGluc3RlYWQuJyxcbiAgICAgICAgZ2V0U2V0R2xvYmFsTG9jYWxlXG4gICAgKTtcbiAgICBob29rcy5sYW5nRGF0YSA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudC5sYW5nRGF0YSBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZURhdGEgaW5zdGVhZC4nLFxuICAgICAgICBnZXRMb2NhbGVcbiAgICApO1xuXG4gICAgdmFyIG1hdGhBYnMgPSBNYXRoLmFicztcblxuICAgIGZ1bmN0aW9uIGFicygpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhO1xuXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9IG1hdGhBYnModGhpcy5fbWlsbGlzZWNvbmRzKTtcbiAgICAgICAgdGhpcy5fZGF5cyA9IG1hdGhBYnModGhpcy5fZGF5cyk7XG4gICAgICAgIHRoaXMuX21vbnRocyA9IG1hdGhBYnModGhpcy5fbW9udGhzKTtcblxuICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyA9IG1hdGhBYnMoZGF0YS5taWxsaXNlY29uZHMpO1xuICAgICAgICBkYXRhLnNlY29uZHMgPSBtYXRoQWJzKGRhdGEuc2Vjb25kcyk7XG4gICAgICAgIGRhdGEubWludXRlcyA9IG1hdGhBYnMoZGF0YS5taW51dGVzKTtcbiAgICAgICAgZGF0YS5ob3VycyA9IG1hdGhBYnMoZGF0YS5ob3Vycyk7XG4gICAgICAgIGRhdGEubW9udGhzID0gbWF0aEFicyhkYXRhLm1vbnRocyk7XG4gICAgICAgIGRhdGEueWVhcnMgPSBtYXRoQWJzKGRhdGEueWVhcnMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFN1YnRyYWN0JDEoZHVyYXRpb24sIGlucHV0LCB2YWx1ZSwgZGlyZWN0aW9uKSB7XG4gICAgICAgIHZhciBvdGhlciA9IGNyZWF0ZUR1cmF0aW9uKGlucHV0LCB2YWx1ZSk7XG5cbiAgICAgICAgZHVyYXRpb24uX21pbGxpc2Vjb25kcyArPSBkaXJlY3Rpb24gKiBvdGhlci5fbWlsbGlzZWNvbmRzO1xuICAgICAgICBkdXJhdGlvbi5fZGF5cyArPSBkaXJlY3Rpb24gKiBvdGhlci5fZGF5cztcbiAgICAgICAgZHVyYXRpb24uX21vbnRocyArPSBkaXJlY3Rpb24gKiBvdGhlci5fbW9udGhzO1xuXG4gICAgICAgIHJldHVybiBkdXJhdGlvbi5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgYWRkKDEsICdzJykgb3IgYWRkKGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIGFkZCQxKGlucHV0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gYWRkU3VidHJhY3QkMSh0aGlzLCBpbnB1dCwgdmFsdWUsIDEpO1xuICAgIH1cblxuICAgIC8vIHN1cHBvcnRzIG9ubHkgMi4wLXN0eWxlIHN1YnRyYWN0KDEsICdzJykgb3Igc3VidHJhY3QoZHVyYXRpb24pXG4gICAgZnVuY3Rpb24gc3VidHJhY3QkMShpbnB1dCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGFkZFN1YnRyYWN0JDEodGhpcywgaW5wdXQsIHZhbHVlLCAtMSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzQ2VpbChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWJibGUoKSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICBkYXlzID0gdGhpcy5fZGF5cyxcbiAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyxcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9kYXRhLFxuICAgICAgICAgICAgc2Vjb25kcyxcbiAgICAgICAgICAgIG1pbnV0ZXMsXG4gICAgICAgICAgICBob3VycyxcbiAgICAgICAgICAgIHllYXJzLFxuICAgICAgICAgICAgbW9udGhzRnJvbURheXM7XG5cbiAgICAgICAgLy8gaWYgd2UgaGF2ZSBhIG1peCBvZiBwb3NpdGl2ZSBhbmQgbmVnYXRpdmUgdmFsdWVzLCBidWJibGUgZG93biBmaXJzdFxuICAgICAgICAvLyBjaGVjazogaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzIxNjZcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIShcbiAgICAgICAgICAgICAgICAobWlsbGlzZWNvbmRzID49IDAgJiYgZGF5cyA+PSAwICYmIG1vbnRocyA+PSAwKSB8fFxuICAgICAgICAgICAgICAgIChtaWxsaXNlY29uZHMgPD0gMCAmJiBkYXlzIDw9IDAgJiYgbW9udGhzIDw9IDApXG4gICAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgICAgbWlsbGlzZWNvbmRzICs9IGFic0NlaWwobW9udGhzVG9EYXlzKG1vbnRocykgKyBkYXlzKSAqIDg2NGU1O1xuICAgICAgICAgICAgZGF5cyA9IDA7XG4gICAgICAgICAgICBtb250aHMgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBjb2RlIGJ1YmJsZXMgdXAgdmFsdWVzLCBzZWUgdGhlIHRlc3RzIGZvclxuICAgICAgICAvLyBleGFtcGxlcyBvZiB3aGF0IHRoYXQgbWVhbnMuXG4gICAgICAgIGRhdGEubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzICUgMTAwMDtcblxuICAgICAgICBzZWNvbmRzID0gYWJzRmxvb3IobWlsbGlzZWNvbmRzIC8gMTAwMCk7XG4gICAgICAgIGRhdGEuc2Vjb25kcyA9IHNlY29uZHMgJSA2MDtcblxuICAgICAgICBtaW51dGVzID0gYWJzRmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgZGF0YS5taW51dGVzID0gbWludXRlcyAlIDYwO1xuXG4gICAgICAgIGhvdXJzID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICAgICAgZGF0YS5ob3VycyA9IGhvdXJzICUgMjQ7XG5cbiAgICAgICAgZGF5cyArPSBhYnNGbG9vcihob3VycyAvIDI0KTtcblxuICAgICAgICAvLyBjb252ZXJ0IGRheXMgdG8gbW9udGhzXG4gICAgICAgIG1vbnRoc0Zyb21EYXlzID0gYWJzRmxvb3IoZGF5c1RvTW9udGhzKGRheXMpKTtcbiAgICAgICAgbW9udGhzICs9IG1vbnRoc0Zyb21EYXlzO1xuICAgICAgICBkYXlzIC09IGFic0NlaWwobW9udGhzVG9EYXlzKG1vbnRoc0Zyb21EYXlzKSk7XG5cbiAgICAgICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgICAgICB5ZWFycyA9IGFic0Zsb29yKG1vbnRocyAvIDEyKTtcbiAgICAgICAgbW9udGhzICU9IDEyO1xuXG4gICAgICAgIGRhdGEuZGF5cyA9IGRheXM7XG4gICAgICAgIGRhdGEubW9udGhzID0gbW9udGhzO1xuICAgICAgICBkYXRhLnllYXJzID0geWVhcnM7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5c1RvTW9udGhzKGRheXMpIHtcbiAgICAgICAgLy8gNDAwIHllYXJzIGhhdmUgMTQ2MDk3IGRheXMgKHRha2luZyBpbnRvIGFjY291bnQgbGVhcCB5ZWFyIHJ1bGVzKVxuICAgICAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxMiBtb250aHMgPT09IDQ4MDBcbiAgICAgICAgcmV0dXJuIChkYXlzICogNDgwMCkgLyAxNDYwOTc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9udGhzVG9EYXlzKG1vbnRocykge1xuICAgICAgICAvLyB0aGUgcmV2ZXJzZSBvZiBkYXlzVG9Nb250aHNcbiAgICAgICAgcmV0dXJuIChtb250aHMgKiAxNDYwOTcpIC8gNDgwMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcyh1bml0cykge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkYXlzLFxuICAgICAgICAgICAgbW9udGhzLFxuICAgICAgICAgICAgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuXG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3F1YXJ0ZXInIHx8IHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgIGRheXMgPSB0aGlzLl9kYXlzICsgbWlsbGlzZWNvbmRzIC8gODY0ZTU7XG4gICAgICAgICAgICBtb250aHMgPSB0aGlzLl9tb250aHMgKyBkYXlzVG9Nb250aHMoZGF5cyk7XG4gICAgICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9udGhzO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9udGhzIC8gMztcbiAgICAgICAgICAgICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vbnRocyAvIDEyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaGFuZGxlIG1pbGxpc2Vjb25kcyBzZXBhcmF0ZWx5IGJlY2F1c2Ugb2YgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgKGlzc3VlICMxODY3KVxuICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyBNYXRoLnJvdW5kKG1vbnRoc1RvRGF5cyh0aGlzLl9tb250aHMpKTtcbiAgICAgICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRheXMgLyA3ICsgbWlsbGlzZWNvbmRzIC8gNjA0OGU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXlzICsgbWlsbGlzZWNvbmRzIC8gODY0ZTU7XG4gICAgICAgICAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXlzICogMjQgKyBtaWxsaXNlY29uZHMgLyAzNmU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXlzICogMTQ0MCArIG1pbGxpc2Vjb25kcyAvIDZlNDtcbiAgICAgICAgICAgICAgICBjYXNlICdzZWNvbmQnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF5cyAqIDg2NDAwICsgbWlsbGlzZWNvbmRzIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAvLyBNYXRoLmZsb29yIHByZXZlbnRzIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIGhlcmVcbiAgICAgICAgICAgICAgICBjYXNlICdtaWxsaXNlY29uZCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKGRheXMgKiA4NjRlNSkgKyBtaWxsaXNlY29uZHM7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHVuaXQgJyArIHVuaXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSB0aGlzLmFzKCdtcycpP1xuICAgIGZ1bmN0aW9uIHZhbHVlT2YkMSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzICtcbiAgICAgICAgICAgIHRoaXMuX2RheXMgKiA4NjRlNSArXG4gICAgICAgICAgICAodGhpcy5fbW9udGhzICUgMTIpICogMjU5MmU2ICtcbiAgICAgICAgICAgIHRvSW50KHRoaXMuX21vbnRocyAvIDEyKSAqIDMxNTM2ZTZcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlQXMoYWxpYXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFzKGFsaWFzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYXNNaWxsaXNlY29uZHMgPSBtYWtlQXMoJ21zJyksXG4gICAgICAgIGFzU2Vjb25kcyA9IG1ha2VBcygncycpLFxuICAgICAgICBhc01pbnV0ZXMgPSBtYWtlQXMoJ20nKSxcbiAgICAgICAgYXNIb3VycyA9IG1ha2VBcygnaCcpLFxuICAgICAgICBhc0RheXMgPSBtYWtlQXMoJ2QnKSxcbiAgICAgICAgYXNXZWVrcyA9IG1ha2VBcygndycpLFxuICAgICAgICBhc01vbnRocyA9IG1ha2VBcygnTScpLFxuICAgICAgICBhc1F1YXJ0ZXJzID0gbWFrZUFzKCdRJyksXG4gICAgICAgIGFzWWVhcnMgPSBtYWtlQXMoJ3knKTtcblxuICAgIGZ1bmN0aW9uIGNsb25lJDEoKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVEdXJhdGlvbih0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXQkMih1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpc1t1bml0cyArICdzJ10oKSA6IE5hTjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlR2V0dGVyKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMuX2RhdGFbbmFtZV0gOiBOYU47XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IG1ha2VHZXR0ZXIoJ21pbGxpc2Vjb25kcycpLFxuICAgICAgICBzZWNvbmRzID0gbWFrZUdldHRlcignc2Vjb25kcycpLFxuICAgICAgICBtaW51dGVzID0gbWFrZUdldHRlcignbWludXRlcycpLFxuICAgICAgICBob3VycyA9IG1ha2VHZXR0ZXIoJ2hvdXJzJyksXG4gICAgICAgIGRheXMgPSBtYWtlR2V0dGVyKCdkYXlzJyksXG4gICAgICAgIG1vbnRocyA9IG1ha2VHZXR0ZXIoJ21vbnRocycpLFxuICAgICAgICB5ZWFycyA9IG1ha2VHZXR0ZXIoJ3llYXJzJyk7XG5cbiAgICBmdW5jdGlvbiB3ZWVrcygpIHtcbiAgICAgICAgcmV0dXJuIGFic0Zsb29yKHRoaXMuZGF5cygpIC8gNyk7XG4gICAgfVxuXG4gICAgdmFyIHJvdW5kID0gTWF0aC5yb3VuZCxcbiAgICAgICAgdGhyZXNob2xkcyA9IHtcbiAgICAgICAgICAgIHNzOiA0NCwgLy8gYSBmZXcgc2Vjb25kcyB0byBzZWNvbmRzXG4gICAgICAgICAgICBzOiA0NSwgLy8gc2Vjb25kcyB0byBtaW51dGVcbiAgICAgICAgICAgIG06IDQ1LCAvLyBtaW51dGVzIHRvIGhvdXJcbiAgICAgICAgICAgIGg6IDIyLCAvLyBob3VycyB0byBkYXlcbiAgICAgICAgICAgIGQ6IDI2LCAvLyBkYXlzIHRvIG1vbnRoL3dlZWtcbiAgICAgICAgICAgIHc6IG51bGwsIC8vIHdlZWtzIHRvIG1vbnRoXG4gICAgICAgICAgICBNOiAxMSwgLy8gbW9udGhzIHRvIHllYXJcbiAgICAgICAgfTtcblxuICAgIC8vIGhlbHBlciBmdW5jdGlvbiBmb3IgbW9tZW50LmZuLmZyb20sIG1vbWVudC5mbi5mcm9tTm93LCBhbmQgbW9tZW50LmR1cmF0aW9uLmZuLmh1bWFuaXplXG4gICAgZnVuY3Rpb24gc3Vic3RpdHV0ZVRpbWVBZ28oc3RyaW5nLCBudW1iZXIsIHdpdGhvdXRTdWZmaXgsIGlzRnV0dXJlLCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5yZWxhdGl2ZVRpbWUobnVtYmVyIHx8IDEsICEhd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVsYXRpdmVUaW1lJDEocG9zTmVnRHVyYXRpb24sIHdpdGhvdXRTdWZmaXgsIHRocmVzaG9sZHMsIGxvY2FsZSkge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBjcmVhdGVEdXJhdGlvbihwb3NOZWdEdXJhdGlvbikuYWJzKCksXG4gICAgICAgICAgICBzZWNvbmRzID0gcm91bmQoZHVyYXRpb24uYXMoJ3MnKSksXG4gICAgICAgICAgICBtaW51dGVzID0gcm91bmQoZHVyYXRpb24uYXMoJ20nKSksXG4gICAgICAgICAgICBob3VycyA9IHJvdW5kKGR1cmF0aW9uLmFzKCdoJykpLFxuICAgICAgICAgICAgZGF5cyA9IHJvdW5kKGR1cmF0aW9uLmFzKCdkJykpLFxuICAgICAgICAgICAgbW9udGhzID0gcm91bmQoZHVyYXRpb24uYXMoJ00nKSksXG4gICAgICAgICAgICB3ZWVrcyA9IHJvdW5kKGR1cmF0aW9uLmFzKCd3JykpLFxuICAgICAgICAgICAgeWVhcnMgPSByb3VuZChkdXJhdGlvbi5hcygneScpKSxcbiAgICAgICAgICAgIGEgPVxuICAgICAgICAgICAgICAgIChzZWNvbmRzIDw9IHRocmVzaG9sZHMuc3MgJiYgWydzJywgc2Vjb25kc10pIHx8XG4gICAgICAgICAgICAgICAgKHNlY29uZHMgPCB0aHJlc2hvbGRzLnMgJiYgWydzcycsIHNlY29uZHNdKSB8fFxuICAgICAgICAgICAgICAgIChtaW51dGVzIDw9IDEgJiYgWydtJ10pIHx8XG4gICAgICAgICAgICAgICAgKG1pbnV0ZXMgPCB0aHJlc2hvbGRzLm0gJiYgWydtbScsIG1pbnV0ZXNdKSB8fFxuICAgICAgICAgICAgICAgIChob3VycyA8PSAxICYmIFsnaCddKSB8fFxuICAgICAgICAgICAgICAgIChob3VycyA8IHRocmVzaG9sZHMuaCAmJiBbJ2hoJywgaG91cnNdKSB8fFxuICAgICAgICAgICAgICAgIChkYXlzIDw9IDEgJiYgWydkJ10pIHx8XG4gICAgICAgICAgICAgICAgKGRheXMgPCB0aHJlc2hvbGRzLmQgJiYgWydkZCcsIGRheXNdKTtcblxuICAgICAgICBpZiAodGhyZXNob2xkcy53ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGEgPVxuICAgICAgICAgICAgICAgIGEgfHxcbiAgICAgICAgICAgICAgICAod2Vla3MgPD0gMSAmJiBbJ3cnXSkgfHxcbiAgICAgICAgICAgICAgICAod2Vla3MgPCB0aHJlc2hvbGRzLncgJiYgWyd3dycsIHdlZWtzXSk7XG4gICAgICAgIH1cbiAgICAgICAgYSA9IGEgfHxcbiAgICAgICAgICAgIChtb250aHMgPD0gMSAmJiBbJ00nXSkgfHxcbiAgICAgICAgICAgIChtb250aHMgPCB0aHJlc2hvbGRzLk0gJiYgWydNTScsIG1vbnRoc10pIHx8XG4gICAgICAgICAgICAoeWVhcnMgPD0gMSAmJiBbJ3knXSkgfHwgWyd5eScsIHllYXJzXTtcblxuICAgICAgICBhWzJdID0gd2l0aG91dFN1ZmZpeDtcbiAgICAgICAgYVszXSA9ICtwb3NOZWdEdXJhdGlvbiA+IDA7XG4gICAgICAgIGFbNF0gPSBsb2NhbGU7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRlVGltZUFnby5hcHBseShudWxsLCBhKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0IHRoZSByb3VuZGluZyBmdW5jdGlvbiBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgZnVuY3Rpb24gZ2V0U2V0UmVsYXRpdmVUaW1lUm91bmRpbmcocm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICBpZiAocm91bmRpbmdGdW5jdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiByb3VuZGluZ0Z1bmN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByb3VuZCA9IHJvdW5kaW5nRnVuY3Rpb247XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCBhIHRocmVzaG9sZCBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgZnVuY3Rpb24gZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkKHRocmVzaG9sZCwgbGltaXQpIHtcbiAgICAgICAgaWYgKHRocmVzaG9sZHNbdGhyZXNob2xkXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbWl0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJlc2hvbGRzW3RocmVzaG9sZF07XG4gICAgICAgIH1cbiAgICAgICAgdGhyZXNob2xkc1t0aHJlc2hvbGRdID0gbGltaXQ7XG4gICAgICAgIGlmICh0aHJlc2hvbGQgPT09ICdzJykge1xuICAgICAgICAgICAgdGhyZXNob2xkcy5zcyA9IGxpbWl0IC0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBodW1hbml6ZShhcmdXaXRoU3VmZml4LCBhcmdUaHJlc2hvbGRzKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHdpdGhTdWZmaXggPSBmYWxzZSxcbiAgICAgICAgICAgIHRoID0gdGhyZXNob2xkcyxcbiAgICAgICAgICAgIGxvY2FsZSxcbiAgICAgICAgICAgIG91dHB1dDtcblxuICAgICAgICBpZiAodHlwZW9mIGFyZ1dpdGhTdWZmaXggPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBhcmdUaHJlc2hvbGRzID0gYXJnV2l0aFN1ZmZpeDtcbiAgICAgICAgICAgIGFyZ1dpdGhTdWZmaXggPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGFyZ1dpdGhTdWZmaXggPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgd2l0aFN1ZmZpeCA9IGFyZ1dpdGhTdWZmaXg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBhcmdUaHJlc2hvbGRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGggPSBPYmplY3QuYXNzaWduKHt9LCB0aHJlc2hvbGRzLCBhcmdUaHJlc2hvbGRzKTtcbiAgICAgICAgICAgIGlmIChhcmdUaHJlc2hvbGRzLnMgIT0gbnVsbCAmJiBhcmdUaHJlc2hvbGRzLnNzID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aC5zcyA9IGFyZ1RocmVzaG9sZHMucyAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsb2NhbGUgPSB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgb3V0cHV0ID0gcmVsYXRpdmVUaW1lJDEodGhpcywgIXdpdGhTdWZmaXgsIHRoLCBsb2NhbGUpO1xuXG4gICAgICAgIGlmICh3aXRoU3VmZml4KSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBsb2NhbGUucGFzdEZ1dHVyZSgrdGhpcywgb3V0cHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsb2NhbGUucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIHZhciBhYnMkMSA9IE1hdGguYWJzO1xuXG4gICAgZnVuY3Rpb24gc2lnbih4KSB7XG4gICAgICAgIHJldHVybiAoeCA+IDApIC0gKHggPCAwKSB8fCAreDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0lTT1N0cmluZyQxKCkge1xuICAgICAgICAvLyBmb3IgSVNPIHN0cmluZ3Mgd2UgZG8gbm90IHVzZSB0aGUgbm9ybWFsIGJ1YmJsaW5nIHJ1bGVzOlxuICAgICAgICAvLyAgKiBtaWxsaXNlY29uZHMgYnViYmxlIHVwIHVudGlsIHRoZXkgYmVjb21lIGhvdXJzXG4gICAgICAgIC8vICAqIGRheXMgZG8gbm90IGJ1YmJsZSBhdCBhbGxcbiAgICAgICAgLy8gICogbW9udGhzIGJ1YmJsZSB1cCB1bnRpbCB0aGV5IGJlY29tZSB5ZWFyc1xuICAgICAgICAvLyBUaGlzIGlzIGJlY2F1c2UgdGhlcmUgaXMgbm8gY29udGV4dC1mcmVlIGNvbnZlcnNpb24gYmV0d2VlbiBob3VycyBhbmQgZGF5c1xuICAgICAgICAvLyAodGhpbmsgb2YgY2xvY2sgY2hhbmdlcylcbiAgICAgICAgLy8gYW5kIGFsc28gbm90IGJldHdlZW4gZGF5cyBhbmQgbW9udGhzICgyOC0zMSBkYXlzIHBlciBtb250aClcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2Vjb25kcyA9IGFicyQxKHRoaXMuX21pbGxpc2Vjb25kcykgLyAxMDAwLFxuICAgICAgICAgICAgZGF5cyA9IGFicyQxKHRoaXMuX2RheXMpLFxuICAgICAgICAgICAgbW9udGhzID0gYWJzJDEodGhpcy5fbW9udGhzKSxcbiAgICAgICAgICAgIG1pbnV0ZXMsXG4gICAgICAgICAgICBob3VycyxcbiAgICAgICAgICAgIHllYXJzLFxuICAgICAgICAgICAgcyxcbiAgICAgICAgICAgIHRvdGFsID0gdGhpcy5hc1NlY29uZHMoKSxcbiAgICAgICAgICAgIHRvdGFsU2lnbixcbiAgICAgICAgICAgIHltU2lnbixcbiAgICAgICAgICAgIGRheXNTaWduLFxuICAgICAgICAgICAgaG1zU2lnbjtcblxuICAgICAgICBpZiAoIXRvdGFsKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBzYW1lIGFzIEMjJ3MgKE5vZGEpIGFuZCBweXRob24gKGlzb2RhdGUpLi4uXG4gICAgICAgICAgICAvLyBidXQgbm90IG90aGVyIEpTIChnb29nLmRhdGUpXG4gICAgICAgICAgICByZXR1cm4gJ1AwRCc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAzNjAwIHNlY29uZHMgLT4gNjAgbWludXRlcyAtPiAxIGhvdXJcbiAgICAgICAgbWludXRlcyA9IGFic0Zsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICAgIGhvdXJzID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICAgICAgc2Vjb25kcyAlPSA2MDtcbiAgICAgICAgbWludXRlcyAlPSA2MDtcblxuICAgICAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgICAgIHllYXJzID0gYWJzRmxvb3IobW9udGhzIC8gMTIpO1xuICAgICAgICBtb250aHMgJT0gMTI7XG5cbiAgICAgICAgLy8gaW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2RvcmRpbGxlL21vbWVudC1pc29kdXJhdGlvbi9ibG9iL21hc3Rlci9tb21lbnQuaXNvZHVyYXRpb24uanNcbiAgICAgICAgcyA9IHNlY29uZHMgPyBzZWNvbmRzLnRvRml4ZWQoMykucmVwbGFjZSgvXFwuPzArJC8sICcnKSA6ICcnO1xuXG4gICAgICAgIHRvdGFsU2lnbiA9IHRvdGFsIDwgMCA/ICctJyA6ICcnO1xuICAgICAgICB5bVNpZ24gPSBzaWduKHRoaXMuX21vbnRocykgIT09IHNpZ24odG90YWwpID8gJy0nIDogJyc7XG4gICAgICAgIGRheXNTaWduID0gc2lnbih0aGlzLl9kYXlzKSAhPT0gc2lnbih0b3RhbCkgPyAnLScgOiAnJztcbiAgICAgICAgaG1zU2lnbiA9IHNpZ24odGhpcy5fbWlsbGlzZWNvbmRzKSAhPT0gc2lnbih0b3RhbCkgPyAnLScgOiAnJztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdG90YWxTaWduICtcbiAgICAgICAgICAgICdQJyArXG4gICAgICAgICAgICAoeWVhcnMgPyB5bVNpZ24gKyB5ZWFycyArICdZJyA6ICcnKSArXG4gICAgICAgICAgICAobW9udGhzID8geW1TaWduICsgbW9udGhzICsgJ00nIDogJycpICtcbiAgICAgICAgICAgIChkYXlzID8gZGF5c1NpZ24gKyBkYXlzICsgJ0QnIDogJycpICtcbiAgICAgICAgICAgIChob3VycyB8fCBtaW51dGVzIHx8IHNlY29uZHMgPyAnVCcgOiAnJykgK1xuICAgICAgICAgICAgKGhvdXJzID8gaG1zU2lnbiArIGhvdXJzICsgJ0gnIDogJycpICtcbiAgICAgICAgICAgIChtaW51dGVzID8gaG1zU2lnbiArIG1pbnV0ZXMgKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgKHNlY29uZHMgPyBobXNTaWduICsgcyArICdTJyA6ICcnKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHZhciBwcm90byQyID0gRHVyYXRpb24ucHJvdG90eXBlO1xuXG4gICAgcHJvdG8kMi5pc1ZhbGlkID0gaXNWYWxpZCQxO1xuICAgIHByb3RvJDIuYWJzID0gYWJzO1xuICAgIHByb3RvJDIuYWRkID0gYWRkJDE7XG4gICAgcHJvdG8kMi5zdWJ0cmFjdCA9IHN1YnRyYWN0JDE7XG4gICAgcHJvdG8kMi5hcyA9IGFzO1xuICAgIHByb3RvJDIuYXNNaWxsaXNlY29uZHMgPSBhc01pbGxpc2Vjb25kcztcbiAgICBwcm90byQyLmFzU2Vjb25kcyA9IGFzU2Vjb25kcztcbiAgICBwcm90byQyLmFzTWludXRlcyA9IGFzTWludXRlcztcbiAgICBwcm90byQyLmFzSG91cnMgPSBhc0hvdXJzO1xuICAgIHByb3RvJDIuYXNEYXlzID0gYXNEYXlzO1xuICAgIHByb3RvJDIuYXNXZWVrcyA9IGFzV2Vla3M7XG4gICAgcHJvdG8kMi5hc01vbnRocyA9IGFzTW9udGhzO1xuICAgIHByb3RvJDIuYXNRdWFydGVycyA9IGFzUXVhcnRlcnM7XG4gICAgcHJvdG8kMi5hc1llYXJzID0gYXNZZWFycztcbiAgICBwcm90byQyLnZhbHVlT2YgPSB2YWx1ZU9mJDE7XG4gICAgcHJvdG8kMi5fYnViYmxlID0gYnViYmxlO1xuICAgIHByb3RvJDIuY2xvbmUgPSBjbG9uZSQxO1xuICAgIHByb3RvJDIuZ2V0ID0gZ2V0JDI7XG4gICAgcHJvdG8kMi5taWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZHM7XG4gICAgcHJvdG8kMi5zZWNvbmRzID0gc2Vjb25kcztcbiAgICBwcm90byQyLm1pbnV0ZXMgPSBtaW51dGVzO1xuICAgIHByb3RvJDIuaG91cnMgPSBob3VycztcbiAgICBwcm90byQyLmRheXMgPSBkYXlzO1xuICAgIHByb3RvJDIud2Vla3MgPSB3ZWVrcztcbiAgICBwcm90byQyLm1vbnRocyA9IG1vbnRocztcbiAgICBwcm90byQyLnllYXJzID0geWVhcnM7XG4gICAgcHJvdG8kMi5odW1hbml6ZSA9IGh1bWFuaXplO1xuICAgIHByb3RvJDIudG9JU09TdHJpbmcgPSB0b0lTT1N0cmluZyQxO1xuICAgIHByb3RvJDIudG9TdHJpbmcgPSB0b0lTT1N0cmluZyQxO1xuICAgIHByb3RvJDIudG9KU09OID0gdG9JU09TdHJpbmckMTtcbiAgICBwcm90byQyLmxvY2FsZSA9IGxvY2FsZTtcbiAgICBwcm90byQyLmxvY2FsZURhdGEgPSBsb2NhbGVEYXRhO1xuXG4gICAgcHJvdG8kMi50b0lzb1N0cmluZyA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ3RvSXNvU3RyaW5nKCkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0b0lTT1N0cmluZygpIGluc3RlYWQgKG5vdGljZSB0aGUgY2FwaXRhbHMpJyxcbiAgICAgICAgdG9JU09TdHJpbmckMVxuICAgICk7XG4gICAgcHJvdG8kMi5sYW5nID0gbGFuZztcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdYJywgMCwgMCwgJ3VuaXgnKTtcbiAgICBhZGRGb3JtYXRUb2tlbigneCcsIDAsIDAsICd2YWx1ZU9mJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCd4JywgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1gnLCBtYXRjaFRpbWVzdGFtcCk7XG4gICAgYWRkUGFyc2VUb2tlbignWCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGlucHV0KSAqIDEwMDApO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ3gnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUodG9JbnQoaW5wdXQpKTtcbiAgICB9KTtcblxuICAgIC8vISBtb21lbnQuanNcblxuICAgIGhvb2tzLnZlcnNpb24gPSAnMi4yOS40JztcblxuICAgIHNldEhvb2tDYWxsYmFjayhjcmVhdGVMb2NhbCk7XG5cbiAgICBob29rcy5mbiA9IHByb3RvO1xuICAgIGhvb2tzLm1pbiA9IG1pbjtcbiAgICBob29rcy5tYXggPSBtYXg7XG4gICAgaG9va3Mubm93ID0gbm93O1xuICAgIGhvb2tzLnV0YyA9IGNyZWF0ZVVUQztcbiAgICBob29rcy51bml4ID0gY3JlYXRlVW5peDtcbiAgICBob29rcy5tb250aHMgPSBsaXN0TW9udGhzO1xuICAgIGhvb2tzLmlzRGF0ZSA9IGlzRGF0ZTtcbiAgICBob29rcy5sb2NhbGUgPSBnZXRTZXRHbG9iYWxMb2NhbGU7XG4gICAgaG9va3MuaW52YWxpZCA9IGNyZWF0ZUludmFsaWQ7XG4gICAgaG9va3MuZHVyYXRpb24gPSBjcmVhdGVEdXJhdGlvbjtcbiAgICBob29rcy5pc01vbWVudCA9IGlzTW9tZW50O1xuICAgIGhvb2tzLndlZWtkYXlzID0gbGlzdFdlZWtkYXlzO1xuICAgIGhvb2tzLnBhcnNlWm9uZSA9IGNyZWF0ZUluWm9uZTtcbiAgICBob29rcy5sb2NhbGVEYXRhID0gZ2V0TG9jYWxlO1xuICAgIGhvb2tzLmlzRHVyYXRpb24gPSBpc0R1cmF0aW9uO1xuICAgIGhvb2tzLm1vbnRoc1Nob3J0ID0gbGlzdE1vbnRoc1Nob3J0O1xuICAgIGhvb2tzLndlZWtkYXlzTWluID0gbGlzdFdlZWtkYXlzTWluO1xuICAgIGhvb2tzLmRlZmluZUxvY2FsZSA9IGRlZmluZUxvY2FsZTtcbiAgICBob29rcy51cGRhdGVMb2NhbGUgPSB1cGRhdGVMb2NhbGU7XG4gICAgaG9va3MubG9jYWxlcyA9IGxpc3RMb2NhbGVzO1xuICAgIGhvb2tzLndlZWtkYXlzU2hvcnQgPSBsaXN0V2Vla2RheXNTaG9ydDtcbiAgICBob29rcy5ub3JtYWxpemVVbml0cyA9IG5vcm1hbGl6ZVVuaXRzO1xuICAgIGhvb2tzLnJlbGF0aXZlVGltZVJvdW5kaW5nID0gZ2V0U2V0UmVsYXRpdmVUaW1lUm91bmRpbmc7XG4gICAgaG9va3MucmVsYXRpdmVUaW1lVGhyZXNob2xkID0gZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkO1xuICAgIGhvb2tzLmNhbGVuZGFyRm9ybWF0ID0gZ2V0Q2FsZW5kYXJGb3JtYXQ7XG4gICAgaG9va3MucHJvdG90eXBlID0gcHJvdG87XG5cbiAgICAvLyBjdXJyZW50bHkgSFRNTDUgaW5wdXQgdHlwZSBvbmx5IHN1cHBvcnRzIDI0LWhvdXIgZm9ybWF0c1xuICAgIGhvb2tzLkhUTUw1X0ZNVCA9IHtcbiAgICAgICAgREFURVRJTUVfTE9DQUw6ICdZWVlZLU1NLUREVEhIOm1tJywgLy8gPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIC8+XG4gICAgICAgIERBVEVUSU1FX0xPQ0FMX1NFQ09ORFM6ICdZWVlZLU1NLUREVEhIOm1tOnNzJywgLy8gPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIHN0ZXA9XCIxXCIgLz5cbiAgICAgICAgREFURVRJTUVfTE9DQUxfTVM6ICdZWVlZLU1NLUREVEhIOm1tOnNzLlNTUycsIC8vIDxpbnB1dCB0eXBlPVwiZGF0ZXRpbWUtbG9jYWxcIiBzdGVwPVwiMC4wMDFcIiAvPlxuICAgICAgICBEQVRFOiAnWVlZWS1NTS1ERCcsIC8vIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIC8+XG4gICAgICAgIFRJTUU6ICdISDptbScsIC8vIDxpbnB1dCB0eXBlPVwidGltZVwiIC8+XG4gICAgICAgIFRJTUVfU0VDT05EUzogJ0hIOm1tOnNzJywgLy8gPGlucHV0IHR5cGU9XCJ0aW1lXCIgc3RlcD1cIjFcIiAvPlxuICAgICAgICBUSU1FX01TOiAnSEg6bW06c3MuU1NTJywgLy8gPGlucHV0IHR5cGU9XCJ0aW1lXCIgc3RlcD1cIjAuMDAxXCIgLz5cbiAgICAgICAgV0VFSzogJ0dHR0ctW1ddV1cnLCAvLyA8aW5wdXQgdHlwZT1cIndlZWtcIiAvPlxuICAgICAgICBNT05USDogJ1lZWVktTU0nLCAvLyA8aW5wdXQgdHlwZT1cIm1vbnRoXCIgLz5cbiAgICB9O1xuXG4gICAgcmV0dXJuIGhvb2tzO1xuXG59KSkpO1xuIl0sIm5hbWVzIjpbInRoaXMiLCJyZXF1aXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1DLENBQUMsVUFBVSxNQUFNLEVBQUUsT0FBTyxFQUFFO0tBQ3NDLE1BQWlCLENBQUEsT0FBQSxHQUFBLE9BQU8sRUFBRSxF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V0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDNUMsTUFBSyxDQUFDLENBQUM7QUFDUDtBQUNBLEtBQUksY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWTtTQUN4QyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDM0MsTUFBSyxDQUFDLENBQUM7QUFDUDtBQUNBLEtBQUksY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDcEQsS0FBSSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZO0FBQ2xELFNBQVEsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3ZDLE1BQUssQ0FBQyxDQUFDO0FBQ1AsS0FBSSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZO0FBQ25ELFNBQVEsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ3hDLE1BQUssQ0FBQyxDQUFDO0FBQ1AsS0FBSSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZO0FBQ3BELFNBQVEsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ3pDLE1BQUssQ0FBQyxDQUFDO0FBQ1AsS0FBSSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZO0FBQ3JELFNBQVEsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQzFDLE1BQUssQ0FBQyxDQUFDO0FBQ1AsS0FB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LENBQUM7QUFDNUMsS0FBSSxLQUFLLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztBQUMxQyxLQUFJLEtBQUssQ0FBQyxvQkFBb0IsR0FBRywwQkFBMEIsQ0FBQztBQUM1RCxLQUFJLEtBQUssQ0FBQyxxQkFBcUIsR0FBRywyQkFBMkIsQ0FBQztBQUM5RCxLQUFJLEtBQUssQ0FBQyxjQUFjLEdBQUcsaUJBQWlCLENBQUM7QUFDN0MsS0FBSSxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUM1QjtBQUNBO0tBQ0ksS0FBSyxDQUFDLFNBQVMsR0FBRztTQUNkLGNBQWMsRUFBRSxrQkFBa0I7U0FDbEMsc0JBQXNCLEVBQUUscUJBQXFCO1NBQzdDLGlCQUFpQixFQUFFLHlCQUF5QjtTQUM1QyxJQUFJLEVBQUUsWUFBWTtTQUNsQixJQUFJLEVBQUUsT0FBTztTQUNiLFlBQVksRUFBRSxVQUFVO1NBQ3hCLE9BQU8sRUFBRSxjQUFjO1NBQ3ZCLElBQUksRUFBRSxZQUFZO1NBQ2xCLEtBQUssRUFBRSxTQUFTO0FBQ3hCLE1BQUssQ0FBQztBQUNOO0tBQ0ksT0FBTyxLQUFLLENBQUM7QUFDakI7QUFDQSxFQUFDLEVBQUUsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
