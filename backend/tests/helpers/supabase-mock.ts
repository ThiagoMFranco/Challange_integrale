import { vi, type Mock } from "vitest";

export interface MockQueryResult {
  data?: unknown;
  error?: { message: string; code?: string } | null;
  count?: number | null;
}

export interface MockQueryBuilder {
  select: Mock;
  insert: Mock;
  ilike: Mock;
  order: Mock;
  range: Mock;
  eq: Mock;
  single: Mock;
  then: (
    onResolve: (value: {
      data: unknown;
      error: unknown;
      count: number | null;
    }) => unknown,
  ) => unknown;
}

export function buildQueryMock(result: MockQueryResult): MockQueryBuilder {
  const resolved = {
    data: result.data ?? null,
    error: result.error ?? null,
    count: result.count ?? null,
  };

  const chain = {} as MockQueryBuilder;

  chain.select = vi.fn(() => chain);
  chain.insert = vi.fn(() => chain);
  chain.ilike = vi.fn(() => chain);
  chain.order = vi.fn(() => chain);
  chain.range = vi.fn(() => chain);
  chain.eq = vi.fn(() => chain);
  chain.single = vi.fn(() => chain);
  chain.then = (onResolve) => onResolve(resolved);

  return chain;
}
