export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (query: any): PaginationParams => {
  const page = Math.max(1, parseInt(query.page)) || 1;
  const limit = Math.max(1, parseInt(query.limit)) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const formatPagination = (total: number, page: number, limit: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
