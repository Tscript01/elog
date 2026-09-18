import { c as defineEventHandler, g as getQuery } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const mockLogs = [
  {
    id: "1",
    date: "2026-09-14",
    week: 1,
    description: "Orientation session at the instrumentation and process control department. Introduced to SCADA monitoring infrastructure and field safety procedures.",
    status: "APPROVED"
  },
  {
    id: "2",
    date: "2026-09-15",
    week: 1,
    description: "Assisted senior instrument technician in zero-point calibration and pressure transmitter zero-trim verification for crude separation units.",
    status: "PENDING"
  },
  {
    id: "3",
    date: "2026-09-16",
    week: 1,
    description: "Inspected 4-20mA HART loop diagnostics across tank farm level gauges and logged telemetry telemetry variations in the daily engineering register.",
    status: "PENDING"
  }
];
const index_get = defineEventHandler((event) => {
  const query = getQuery(event);
  if (query.week) {
    const w = Number(query.week);
    return mockLogs.filter((l) => l.week === w);
  }
  return mockLogs;
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
