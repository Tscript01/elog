import { c as defineEventHandler, r as readBody, e as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const identifier = (body == null ? void 0 : body.identifier) || "student@university.edu";
  const password = (body == null ? void 0 : body.password) || "";
  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password is required"
    });
  }
  let role = "student";
  if (identifier.toLowerCase().includes("supervisor") || identifier.startsWith("SUP-")) {
    role = "supervisor";
  } else if (identifier.toLowerCase().includes("coordinator") || identifier.startsWith("COORD-")) {
    role = "coordinator";
  } else if (identifier.toLowerCase().includes("admin")) {
    role = "admin";
  }
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      identifier,
      name: identifier.split("@")[0],
      role,
      exp: Math.floor(Date.now() / 1e3) + 60 * 60 * 24 * 7
    })
  );
  const signature = btoa("mock-signature");
  const token = `${header}.${payload}.${signature}`;
  return {
    token,
    role,
    user: {
      identifier,
      role
    }
  };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
