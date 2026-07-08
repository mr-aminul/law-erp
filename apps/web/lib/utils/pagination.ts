export type PaginationItem = number | "ellipsis";

/** Build a compact page list with ellipsis, e.g. 1 … 4 5 6 … 12 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): PaginationItem[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];

  const totalNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const range: PaginationItem[] = [1];

  if (showLeftEllipsis) {
    range.push("ellipsis");
  } else {
    for (let page = 2; page < leftSibling; page++) {
      range.push(page);
    }
  }

  for (let page = leftSibling; page <= rightSibling; page++) {
    if (page !== 1 && page !== totalPages) {
      range.push(page);
    }
  }

  if (showRightEllipsis) {
    range.push("ellipsis");
  } else {
    for (let page = rightSibling + 1; page < totalPages; page++) {
      range.push(page);
    }
  }

  if (totalPages > 1) {
    range.push(totalPages);
  }

  return range;
}

export function clampPage(page: number, totalPages: number): number {
  if (totalPages < 1) return 1;
  return Math.min(Math.max(page, 1), totalPages);
}

export function getPageSlice<T>(
  items: T[],
  page: number,
  pageSize: number
): { slice: T[]; totalPages: number; start: number; end: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize) || 1);
  const safePage = clampPage(page, totalPages);
  const start = items.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, items.length);

  return {
    slice: items.slice((safePage - 1) * pageSize, safePage * pageSize),
    totalPages,
    start,
    end,
  };
}
