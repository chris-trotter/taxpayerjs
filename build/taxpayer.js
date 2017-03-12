/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Taxpayer = __webpack_require__(1);

var _Taxpayer2 = _interopRequireDefault(_Taxpayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var john = new _Taxpayer2.default();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(2);

var _config2 = _interopRequireDefault(_config);

var _defaultAttributes = __webpack_require__(3);

var _defaultAttributes2 = _interopRequireDefault(_defaultAttributes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Taxpayer = function () {
    function Taxpayer(attributes) {
        var taxYear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _config2.default.DEFAULT_TAX_YEAR;

        _classCallCheck(this, Taxpayer);

        // Throw error if no attributes provided
        if (!attributes) {
            throw Error(_config2.default.ERRORS.MISSING_ATTRIBUTES);
        }

        this.taxYear = taxYear;

        // Assign tax payer's attributes to the base of the instantiated object
        // This creates a simple API for users
        _extends(this, _defaultAttributes2.default, attributes);
    }

    _createClass(Taxpayer, [{
        key: 'getSalary',
        value: function getSalary() {
            return this.salary;
        }
    }, {
        key: 'taxYear',
        get: function get() {
            return this._taxYear;
        },
        set: function set(taxYear) {
            // Lookup provided tax year and assign the appropriate configuration
            this._taxYear = taxYear;

            switch (taxYear) {
                case '2015/2016':
                    {
                        this.rules = _config2.default[taxYear];
                        break;
                    }
                case '2014/2015':
                    {
                        this.rules = _config2.default[taxYear];
                        break;
                    }
                case '2013/2014':
                    {
                        this.rules = _config2.default[taxYear];
                        break;
                    }
                default:
                    {
                        throw Error(_config2.default.ERRORS.INVALID_TAX_YEAR);
                        break;
                    }
            }
        }
    }]);

    return Taxpayer;
}();

exports.default = Taxpayer;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    "DEFAULT_TAX_YEAR": "2015/2016",
    "ERRORS": {
        "MISSING_ATTRIBUTES": "Tax payer attributes must be provided.",
        "INVALID_TAX_YEAR": "A valid tax year was not provided."
    },
    "2015/2016": {
        "incomeTax": {
            "personalAllowance": 12000,
            "taxRate": 0.3
        }
    }
};

exports.default = config;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var defaultAttributes = {
    age: 40,
    studentLoanRepayments: false,
    studentLoanRepaymentsPlan: 1,
    pensionContributions: false,
    pensionContributionsPercent: 0.05,
    taxCode: '1200L'
};

exports.default = defaultAttributes;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);