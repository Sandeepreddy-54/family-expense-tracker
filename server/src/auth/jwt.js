import jwt from 'jsonwebtoken';
import { config } from '../config.js';

// Two trusted people on their own personal devices — favor avoiding re-login
// friction over short-lived-token rigor.
const EXPIRES_IN = '180d';

export const signToken = (slot) => jwt.sign({ sub: slot }, config.jwtSecret, { expiresIn: EXPIRES_IN });

export const verifyToken = (token) => jwt.verify(token, config.jwtSecret);
