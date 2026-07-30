export const queryKeys = {
  blogs: {
    all: ["blogs"] as const,
    list: (page: number, limit: number) =>
      ["blogs", "public", page, limit] as const,
    detail: (id: string) => ["blogs", "detail", id] as const,
    admin: {
      all: ["blogs", "admin"] as const,
      list: (page: number, limit: number) =>
        ["blogs", "admin", page, limit] as const,
      detail: (id: string) => ["blogs", "admin", "detail", id] as const,
    },
  },
  events: {
    all: ["events"] as const,
    list: (...filters: unknown[]) => ["events", "public", ...filters] as const,
    detail: (id: string) => ["events", "detail", id] as const,
    admin: {
      all: ["events", "admin"] as const,
      list: (page: number, limit: number) =>
        ["events", "admin", page, limit] as const,
      detail: (id: string) => ["events", "admin", "detail", id] as const,
    },
  },
  gallery: {
    all: ["gallery"] as const,
    list: (...filters: unknown[]) => ["gallery", "public", ...filters] as const,
    admin: {
      all: ["gallery", "admin"] as const,
      list: (page: number, limit: number) =>
        ["gallery", "admin", page, limit] as const,
      detail: (id: string) => ["gallery", "admin", "detail", id] as const,
    },
  },
  whitelist: {
    all: ["signup-whitelist"] as const,
  },
  visitors: {
    count: ["visitor-count"] as const,
  },
};
