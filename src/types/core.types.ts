export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface BaseImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
}
