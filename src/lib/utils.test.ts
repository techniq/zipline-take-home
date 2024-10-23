import dagre from '@dagrejs/dagre';
import type { DagreGraphData } from './types';

const exampleGraph: DagreGraphData = {
	nodes: [
		{ id: 'A' },
		{ id: 'B' },
		{ id: 'C' },
		{ id: 'D' },
		{ id: 'E' },
		{ id: 'F' },
		{ id: 'G' },
		{ id: 'H' },
		{ id: 'I' }
	],
	edges: [
		{ sourceId: 'A', targetId: 'B' },
		{ sourceId: 'C', targetId: 'B' },
		{ sourceId: 'B', targetId: 'E' },
		{ sourceId: 'B', targetId: 'F' },
		{ sourceId: 'D', targetId: 'E' },
		{ sourceId: 'D', targetId: 'F' },
		{ sourceId: 'E', targetId: 'H' },
		{ sourceId: 'G', targetId: 'H' },
		{ sourceId: 'H', targetId: 'I' }
	]
};

function buildGraph(data: DagreGraphData) {
	const g = new dagre.graphlib.Graph();

	g.setGraph({});

	data.nodes.forEach((n) => {
		g.setNode(n.id, {
			label: typeof n.label === 'string' ? n.label : n.id,
			...(typeof n.label === 'object' ? n.label : null)
		});
	});

	data.edges.forEach((e) => {
		g.setEdge(e.sourceId, e.targetId);
	});

	return g;
}

import { describe, it, expect } from 'vitest';
import { ancestors, descendants } from './utils';

describe('accessors', () => {
	it('start of graph ', () => {
		const graph = buildGraph(exampleGraph);
		const actual = ancestors(graph, 'A');
		expect(actual).length(0);
	});

	it('middle of graph ', () => {
		const graph = buildGraph(exampleGraph);
		const actual = ancestors(graph, 'E');
		expect(actual).to.have.members(['A', 'B', 'C', 'D']);
	});

	it('end of graph ', () => {
		const graph = buildGraph(exampleGraph);
		const actual = ancestors(graph, 'I');
		expect(actual).to.have.members(['A', 'B', 'C', 'D', 'E', 'G', 'H']);
	});

	it('max depth', () => {
		const graph = buildGraph(exampleGraph);
		const actual = ancestors(graph, 'H', 2);
		expect(actual).to.have.members(['B', 'D', 'E', 'G']);
	});
});

describe('descendants', () => {
	it('start of graph ', () => {
		const graph = buildGraph(exampleGraph);
		const actual = descendants(graph, 'A');
		expect(actual).to.have.members(['B', 'E', 'F', 'H', 'I']);
	});

	it('middle of graph ', () => {
		const graph = buildGraph(exampleGraph);
		const actual = descendants(graph, 'E');
		expect(actual).to.have.members(['H', 'I']);
	});

	it('end of graph ', () => {
		const graph = buildGraph(exampleGraph);
		const actual = descendants(graph, 'I');
		expect(actual).length(0);
	});

	it('max depth', () => {
		const graph = buildGraph(exampleGraph);
		const actual = descendants(graph, 'B', 2);
		expect(actual).to.have.members(['E', 'F', 'H']);
	});
});
