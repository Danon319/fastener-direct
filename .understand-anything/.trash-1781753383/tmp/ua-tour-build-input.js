const fs = require('fs');
const base = process.argv[2];
const nodes = JSON.parse(fs.readFileSync(base + '/.understand-anything/tmp/arch-filenodes.json', 'utf8'));
const layers = JSON.parse(fs.readFileSync(base + '/.understand-anything/intermediate/layers.json', 'utf8'));
const edges = JSON.parse(fs.readFileSync(base + '/.understand-anything/tmp/arch-alledges.json', 'utf8'));
fs.writeFileSync(
  base + '/.understand-anything/tmp/ua-tour-input.json',
  JSON.stringify({ nodes, edges, layers }, null, 2)
);
console.log('wrote input:', nodes.length, 'nodes,', edges.length, 'edges,', layers.length, 'layers');
