import { Request } from 'express';
import { I_ResponsePagination } from '../../interfaces/pagination.interface';

export const setPagination = (
  data: Record<string, any>[],
  totalRow: number,
  page: number = 1,
  limit: number = 20
): I_ResponsePagination => {
  page = Math.max(page, 1);
  limit = Math.max(limit, 1);


  const totalPage = Math.ceil(totalRow / limit);
  const nextPage = page < totalPage ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;
  return {
    records: data,
    next_page: nextPage,
    prev_page: prevPage,
    total_page: totalRow,
    total_row: totalRow,
    limit,
    page,
  } as I_ResponsePagination;
};
