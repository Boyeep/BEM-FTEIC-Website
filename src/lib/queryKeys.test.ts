import { describe, expect, it } from "vitest";

import { queryKeys } from "./queryKeys";

describe("queryKeys", () => {
  it("keeps public and admin content caches isolated", () => {
    expect(queryKeys.blogs.list(1, 6)).toEqual(["blogs", "public", 1, 6]);
    expect(queryKeys.blogs.admin.list(1, 20)).toEqual([
      "blogs",
      "admin",
      1,
      20,
    ]);
  });

  it("creates stable detail keys", () => {
    expect(queryKeys.events.detail("event-id")).toEqual([
      "events",
      "detail",
      "event-id",
    ]);
  });
});
