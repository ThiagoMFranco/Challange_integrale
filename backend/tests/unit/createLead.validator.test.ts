import { describe, it, expect } from "vitest";
import { createLeadSchema } from "../../src/validators/createLead.validator.js";

const baseInput = {
  name: "Thiago Teste",
  email: "thiago@mail.com",
  phone: "14999999999",
  origin: "website",
};

describe("createLeadSchema", () => {
  it("accepts a valid payload", () => {
    const result = createLeadSchema.safeParse(baseInput);
    expect(result.success).toBe(true);
  });

  it("accepts names with accents, apostrophes and hyphens", () => {
    const result = createLeadSchema.safeParse({
      ...baseInput,
      name: "José D'Ávila-Souza",
    });
    expect(result.success).toBe(true);
  });

  it("accepts phones with common formatting characters", () => {
    const result = createLeadSchema.safeParse({
      ...baseInput,
      phone: "+55 (11) 91234-5678",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name made only of symbols", () => {
    const result = createLeadSchema.safeParse({ ...baseInput, name: "@###@#" });
    expect(result.success).toBe(false);
  });

  it("rejects a phone made only of symbols", () => {
    const result = createLeadSchema.safeParse({ ...baseInput, phone: "!#!@#" });
    expect(result.success).toBe(false);
  });

  it("rejects a phone with fewer than 8 digits", () => {
    const result = createLeadSchema.safeParse({
      ...baseInput,
      phone: "(11) 123",
    });
    expect(result.success).toBe(false);
  });

  it("trims surrounding whitespace from the name", () => {
    const result = createLeadSchema.safeParse({
      ...baseInput,
      name: "  Thiago Teste  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Thiago Teste");
    }
  });
});
