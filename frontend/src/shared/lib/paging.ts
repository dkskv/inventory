export interface PaginationParams {
  limit: number;
  offset: number;
}

const calculateOffset = (page: number, pageSize: number) =>
  (page - 1) * pageSize;

export const createPaginationParams = (
  page: number,
  pageSize: number
): PaginationParams => ({
  limit: pageSize,
  offset: calculateOffset(page, pageSize),
});
