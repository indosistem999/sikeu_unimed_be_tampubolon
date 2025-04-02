export interface I_PaginateArgs {
  page: number;
  limit: number;
  skip: number;
  search: string;
}

export interface I_ResponsePagination {
  records: Record<string, any>[];
  total_page: number;
  next_page: number | null;
  prev_page: number | null;
  limit: number;
  page: number;
  total_row: number;
}

export interface I_QueryPaginate {
  where: { [key: string]: any };
  order: object | object[] | any;
  paginate: I_PaginateArgs;
}
