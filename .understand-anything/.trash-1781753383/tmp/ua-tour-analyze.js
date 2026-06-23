'use strict';
const fs = require('fs');

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) {
    console.error('Usage: node ua-tour-analyze.js <input.json> <output.json>');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const rawNodes = data.nodes || [];
  const edges = data.edges || [];
  const layers = data.layers || [];

  // Drop function/class-level nodes; keep file-level + non-code node types.
  const nodes = rawNodes.filter((n) => n.type !== 'function' && n.type !== 'class');
  const nodeIds = new Set(nodes.map((n) => n.id));
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  // Only keep edges between retained nodes.
  const realEdges = edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));

  // --- Fan-in / Fan-out ---
  const fanIn = new Map();
  const fanOut = new Map();
  for (const id of nodeIds) {
    fanIn.set(id, 0);
    fanOut.set(id, 0);
  }
  for (const e of realEdges) {
    fanOut.set(e.source, fanOut.get(e.source) + 1);
    fanIn.set(e.target, fanIn.get(e.target) + 1);
  }

  const nm = (id) => (nodeById.get(id) ? nodeById.get(id).name : id);

  const fanInRanking = [...fanIn.entries()]
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([id, c]) => ({ id, fanIn: c, name: nm(id) }));

  const fanOutRanking = [...fanOut.entries()]
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([id, c]) => ({ id, fanOut: c, name: nm(id) }));

  // --- Entry point candidates ---
  const codeEntryNames = new Set([
    'index.ts', 'index.js', 'main.ts', 'main.js', 'main.jsx', 'index.jsx',
    'app.ts', 'app.js', 'app.jsx', 'App.jsx', 'server.ts', 'server.js',
    'mod.rs', 'main.go', 'main.py', 'main.rs', 'manage.py', 'app.py',
    'wsgi.py', 'asgi.py', 'run.py', '__main__.py', 'Application.java',
    'Main.java', 'Program.cs', 'config.ru', 'index.php', 'App.swift',
    'Application.kt', 'main.cpp', 'main.c', 'index.html',
  ]);

  const fanOutVals = [...fanOut.values()].sort((a, b) => b - a);
  const top10pctIdx = Math.max(0, Math.floor(fanOutVals.length * 0.1) - 1);
  const top10pctThreshold = fanOutVals.length ? fanOutVals[top10pctIdx] : 0;
  const fanInVals = [...fanIn.values()].sort((a, b) => a - b);
  const bottom25Idx = Math.max(0, Math.floor(fanInVals.length * 0.25) - 1);
  const bottom25Threshold = fanInVals.length ? fanInVals[bottom25Idx] : 0;

  const entryScores = [];
  for (const n of nodes) {
    let score = 0;
    const fp = n.filePath || '';
    const depth = fp.split('/').length;
    if (n.type === 'document') {
      if (n.name === 'README.md' && depth <= 1) score += 5;
      else if (/\.md$/i.test(n.name) && depth <= 2) score += 2;
    } else if (n.type === 'file') {
      if (codeEntryNames.has(n.name)) score += 3;
      if (depth <= 3) score += 1; // src/index.ts style
      if (fanOut.get(n.id) >= top10pctThreshold && top10pctThreshold > 0) score += 1;
      if (fanIn.get(n.id) <= bottom25Threshold) score += 1;
    }
    if (score > 0) {
      entryScores.push({ id: n.id, score, name: n.name, type: n.type, summary: n.summary || '' });
    }
  }
  entryScores.sort((a, b) => b.score - a.score);
  const entryPointCandidates = entryScores.slice(0, 5);

  // --- BFS from top CODE entry point ---
  const forwardAdj = new Map();
  for (const id of nodeIds) forwardAdj.set(id, []);
  for (const e of realEdges) {
    if (e.type === 'imports' || e.type === 'calls') {
      forwardAdj.get(e.source).push(e.target);
    }
  }

  const codeEntry = entryScores.find((c) => c.type === 'file');
  const startNode = codeEntry ? codeEntry.id : (nodes.find((n) => n.type === 'file') || {}).id;

  const order = [];
  const depthMap = {};
  if (startNode) {
    const queue = [startNode];
    depthMap[startNode] = 0;
    const seen = new Set([startNode]);
    while (queue.length) {
      const cur = queue.shift();
      order.push(cur);
      for (const nxt of forwardAdj.get(cur) || []) {
        if (!seen.has(nxt)) {
          seen.add(nxt);
          depthMap[nxt] = depthMap[cur] + 1;
          queue.push(nxt);
        }
      }
    }
  }
  const byDepth = {};
  for (const [id, d] of Object.entries(depthMap)) {
    (byDepth[d] = byDepth[d] || []).push(id);
  }

  // --- Non-code inventory ---
  const nonCodeFiles = { documentation: [], infrastructure: [], data: [], config: [] };
  for (const n of nodes) {
    const rec = { id: n.id, name: n.name, type: n.type, summary: n.summary || '' };
    if (n.type === 'document') nonCodeFiles.documentation.push(rec);
    else if (['service', 'pipeline', 'resource'].includes(n.type)) nonCodeFiles.infrastructure.push(rec);
    else if (['table', 'schema', 'endpoint'].includes(n.type)) nonCodeFiles.data.push(rec);
    else if (n.type === 'config') nonCodeFiles.config.push(rec);
  }

  // --- Clusters (bidirectional + expansion) ---
  const pairKey = (a, b) => [a, b].sort().join('||');
  const edgeSet = new Set();
  const adjUndir = new Map();
  for (const id of nodeIds) adjUndir.set(id, new Set());
  for (const e of realEdges) {
    edgeSet.add(e.source + '>>' + e.target);
    adjUndir.get(e.source).add(e.target);
    adjUndir.get(e.target).add(e.source);
  }
  const bidir = [];
  const seenPair = new Set();
  for (const e of realEdges) {
    if (edgeSet.has(e.target + '>>' + e.source)) {
      const k = pairKey(e.source, e.target);
      if (!seenPair.has(k)) {
        seenPair.add(k);
        bidir.push([e.source, e.target]);
      }
    }
  }
  const clusters = [];
  for (const [a, b] of bidir) {
    const members = new Set([a, b]);
    for (const cand of nodeIds) {
      if (members.has(cand)) continue;
      let conn = 0;
      for (const m of members) if (adjUndir.get(cand).has(m)) conn++;
      if (conn >= 2 && members.size < 5) members.add(cand);
    }
    let edgeCount = 0;
    const arr = [...members];
    for (let i = 0; i < arr.length; i++)
      for (let j = 0; j < arr.length; j++)
        if (i !== j && edgeSet.has(arr[i] + '>>' + arr[j])) edgeCount++;
    clusters.push({ nodes: arr, edgeCount });
  }
  clusters.sort((a, b) => b.edgeCount - a.edgeCount);
  const topClusters = clusters.slice(0, 10);

  // --- Node summary index ---
  const nodeSummaryIndex = {};
  for (const n of nodes) {
    nodeSummaryIndex[n.id] = { name: n.name, type: n.type, summary: n.summary || '' };
  }

  const out = {
    scriptCompleted: true,
    entryPointCandidates,
    fanInRanking,
    fanOutRanking,
    bfsTraversal: { startNode, order, depthMap, byDepth },
    nonCodeFiles,
    clusters: topClusters,
    layers: {
      count: layers.length,
      list: layers.map((l) => ({ id: l.id, name: l.name, description: l.description })),
    },
    nodeSummaryIndex,
    totalNodes: nodes.length,
    totalEdges: realEdges.length,
  };

  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2));
  console.log('Analysis complete:', nodes.length, 'nodes,', realEdges.length, 'edges.');
  process.exit(0);
}

try {
  main();
} catch (err) {
  console.error('FATAL:', err.stack || err.message);
  process.exit(1);
}
