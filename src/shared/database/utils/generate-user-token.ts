import { sign } from 'jsonwebtoken';

export const generateUserToken = (userId: number) => {
  return sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
