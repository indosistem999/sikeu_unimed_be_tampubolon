import { Request } from 'express';
import { I_PaginateArgs } from '../../interfaces/pagination.interface';
import { standartDateISO } from './common.util';
import { I_RequestCustom } from '../../interfaces/app.interface';

export const defineRequestQuery = (req: Request, columns: string[]): { [key: string]: any } => {
  try {
    const entries = Object.entries(req?.query);
    const result: { [key: string]: any } = {};

    for (const [key, value] of entries) {
      const checkItem = columns.find((item) => item.split('.').pop() === key);

      if (checkItem && value !== '') {
        result[checkItem] = value;
      }
    }

    return result;
  } catch (error: any) {
    console.error('Modified request query filter failed.', error);
    return {};
  }
};

export const defineRequestOrderORM = (
  req: Request | any,
  defaultOrder: string[],
  sortColumn: Record<string, string> = {}
): any => {
  let orderOption: { [key: string]: any } = {}
  const direction = req?.query?.direction_name || defaultOrder[0];
  const orders = req?.query?.order_name?.toUpperCase() || defaultOrder[1]?.toUpperCase();

  if (typeof orders === 'string' && typeof direction === 'string') {
    orderOption[sortColumn?.[direction]] = orders
  } else {
    const content: { [key: string]: any } = {}
    for (let index = 0; index < direction.length; index += 1) {
      if (sortColumn[direction[index]]) {
        content[sortColumn[direction[index]]] = orders[index]
      }
      orderOption = content;
    }
  }

  return orderOption;
}

export const defineRequestOrder = (
  req: Request | any,
  defaultOrder: string[],
  sortColumn: Record<string, string> = {}
): object | object[] | any => {
  let order: object | object[] | any = {};
  const direction = req?.query?.direction_name || defaultOrder[0];
  const orders = req?.query?.order_name?.toUpperCase() || defaultOrder[1]?.toUpperCase();
  if (typeof orders === 'string' && typeof direction === 'string') {
    order = [{ column: sortColumn?.[direction] ?? defaultOrder[0], order: orders }];
  } else {
    const content: Record<string, string>[] = [];
    for (let index = 0; index < direction.length; index += 1) {
      if (sortColumn[direction[index]]) {
        content.push({
          column: sortColumn[direction[index]],
          order: orders[index],
        });
      }
      order = content;
    }
  }
  if (order.length > 0) {
    return order;
  }
  return [{ column: defaultOrder[0], order: defaultOrder[1] }];
};

export const defineRequestPaginateArgs = (req: Request): I_PaginateArgs => {
  const page = Number(req?.query?.page) || 1;
  const limit = Number(req?.query?.limit) || 10;
  const search = (req?.query?.search as string) || '';
  return {
    page,
    skip: (page - 1) * limit,
    search,
    limit,
  };
};

export const defineRequestOption = (req: I_RequestCustom, type: string = 'create') => {
  const payload: Record<string, any> = req?.body;
  switch (type.toLowerCase()) {
    case 'update':
      payload.updated_at = standartDateISO();
      payload.updated_by = req?.user;
      break;

    case 'delete':
      payload.deleted_at = standartDateISO();
      payload.deleted_by = req?.user;
      break;

    default:
      payload.created_at = standartDateISO();
      payload.created_by = req?.user;
      break;
  }
  return payload;
};

export const getRequestProperties = (req: Request): { [key: string]: any } => {
  return {
    request_ip: req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress,
    request_host: req?.hostname
  }
}
