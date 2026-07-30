import { describe, expect, it } from "vitest";

import { listParams, mapApiPagination } from "./pagination";

describe("pagination", () => {
  it("maps the backend pagination contract", () => {
    expect(
      mapApiPagination({
        items: [],
        pagination: {
          page: 2,
          page_size: 10,
          total_items: 25,
          total_pages: 3,
          has_next_page: true,
          has_previous_page: true,
        },
      }),
    ).toEqual({
      page: 2,
      limit: 10,
      totalItems: 25,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it("normalizes invalid list parameters", () => {
    expect(listParams(0, Number.NaN)).toEqual({ page: 1, page_size: 1 });
  });
});
