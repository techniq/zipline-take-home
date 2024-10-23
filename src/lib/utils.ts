import dagre from '@dagrejs/dagre';

/** Get all upstream predecessors */
export function ancestors(graph: dagre.graphlib.Graph, nodeId: string): dagre.Node[] {
	// TODO: Types from dagre appear incorrect
	const predecessors = graph.predecessors(nodeId) ?? [];
	return [...predecessors, ...predecessors.flatMap((pId) => ancestors(graph, pId))];
}

/** Get all downstream descendants */
export function descendants(graph: dagre.graphlib.Graph, nodeId: string): dagre.Node[] {
	// TODO: Types from dagre appear incorrect
	const predecessors = graph.successors(nodeId) ?? [];
	return [...predecessors, ...predecessors.flatMap((pId) => descendants(graph, pId))];
}
