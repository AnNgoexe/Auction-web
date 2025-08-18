export class PaginationMeta {
  totalItems!: number;

  itemCount!: number;

  itemsPerPage!: number;

  totalPages!: number;

  currentPage!: number;

  hasNextPage!: boolean;

  hasPrevPage!: boolean;
}

export class PaginationResult<T> {
  data!: T[];

  meta!: PaginationMeta;
}
