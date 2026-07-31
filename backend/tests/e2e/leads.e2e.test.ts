import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { buildQueryMock } from "../helpers/supabase-mock.js";

const mockFrom = vi.hoisted(() => vi.fn());

vi.mock("../../src/config/env.js", () => ({
  default: {
    SUPABASE_URL: "https://test.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
    PORT: 3000,
    NODE_ENV: "test",
    CORS_ORIGIN: "*",
  },
}));

vi.mock("../../src/config/supabase.js", () => ({
  supabase: { from: mockFrom },
}));

import app from "../../src/app.js";

describe("POST /api/leads", () => {
  beforeEach(() => {
    mockFrom.mockReset();
  });

  it("creates a lead and returns 201", async () => {
    const createdLead = {
      id: "uuid-1",
      name: "Thiago Teste",
      email: "thiago@mail.com",
      phone: "14999999999",
      company: "Teste",
      origin: "website",
      notes: "teste",
      created_at: "2026-01-01T00:00:00.000Z",
    };
    mockFrom.mockReturnValue(
      buildQueryMock({ data: createdLead, error: null }),
    );

    const response = await request(app).post("/api/leads").send({
      name: "Thiago Teste",
      email: "thiago@mail.com",
      phone: "14999999999",
      company: "Teste",
      origin: "website",
      notes: "teste",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(createdLead);
  });

  it("returns 400 when required fields are missing", async () => {
    const response = await request(app)
      .post("/api/leads")
      .send({ email: "no-name@mail.com" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("returns 400 when origin is not one of the allowed values", async () => {
    const response = await request(app).post("/api/leads").send({
      name: "Thiago",
      email: "thiago@mail.com",
      phone: "14999999999",
      origin: "not-a-real-origin",
    });

    expect(response.status).toBe(400);
  });
});

describe("GET /api/leads", () => {
  beforeEach(() => {
    mockFrom.mockReset();
  });

  it("lists leads with pagination metadata", async () => {
    const leads = [
      {
        id: "1",
        name: "Ana",
        email: "ana@mail.com",
        phone: "111",
        origin: "website",
        created_at: "2026-01-02T00:00:00.000Z",
      },
    ];
    mockFrom.mockReturnValue(
      buildQueryMock({ data: leads, error: null, count: 1 }),
    );

    const response = await request(app).get("/api/leads");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      data: leads,
      total: 1,
      page: 1,
      limit: 20,
      hasMore: false,
    });
  });

  it("applies searchName and searchOrigin as query params", async () => {
    const builder = buildQueryMock({ data: [], error: null, count: 0 });
    mockFrom.mockReturnValue(builder);

    await request(app)
      .get("/api/leads")
      .query({ searchName: "Ana", searchOrigin: "website" });

    expect(builder.ilike).toHaveBeenCalledWith("name", "%Ana%");
    expect(builder.ilike).toHaveBeenCalledWith("origin", "%website%");
  });
});
