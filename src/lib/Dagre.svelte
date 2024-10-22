<script module>
	export const RankDir = {
		'top-bottom': 'TB',
		'bottom-top': 'BT',
		'left-right': 'LR',
		'right-left': 'RL'
	};

	export const Align = {
		'up-left': 'UL',
		'up-right': 'UR',
		'down-left': 'DL',
		'down-right': 'DR'
	};
</script>

<script lang="ts">
	import dagre from '@dagrejs/dagre';
	import type { DagreGraphData } from './types';

	interface Props {
		data: DagreGraphData;
		/** Direction for rank nodes */
		direction?: keyof typeof RankDir;

		/** Alignment for rank nodes */
		align?: keyof typeof Align | undefined;

		/** Number of pixels that separate nodes horizontally in the layout */
		nodeSeparation?: number;

		/** Number of pixels between each rank in the layout */
		rankSeparation?: number;

		/** Default node width if not defined */
		nodeWidth?: number;

		/** Default node height if not defined */
		nodeHeight?: number;

		/** Filter nodes */
		filterNodes?: (nodeId: string, graph: dagre.graphlib.Graph) => boolean;

		children?: import('svelte').Snippet<[{ nodes: dagre.Node[]; edges: dagre.GraphEdge[] }]>;
	}

	let {
		data,
		direction = 'top-bottom',
		align = undefined,
		nodeSeparation = 50,
		rankSeparation = 50,
		nodeWidth = 100,
		nodeHeight = 50,
		filterNodes = () => true,
		children
	}: Props = $props();

	let g = $derived.by(() => {
		let g = new dagre.graphlib.Graph();

		g.setGraph({
			rankdir: RankDir[direction],
			align: align ? Align[align] : undefined,
			nodesep: nodeSeparation,
			ranksep: rankSeparation
		});

		g.setDefaultEdgeLabel(() => {
			return {};
		});

		data.nodes.forEach((n) => {
			g.setNode(n.id, {
				label: typeof n.label === 'string' ? n.label : n.id,
				width: nodeWidth,
				height: nodeHeight,
				...(typeof n.label === 'object' ? n.label : null)
			});
		});

		data.edges.forEach((e) => {
			g.setEdge(e.sourceId, e.targetId);
		});

		g = filterNodes ? g.filterNodes((nodeId) => filterNodes(nodeId, g)) : g;

		dagre.layout(g);

		return g;
	});

	let nodes = $derived(g.nodes().map((id) => g.node(id)));
	let edges = $derived(g.edges().map((edge) => ({ ...edge, ...g.edge(edge) })));
</script>

{@render children?.({ nodes, edges })}
