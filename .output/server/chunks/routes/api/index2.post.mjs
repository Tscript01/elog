import { c as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
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
  return {
    success: true,
    data: body
  };
});

export { index_post as default };
//# sourceMappingURL=index2.post.mjs.map
