"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = exports.identifyFace = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _canvas = _interopRequireDefault(require("canvas"));

var faceapi = _interopRequireWildcard(require("face-api.js"));

var _fs = _interopRequireDefault(require("fs"));

var _monkeyPatch = require("./monkeyPatch");

var _path = _interopRequireDefault(require("path"));

var _constants = require("./constants");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

(0, _monkeyPatch.monkeyPatchFaceApiEnv)();
var labeledFaceDescriptors = null;
var faceMatcher = null;

var load = function load() {
  return Promise.all([faceapi.nets.faceRecognitionNet.loadFromDisk(_constants.MODELS_URL), faceapi.nets.faceLandmark68Net.loadFromDisk(_constants.MODELS_URL), faceapi.nets.ssdMobilenetv1.loadFromDisk(_constants.MODELS_URL), faceapi.nets.ageGenderNet.loadFromDisk(_constants.MODELS_URL), faceapi.nets.faceExpressionNet.loadFromDisk(_constants.MODELS_URL)]).then(start);
};

exports.load = load;

var identifyFace = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var image, displaySize, detections, resizedDetections, results;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _canvas["default"].loadImage("".concat(_constants.CAPTURED_IMG_URL));

          case 3:
            image = _context.sent;
            displaySize = {
              width: image.width,
              height: image.height
            };
            _context.next = 7;
            return faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

          case 7:
            detections = _context.sent;
            //withFaceExpressions().withAgeAndGender()
            resizedDetections = faceapi.resizeResults(detections, displaySize);
            results = faceMatcher.findBestMatch(resizedDetections.descriptor);
            return _context.abrupt("return", _objectSpread(_objectSpread({
              'results': results
            }, results), resizedDetections));

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", {
              'error': _context.t0
            });

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));

  return function identifyFace() {
    return _ref.apply(this, arguments);
  };
}();

exports.identifyFace = identifyFace;

var start = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return loadLabeledImages();

          case 2:
            labeledFaceDescriptors = _context2.sent;
            faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
            console.log("Server listening on port ".concat(_constants.PORT));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function start() {
    return _ref2.apply(this, arguments);
  };
}();

var dirs = function dirs(p) {
  return _fs["default"].readdirSync(p).filter(function (f) {
    return _fs["default"].statSync(_path["default"].join(p, f)).isDirectory();
  });
};

var loadLabeledImages = function loadLabeledImages() {
  try {
    var labels = dirs(_constants.LABELED_IMAGES_URL);
    return Promise.all(labels.map( /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(label) {
        var descriptions, i, img, detections;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                descriptions = [];
                i = 1;

              case 2:
                if (!(i <= 2)) {
                  _context3.next = 13;
                  break;
                }

                _context3.next = 5;
                return _canvas["default"].loadImage("".concat(_constants.LABELED_IMAGES_URL, "/").concat(label, "/").concat(i, ".jpg"));

              case 5:
                img = _context3.sent;
                _context3.next = 8;
                return faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

              case 8:
                detections = _context3.sent;

                if ((detections === null || detections === void 0 ? void 0 : detections.descriptor) !== undefined) {
                  descriptions.push(detections.descriptor);
                }

              case 10:
                i++;
                _context3.next = 2;
                break;

              case 13:
                return _context3.abrupt("return", new faceapi.LabeledFaceDescriptors(label, descriptions));

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }()));
  } catch (error) {
    console.log(error);
  }
};