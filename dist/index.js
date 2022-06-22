"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

require("dotenv/config");

var _path = _interopRequireDefault(require("path"));

var _multer = _interopRequireDefault(require("multer"));

var _fs = _interopRequireDefault(require("fs"));

var _faceRecognition = require("./faceRecognition");

var _constants = require("./constants");

var _mongoDB = require("./config/mongoDB");

var _connectToLeanOnline = require("./connectToLeanOnline");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

require('@tensorflow/tfjs-node');

(0, _mongoDB.connectDB)();

var storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    return cb(null, _constants.TEMP_UPLOAD_FOR_LOGIN_URL);
  },
  filename: function filename(req, file, cb) {
    return cb(null, _constants.LOGIN_IMG_NAME);
  }
});

var uploadSingle = (0, _multer["default"])({
  storage: storage
});

var multiStorage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    var dir = "".concat(_constants.LABELED_IMAGES_URL, "/").concat(req.body.label);
    !_fs["default"].existsSync(dir) ? _fs["default"].mkdirSync(dir) : null;
    cb(null, _path["default"].join(dir));
  },
  filename: function filename(req, file, cb) {
    return cb(null, file.originalname);
  }
});

var uploadMultiple = (0, _multer["default"])({
  storage: multiStorage
});
var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"]["static"]('public'));
app.use(_express["default"].json());
app.get('/', function (req, res) {
  return res.send('Received a GET HTTP method');
});
app.post('/', uploadSingle.single('image'), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var results, loginKeys;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _faceRecognition.identifyFace)();

          case 2:
            results = _context.sent;
            _context.next = 5;
            return (0, _connectToLeanOnline.genarateLoginKey)(results);

          case 5:
            loginKeys = _context.sent;

            if (!(loginKeys.token == null)) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", res.status(400).json({
              error: 'no face detected'
            }));

          case 8:
            return _context.abrupt("return", res.send(_objectSpread(_objectSpread({}, results.results), loginKeys)));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.post('/register', uploadMultiple.array('image'), /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var label, isExist;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            label = req.body.label;
            _context2.next = 3;
            return (0, _connectToLeanOnline.checkUsernameExist)(label);

          case 3:
            isExist = _context2.sent;

            if (isExist) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              message: 'tài khoản không tồn tại trong hệ thống'
            }));

          case 6:
            (0, _faceRecognition.load)();
            return _context2.abrupt("return", res.send({
              label: req.body.label
            }));

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
app.listen(_constants.PORT, _faceRecognition.load);