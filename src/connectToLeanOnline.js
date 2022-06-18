import { UserModel } from './models/user.model';
import jwt from 'jsonwebtoken';
const secretKey = 'secret-learn-online-key';

export const genarateLoginKey = async (result) => {
  
  const username = result?._label;

  const user = await UserModel.findOne({ username: username })

  if (!user) {
    return {
      token: null,
    };
  }

  let token = jwt.sign({ username: username, password: user.password }, secretKey);

  return {
    token,
    fullname: user.name,
  }
}

export const checkUsernameExist = async (username) => {
  const user = await UserModel.findOne({ username: username })

  if (!user) {
    return false;
  }
  
  return true;
}