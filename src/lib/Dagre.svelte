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

	export let graph: {
		nodes: Array<{ name: string; label?: string | dagre.Label }>;
		edges: Array<{ sourceId: string; targetId: string }>;
	};

	/** Direction for rank nodes */
	export let direction: keyof typeof RankDir = 'top-bottom';

	/** Alignment for rank nodes */
	export let align: keyof typeof Align | undefined = undefined;

	/** Number of pixels that separate nodes horizontally in the layout */
	export let nodeSeparation = 50;

	/** Default node width if not defined */
	export let nodeWidth = 100;

	/** Default node height if not defined */
	export let nodeHeight = 50;

	let g: dagre.graphlib.Graph;
	$: {
		g = new dagre.graphlib.Graph();

		g.setGraph({
			rankdir: RankDir[direction],
			align: align ? Align[align] : undefined,
			nodesep: nodeSeparation
		});

		g.setDefaultEdgeLabel(function () {
			return {};
		});

		graph.nodes.forEach((n) => {
			// `g.setDefaultNodeLabel()` not applying, so manually handle
			g.setNode(n.name, {
				label: typeof n.label === 'string' ? n.label : n.name,
				width: nodeWidth,
				height: nodeHeight,
				...(typeof n.label === 'object' ? n.label : null)
			});
		});

		graph.edges.forEach((e) => {
			g.setEdge(e.sourceId, e.targetId);
		});

		dagre.layout(g);
	}

	$: nodes = g.nodes().map((id) => g.node(id));
	$: edges = g.edges().map((edge) => g.edge(edge));
</script>

<slot {nodes} {edges} />
