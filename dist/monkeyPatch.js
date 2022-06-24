"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.monkeyPatchFaceApiEnv = void 0;

var _canvas = _interopRequireDefault(require("canvas"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var faceapi = _interopRequireWildcard(require("face-api.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var monkeyPatchFaceApiEnv = function monkeyPatchFaceApiEnv() {
  var Canvas = _canvas["default"].Canvas,
      Image = _canvas["default"].Image,
      ImageData = _canvas["default"].ImageData;
  faceapi.env.monkeyPatch({
    Canvas: Canvas,
    Image: Image,
    ImageData: ImageData
  });
  faceapi.env.monkeyPatch({
    fetch: _nodeFetch["default"]
  });
};

exports.monkeyPatchFaceApiEnv = monkeyPatchFaceApiEnv;