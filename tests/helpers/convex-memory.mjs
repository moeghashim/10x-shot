import { loadModule } from "./load-route.mjs";

// A minimal in-memory stand-in for the Convex database API the handlers use.
export function memoryDb(tables) {
  const all = () => Object.values(tables).flat();
  return {
    tables,
    query(table) {
      const filters = [];
      const rows = () => (tables[table] ??= []).filter((doc) => filters.every(([key, value]) => doc[key] === value));
      const query = {
        withIndex(_name, build) {
          const range = { eq: (key, value) => (filters.push([key, value]), range) };
          build(range);
          return query;
        },
        collect: async () => rows(),
        first: async () => rows()[0] ?? null,
      };
      return query;
    },
    get: async (id) => all().find((doc) => doc._id === id) ?? null,
    async insert(table, doc) {
      const rows = (tables[table] ??= []);
      const _id = `${table}:${rows.length + 1}:${Math.random()}`;
      rows.push({ _id, ...doc });
      return _id;
    },
    async patch(id, fields) {
      const doc = all().find((candidate) => candidate._id === id);
      for (const [key, value] of Object.entries(fields)) {
        if (value === undefined) delete doc[key];
        else doc[key] = value;
      }
    },
    async delete(id) {
      for (const rows of Object.values(tables)) {
        const index = rows.findIndex((doc) => doc._id === id);
        if (index >= 0) rows.splice(index, 1);
      }
    },
  };
}

// Loads a Convex function module with the real validators and the real
// convex/lib.ts, signed in as `userId`.
export function loadConvex(file, userId = "admin-1") {
  const identity = (definition) => definition;
  const lib = loadModule("convex/lib.ts", {
    "../lib/launch-date": loadModule("lib/launch-date.ts", {}),
    "./auth": { authComponent: { safeGetAuthUser: async () => ({ _id: userId }) } },
  });
  return loadModule(file, {
    "./_generated/server": { query: identity, mutation: identity, action: identity, internalQuery: identity, internalMutation: identity, internalAction: identity },
    "./_generated/api": { internal: {} },
    "./lib": lib,
    "./auth": { createAuth: () => ({}) },
    "./validators": loadModule("convex/validators.ts", {}),
  });
}

export function adminProfile(userId, isActive = true) {
  return { _id: `profile:${userId}`, userId, email: `${userId}@example.com`, isActive };
}
