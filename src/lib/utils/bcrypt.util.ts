import bcrypt from 'bcrypt';
import { SaltRounds } from '../../constanta';

interface I_PasswordEncrypt {
  salt: string;
  password_hash: string;  
}

export const generateSalt = async():Promise<string> => {
  return bcrypt.genSalt(SaltRounds);
}

export const encryptPassword = async(password: string):Promise<I_PasswordEncrypt> => {
  const salt = await generateSalt();
  const password_hash = await hashedPassword(password, salt);

  return {
    salt: salt ?? '',
    password_hash: password_hash ?? ''
  }
}

export const hashedPassword = async (password: string, salt: string): Promise<string> => {
  return bcrypt.hash(password, salt);
};

export const comparedPassword = async (password: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};


export const comparedPasswordBySalt = async (password: string, salt: any, inputPassword: string): Promise<boolean> => {
  const hashedPassword = await bcrypt.hash(inputPassword, salt);
  console.log({
    salt,
    password,
    hashedPassword
  })
  return hashedPassword !== password
};