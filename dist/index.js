#!/usr/bin/env node
// Lightweight launcher that runs the source entrypoint. This keeps the action runnable without
// requiring the repository to include a full ncc bundle. After making source changes you may
// still want to produce a bundled dist with `npm run build` and commit it here.
require('../src/index.js');
