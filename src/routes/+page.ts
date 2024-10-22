import type { BuildNode, DagreGraphData } from '$lib/types';
import { randomInteger } from 'svelte-ux/utils/number';

type ApiGraph = { nodes: BuildNode[]; edges: DagreGraphData['edges'] };

export function load() {
	const exampleGraph: ApiGraph = {
		nodes: [
			{ node_name: 'A', node_type: 'TYPE_1', tags: ['tag-1', 'tag-2'] },
			{ node_name: 'B', node_type: 'TYPE_2', tags: ['tag-2'] },
			{ node_name: 'C', node_type: 'TYPE_2', tags: ['tag-4'] },
			{ node_name: 'D', node_type: 'TYPE_1', tags: ['tag-3', 'tag-4'] },
			{ node_name: 'E', node_type: 'TYPE_3', tags: ['tag-3'] },
			{ node_name: 'F', node_type: 'TYPE_2', tags: ['tag-2', 'tag-4'] },
			{ node_name: 'G', node_type: 'TYPE_1', tags: ['tag-1'] },
			{ node_name: 'H', node_type: 'TYPE_3', tags: ['tag-2'] },
			{ node_name: 'I', node_type: 'TYPE_3', tags: ['tag-4'] }
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

	const alpha = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));

	const simpleGraph: ApiGraph = {
		nodes: alpha.map((a) => ({ node_name: a, node_type: 'TYPE_1', tags: ['tag-1'] })),
		edges: alpha.flatMap((a, i) => {
			if (i === 25) {
				return [];
			} else {
				// TODO: Generate more than 1 downstream edge for some nodes
				const randomDownstreamId = randomInteger(i + 1, 25);
				const edge = { sourceId: a, targetId: alpha[randomDownstreamId] };
				return [edge];
			}
		})
	};

	return {
		graph: exampleGraph
		// graph: simpleGraph
	};
}
