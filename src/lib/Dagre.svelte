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

	export let data: DagreGraphData;

	/** Direction for rank nodes */
	export let direction: keyof typeof RankDir = 'top-bottom';

	/** Alignment for rank nodes */
	export let align: keyof typeof Align | undefined = undefined;

	/** Number of pixels that separate nodes horizontally in the layout */
	export let nodeSeparation = 50;

	/** Number of pixels between each rank in the layout */
	export let rankSeparation = 50;

	/** Default node width if not defined */
	export let nodeWidth = 100;

	/** Default node height if not defined */
	export let nodeHeight = 50;

	export let filterNodes: (nodeId: string, graph: dagre.graphlib.Graph) => boolean = () => true;

	let g: dagre.graphlib.Graph;
	$: {
		g = new dagre.graphlib.Graph();

		g.setGraph({
			rankdir: RankDir[direction],
			align: align ? Align[align] : undefined,
			nodesep: nodeSeparation,
			ranksep: rankSeparation
		});

		g.setDefaultEdgeLabel(function () {
			return {};
		});

		data.nodes.forEach((n) => {
			// `g.setDefaultNodeLabel()` not applying, so manually handle
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
	}

	$: nodes = g.nodes().map((id) => g.node(id));
	$: edges = g.edges().map((edge) => g.edge(edge));
</script>

<slot {nodes} {edges} />
