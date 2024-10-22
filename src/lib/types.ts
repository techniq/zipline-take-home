import dagre from '@dagrejs/dagre';

export type DagreGraphData = {
	nodes: Array<{ id: string; label?: string | dagre.Label }>;
	edges: Array<{ sourceId: string; targetId: string }>;
};

export type BuildNode = {
	node_name: string;
	node_type: 'TYPE_1' | 'TYPE_2' | 'TYPE_3' | 'TYPE_4';
	tags: string[];
};
