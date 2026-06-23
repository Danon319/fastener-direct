'use strict';
const fs = require('fs');

const [, , fnPath, iePath, aePath, outPath] = process.argv;
if (!fnPath || !iePath || !aePath || !outPath) {
  console.error('usage: node ua-arch-analyze.js <filenodes> <importedges> <alledges> <out>');
  process.exit(1);
}

let fileNodes, importEdges, allEdges;
try {
  fileNodes = JSON.parse(fs.readFileSync(fnPath, 'utf8'));
  importEdges = JSON.parse(fs.readFileSync(iePath, 'utf8'));
  allEdges = JSON.parse(fs.readFileSync(aePath, 'utf8'));
} catch (e) {
  console.error('parse error:', e.message);
  process.exit(1);
}

const ids = new Set(fileNodes.map((n) => n.id));
const byId = new Map(fileNodes.map((n) => [n.id, n]));

// Common prefix across filePaths (by path segments)
const paths = fileNodes.map((n) => n.filePath.split('/'));
function commonPrefix(arrs) {
  if (!arrs.length) return [];
  let pref = arrs[0].slice(0, -1); // exclude filename
  for (const a of arrs) {
    const dir = a.slice(0, -1);
    let i = 0;
    while (i < pref.length && i < dir.length && pref[i] === dir[i]) i++;
    pref = pref.slice(0, i);
  }
  return pref;
}
const prefix = commonPrefix(paths);

// A. Directory grouping
const directoryGroups = {};
for (const n of fileNodes) {
  const segs = n.filePath.split('/');
  const rel = segs.slice(prefix.length);
  const group = rel.length > 1 ? rel[0] : '(root)';
  (directoryGroups[group] ||= []).push(n.id);
}

// More useful grouping: full sub-path within client/server src. For monorepo, group by meaningful dir.
const semanticGroups = {};
for (const n of fileNodes) {
  const p = n.filePath;
  let g;
  if (p.startsWith('client/src/')) {
    const sub = p.slice('client/src/'.length).split('/');
    g = 'client/' + (sub.length > 1 ? sub[0] + (sub[0] === 'components' && sub.length > 2 ? '/' + sub[1] : '') : '(src-root)');
  } else if (p.startsWith('server/src/')) {
    const sub = p.slice('server/src/'.length).split('/');
    g = 'server/' + (sub.length > 1 ? sub[0] : '(src-root)');
  } else if (p.startsWith('client/')) {
    g = 'client/(root)';
  } else if (p.startsWith('server/')) {
    g = 'server/(root)';
  } else {
    g = '(repo-root)';
  }
  (semanticGroups[g] ||= []).push(n.id);
}

// B. Node type grouping
const nodeTypeGroups = {};
for (const n of fileNodes) (nodeTypeGroups[n.type] ||= []).push(n.id);

// group lookup for a node id (use semanticGroups)
const idToGroup = new Map();
for (const [g, list] of Object.entries(semanticGroups)) for (const id of list) idToGroup.set(id, g);

// C. fan-in / fan-out from importEdges (only between file nodes)
const fanOut = {}, fanIn = {};
for (const e of importEdges) {
  if (!ids.has(e.source) || !ids.has(e.target)) continue;
  fanOut[e.source] = (fanOut[e.source] || 0) + 1;
  fanIn[e.target] = (fanIn[e.target] || 0) + 1;
}

// E. inter-group import frequency
const interMap = {};
for (const e of importEdges) {
  const gs = idToGroup.get(e.source), gt = idToGroup.get(e.target);
  if (!gs || !gt || gs === gt) continue;
  const k = gs + ' -> ' + gt;
  interMap[k] = (interMap[k] || 0) + 1;
}
const interGroupImports = Object.entries(interMap)
  .map(([k, count]) => ({ from: k.split(' -> ')[0], to: k.split(' -> ')[1], count }))
  .sort((a, b) => b.count - a.count);

// F. intra-group density
const intraGroupDensity = {};
for (const g of Object.keys(semanticGroups)) intraGroupDensity[g] = { internalEdges: 0, totalEdges: 0 };
for (const e of importEdges) {
  const gs = idToGroup.get(e.source), gt = idToGroup.get(e.target);
  if (!gs || !gt) continue;
  if (gs === gt) intraGroupDensity[gs].internalEdges++;
  intraGroupDensity[gs].totalEdges++;
  if (gt !== gs) intraGroupDensity[gt].totalEdges++;
}
for (const g of Object.keys(intraGroupDensity)) {
  const d = intraGroupDensity[g];
  d.density = d.totalEdges ? +(d.internalEdges / d.totalEdges).toFixed(2) : 0;
}

// D. cross-category edges (non-import edge types between node-type groups)
const idType = (id) => (byId.get(id) ? byId.get(id).type : id.split(':')[0]);
const crossMap = {};
for (const e of allEdges) {
  if (e.type === 'imports' || e.type === 'contains' || e.type === 'exports' || e.type === 'calls') continue;
  // only file-level both ends
  if (!ids.has(e.source) && !ids.has(e.target)) continue;
  const ft = idType(e.source), tt = idType(e.target);
  const k = ft + '|' + tt + '|' + e.type;
  crossMap[k] = (crossMap[k] || 0) + 1;
}
const crossCategoryEdges = Object.entries(crossMap).map(([k, count]) => {
  const [fromType, toType, edgeType] = k.split('|');
  return { fromType, toType, edgeType, count };
});

// K. dependency direction
const directed = {};
for (const ig of interGroupImports) {
  const key = [ig.from, ig.to].sort().join('::');
  (directed[key] ||= {})[ig.from + '>' + ig.to] = ig.count;
}
const dependencyDirection = interGroupImports
  .filter((ig) => {
    const rev = interMap[ig.to + ' -> ' + ig.from] || 0;
    return ig.count >= rev;
  })
  .map((ig) => ({ dependent: ig.from, dependsOn: ig.to, count: ig.count }));

// fileStats
const filesPerGroup = {};
for (const [g, l] of Object.entries(semanticGroups)) filesPerGroup[g] = l.length;
const nodeTypeCounts = {};
for (const [t, l] of Object.entries(nodeTypeGroups)) nodeTypeCounts[t] = l.length;

const result = {
  scriptCompleted: true,
  commonPrefix: prefix.join('/'),
  topLevelGroups: directoryGroups,
  semanticGroups,
  nodeTypeGroups,
  crossCategoryEdges,
  interGroupImports,
  intraGroupDensity,
  dependencyDirection,
  fileStats: { totalFileNodes: fileNodes.length, filesPerGroup, nodeTypeCounts },
  fileFanIn: fanIn,
  fileFanOut: fanOut,
};

fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log('done. total nodes:', fileNodes.length, 'groups:', Object.keys(semanticGroups).length);
process.exit(0);
