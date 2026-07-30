import { Request } from "express";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

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

export function getPaginationParams(req: Request): PaginationParams {
  const pageQuery = req.query.page;
  const limitQuery = req.query.limit;

  const parsedPage = parseInt(String(pageQuery), 10);
  const parsedLimit = parseInt(String(limitQuery), 10);

  const page = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = !isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100 ? parsedLimit : 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
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
