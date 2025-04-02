import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { Config as cfg } from '../../constanta';
import { Request } from 'express';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

/**
 * Generates a new UUID v4.
 * @returns A UUID v4 string.
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Normalizes an email address (e.g., trim and lowercase).
 * @param email - The email address to normalize.
 * @returns The normalized email address.
 */
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Formats a timestamp to a readable date-time string.
 * @param date - The date to format.
 * @returns A formatted string (e.g., "YYYY-MM-DD HH:mm:ss").
 */
export const formatTimestamp = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Intl.DateTimeFormat('en-US', options).format(date).replace(',', '');
};

/** Generate Slug Name */
export const generateSlug = (name: string): string | null => {
  if (name != null && name != undefined) {
    return name
      .toLowerCase() // Convert to lowercase
      .trim() // Remove leading and trailing spaces
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ''); // Remove special characters except hyphens
  }

  return null;
};

export const standartDateISO = (format: string = '') => {
  if (format != '') {
    return dayjs().format(format);
  }
  return dayjs().format();
};

export const formatDateToday = (
  format: string = 'YYYY-MM-DD HH:mm:ss',
  date: any = standartDateISO()
) => {
  const newDate = dayjs(date).format(format);
  return newDate;
};

export const getDurationInMilliseconds = (start = process.hrtime()) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

export const debugRequestHandler = (req: Request) => {
  if (Boolean(cfg.AppDebug) == true) {
    const ALLOWED_LOG = ['local', 'development', 'staging'];
    console.log(`=========== Incoming Request ${formatDateToday()} ===========`);
    if (ALLOWED_LOG.includes(cfg.AppEnv)) {
      console.log('Headers:', req?.headers);
    }
    console.log('Query:', JSON.stringify(req?.query));
    console.log('Param:', JSON.stringify(req?.params));
    console.log('Body:', JSON.stringify(req?.body));
  }
};

export const Match = (property: string, validationOptions?: ValidationOptions) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any)[property];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must match ${property}`;
        },
      },
    });
  };
};
