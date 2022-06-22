"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserModel = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  description: {
    type: String,
    "default": 'Mô tả về bản thân'
  },
  avatar_url: {
    type: String,
    "default": 'https://seud.org/wp-content/uploads/2020/06/avatar-nobody.png'
  },
  address: {
    type: String,
    "default": 'Hà Nội, Việt Nam'
  },
  status: {
    type: String,
    "default": 'active'
  },
  roles: [{
    type: _mongoose["default"].Types.ObjectId,
    ref: 'Role'
  }],
  phone: {
    type: String,
    "default": '0967999999'
  },
  birthday: Date
});

var UserModel = _mongoose["default"].model('User', userSchema);

exports.UserModel = UserModel;