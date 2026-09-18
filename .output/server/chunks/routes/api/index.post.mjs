import { c as defineEventHandler, r as readBody, e as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.date || !body.description) {
    throw createError({
      statusCode: 400,
      statusMessage: "Date and description are required"
    });
  }
  return {
    id: String(Date.now()),
    date: body.date,
    week: body.week || 1,
    description: body.description,
    image_url: body.image_url,
    status: "PENDING"
  };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
