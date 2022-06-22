"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genarateLoginKey = exports.checkUsernameExist = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _user = require("./models/user.model");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var secretKey = 'secret-learn-online-key';

var genarateLoginKey = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(result) {
    var username, user, token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            username = result === null || result === void 0 ? void 0 : result._label;
            _context.next = 3;
            return _user.UserModel.findOne({
              username: username
            });

          case 3:
            user = _context.sent;

            if (user) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", {
              token: null
            });

          case 6:
            token = _jsonwebtoken["default"].sign({
              username: username,
              password: user.password
            }, secretKey);
            return _context.abrupt("return", {
              token: token,
              fullname: user.name
            });

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function genarateLoginKey(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.genarateLoginKey = genarateLoginKey;

var checkUsernameExist = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(username) {
    var user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _user.UserModel.findOne({
              username: username
            });

          case 2:
            user = _context2.sent;

            if (user) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", false);

          case 5:
            return _context2.abrupt("return", true);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function checkUsernameExist(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.checkUsernameExist = checkUsernameExist;