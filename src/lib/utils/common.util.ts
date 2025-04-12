import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { Config as cfg } from '../../constanta';
import { Request } from 'express';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { randomInt } from 'crypto'

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
      .toLowerCase()                      // Convert to lowercase
      .trim()                              // Remove any leading or trailing spaces
      .replace(/\s+/g, '-')                // Replace spaces with hyphens
      .replace(/[^a-z0-9\-]/g, '')         // Remove any non-alphanumeric characters except hyphens
      .replace(/--+/g, '-');
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


export const generateOTPCode = (length: number = 6): string => {
  if (length <= 0) throw new Error("Length must be greater than 0");

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return randomInt(min, max + 1).toString();
}

export const getTotalDays = (start: Date, end: Date): number => {
  const startTimestamp: number = new Date(start).getTime();
  const endTimestamp: number = new Date(end).getTime();
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const num = Math.abs(endTimestamp - startTimestamp) / millisecondsPerDay;

  if (num >= 0.465) {
    return Math.ceil(num)
  }
  return Math.floor(num)
}


export const getTotalMinutes = (start: Date, end: Date): number => {
  const startTimestamp: number = new Date(start).getTime();
  const endTimestamp: number = new Date(end).getTime();

  const millisecondsPerMinute = 1000 * 60;
  return Math.abs(endTimestamp - startTimestamp) / millisecondsPerMinute;
}


export const splitFullName = (fullName: string): { [key: string]: any } => {

  if (fullName != '' && fullName != null) {
    const parts = fullName.trim().split(/\s+/);
    const lastName = parts.pop(); // remove and get the last element
    const firstName = parts.join(' '); // join the rest as first name
    return {
      first_name: firstName,
      last_name: lastName
    };
  }

  return {
    first_name: null,
    last_name: null
  }
}

export const getHostProtocol = (req: Request): string => {
  const protocol = req.protocol;
  const host = req.get('host'); // includes hostname and port
  return `${protocol}://${host}`;
}

export const getBaseUrl = (req: Request, path: string): string => {
  return `${getHostProtocol(req)}/api/v1/${path}/files`
}