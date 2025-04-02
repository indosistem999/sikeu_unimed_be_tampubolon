import bcrypt from 'bcrypt';
import { SaltRounds } from '../../constanta';

export const hashedPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SaltRounds);
};

export const comparedPassword = async (password: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};
