export interface Paging {
  limit: number;
  offset: number;
}

export interface PagedArray<T> {
  items: T[];
  totalCount: number;
}
