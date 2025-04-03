import jwt, { SignOptions } from 'jsonwebtoken';
import { Config as cfg } from '../../constanta';
import { I_AuthUserPayload } from '../../interfaces/auth.interface';

/**
 * Generates a JWT token.
 * @param payload - The payload to include in the token.
 * @param expiresIn - The expiration time for the token (e.g., "1h", "7d").
 * @returns The generated JWT token.
 */
export const generatedToken = (payload: I_AuthUserPayload, expiresIn: any = '1h'): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, cfg.JwtSecretKey, options);
};

/**
 * Verifies and decodes a JWT token.
 * @param token - The JWT token to verify.
 * @returns The decoded payload.
 * @throws If the token is invalid or expired.
 */
export const verifiedToken = (token: string): I_AuthUserPayload => {
  return jwt.verify(token, cfg.JwtSecretKey) as I_AuthUserPayload;
};
