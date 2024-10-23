import type { ApiNodeData, DagreGraphData } from '$lib/types';
import { randomInteger } from '@layerstack/utils';
import { unique } from '@layerstack/utils/array';
import { range } from 'd3-array';

type ApiGraph = { nodes: ApiNodeData[]; edges: DagreGraphData['edges'] };

export function load({ url }) {
	const basicGraph: ApiGraph = {
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

	function getRandomTags() {
		return range(randomInteger(1, 10)).map((n) => {
			return `tag-${n + 1}`;
		});
	}

	function getRandomDownstreamIds(index: number) {
		return unique(range(randomInteger(1, 3)).map(() => randomInteger(index + 1, 25)));
	}

	const generatedSimpleGraph: ApiGraph = {
		nodes: alpha.map((a) => ({
			node_name: a,
			node_type: `TYPE_${randomInteger(1, 4)}` as ApiGraph['nodes'][number]['node_type'],
			tags: getRandomTags()
		})),
		edges: alpha.flatMap((a, i) => {
			if (i === 25) {
				return [];
			} else {
				const randomDownstreamId = randomInteger(i + 1, 25);
				const edge = { sourceId: a, targetId: alpha[randomDownstreamId] };
				return [edge];
			}
		})
	};

	const generatedComplexGraph: ApiGraph = {
		nodes: alpha.map((a) => ({
			node_name: a,
			node_type: `TYPE_${randomInteger(1, 4)}` as ApiGraph['nodes'][number]['node_type'],
			tags: getRandomTags()
		})),
		edges: alpha.flatMap((a, i) => {
			if (i === 25) {
				return [];
			} else {
				return getRandomDownstreamIds(i).map((id) => {
					return { sourceId: a, targetId: alpha[id] };
				});
			}
		})
	};

	const graphs = {
		basic: basicGraph,
		generated_simple: generatedSimpleGraph,
		generated_complex: generatedComplexGraph
	};

	// @ts-expect-error: Handles missing keys
	const graph: ApiGraph = graphs[url.searchParams.get('graph') ?? 'basic'] ?? basicGraph;

	return {
		graph
	};
}
