export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  thumbnails: T[];
  meta: PaginationMeta;
}

export function formatPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    thumbnails: data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}
