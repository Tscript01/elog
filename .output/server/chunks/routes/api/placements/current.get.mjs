import { c as defineEventHandler } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

let mockPlacement = {
  company_name: "Shell Petroleum Development Company",
  supervisor_id: "SUP-ENG-8492",
  start_date: "2026-03-01",
  end_date: "2026-08-31"
};
const current_get = defineEventHandler(() => {
  return mockPlacement;
});

export { current_get as default };
//# sourceMappingURL=current.get.mjs.map
