import fs from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const realRequire = createRequire(import.meta.url);

// Loads a TypeScript module with its imports replaced by `modules`, so a route
// handler can run without Next, Convex or the network.
export function loadModule(file, modules) {
  const { outputText } = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  const require = (specifier) => {
    if (specifier in modules) return modules[specifier];
    if (specifier.startsWith("@/") || specifier.startsWith(".")) {
      throw new Error(`${file} imports ${specifier}, which the test did not provide`);
    }
    return realRequire(specifier);
  };
  new Function("exports", "require", outputText)(exports, require);
  return exports;
}

// `api.projects.save` becomes the string "projects.save".
function pathProxy(path) {
  return new Proxy(() => {}, {
    get: (_, key) => (key === Symbol.toPrimitive || key === "toString" ? () => path : pathProxy(path ? `${path}.${key}` : key)),
  });
}

// What requireAdmin throws for a caller with no session, as production returns it.
function unauthenticated() {
  const { ConvexError } = realRequire("convex/values");
  const error = new ConvexError("[Request ID: test] Server Error");
  error.data = "Unauthenticated";
  return error;
}

// Convex queries with no requireAdmin guard. They answer a signed-out caller.
const PUBLIC_QUERIES = { "siteContent.getByKey": () => null, "globalMetrics.list": () => [] };

// Builds the module set an admin route imports. `convex` maps function paths to
// handlers; a signed-out session is rejected by every guarded function.
export function adminRouteModules({ signedIn, convex = {}, translation = {} }) {
  const calls = [];
  const run = async (ref, args) => {
    const path = String(ref);
    calls.push({ path, args });
    if (!signedIn && path in PUBLIC_QUERIES) return PUBLIC_QUERIES[path](args);
    if (!signedIn) throw unauthenticated();
    if (!(path in convex)) throw new Error(`No mock for ${path}`);
    return convex[path](args);
  };
  const nextServer = { NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) } };
  const modules = {
    "next/server": nextServer,
    "@/lib/route-error": loadModule("lib/route-error.ts", { "next/server": nextServer }),
    "next/cache": { revalidatePath() {}, revalidateTag() {} },
    "@/convex/_generated/api": { api: pathProxy("") },
    "@/lib/auth-server": {
      fetchConvexAuthQuery: run,
      fetchConvexAuthMutation: run,
      fetchConvexAuthAction: run,
      requireAdminSession: () => run("adminUsers.current", {}),
      hasConvexEnv: () => true,
    },
    "@/lib/cache-tags": {},
    "@/lib/site-content": { DEFAULT_SITE_COPY: {}, mergeSiteCopyEntries: (entries) => entries },
    "@/lib/translation": translation,
  };
  return { modules, calls };
}

export function jsonRequest(body) {
  return { json: async () => body, nextUrl: new URL("http://localhost/") };
}
