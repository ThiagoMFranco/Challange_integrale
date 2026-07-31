import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildQueryMock } from "../helpers/supabase-mock.js";

const mockFrom = vi.hoisted(() => vi.fn());

vi.mock("../../src/config/supabase.js", () => ({
  supabase: { from: mockFrom },
}));

import { getLeads } from "../../src/services/getLeads.service.js";

const sampleLeads = [
  {
    id: "1",
    name: "Ana",
    email: "ana@mail.com",
    phone: "111",
    origin: "website",
    created_at: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Bruno",
    email: "bruno@mail.com",
    phone: "222",
    origin: "referral",
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

describe("getLeads service", () => {
  beforeEach(() => {
    mockFrom.mockReset();
  });

  it("returns paginated leads with defaults", async () => {
    mockFrom.mockReturnValue(
      buildQueryMock({ data: sampleLeads, error: null, count: 2 }),
    );

    const result = await getLeads({ page: 1, limit: 20 });

    expect(result).toEqual({
      data: sampleLeads,
      total: 2,
      page: 1,
      limit: 20,
      hasMore: false,
    });
  });

  it("computes hasMore correctly when more records exist beyond the page", async () => {
    mockFrom.mockReturnValue(
      buildQueryMock({ data: sampleLeads, error: null, count: 50 }),
    );

    const result = await getLeads({ page: 1, limit: 2 });

    expect(result.hasMore).toBe(true);
  });

  it("applies searchName and searchOrigin as ilike filters", async () => {
    const builder = buildQueryMock({
      data: sampleLeads,
      error: null,
      count: 2,
    });
    mockFrom.mockReturnValue(builder);

    await getLeads({
      page: 1,
      limit: 20,
      searchName: "Ana",
      searchOrigin: "website",
    });

    expect(builder.ilike).toHaveBeenCalledWith("name", "%Ana%");
    expect(builder.ilike).toHaveBeenCalledWith("origin", "%website%");
  });

  it("throws a CustomError when Supabase returns an error", async () => {
    mockFrom.mockReturnValue(
      buildQueryMock({ data: null, error: { message: "query failed" } }),
    );

    await expect(getLeads({ page: 1, limit: 20 })).rejects.toThrow(
      "Failed to fetch leads",
    );
  });
});
