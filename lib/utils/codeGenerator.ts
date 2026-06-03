import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique visitor code
 * Format: VIS-YYYY-000001
 */
export const generateVisitorCode = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `VIS-${year}-${random}`;
};

/**
 * Generate a unique visit number
 * Format: VISIT-YYYY-MM-000001
 */
export const generateVisitNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `VISIT-${year}-${month}-${random}`;
};

/**
 * Generate QR token
 */
export const generateQRToken = (): string => {
  return uuidv4();
};

/**
 * Generate UUID for user
 */
export const generateUUID = (): string => {
  return uuidv4();
};
