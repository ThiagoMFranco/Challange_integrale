import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildQueryMock } from "../helpers/supabase-mock.js";

const mockFrom = vi.hoisted(() => vi.fn());

vi.mock("../../src/config/supabase.js", () => ({
  supabase: { from: mockFrom },
}));

import { createLead } from "../../src/services/createLead.service.js";
import type { CreateLeadInput } from "../../src/validators/createLead.validator.js";

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validInput: CreateLeadInput = {
  name: "Thiago Teste",
  email: "thiago@mail.com",
  phone: "14999999999",
  company: "Teste Ltda",
  origin: "website",
  notes: "Lead de teste",
};

describe("createLead service", () => {
  beforeEach(() => {
    mockFrom.mockReset();
  });

  it("returns the created lead when Supabase insert succeeds", async () => {
    const insertedLead = {
      id: "uuid-1",
      ...validInput,
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockFrom.mockReturnValue(
      buildQueryMock({ data: insertedLead, error: null }),
    );

    const result = await createLead(validInput);

    expect(result).toEqual(insertedLead);
    expect(mockFrom).toHaveBeenCalledWith("leads");
  });

  it("generates a UUID for the new lead and sends it in the insert payload", async () => {
    const query = buildQueryMock({
      data: { id: "ignored", ...validInput },
      error: null,
    });
    mockFrom.mockReturnValue(query);

    await createLead(validInput);

    const insertedRow = query.insert.mock.calls[0][0][0];
    expect(insertedRow.id).toMatch(UUID_V4_PATTERN);
  });

  it("throws a CustomError when Supabase returns an error", async () => {
    mockFrom.mockReturnValue(
      buildQueryMock({ data: null, error: { message: "insert failed" } }),
    );

    await expect(createLead(validInput)).rejects.toThrow(
      "Failed to create lead",
    );
  });

  it("throws a CustomError when Supabase returns no data and no error", async () => {
    mockFrom.mockReturnValue(buildQueryMock({ data: null, error: null }));

    await expect(createLead(validInput)).rejects.toThrow(
      "No data returned from database",
    );
  });
});
